/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    const today = new Date();
    const oneDay = 60 * 60 * 24 * 1000;
    [
      {
        title: "Complete assignment",
        completed: false,
        dueDate: new Date(today.getTime() - 1 * oneDay).toLocaleDateString(
          "en-CA",
        ),
      },
      {
        title: "Go for shopping",
        completed: false,
        dueDate: new Date().toLocaleDateString("en-CA"),
      },
      {
        title: "Complete project",
        completed: false,
        dueDate: new Date(today.getTime() + 1 * oneDay).toLocaleDateString(
          "en-CA",
        ),
      },
    ].forEach(add);
  });
  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Test for overdue", () => {
    expect(overdue().length).toEqual(1);
  });

  test("Test due today", () => {
    expect(dueToday().length).toEqual(2);
  });

  test("Test for due later", () => {
    expect(dueLater().length).toEqual(1);
  });
});
