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
  
  move(item: T, list: ItemList<T>) {
    const node = this.findNode(item);
    if (node) {
      this.deleteNode(node);
      list.addItem(node.item);
    }
  }
  
  clear() {
    this.head = null;
    this.tail = null;

    for (const node of this) {
      node.item.remove();
    }
  }
  
  private findNode(item: T) {
    for (const node of this) {
      if (node.item === item) {
        return node;
      }
    }
  }

  private deleteNode(node: ItemNode<T>) {
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
    
    node.item.remove();
  }
  
  dispatch(callback: (list: T[]) => void) {
    const list = [];
    for (const node of this) {
      list.push(node.item);
    }

    callback(list);
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