"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await this.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");
      console.log("Overdue");
      console.log(
        (await this.overdue())
          .map((todo) => todo.displayableString())
          .join("\n"),
      );
      console.log("\n");
      console.log("Due Today");
      console.log(
        (await this.dueToday())
          .map((todo) => todo.displayableString())
          .join("\n"),
      );
      console.log("\n");
      console.log("Due Later");
      console.log(
        (await this.dueLater())
          .map((todo) => todo.displayableString())
          .join("\n"),
      );
    }

    static async overdue() {
      return await this.findAll({
        where: { dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") } },
      });
    }

    static async dueToday() {
      return await this.findAll({
        where: { dueDate: { [Op.eq]: new Date().toLocaleDateString("en-CA") } },
      });
    }

    static async dueLater() {
      return await this.findAll({
        where: { dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") } },
      });
    }

    static async markAsComplete(id) {
      await this.update({ completed: true }, { where: { id: id } });
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title.trim()} ${
        this.dueDate == new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate
      }`.trim();
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );

  return Todo;
};
