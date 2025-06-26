import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InteractiveBoardViewer from "./GroupBoard";
import BoardDetailPage from "./BoardDetailPage";
import BoardStatusGrouped from "./statusgroup";
import CreateTaskForm from "./Createtask";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InteractiveBoardViewer />} />
        <Route path="/boards/:id" element={<BoardDetailPage />} />
        <Route path="/boards/:id/status-view" element={<BoardStatusGrouped />} />
        <Route path="/create-task" element={<CreateTaskForm />} />


      </Routes>
    </Router>
  );
}

