$(document).ready(function () {
  let tasks = JSON.parse(localStorage.getItem("data") || "[]");
  displayCurrentTasks();
  // render task display html string
  function renderTaskHtml(task, extra = "") {
    return `
          <li>
            <div class="taskName">
              <div class="taskDate">${task.deadline}</div>
              <div class="assignee">${task.assignee}</div>
              <strong>${task.title}</strong>
              <div class="description">${task.description}</div>
            </div>
            <div class="taskInfo">
              <div class="typeTag ${task.type}">${task.type}</div>
              ${extra}
            </div>
        </li>
    `;
  }
  // Display current tasks
  function displayCurrentTasks() {
    const sortedTasks = getSortedCurrentTasks();
    const tasks = sortedTasks.filter((task) => !task.completed);
    $("#taskLists").empty();
    if (tasks.length === 0) {
      $("#taskLists").html("<li class='noData'>No data</li>");
    } else {
      tasks.forEach((task) => {
        $("#taskLists").append(
          renderTaskHtml(
            task,
            `
            <div class=action>
                <img class="taskIcon completeTask" src="assets/tick.svg" data-id="${task.id}"></img>
                <img class="taskIcon deleteTask" src="assets/close.svg" data-id="${task.id}"></img>
                <img class="taskIcon editTask" src="assets/edit.svg" data-id="${task.id}"></img>
            </div>
          `
          )
        );
      });
    }
  }
  // Display completed tasks
  function displayCompletedTasks() {
    const sortedTasks = getSortedCurrentTasks();
    const tasks = sortedTasks.filter((task) => task.completed).reverse();
    $("#taskLists").empty();
    if (tasks.length === 0) {
      $("#taskLists").html("<li class='noData'>No data</li>");
    } else {
      tasks.forEach((task) => {
        $("#taskLists").append(renderTaskHtml(task));
      });
    }
  }

  // Function to get current tasks
  function getSortedCurrentTasks() {
    const sortedTasks = tasks.sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );
    return sortedTasks;
  }

  // Delete task on button click
  $(document).on("click", ".deleteTask", function () {
    const id = $(this).data("id");
    console.log(id, tasks);
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("data", JSON.stringify(tasks));
    displayCurrentTasks();
  });

  // Complete task on button click
  $(document).on("click", ".completeTask", function () {
    const id = $(this).data("id");
    console.log(id, tasks);
    tasks.find((task) => task.id === id).completed = true;
    localStorage.setItem("data", JSON.stringify(tasks));
    displayCurrentTasks();
  });

  // Edit task on button click
  $(document).on("click", ".editTask", function () {
    const id = $(this).data("id");
    console.log(id, tasks);

    location.href = `task.html?taskId=${id}`
  });

  //Toggle current and completed tasks
  $("#taskToggle").on("click", function () {
    const $text = $(this);
    const text = $(this).text();
    const $h1 = $("h1");
    if (text === "Completed Tasks") {
      displayCompletedTasks();
      $text.text("Current Tasks");
      $h1.text("Completed Tasks");
    } else {
      displayCurrentTasks();
      $text.text("Completed Tasks");
      $h1.text("Current Tasks");
    }
  });
});
