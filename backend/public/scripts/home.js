
//FRONTEND

document.addEventListener("DOMContentLoaded", () => {
  const createTaskBtn = document.getElementById("createTask");
  const formTasks = document.querySelector(".hiddenFormTasks");
  const closeBtn = formTasks.querySelector(".hdf_closeBtn");

  // abrir con transición
  createTaskBtn.addEventListener("click", () => {
    formTasks.classList.add("show");
    createTaskBtn.style.display = "none";
  });

  // cerrar con transición
  closeBtn.addEventListener("click", () => {
    formTasks.classList.remove("show");
    createTaskBtn.style.display = "inline-block";
  });
});


//BACKEND
const containerRight = document.querySelector(".containerRight");
function renderTasks(tasks) {
  tasks.forEach(task => {
    const div = document.createElement("div");  
    div.textContent = task.title; 
    containerRight.appendChild(div);
  });
}
// Al cargar la página, pedimos las tareas al backend
fetch("/api/tasks") //fetch pide tareas al backend.
  .then(res => res.json()) 
  .then(data => {
    renderTasks(data);
  })
  .catch(err => console.error("Error cargando tareas:", err));
