import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/entities/user/model/auth-context';
import { AppRouter } from '@/app/providers/router';
import '@mantine/core/styles.css';

export default function App() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100dvh',
      }}
    >
      <MantineProvider>
        <AuthProvider>
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
            <AppRouter />
          </div>
        </AuthProvider>
      </MantineProvider>
    </div>
  );
}