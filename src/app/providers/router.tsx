import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { useAuth } from '@/entities/user/model/auth-context';
import { Center, Loader } from '@mantine/core';
import { PrivateRoute } from './PrivateRoute';
import { NotesPage } from '@/pages/notes/ui/NotesPage';

export const AppRouter = () => {
  const { isLoading } = useAuth();

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
        <Route element={<Outlet />}>
          <Route
            path="/login"
            lazy={async () => {
              const { AuthPage } = await import('@/pages/auth/ui/AuthPage');
              return { Component: AuthPage };
            }}
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            }
          >
            <Route
              index
              lazy={async () => {
                return { Component: NotesPage };
              }}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </>
    )
  );

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <RouterProvider router={router} />
    </div>
  );
};