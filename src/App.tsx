import { AuthProvider, useAuth } from '@/entities/user/model/auth-context';

const TestAuth = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div>
      {user ? <h1>Привет, {user.email}</h1> : <h1>Авторизуйтесь</h1>}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TestAuth />
    </AuthProvider>
  )
}

export default App
