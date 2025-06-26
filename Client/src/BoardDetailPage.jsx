import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function BoardDetailPage() {
  const { id } = useParams(); 
//   above params helps us to fetch id 
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    // Fetch board name
    axios.get("http://localhost:8080/boards")
      .then(res => {
        const found = res.data.result.find(b => b._id === id);
        setBoard(found);
      });

    // Fetch tasks for board
    axios.get(`http://localhost:8080/boards/${id}/tasks`)
      .then(res => {
        setTasks(res.data.tasks || []);
      })
      .catch(err => console.error("Failed to fetch tasks:", err));
  }, [id]);

  const grouped = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {});

  const handleDelete = async (taskId) => {
    await axios.delete(`http://localhost:8080/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.put(`http://localhost:8080/tasks/${editingTask._id}`, editingTask);
    setTasks(prev =>
      prev.map(t => (t._id === editingTask._id ? res.data.task : t))
    );
    setEditingTask(null);
  };

  return (
    <div>
      <h2>Board: {board?.name || "Loading"}</h2>
      <h3>Tasks (Grouped by Status)</h3>

      {Object.keys(grouped).length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        Object.entries(grouped).map(([status, tasks]) => (
          <div key={status}>
            <h4>Status: {status}</h4>
            <ul>
              {tasks.map(task => (
                <li key={task._id}>
                  {editingTask?._id === task._id ? (
                    <form onSubmit={handleEditSubmit}>
                      <input
                        name="title"
                        value={editingTask.title}
                        onChange={handleEditChange}
                        placeholder="Title"
                      /><br />
                      <input
                        name="description"
                        value={editingTask.description}
                        onChange={handleEditChange}
                        placeholder="Description"
                      /><br />
                      <input
                        name="priority"
                        value={editingTask.priority}
                        onChange={handleEditChange}
                        placeholder="Priority"
                      /><br />
                      <input
                        name="assignedTo"
                        value={editingTask.assignedTo}
                        onChange={handleEditChange}
                        placeholder="Assigned To"
                      /><br />
                      <input
                        name="dueDate"
                        type="date"
                        value={editingTask.dueDate?.slice(0, 10)}
                        onChange={handleEditChange}
                      /><br />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
                    </form>
                  ) : (
                    <div>
                      <strong>{task.title}</strong> - {task.description} <br />
                      Priority: {task.priority}, Assigned: {task.assignedTo || "N/A"}, Due: {task.dueDate?.slice(0, 10)}
                      <br />
                      <button onClick={() => handleEdit(task)}>Edit</button>
                      <button onClick={() => handleDelete(task._id)}>Delete</button>
                      <hr />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
