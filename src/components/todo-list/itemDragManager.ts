export class ItemDragManager {
  private static instance: ItemDragManager | null = null;
  private originItem: HTMLElement | null = null;
  private originOpacity: string = "1";

  private originX: number = 0;
  private originY: number = 0;
  private deltaX: number = 0;
  private deltaY: number = 0;

  private draggingItem: HTMLElement | null = null;
  private moveEventListener: EventListener | null = null;
  private endEventListener: EventListener | null = null;
  private cancelEventListener: EventListener | null = null;

  private belowItem: HTMLElement | null = null;
  private releaseHandler: (item: HTMLElement, target: HTMLElement, isBefore: boolean) => void = () => {};
  
  private previewTimer: ReturnType<typeof setTimeout> | null = null;
  private timerTarget: HTMLElement | null = null;
  
  private previewHandler: (item?: HTMLElement, target?: HTMLElement, isBefore?: boolean) => void = () => {};
  private previewLocTarget: HTMLElement | null = null;
  private previewBefore: boolean = false;

  private constructor() {
  }

  public setReleaseHandler(handler: (item: HTMLElement, target: HTMLElement, isBefore: boolean) => void) {
    this.releaseHandler = handler;
  }
  
  public setPreviewHandler(handler: (item?: HTMLElement, target?: HTMLElement, isBefore?: boolean) => void) {
    this.previewHandler = handler;
  }

  public static getInstance(): ItemDragManager {
    if (!ItemDragManager.instance) {
      ItemDragManager.instance = new ItemDragManager();
    }
    return ItemDragManager.instance;
  }
  
  public selectItem(item: HTMLElement, originX: number, originY: number) {
    this.originOpacity = item.style.opacity;
    this.originItem = item;
    this.timerTarget = null;
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox instanceof HTMLInputElement && checkbox.checked) {
      return;
    }

    this.originX = originX;
    this.originY = originY;
    this.deltaX = item.offsetLeft - originX;
    this.deltaY = item.offsetTop - originY;
    this.moveEventListener = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      this.moveDragging(mouseEvent.clientX, mouseEvent.clientY);
    };
    this.endEventListener = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (this.moveEventListener) {
        document.body.removeEventListener("mousemove", this.moveEventListener);
      }
      if (this.endEventListener) {
        document.body.removeEventListener("mouseup", this.endEventListener);
      }
      
      this.moveEventListener = null;
      this.endEventListener = null;
      
      this.releaseItem(mouseEvent.clientY);
    };
    this.cancelEventListener = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === "Escape") {
        this.cancel();
        this.previewHandler();
        this.originItem = null;
      }
    };
    document.body.addEventListener("mousemove", this.moveEventListener);
    document.body.addEventListener("mouseup", this.endEventListener);
    document.body.addEventListener("keydown", this.cancelEventListener);
  }

  public moveDragging(x: number, y: number) {
    const maxDistance = 5;
    const deltaX = this.originX - x;
    const deltaY = this.originY - y;
    if (this.originItem && !this.draggingItem && 
      (deltaX < -maxDistance || maxDistance < deltaX || 
      deltaY < -maxDistance || maxDistance < deltaY)) {
      this.originOpacity = this.originItem.style.opacity;
      this.originItem.style.opacity = "0.5";
      this.draggingItem = this.originItem.cloneNode(true) as HTMLElement;
      this.draggingItem.style.position = "absolute";
      this.draggingItem.style.zIndex = "1000";
      this.draggingItem.style.left = `${this.originX + this.deltaX}px`;
      this.draggingItem.style.top = `${this.originY + this.deltaY}px`;
      document.body.appendChild(this.draggingItem);
    }
    
    if (this.draggingItem) {
      this.draggingItem.style.left = `${x + this.deltaX}px`;
      this.draggingItem.style.top = `${y + this.deltaY}px`;
      
      this.draggingItem.style.display = 'none';
      const belowItem = document.elementFromPoint(x, y);
      this.draggingItem.style.display = '';

      if (belowItem) {
        const item = belowItem.closest('.todo-list-item');
        if (item instanceof HTMLElement) {
          this.registerPreviewTimer(item, y);
        }
        
        const checkbox = belowItem.querySelector('input[type="checkbox"]');
        if (item && item instanceof HTMLElement && 
          checkbox && checkbox instanceof HTMLInputElement && !checkbox.checked) {
          if (item !== this.belowItem) {
            this.belowItem?.classList.remove('target');
            this.belowItem = item;
            this.belowItem.classList.add('target');
          }
        } else if (!item) {
          this.belowItem?.classList.remove('target');
          this.belowItem = null;
        }
      } else {
        this.belowItem?.classList.remove('target');
        this.belowItem = null;
      }
    }
  }
  
  public isClick(item: HTMLElement): boolean {
    return !this.draggingItem && !!this.originItem && this.originItem == item;
  }
  
  public cancel() {
    if (this.originItem) {
      this.originItem.style.opacity = this.originOpacity;
      this.originItem.classList.remove('target');
    }
    if (this.draggingItem) {
      this.draggingItem.remove();
    }
    if (this.belowItem) {
      this.belowItem.classList.remove('target');
    }
    
    if (this.moveEventListener) {
      document.body.removeEventListener("mousemove", this.moveEventListener);
    }
    if (this.endEventListener) {
      document.body.removeEventListener("mouseup", this.endEventListener);
    }
    if (this.cancelEventListener) {
      document.body.removeEventListener("keydown", this.cancelEventListener);
    }
    
    this.previewLocTarget = null;
    this.draggingItem = null;
    this.belowItem = null;
  }

  public releaseItem(offsetY: number) {
    if (this.originItem && this.belowItem) {
      this.belowItem.classList.remove('target');
      if (this.previewLocTarget && (this.belowItem === this.previewLocTarget || this.belowItem === this.originItem)) {
        this.releaseHandler(this.originItem, this.previewLocTarget, this.previewBefore);
      } else {
        this.releaseHandler(this.originItem, this.belowItem, 
          offsetY > (this.belowItem.offsetTop + this.belowItem.offsetHeight / 2));
      }
    }
    this.cancel();
  }
  
  private registerPreviewTimer(item: HTMLElement, y: number) {
    const previewBefore = item.offsetTop + item.offsetHeight / 2 < y;
    if (item === this.originItem || (this.previewLocTarget && this.previewLocTarget === item && this.previewBefore === previewBefore)) {
      return;
    }
    
    if ((this.timerTarget !== item || this.previewBefore !== previewBefore) && item instanceof HTMLElement) {
      this.previewBefore = previewBefore;
      this.timerTarget = item;
      if (this.previewTimer) {
        clearTimeout(this.previewTimer);
      }

      this.previewTimer = setTimeout(() => {
        this.previewTimer = null;
        if (this.originItem && item instanceof HTMLElement && this.belowItem) {
          this.belowItem?.classList.remove('target');
          this.previewLocTarget = this.belowItem;
          this.previewHandler(this.originItem, item, this.previewBefore);
        }
      }, 2000);
    }
  }
}

