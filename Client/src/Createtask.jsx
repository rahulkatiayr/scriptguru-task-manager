import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateTaskForm() {
  const [boards, setBoards] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
    boardId: ""
  });

  useEffect(() => {

    axios.get("http://localhost:8080/boards")
      .then(res => {
        setBoards(res.data.result);
      })
      .catch(err => {
        console.error("Error fetching boards:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { boardId, ...taskData } = formData;
    // spread operator used

    if (!boardId) {
      alert("Please select a board.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8080/boards/${boardId}/tasks`, taskData);
      alert(" Task created successfully!");
      console.log(res.data);
      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignedTo: "",
        dueDate: "",
        boardId: ""
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      alert(" Failed to create task.");
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label><br />
        <input type="text" name="title" value={formData.title} onChange={handleChange} required /><br /><br />

        <label>Description:</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} /><br /><br />

        <label>Status:</label><br />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select><br /><br />

        <label>Priority:</label><br />
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select><br /><br />

        <label>Assigned To:</label><br />
        <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange} /><br /><br />

        <label>Due Date:</label><br />
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} /><br /><br />

        <label>Select Board:</label><br />
        <select name="boardId" value={formData.boardId} onChange={handleChange} required>
          <option value=""> Select Board </option>
          {boards.map(board => (
            <option key={board._id} value={board._id}>{board.name}</option>
          ))}
        </select><br /><br />

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}
