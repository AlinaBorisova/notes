import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { useAuth } from '@/entities/user/model/auth-context';
import { AuthPage } from '@/pages/auth/ui/AuthPage';
import { Center, Loader } from '@mantine/core';

const NotesPlaceholder = () => <h1>Здесь будут твои заметки</h1>;

export const AppRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="blue" />
      </Center>
    );
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/login"
          element={<AuthPage />}
        />
        <Route
          path="/"
          element={user ? <NotesPlaceholder /> : <Navigate to="/login" />}
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
};