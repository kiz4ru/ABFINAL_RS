const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: 'Tarea de ejemplo 1', completed: false },
  { id: 2, title: 'Tarea de ejemplo 2', completed: true },
];
let nextId = 3;

// Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Crear una nueva tarea
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }
  const newTask = { id: nextId++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Actualizar una tarea existente (marcar como completada/incompleta)
app.patch('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  // Solo permitimos actualizar el estado 'completed'
  if (typeof req.body.completed === 'boolean') {
    task.completed = req.body.completed;
  } else {
    return res.status(400).json({ message: 'Solo se puede actualizar el estado de completado.' });
  }

  res.json(task);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor de tareas escuchando en http://localhost:${port}`);
  });
}

module.exports = app; // Exportar para pruebas
