document.addEventListener("DOMContentLoaded", () => {
  const createTaskBtn = document.getElementById("createTask");
  const formTasks = document.querySelector(".hiddenFormTasks");
  const closeBtn = formTasks.querySelector(".hdf_closeBtn");
  const doneBtn = formTasks.querySelector(".doneFormButton");
  const containerRight = document.querySelector(".containerRight");
  const containerTasks = document.getElementById("containerTasks");
  const totalTasksPanelText = document.querySelector(".text_total_tasks")
  const taskCheckbok = document.getElementById("task_Check");
  const finishedTaskPanelText =document.querySelector(".text_finished_tasks")

    // ✅ cargar tareas al inicio
  fetch("/api/tasks")
    .then(res => res.json())
    .then(data => {
      renderTasks(data); // muestra todas las tareas guardadas
      showTotal(data); // muestra el numero de tareas guardadas
    })
    .catch(err => console.error("Error cargando tareas:", err));

  // abrir con transición
  createTaskBtn.addEventListener("click", () => {
    formTasks.classList.add("show");
    createTaskBtn.style.display = "none";
    containerTasks.style.display = "none";

  });

  // cerrar con transición
  closeBtn.addEventListener("click", () => {
    formTasks.classList.remove("show");
    createTaskBtn.style.display = "inline-block";
    containerTasks.style.display = "block";
  });

  //  función para renderizar varias tareas
  function renderTasks(tasks) {
    tasks.forEach(task => {
      renderTask(task); // reutilizamos la de una sola
    });
  }

  // 🔹 función para renderizar UNA sola tarea
  function renderTask(task) {
    const div = document.createElement("div");
    
    div.classList.add("taskInfoDiv");
      div.innerHTML = `
    <input type="checkbox" class="task_Check">
    <p class="task_Name">${task.name}</p>
    <p class="task_Date">${task.date}</p>
    <p class="task_Hour">${task.hour}</p>
  `;
    containerTasks.appendChild(div);
  }



  // ✅ enviar nueva tarea
  doneBtn.addEventListener("click", async () => {
    const name = document.getElementById("taskName").value.trim();
    const date = document.getElementById("taskDate").value;
    const hour = document.getElementById("taskHour").value;

    if (!name || !date || !hour) {
      alert("Todos los campos deben estar llenos!");
      return;
    }

    const payload = { name, date, hour };

    try {
      // 1) enviar al backend
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Error ${res.status}`);
      }

      // 2) recibir la tarea creada desde el backend
      const createdTask = await res.json();

      // 3) mostrarla en pantalla (sin recargar)
      renderTask(createdTask);

      // 4) limpiar y cerrar el form
      document.getElementById("taskName").value = "";
      document.getElementById("taskDate").value = "";
      document.getElementById("taskHour").value = "";
      formTasks.classList.remove("show");
      createTaskBtn.style.display = "inline-block";
      containerTasks.style.display = "block";
    } catch (err) {
      console.error("No se pudo crear la tarea:", err);
      alert("Ocurrió un error al guardar la tarea. Revisa la consola.");
    }
     
    //Mostrar informacion en el panel 

    //Mostrar cuantas tareas hay
     fetch("/api/tasks")
    .then(res => res.json())
    .then(data => {
      showTotal(data); // muestra todas las tareas guardadas
      
    })
    .catch(err => console.error("Error mostrando datos:", err));
  });

  
    function showTotal(tasks) {
    if (!totalTasksPanelText) {
        console.error("No se encontró el elemento totalTasksPanelText");
        return;
    }

    if (!tasks || tasks.length === 0) {
        totalTasksPanelText.textContent = "Total Tasks: 0";
        console.log("Total tasks: 0");
    } else {
        totalTasksPanelText.textContent = `Total Tasks: ${tasks.length}`;
        console.log("El total es", tasks.length);
    }

   //total tareas completadas
   
}

});
