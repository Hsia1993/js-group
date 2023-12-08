// generate random uuid for taskss
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
$(document).ready(async function () {
  // Initialize date picker
  let tasks = JSON.parse(localStorage.getItem("data") || "[]");
  $(".datepicker").datepicker({
    minDate: 0,
  });

  let url = decodeURI(window.location.href);
  let taskId = url.split("?taskId=")[1];
  let task = undefined;
  if (taskId) {
    try {
      const { data } = await axios.get(`/api/task/${taskId}`);
      task = data.data;
    } catch (e) {}

    if (task) {
      $("#title").val(task.title);
      $("#assignee").val(task.assignee);
      $("#description").val(task.description);
      $("#deadline").val(task.deadline);
      $("#type").val(task.type);
    }
  }

  // Submit form to add a new task
  $("#addTaskForm").submit(async function (event) {
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
    task = {
      ...data,
      completed: false,
    };
    tasks.push(task);
    try {
      if (taskId) {
        await axios.put(`/api/task/${taskId}`, task);
      } else {
        await axios.post("/api/task", task);
      }
      $("#content").val("");
      $("#deadline").val("");
      window.location.href = "/";
    } catch (e) {
      console.log(e);
    }
  });
});
