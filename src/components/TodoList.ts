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

const makeUniqueId = () => {
  let nextId = 0;
  return () => {
    nextId++;
    return nextId;
  };
};

const TodoList = (): HTMLElement => {
  const container = document.createElement("div");
  container.classList.add("todo-list");

  const todoListInput = Object.assign(document.createElement("input"), {
    name: "todo-list-input",
    classList: ["todo-list-input"],
    type: "text",
    placeholder: "What needs to be done?",
    dataset: {
      id: makeUniqueId(),
    },
  });

  const todoListItemContainer = document.createElement("div");
  todoListItemContainer.classList.add("todo-list-item-container");

  const todoListFooter = document.createElement("div");
  todoListFooter.classList.add("todo-list-footer");

  const todoListFooterLeft = document.createElement("div");
  todoListFooterLeft.classList.add("todo-list-footer-left");

  const leftText = document.createElement("span");
  leftText.textContent = "0 items left";
  todoListFooterLeft.appendChild(leftText);

  const todoListFooterCenter = document.createElement("div");
  todoListFooterCenter.classList.add("todo-list-footer-center");

  const allButton = document.createElement("button");
  allButton.classList.add("todo-list-button");
  allButton.textContent = "All";

  const activeButton = document.createElement("button");
  activeButton.classList.add("todo-list-button");
  activeButton.name = "todo-list-button-active";
  activeButton.textContent = "Active";

  const completedButton = document.createElement("button");
  completedButton.classList.add("todo-list-button");
  completedButton.name = "todo-list-button-completed";
  completedButton.textContent = "Completed";

  todoListFooterCenter.appendChild(allButton);
  todoListFooterCenter.appendChild(activeButton);
  todoListFooterCenter.appendChild(completedButton);

  const todoListFooterRight = document.createElement("div");
  todoListFooterRight.classList.add("todo-list-footer-right");

  const clearCompletedButton = document.createElement("button");
  clearCompletedButton.classList.add("todo-list-button");
  clearCompletedButton.name = "todo-list-button-clear-completed";
  clearCompletedButton.textContent = "Clear completed";

  todoListFooterRight.appendChild(clearCompletedButton);

  todoListFooter.appendChild(todoListFooterLeft);
  todoListFooter.appendChild(todoListFooterCenter);
  todoListFooter.appendChild(todoListFooterRight);

  container.appendChild(todoListInput);
  container.appendChild(todoListItemContainer);
  container.appendChild(todoListFooter);
  return container;
}

export default TodoList;
