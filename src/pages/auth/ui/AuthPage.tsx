import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Center, Container } from "@mantine/core";

export const AuthPage = () => {
  return (
    <>
      <Container>
        <Center h="100vh">
          <LoginForm />
        </Center>
      </Container>
    </>
  );
};