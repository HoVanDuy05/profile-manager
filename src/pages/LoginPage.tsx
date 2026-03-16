import React from 'react';
import { 
  TextInput, 
  PasswordInput, 
  Paper, 
  Title, 
  Text, 
  Container, 
  Group, 
  Button, 
  Box, 
  rem, 
  Stack,
  Notification
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconFingerprint, IconAt, IconLock, IconLogin } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
 
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
 
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });
 
  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      login(response.data);
      notifications.show({
        title: 'Login Successful',
        message: `Welcome back, ${response.data.user.name}!`,
        color: 'green',
      });
      navigate('/');
    } catch (error: any) {
      notifications.show({
        title: 'Login Failed',
        message: error.response?.data?.message || 'Invalid credentials. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Box 
      style={{ 
        minHeight: '100svh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--mantine-color-violet-light) 0%, var(--mantine-color-violet-light-hover) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Abstract Background Shapes */}
      <Box 
        style={{ 
          position: 'absolute', 
          width: '600px', 
          height: '600px', 
          background: 'var(--mantine-color-violet-2)', 
          borderRadius: '50%', 
          top: '-10%', 
          right: '-5%', 
          filter: 'blur(100px)', 
          opacity: 0.5,
          zIndex: 0
        }} 
      />
      <Box 
        style={{ 
          position: 'absolute', 
          width: '400px', 
          height: '400px', 
          background: 'var(--mantine-color-violet-1)', 
          borderRadius: '50%', 
          bottom: '-10%', 
          left: '-5%', 
          filter: 'blur(80px)', 
          opacity: 0.4,
          zIndex: 0
        }} 
      />
 
      <Container size={420} my={40} style={{ position: 'relative', zIndex: 1 }}>
        <Stack gap="xl">
          <Box style={{ textAlign: 'center' }}>
            <Group justify="center" mb="xs">
              <IconFingerprint size={48} color="var(--mantine-color-violet-6)" stroke={2.5} />
            </Group>
            <Title 
              order={1} 
              fz={32} 
              fw={900} 
              style={{ letterSpacing: '-0.03em' }}
            >
              VanDuy <Text span c="violet.6" inherit>Admin</Text>
            </Title>
            <Text c="dimmed" size="sm" mt={5}>
              Welcome back! Please enter your details.
            </Text>
          </Box>
 
          <Paper withBorder shadow="xl" p={30} radius="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput 
                  label="Email" 
                  placeholder="your@email.com" 
                  required 
                  size="md"
                  leftSection={<IconAt size={rem(18)} stroke={1.5} />}
                  {...form.getInputProps('email')}
                />
                <PasswordInput 
                  label="Password" 
                  placeholder="Your password" 
                  required 
                  mt="md" 
                  size="md"
                  leftSection={<IconLock size={rem(18)} stroke={1.5} />}
                  {...form.getInputProps('password')}
                />
                
                <Button 
                  fullWidth 
                  mt="xl" 
                  size="md" 
                  type="submit" 
                  loading={loading}
                  radius="md"
                  rightSection={<IconLogin size={18} />}
                  style={{
                    background: 'linear-gradient(45deg, var(--mantine-color-violet-6) 0%, var(--mantine-color-violet-8) 100%)',
                    boxShadow: 'var(--mantine-shadow-md)'
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Paper>
 
          <Text c="dimmed" size="xs" ta="center">
            Authorized Personnel Only
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};
 
export default LoginPage;
