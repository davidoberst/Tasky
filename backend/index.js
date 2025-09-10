
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/",(req,res) =>{
    res.send("server works")
});


let tasks = [];
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});


app.post("/api/tasks", (req, res) => {
  const { name, date, hour } = req.body; // extraemos el título enviado

  if(!name || !date || !hour){
    return res.status(400).json({ error: "Faltan campos: name, date y hour son obligatorios" });
  }

  const newTask = {
    id: Date.now(),  // id único usando la fecha
    name,     
    date,
    hour, // lo que envió el usuario
    done: false      // por defecto, no está completada
  };

  tasks.push(newTask); // guardamos en el array
  res.status(201).json(newTask); // respondemos con la nueva tarea creada
});

app.listen(PORT, ()=>{
    console.log("server working in http://localhost",PORT)
})


//delete task 
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id); // id viene como string, lo convertimos a número
  const index = tasks.findIndex(task => task.id === taskId);

  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const deletedTask = tasks.splice(index, 1); // eliminamos del array
  res.json(deletedTask[0]); // respondemos con la tarea eliminada
});

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  task.done = req.body.done; // true o false
  res.json(task);
});

//delete all tasks 

app.delete("/api/tasks",(req,res) =>{
 if(tasks.length === 0){
     return res.status(404).json({ error: "No tasks to delete" });   
 }
  tasks.length = 0; // Vaciar array
   console.log("All tasks deleted");
   res.json({ message: "All tasks deleted successfully" });
});

