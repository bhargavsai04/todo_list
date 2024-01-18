function todoList() {
  let all = [];

  function add(todoItem) {
    all.push(todoItem);
  }

  function markAsComplete(index) {
    all[index].completed = true;
  }

  function overdue() {
    return all.filter(
      (item) => item.dueDate < new Date().toLocaleDateString("en-CA"),
    );
  }

  function dueToday() {
    return all.filter(
      (item) => item.dueDate == new Date().toLocaleDateString("en-CA"),
    );
  }

  function dueLater() {
    return all.filter(
      (item) => item.dueDate > new Date().toLocaleDateString("en-CA"),
    );
  }

  function toDisplayableList(list) {
    let opArray = list.map(
      (item) =>
        `${item.completed ? "[x]" : "[ ]"} ${item.title} ${
          item.dueDate === new Date().toLocaleDateString("en-CA")
            ? ""
            : item.dueDate
        }`,
    );

    let str = String(opArray);
    str = str.replace(",", "\n");
    return str;
  }

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
}

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

module.exports = todoList;
