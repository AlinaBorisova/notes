import { useState } from 'react';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Group, 
  Anchor, 
  Title, 
  Stack 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '@/shared/api/firebase';

export const LoginForm = () => {
  const [type, setType] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Некорректный email'),
      password: (val) => (val.length < 6 ? 'Пароль должен быть не менее 6 символов' : null),
    },
  });

  // 3. Обработка отправки формы
  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="md">
        {type === 'login' ? 'Вход' : 'Создать аккаунт'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="example@example.com"
            radius="md"
            ta="left"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label="Пароль"
            placeholder="Ваш пароль"
            radius="md"
            ta="left"
            {...form.getInputProps('password')}
          />

          {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>}

          <Group justify="space-between" mt="sm">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => setType(type === 'login' ? 'register' : 'login')}
              size="xs"
            >
              {type === 'login'
                ? 'Нет аккаунта? Зарегистрироваться'
                : 'Уже есть аккаунт? Войти'}
            </Anchor>
            <Button type="submit" radius="md">
              {type === 'login' ? 'Войти' : 'Регистрация'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};