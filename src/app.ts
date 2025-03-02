import TodoList from "@component/TodoList.ts";

const container = document.querySelector<HTMLDivElement>("main.core-container");
if (!container) {
  throw new Error("core-container not found");
}

container.appendChild(TodoList());