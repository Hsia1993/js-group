// generate random uuid for taskss
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
$(document).ready(function () {
  // Initialize date picker
  let tasks = JSON.parse(localStorage.getItem("data") || "[]");
  $(".datepicker").datepicker({
    minDate: 0,
  });

  let url = decodeURI(window.location.href);
  let taskId = url.split("?taskId=")[1];
  console.log(`taskId: ${taskId}`);

  let task = undefined
  if (taskId) {
    task = tasks.find((task) => task.id === taskId);
    if (task) {
      $("#title").val(task.title)
      $("#assignee").val(task.assignee)
      $("#description").val(task.description)
      $("#deadline").val(task.deadline)
      $("#type").val(task.type)
    }
  }

  // Submit form to add a new task
  $("#addTaskForm").submit(function (event) {
    event.preventDefault();

    // Get form values
    let data = [
      "content",
      "deadline",
      "type",
      "title",
      "description",
      "assignee",
    ].reduce((acc, cur) => {
      acc[cur] = $(`#${cur}`).val();
      return acc;
    }, {});

    if (task) {
      for (let key in data) {
        task[key] = data[key]
      }
      task['completed'] = false
    } else {
      // Create task object
      task = {
        ...data,
        id: uuid(),
        completed: false,
      };
      tasks.push(task);
    }

    // Add task to tasks array
    localStorage.setItem("data", JSON.stringify(tasks));

    // Clear the form
    $("#content").val("");
    $("#deadline").val("");
    window.location.href = "index.html";
  });
});
