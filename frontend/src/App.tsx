import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "@/pages/users";
import FilesPage from "@/pages/files";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/files" element={<FilesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
