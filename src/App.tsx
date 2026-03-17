import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

// Pages - boilerplates for now
import Dashboard from './pages/Dashboard';
import ProfileManager from './pages/ProfileManager';
import SkillsManager from './pages/SkillsManager';
import ProjectsManager from './pages/ProjectsManager';
import ExperienceManager from './pages/ExperienceManager';
import MediaManager from './pages/MediaManager';
import MessagesInbox from './pages/MessagesInbox';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
 
// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
 
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
 
  return <>{children}</>;
};

// CSS imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/dates/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications position="top-right" zIndex={2000} />
          <NavigationProgress />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfileManager />} />
                        <Route path="/skills" element={<SkillsManager />} />
                        <Route path="/projects" element={<ProjectsManager />} />
                        <Route path="/experience" element={<ExperienceManager />} />
                        <Route path="/media" element={<MediaManager />} />
                        <Route path="/messages" element={<MessagesInbox />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
