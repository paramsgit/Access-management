import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import UsersPage from "@/pages/users";
import FilesPage from "@/pages/files/files";

import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { useAuthStore } from "@/store/auth.store";
import LoginPage from "./pages/auth/login";
import { PublicRoute } from "./components/routes/PublicRoute";
import Layout from "./components/custom/Layout";
import { SidebarProvider } from "./components/ui/sidebar";
import FileDetailsPage from "./pages/files/FileDetailsPage";

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected routes */}

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<UsersPage />} />
              <Route path="/files" element={<FilesPage />} />
              <Route path="/files/:id" element={<FileDetailsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}
