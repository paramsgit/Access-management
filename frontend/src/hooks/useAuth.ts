import { useAuthStore } from "@/store/auth.store";
import { useShallow } from "zustand/react/shallow";

export const useAuth = () => {
  const { user, loading, login, logout, checkAuth } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      loading: state.loading,
      login: state.login,
      logout: state.logout,
      checkAuth: state.checkAuth,
    })),
  );

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: Boolean(user),
  };
};
