"use strict";
const db = require("./models/index");

async function listTodo() {
  try {
    await db.Todo.showList();
  } catch (error) {
    console.error(error);
  }
}

(async function() {
  await listTodo();
})();
