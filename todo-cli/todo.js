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
        (item) => item.dueDate < new Date().toLocaleDateString("en-CA")
      );
    }
  
    function dueToday() {
      return all.filter(
        (item) => item.dueDate == new Date().toLocaleDateString("en-CA")
      );
    }
  
    function dueLater() {
      return all.filter(
        (item) => item.dueDate > new Date().toLocaleDateString("en-CA")
      );
    }
  
    function toDisplayableList(list) {
      let opArray = list.map(
        (item) =>
          `${item.completed ? "[x]" : "[ ]"} ${item.title} ${
            item.dueDate === new Date().toLocaleDateString("en-CA")
              ? ""
              : item.dueDate
          }`
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
  
  const todos = todoList();
  
  function formattedDate(d) {
    return d.toISOString().split("T")[0];
  }
  
  let dateToday = new Date();
  const today = formattedDate(dateToday);
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  );
  
  todos.add({ title: "Submit assignment", dueDate: yesterday, completed: false });
  todos.add({ title: "Pay rent", dueDate: today, completed: true });
  todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
  todos.add({ title: "File taxes", dueDate: tomorrow, completed: false });
  todos.add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
  
  console.log("My Todo-list\n");
  
  console.log("Overdue");
  let overdues = todos.overdue();
  let formattedOverdues = todos.toDisplayableList(overdues);
  console.log(formattedOverdues);
  console.log("\n");
  
  console.log("Due Today");
  let itemsDueToday = todos.dueToday();
  let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday);
  console.log(formattedItemsDueToday);
  console.log("\n");
  
  console.log("Due Later");
  let itemsDueLater = todos.dueLater();
  let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater);
  console.log(formattedItemsDueLater);
  console.log("\n\n");
  