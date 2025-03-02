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
  
  private belowItem: HTMLElement | null = null;
  private releaseHandler: (item: HTMLElement, target: HTMLElement, isBefore: boolean) => void = () => {};

  private constructor() {
  }

  public setReleaseHandler(handler: (item: HTMLElement, target: HTMLElement, isBefore: boolean) => void) {
    this.releaseHandler = handler;
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
    document.body.addEventListener("mousemove", this.moveEventListener);
    document.body.addEventListener("mouseup", this.endEventListener);
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
        if (item && item instanceof HTMLElement) {
          if (item !== this.belowItem) {
            this.belowItem?.classList.remove('target');
            this.belowItem = item;
            this.belowItem.classList.add('target');
          }
        } else if (!item) {
          this.belowItem?.classList.remove('target');
          this.belowItem = null;
        }
      }
    }
  }
  
  public isDragging(): boolean {
    return this.draggingItem !== null;
  }
  
  public cancel() {
    if (this.originItem) {
      this.originItem.style.opacity = this.originOpacity;
    }
    if (this.draggingItem) {
      this.draggingItem.remove();
    }
    
    this.originItem = null;
    this.draggingItem = null;
    this.belowItem = null;
  }

  public releaseItem(offsetY: number) {
    if (this.belowItem) {
      this.belowItem.classList.remove('target');
      if (this.originItem) {
        this.releaseHandler(this.originItem, this.belowItem, 
          offsetY > (this.belowItem.offsetTop + this.belowItem.offsetHeight / 2));
      }
    }
    this.cancel();
  }
}

