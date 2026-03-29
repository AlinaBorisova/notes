import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/entities/user/model/auth-context';
import { AppRouter } from '@/app/providers/router';
import '@mantine/core/styles.css';

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </MantineProvider>
  );
}