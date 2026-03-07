import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// import UsersPage from "@/pages/users";
import FilesPage from "@/pages/files";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "@/store/auth.store";
import LoginPage from "./pages/auth/login";

export default function App() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/files" element={<FilesPage />} />
        </Route> */}

        {/* <Route path="*" element={<Navigate to="/users" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
