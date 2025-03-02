import IdGenerator from "@/utils/IdGenerator";

export const constructTodoListInput = (): HTMLElement => {
  const todoListInput = Object.assign(document.createElement("input"), {
    name: "todo-list-input",
    classList: ["todo-list-input"],
    type: "text",
    placeholder: "What needs to be done?",
  });

  return todoListInput;
}

export const constructTodoListItemContainer = (): HTMLElement => {
  const todoListItemContainer = Object.assign(document.createElement("div"), {
    classList: ["todo-list-item-container"],
  });
  return todoListItemContainer;
}

export const constructFooter = (): HTMLElement => {
  const todoListFooter = Object.assign(document.createElement("div"), {
    classList: ["todo-list-footer"],
  });
  
  const todoListFooterLeft = Object.assign(document.createElement("div"), {
    classList: ["todo-list-footer-left"],
  });

  const leftText = Object.assign(document.createElement("span"), {
    textContent: "0 items left",
  });
  todoListFooterLeft.appendChild(leftText);

  const todoListFooterCenter = Object.assign(document.createElement("div"), {
    classList: ["todo-list-footer-center"],
  });

  const allButton = Object.assign(document.createElement("button"), {
    classList: ["todo-list-button"],
    name: "todo-list-button-all",
    textContent: "All",
  });

  const activeButton = Object.assign(document.createElement("button"), {
    classList: ["todo-list-button"],
    name: "todo-list-button-active",
    textContent: "Active",
  });

  const completedButton = Object.assign(document.createElement("button"), {
    classList: ["todo-list-button"],
    name: "todo-list-button-completed",
    textContent: "Completed",
  });

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
  
  return todoListFooter;
}

export const constructTodoListItem = (value: string, componentId: number): HTMLElement => {
  const todoListItem = Object.assign(document.createElement("div"), {
    classList: ["todo-list-item"],
  });
  
  const textItem = Object.assign(document.createElement("span"), {
    classList: ["todo-list-item-text"],
    textContent: value,
  });
  
  todoListItem.appendChild(textItem);
  
  const deleteButton = Object.assign(document.createElement("button"), {
    classList: ["todo-list-item-delete-button"],
    textContent: "삭제",
  });
  
  todoListItem.appendChild(deleteButton);
  
  todoListItem.dataset.id = componentId.toString();
  todoListItem.dataset.itemId = `${IdGenerator.generateId()}`;
  
  return todoListItem;
}
