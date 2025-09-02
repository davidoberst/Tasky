
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
  const { title } = req.body; // extraemos el título enviado
  const newTask = {
    id: Date.now(),  // id único usando la fecha
    title,           // lo que envió el usuario
    done: false      // por defecto, no está completada
  };

  tasks.push(newTask); // guardamos en el array
  res.status(201).json(newTask); // respondemos con la nueva tarea creada
});

app.listen(PORT, ()=>{
    console.log("server working in http://localhost",PORT)
})
