const taskModel = require("../models/task");
const editTask = async (req, res) => {
  try {
    const data = await taskModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
      completed: undefined,
    });
    res.status(200).send({ data });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
};
const completeTask = async (req, res) => {
  try {
    const data = await taskModel.findByIdAndUpdate(req.params.id, {
      completed: true,
    });
    res.status(200).send({ data });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const data = await taskModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ data });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
};

const createTask = async (req, res) => {
  try {
    const data = await taskModel.create({
      ...req.body,
      completed: undefined,
    });
    res.status(200).send({ data });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
};
const getTaskList = async (req, res) => {
  try {
    const data = await taskModel.find(req.query);
    res.status(200).send({ data });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
};

const getTask = async (req, res) => {
  try {
    const data = await taskModel.findById(req.params.id);
    res.status(200).send({ data });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
};
module.exports = {
  "[PUT] /task/:id": editTask,
  "[PUT] /task/:id/complete": completeTask,
  "[DELETE] /task/:id": deleteTask,
  "[POST] /task": createTask,
  "[GET] /tasks": getTaskList,
  "[GET] /task/:id": getTask,
};
