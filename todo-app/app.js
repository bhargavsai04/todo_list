"use strict";
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.get("/todos", async (_request, response) => {
  console.log("Processing list of all Todos ...");
  try {
    const todo = await Todo.findAll();
    response.json(todo);
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

app.get("/todos/:id", async (request, response) => {
  try {
    const todo = await Todo.findByPk(request.params.id);
    response.json(todo);
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  try {
    const todo = await Todo.addTodo(request.body);
    response.json(todo);
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    response.json(updatedTodo);
  } catch (error) {
    console.error(error);
    response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const deleteFlag = await Todo.destroy({ where: { id: request.params.id } });
  response.send(deleteFlag ? true : false);
});

module.exports = app;
