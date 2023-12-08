$(document).ready(async function () {
  // let tasks = JSON.parse(localStorage.getItem("data") || "[]");
  let tasks = [];
  try {
    const { data } = await axios.get("/api/tasks");
    tasks = data.data;
  } catch (e) {}
  displayCurrentTasks();
  // render task display html string
  function renderTaskHtml(task, extra = "") {
    return `
          <li class="${task.type}">
            <div class="taskName">
              <div class="taskDate bg${task.type}">${task.deadline}</div>
              <div class="assignee bg${task.type}">${task.assignee}</div>
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
  function displayCurrentTasks(keyWord = undefined) {
    const sortedTasks = getSortedCurrentTasks();

    const tasks = sortedTasks.filter((task) => {
      if (task.completed) {
        return false;
      } else {
        if (keyWord) {
          return (
            task.title.indexOf(keyWord) != -1 ||
            task.description.indexOf(keyWord) != -1 ||
            task.assignee.indexOf(keyWord) != -1
          );
        } else {
          return true;
        }
      }
    });

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
                <img class="taskIcon editTask" src="assets/edit.svg" data-id="${task._id}"></img>
                <img class="taskIcon completeTask" src="assets/finish.svg" data-id="${task._id}"></img>
                <img class="taskIcon deleteTask" src="assets/delete.svg" data-id="${task._id}"></img>
            </div>
          `
          )
        );
      });
    }
  }

  // Display completed tasks
  function displayCompletedTasks(keyWord = undefined) {
    const sortedTasks = getSortedCurrentTasks();

    const tasks = sortedTasks
      .filter((task) => {
        if (task.completed) {
          if (keyWord) {
            return (
              task.title.indexOf(keyWord) != -1 ||
              task.description.indexOf(keyWord) != -1 ||
              task.assignee.indexOf(keyWord) != -1
            );
          } else {
            return true;
          }
        } else {
          return false;
        }
      })
      .reverse();

    $("#taskLists").empty();
    if (tasks.length === 0) {
      $("#taskLists").html("<li class='noData'>No data</li>");
    } else {
      tasks.forEach((task) => {
        $("#taskLists").append(
          renderTaskHtml(
            task,
            `<div class="typeTag completed"><b>Completed</b></div>`
          )
        );
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

  $("#task-filter").on("input", function () {
    let keyWord = $("#task-filter").val();
    displayCurrentTasks(keyWord);
  });

  // Delete task on button click
  $(document).on("click", ".deleteTask", async function () {
    const id = $(this).data("id");
    try {
      await axios.delete(`/api/task/${id}`);
      tasks = tasks.filter((task) => task._id !== id);
      displayCurrentTasks();
    } catch (e) {
      console.log(e);
    }
  });

  // Complete task on button click
  $(document).on("click", ".completeTask", async function () {
    const id = $(this).data("id");
    try {
      await axios.put(`/api/task/${id}/complete`);
      tasks.find((task) => task._id === id).completed = true;
      displayCurrentTasks();
    } catch (e) {
      console.log(e);
    }
  });

  // Edit task on button click
  $(document).on("click", ".editTask", function () {
    const id = $(this).data("id");
    location.href = `/task?taskId=${id}`;
  });

  //Toggle current and completed tasks
  $("#taskToggle").on("click", function () {
    const $text = $(this);
    const text = $(this).text();
    const $h1 = $("h1");
    if (text === "Completed Tasks") {
      displayCompletedTasks($("#task-filter").val());
      $text.text("Current Tasks");
      $h1.text("Completed Tasks");
    } else {
      displayCurrentTasks($("#task-filter").val());
      $text.text("Completed Tasks");
      $h1.text("Current Tasks");
    }
  });
});
