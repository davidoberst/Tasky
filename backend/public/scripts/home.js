document.addEventListener("DOMContentLoaded", () => {
  const createTaskBtn = document.getElementById("createTask");
  const formTasks = document.querySelector(".hiddenFormTasks");
  const closeBtn = formTasks.querySelector(".hdf_closeBtn");
  const doneBtn = formTasks.querySelector(".doneFormButton");
  const containerTasks = document.getElementById("containerTasks");
  const totalTasksPanelText = document.querySelector(".text_total_tasks");
  const finishedTaskPanelText = document.querySelector(".text_finished_tasks");

  // ✅ Cargar tareas al inicio
  fetch("/api/tasks")
    .then(res => res.json())
    .then(data => {
      renderTasks(data);
      showTotal(data);
      showFinished(data);
    })
    .catch(err => console.error("Error cargando tareas:", err));

  // Abrir formulario
  createTaskBtn.addEventListener("click", () => {
    formTasks.classList.add("show");
    createTaskBtn.style.display = "none";
    containerTasks.style.display = "none";
  });

  // Cerrar formulario
  closeBtn.addEventListener("click", () => {
    formTasks.classList.remove("show");
    createTaskBtn.style.display = "inline-block";
    containerTasks.style.display = "block";
  });

  // Renderizar varias tareas
  function renderTasks(tasks) {
    tasks.forEach(task => renderTask(task));
  }

  // 🔹 Renderizar una tarea
  function renderTask(task) {
    const div = document.createElement("div");
    div.classList.add("taskInfoDiv");

    div.innerHTML = `
      <input type="checkbox" class="task_Check" ${task.done ? "checked" : ""}>
      <p class="task_Name">${task.name}</p>
      <p class="task_Date">${task.date}</p>
      <p class="task_Hour">${task.hour}</p>
      <i class="fa-solid fa-trash deleteTaskBtn"></i>
    `;

    div.dataset.id = task.id;

    // Checkbox
    const checkbox = div.querySelector(".task_Check");
    checkbox.addEventListener("change", async () => {
      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: checkbox.checked })
        });

        updateFinishedPanel();
      } catch (err) {
        console.error("Error actualizando tarea:", err);
        alert("No se pudo actualizar la tarea");
      }
    });

    // Botón borrar
    const deleteBtn = div.querySelector(".deleteTaskBtn");
    deleteBtn.addEventListener("click", async () => {
      const confirmDelete = confirm("¿Seguro que quieres eliminar esta tarea?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar la tarea");

        div.remove();
        const tasksData = await fetch("/api/tasks").then(r => r.json());
        showTotal(tasksData);
        updateFinishedPanel();
      } catch (err) {
        console.error("No se pudo borrar la tarea:", err);
        alert("Error al borrar la tarea");
      }
    });

    containerTasks.appendChild(div);
  }

  // ✅ Crear nueva tarea
  doneBtn.addEventListener("click", async () => {
    const name = document.getElementById("taskName").value.trim();
    const date = document.getElementById("taskDate").value;
    const hour = document.getElementById("taskHour").value;

    if (!name || !date || !hour) {
      alert("Todos los campos deben estar llenos!");
      return;
    }

    const payload = { name, date, hour, done: false };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Error ${res.status}`);
      }

      const createdTask = await res.json();
      renderTask(createdTask);

      document.getElementById("taskName").value = "";
      document.getElementById("taskDate").value = "";
      document.getElementById("taskHour").value = "";
      formTasks.classList.remove("show");
      createTaskBtn.style.display = "inline-block";
      containerTasks.style.display = "block";

      const tasksData = await fetch("/api/tasks").then(r => r.json());
      showTotal(tasksData);
      updateFinishedPanel();
    } catch (err) {
      console.error("No se pudo crear la tarea:", err);
      alert("Ocurrió un error al guardar la tarea. Revisa la consola.");
    }
  });

  // Mostrar total de tareas
  function showTotal(tasks) {
    totalTasksPanelText.textContent = `Total Tasks: ${tasks.length}`;
  }

  // Actualizar panel de tareas completadas
  function updateFinishedPanel() {
    const allTasks = containerTasks.querySelectorAll(".task_Check");
    const finishedCount = Array.from(allTasks).filter(cb => cb.checked).length;
    finishedTaskPanelText.textContent = `Finished Tasks: ${finishedCount}`;
  }

  // Inicializar panel de tareas completadas al cargar
  function showFinished(tasks) {
    const finishedCount = tasks.filter(t => t.done).length;
    finishedTaskPanelText.textContent = `Finished Tasks: ${finishedCount}`;
  }
});
