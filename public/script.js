async function fetchTasks() {
  const res = await fetch('/api/tasks');
  return res.json();
}

async function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const tasks = await fetchTasks();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${index}, ${!task.completed})">${task.text}</span>
      <button onclick="deleteTask(${index})">Видалити</button>
    `;
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text !== "") {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, completed: false }),
    });
    input.value = "";
    renderTasks();
  }
}

async function toggleTask(index, completed) {
  const tasks = await fetchTasks();
  const task = tasks[index];
  task.completed = completed;

  await fetch(`/api/tasks/${index}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  renderTasks();
}

async function deleteTask(index) {
  await fetch(`/api/tasks/${index}`, { method: 'DELETE' });
  renderTasks();
}

renderTasks();
