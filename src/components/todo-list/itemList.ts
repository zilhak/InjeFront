export class ItemList<T extends HTMLElement> {
  private head: ItemNode<T> | null;
  private tail: ItemNode<T> | null;
  
  public constructor() {
    this.head = null;
    this.tail = null;
  }
  
  addItem(item: T, registerHandler?: (item: T) => void) {
    if (registerHandler) {
      registerHandler(item);
    }

    const newNode = new ItemNode<T>({
      prev: this.tail, 
      next: null,
      item: item
    });
    
    const deleteHandler = () => {
      this.deleteNode(newNode);
      
      item.removeEventListener("delete", deleteHandler);
    };
    
    item.addEventListener("delete", deleteHandler);

    if (this.tail !== null) {
      this.tail.next = newNode;
    }
    this.tail = newNode;

    if (this.head === null) {
      this.head = newNode;
    }
  }
  
  move(item: T, target: T, isBefore: boolean) {
    const node = this.findNode(item);
    const targetNode = this.findNode(target);
    
    if (!node || !targetNode) {
      return;
    }
    
    if (node.item === targetNode.item) {
      return;
    }
    
    this.popNode(node);
    this.insertNode(node, targetNode, isBefore);
  }
  
  clear(filter?: (item: T) => boolean) {
    for (const node of this) {
      if (!filter || filter(node.item)) {
        this.deleteNode(node);
      }
    }
  }
  
  private findNode(item: T) {
    for (const node of this) {
      if (node.item === item) {
        return node;
      }
    }
  }
  
  private insertNode(node: ItemNode<T>, target: ItemNode<T>, isBefore: boolean) {
    if (isBefore) {
      node.prev = target.prev;
      node.next = target;

      if (target.prev) {
        target.prev.next = node;
      } else {
        this.head = node;
      }
      target.prev = node;
    } else {
      node.prev = target;
      node.next = target.next;
      
      if (target.next) {
        target.next.prev = node;
      } else {
        this.tail = node;
      }
      target.next = node;
    }
  }
  
  private popNode(node: ItemNode<T>) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private deleteNode(node: ItemNode<T>) {
    this.popNode(node);
    node.item.remove();
  }
  
  dispatch(callback: (activeList: T[], completedList: T[]) => void, activeFilter?: (item: T) => boolean, completedFilter?: (item: T) => boolean) {
    const activeList = [];
    const completedList = [];
    for (const node of this) {
      if (!activeFilter || activeFilter(node.item)) {
        activeList.push(node.item);
      }
      if (completedFilter && completedFilter(node.item)) {
        completedList.push(node.item);
      }
    }

    callback(activeList, completedList);
  }  
  
  [Symbol.iterator](): Iterator<ItemNode<T>> {
    let current = this.tail;
    
    return {
      next: (): IteratorResult<ItemNode<T>> => {
        if (!current) {
          return { done: true, value: null };
        }
        
        const value = current;
        current = current.prev;
        
        return { done: false, value };
      }
    };
  }
}

interface ItemNodeInterface<T> {
  prev: ItemNode<T> | null;
  next: ItemNode<T> | null;
  item: T;
}

class ItemNode<T> implements ItemNodeInterface<T> {
  prev: ItemNode<T> | null;
  next: ItemNode<T> | null;
  item: T;

  constructor({ prev, next, item }: ItemNodeInterface<T>) {
    this.prev = prev;
    this.next = next;
    this.item = item;
  }
}