import TodoList from "@component/TodoList";

describe("TodoList", () => {
  it("should create a todo list", () => {
    const todoListComponent = TodoList();
    expect(todoListComponent).toBeDefined();
  });
});

