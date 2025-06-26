import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InteractiveBoardViewer() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  
  useEffect(() => {
    axios.get("http://localhost:8080/boards")
      .then(res => {
        setBoards(res.data.result); // Boards array
      })
      .catch(err => console.error("Error fetching boards:", err));
  }, []);

  
  const handleBoardClick = async (board) => {
    setSelectedBoard(board);
    setLoadingTasks(true);

    try {
      const res = await axios.get(`http://localhost:8080/boards/${board._id}/tasks`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }

    setLoadingTasks(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
    
      <div style={{ width: "220px", padding: "20px", borderRight: "1px solid #ccc" }}>
        <h3> Boards</h3>
        {boards.length === 0 ? (
          <p>No boards found.</p>
        ) : (
          boards.map((board) => (
            <div
              key={board._id}
              onClick={() => handleBoardClick(board)}
              style={{
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                backgroundColor: selectedBoard?._id === board._id ? "#eee" : "#fff",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            >
              {board.name}
            </div>
          ))
        )}
      </div>

    
      <div style={{ flex: 1, padding: "20px" }}>
        {selectedBoard ? (
          <>
            <h2> Tasks in "{selectedBoard.name}"</h2>
            {loadingTasks ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p>No tasks in this board.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {tasks.map(task => (
                  <li key={task._id} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "6px" }}>
                    <strong> {task.title}</strong><br />
                    {task.description && <div> {task.description}</div>}
                    <div> Status: {task.status}</div>
                    <div> Priority: {task.priority}</div>
                    <div> Assigned To: {task.assignedTo || "Unassigned"}</div>
                    <div> Due: {task.dueDate?.slice(0, 10) || "No due date"}</div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p>Click a board to view its tasks</p>
        )}
      </div>
    </div>
  );
}
