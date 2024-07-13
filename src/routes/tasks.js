const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const tasksFilePath = path.join(__dirname,"../../data/tasks.json");
console.log(__dirname,"../../data/tasks.json")

// Leer tareas desde el archivo
const readTasks = () => {
  const tasksData = fs.readFileSync(tasksFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(tasksData); // Retornar los datos en formato JSON.
};

// Escribir tareas en el archivo
const writeTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
};

// Crear una nueva tarea
router.post("/", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length + 1, // simulamos un id autoincrementable
    title: req.body.title, // obtenemos el titulo de la tarea desde el cuerpo de la solicitud
    description: req.body.description, // obtenemos la descripcion de la tarea desde el cuerpo de la solicitud
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json({ message: "Tarea creada exitosamente", task: newTask });
});

// Obtener todas las tareas
router.get("/", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Obtener una tarea por ID
router.get("/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }
  res.json(task);
});

// Actualizar una tarea por ID
router.put("/:id", (req, res) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }
  const updatedTask = {
    ...tasks[taskIndex],
    title: req.body.title,
    description: req.body.description,
  };
  tasks[taskIndex] = updatedTask;
  writeTasks(tasks);
  res.json({ message: "Tarea actualizada exitosamente", task: updatedTask });
});

// Eliminar una tarea por ID
router.delete("/:id", (req, res) => {
  const tasks = readTasks();
  const newTasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  if (tasks.length === newTasks.length) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }
  writeTasks(newTasks);
  res.json({ message: "Tarea eliminada exitosamente" });
});

module.exports = router;