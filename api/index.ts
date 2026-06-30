import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { Task } from "./type/task";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data/tasks.json");

app.use(cors());
app.use(express.json());

function loadTasks(): Task[] {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveTasks(tasks: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

let tasks = loadTasks();

app.get("/api/tasks", (req, res) => {
  try {
    res.status(200).json(tasks);
  } catch (e: any) {
    throw new Error(e);
  }
});

app.post("/api/tasks", (req, res) => {
  const newTask = req.body;

  try {
    tasks = [...tasks, {...newTask, id: Math.random().toString()}];

    saveTasks(tasks);

    res.status(201).json(tasks);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    res.status(404).send(`No task with Id-${taskId} found`);
  }

  try {
    const updatedTask = tasks.map((task) => {
      return task.id === taskId ? { ...task, ...req.body } : task;
    });

    tasks = updatedTask;
    saveTasks(updatedTask);
    res.status(200).json(updatedTask);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(404).send(`Id is missing`);
  }

  try {
    const myTasks = tasks.find((task) => task.id === id);
    if (!myTasks) {
      res.status(404).send("Task is not found");
      return;
    }

    tasks = tasks.filter((task) => task.id !== id);

    saveTasks(tasks);

    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
