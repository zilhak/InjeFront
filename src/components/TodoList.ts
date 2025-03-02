import IdGenerator from "../utils/IdGenerator";
import { 
  constructTodoListInput, 
  constructTodoListItemContainer, 
  constructFooter, 
  constructTodoListItem 
} from "./todo-list/constructor";
import { ItemDragManager } from "./todo-list/itemDragManager";
import { ItemList } from "./todo-list/itemList";

const TodoList = (): HTMLElement => {
  const container = document.createElement("div");
  container.classList.add("todo-list");

  const id = IdGenerator.generateId();
  const todoListInput = constructTodoListInput();
  const todoListItemContainer = constructTodoListItemContainer();
  const todoListFooter = constructFooter();
  
  setEventListeners(todoListInput, todoListItemContainer, todoListFooter, id);

  container.appendChild(todoListInput);
  container.appendChild(todoListItemContainer);
  container.appendChild(todoListFooter);
  
  return container;
}

const setEventListeners = (
  todoListInput: HTMLElement, 
  todoListItemContainer: HTMLElement, 
  todoListFooter: HTMLElement,
  id: number
) => {
  let appliedButton: 'all' | 'active' | 'completed' = 'all';
  
  const itemList = new ItemList<HTMLElement>();

  todoListInput.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent) || 
          event.key !== "Enter" || 
        !(event.target instanceof HTMLInputElement)) {
      return;
    }

    const value = event.target.value;
    itemList.addItem(constructTodoListItem(value, id), (item) => {
      registerItemListener(item, dispatch);
    });
    const itemDragManager = ItemDragManager.getInstance();
    itemDragManager.setReleaseHandler((item, target, isBefore) => {
      itemList.move(item, target, isBefore);
      dispatch();
    });
    dispatch();

    event.target.value = "";
  });
  
  const itemLeftText = todoListFooter.querySelector(".todo-list-footer-left > span");
  const allButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-all']");
  const activeButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-active']");
  const completedButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-completed']");
  allButton?.classList.add("apply");
  
  allButton?.addEventListener("click", () => {
    if (appliedButton === 'all') return;

    appliedButton = 'all';
    allButton.classList.add("apply");
    activeButton?.classList.remove("apply");
    completedButton?.classList.remove("apply");
    dispatch();
  });

  activeButton?.addEventListener("click", () => {
    if (appliedButton === 'active') return;

    appliedButton = 'active';
    allButton?.classList.remove("apply");
    activeButton.classList.add("apply");
    completedButton?.classList.remove("apply");
    dispatch();
  });

  completedButton?.addEventListener("click", () => {
    if (appliedButton === 'completed') return;

    appliedButton = 'completed';
    allButton?.classList.remove("apply");
    activeButton?.classList.remove("apply");
    completedButton.classList.add("apply");
    dispatch();
  });
  
  const clearCompletedButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-clear-completed']");
  clearCompletedButton?.addEventListener("click", () => {
    itemList.clear(completedFilter);
    dispatch();
  });
  
  const dispatch = () => {
    todoListItemContainer.innerHTML = "";
    itemList.dispatch((activeList: HTMLElement[], completedList: HTMLElement[]) => {
      if (appliedButton !== 'completed') {
        activeList.forEach((item) => {
          todoListItemContainer.appendChild(item);
        });
      }

      if (appliedButton !== 'active') {
        completedList.forEach((item) => {
          todoListItemContainer.appendChild(item);
        });
      }

      if (itemLeftText) {
        itemLeftText.textContent = `${activeList.length} items left`;
      }
      if (clearCompletedButton) {
        clearCompletedButton.textContent = `Clear completed (${completedList.length})`;
      }
    }, activeFilter, completedFilter);
  }

  dispatch();
}

const activeFilter = (item: HTMLElement) => {
  const checkbox = item.querySelector("input[type='checkbox']");
  if (checkbox && checkbox instanceof HTMLInputElement) {
    return !checkbox.checked;
  }
  return false;
}

const completedFilter = (item: HTMLElement) => {
  const checkbox = item.querySelector("input[type='checkbox']");
  if (checkbox && checkbox instanceof HTMLInputElement) {
    return checkbox.checked;
  }
  return false;
}

const registerItemListener = (item: HTMLElement, dispatch: () => void) => {
  const deleteButton = item.querySelector(".todo-list-item-delete-button");
  deleteButton?.addEventListener("click", (_event) => {
    const deleteEvent = new CustomEvent("delete", {
      bubbles: true,
      detail: { item: item }
    });
    deleteButton.dispatchEvent(deleteEvent);
    dispatch();
  });
  
  const itemDragManager = ItemDragManager.getInstance();
  item.addEventListener("mousedown", (event: MouseEvent) => {
    const target = event.target;
    if (target instanceof HTMLButtonElement || item.classList.contains("completed")) {
      return;
    }
    
    itemDragManager.selectItem(item, event.clientX, event.clientY);
    event.preventDefault();
  });

  item.addEventListener("mouseup", (event: MouseEvent) => {
    if (itemDragManager.isClick(item)) {
      const target = event.target;
      if (target instanceof HTMLButtonElement || item.classList.contains("completed")) {
        return;
      }
      
      const checkbox = item.querySelector("input[type='checkbox']");
      if (checkbox && checkbox instanceof HTMLInputElement) {
        checkbox.checked = !checkbox.checked;
      }

      dispatch();
    }
  });
}

export default TodoList;
