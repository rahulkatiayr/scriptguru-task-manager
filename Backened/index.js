import express from "express";
import mongoose from "mongoose";
import Board from "./Model/Board.js";
import Task from "./Model/Task.js";
import cors from "cors";

const app=express();
app.use(express.json());
app.use(cors());

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/scriptguru');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


async function saveFirstBoardAndTask() {
  try {
    
    const board = new Board({
      name: "Marketing",
    });

    await board.save();
    console.log(" Board saved:", board);

    
    const task = new Task({
      title: "Marketing Strategy",
      description: "Learn Modern tool",
      status: "in progress",
      priority: "medium",
      assignedTo: "rahul@example.com",
      dueDate: new Date("2025-07-01"),
      boardId: board._id,
    });

    await task.save();
    
  } catch (error) {
     console.log(error);
  } 
}

// saveFirstBoardAndTask();

app.get("/boards",async(req,res)=>{
  const result=  await Board.find({});
  res.status(200).send({ result });
    
})



app.post("/boards", async (req, res) => {
  try {
    const { name } = req.body;

    const newBoard = await Board.create({ name }); 

    res.status(201).send({
      message: "Board created successfully",
      board: newBoard,
    });
  } catch (error) {
    
    res.status(500).send({ error: "Failed " });
  }
});

// get task by id itself
app.get("/boards/:id/tasks",async(req,res)=>{
        try {
            const {id}=req.params;
           const result= await Task.find({boardId:id});
            res.status(201).send({message:"fetched task " , tasks:result})
        } catch (error) {
            console.log(error)
            
        }
})


// now create task in board

app.post("/boards/:id/tasks", async (req, res) => {
  try {
    const { id } = req.params; 
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    } = req.body;

    
      const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      boardId: id,
    });

    res.status(201).send({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed " });
  }
});



// update the task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true, 
    //   above helps us knowing the updated one
      runValidators: true, 
    //   above one helps us in running validation of schema 
    });

    

    res.status(200).send({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to update task" });
  }
});

// here is deleting the task 
app.delete("/tasks/:id",async(req,res)=>{
    try {
        const{id}=req.params;
        await Task.findByIdAndDelete(id);
        res.status(201).send({message : "deleted successfully"});
    } 

    catch (error) {
        console.log(error);
    }
    
})

app.listen(8080,()=>{
    console.log("your app is listening at port number 8080");
})