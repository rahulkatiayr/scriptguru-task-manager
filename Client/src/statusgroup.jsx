import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function BoardStatusGrouped() {
  const { id } = useParams(); // board ID
  const [board, setBoard] = useState(null);
  const [tasksByStatus, setTasksByStatus] = useState({});

  useEffect(() => {
    // Fetch the board
    axios.get("http://localhost:8080/boards")
      .then(res => {
        const selected = res.data.result.find(b => b._id === id);
        setBoard(selected);
      });

    // Fetch tasks in the board
    axios.get(`http://localhost:8080/boards/${id}/tasks`)
      .then(res => {
        const grouped = {};
        (res.data.tasks || []).forEach(task => {
          const key = task.status || "Uncategorized";
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(task);
        });
        setTasksByStatus(grouped);
      });
  }, [id]);

  return (
    <div>
      <h2>Board: {board?.name || "Loading..."}</h2>

      {Object.keys(tasksByStatus).length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status}>
            <h3>Status: {status}</h3>
            <ul>
              {tasks.map(task => (
                <li key={task._id}>
                  <p><strong>Title:</strong> {task.title}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Due Date:</strong> {task.dueDate?.slice(0, 10)}</p>
                  <p><strong>Assigned To:</strong> {task.assignedTo}</p>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
