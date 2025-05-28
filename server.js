const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, 'data', 'tasks.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/tasks', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Помилка читання файлу' });
    res.json(JSON.parse(data || '[]'));
  });
});

app.post('/api/tasks', (req, res) => {
  const newTask = req.body;

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    const tasks = data ? JSON.parse(data) : [];
    tasks.push(newTask);

    fs.writeFile(DATA_PATH, JSON.stringify(tasks), err => {
      if (err) return res.status(500).json({ error: 'Помилка запису' });
      res.status(201).json({ message: 'Завдання додано' });
    });
  });
});

app.put('/api/tasks/:index', (req, res) => {
  const { index } = req.params;
  const updatedTask = req.body;

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    const tasks = data ? JSON.parse(data) : [];
    tasks[index] = updatedTask;

    fs.writeFile(DATA_PATH, JSON.stringify(tasks), err => {
      if (err) return res.status(500).json({ error: 'Помилка оновлення' });
      res.json({ message: 'Оновлено' });
    });
  });
});

app.delete('/api/tasks/:index', (req, res) => {
  const { index } = req.params;

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    const tasks = data ? JSON.parse(data) : [];
    tasks.splice(index, 1);

    fs.writeFile(DATA_PATH, JSON.stringify(tasks), err => {
      if (err) return res.status(500).json({ error: 'Помилка видалення' });
      res.json({ message: 'Видалено' });
    });
  });
});

app.listen(PORT, () => console.log(`Сервер працює: http://localhost:${PORT}`));
