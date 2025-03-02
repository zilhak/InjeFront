import IdGenerator from "../utils/IdGenerator";
import { 
  constructTodoListInput, 
  constructTodoListItemContainer, 
  constructFooter, 
  constructTodoListItem 
} from "./todo-list/constructor";
import { ItemList } from "./todo-list/itemList";

// <div class="todo-list">
//   <input name="todo-list-input" class="todo-list-input" type="text" placeholder="What needs to be done?" />
//   <div class="todo-list-item-container"/>
//   <div class="todo-list-footer">
//     <div class="todo-list-footer-left">
//       <span name="todo-list-left-text">0 items left</span>
//     </div>
//     <div class="todo-list-footer-center">
//       <button class="todo-list-button" name="todo-list-button-all">All</button>
//       <button class="todo-list-button" name="todo-list-button-active">Active</button>
//       <button class="todo-list-button" name="todo-list-button-completed">Completed</button>            
//     </div>
//     <div class="todo-list-footer-right">
//       <button class="todo-list-button" name="todo-list-button-clear-completed">Clear completed</button>            
//     </div>
//   </div>
// </div>

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
  const activeItemList = new ItemList<HTMLElement>();
  const completedItemList = new ItemList<HTMLElement>();

  const dispatchHandler = (list: HTMLElement[]) => {
    todoListItemContainer.innerHTML = "";
    list.forEach((item) => {
      todoListItemContainer.appendChild(item);
    });
  }

  todoListInput.addEventListener("input", (event) => {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    activeItemList.addItem(constructTodoListItem(value, id), (item) => {
      item.addEventListener("click", (event: MouseEvent) => {
        const target = event.target;
        if (target instanceof HTMLButtonElement) {
          return;
        }

        if (!item.classList.contains("completed")) {
          item.classList.add("completed");
        }
      });

      const deleteButton = item.querySelector(".todo-list-item-delete-button");
      deleteButton?.addEventListener("click", (_event) => {
        const deleteEvent = new CustomEvent("delete", {
          bubbles: true,
          detail: { item: item }
        });
        deleteButton.dispatchEvent(deleteEvent);
        activeItemList.dispatch(dispatchHandler);
      });
    });
    activeItemList.dispatch(dispatchHandler);

    input.value = "";
  });
  
  const allButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-all']");
  const activeButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-active']");
  const completedButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-completed']");
  
  allButton?.addEventListener("click", () => {
    appliedButton = 'all';
    allButton.classList.add("apply");
    activeButton?.classList.remove("apply");
    completedButton?.classList.remove("apply");
  });
  activeButton?.addEventListener("click", () => {
    appliedButton = 'active';
    allButton?.classList.remove("apply");
    activeButton.classList.add("apply");
    completedButton?.classList.remove("apply");
  });
  completedButton?.addEventListener("click", () => {
    appliedButton = 'completed';
    allButton?.classList.remove("apply");
    activeButton?.classList.remove("apply");
    completedButton.classList.add("apply");
  });
  
  const clearCompletedButton = todoListFooter.querySelector(".todo-list-button[name='todo-list-button-clear-completed']");
  clearCompletedButton?.addEventListener("click", () => {
    completedItemList.clear();
  });
  
}



export default TodoList;
