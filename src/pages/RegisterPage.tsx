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
  Anchor
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconFingerprint, IconAt, IconLock, IconUser, IconUserPlus } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 8 ? 'Password must have at least 8 characters' : null),
      password_confirmation: (value, values) => 
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await authService.register(values);
      login(response.data);
      notifications.show({
        title: 'Registration Successful',
        message: `Welcome, ${response.data.user.name}! Your account has been created.`,
        color: 'green',
      });
      navigate('/');
    } catch (error: any) {
      notifications.show({
        title: 'Registration Failed',
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
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
        background: 'linear-gradient(135deg, var(--mantine-color-blue-light) 0%, var(--mantine-color-blue-light-hover) 100%)',
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
          background: 'var(--mantine-color-blue-2)', 
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
          background: 'var(--mantine-color-blue-1)', 
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
              <IconUserPlus size={48} color="var(--mantine-color-blue-6)" stroke={2.5} />
            </Group>
            <Title 
              order={1} 
              fz={32} 
              fw={900} 
              style={{ letterSpacing: '-0.03em' }}
            >
              Create <Text span c="blue.6" inherit>Account</Text>
            </Title>
            <Text c="dimmed" size="sm" mt={5}>
              Join the admin panel to manage your profile.
            </Text>
          </Box>

          <Paper withBorder shadow="xl" p={30} radius="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput 
                  label="Full Name" 
                  placeholder="John Doe" 
                  required 
                  size="md"
                  leftSection={<IconUser size={rem(18)} stroke={1.5} />}
                  {...form.getInputProps('name')}
                />
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
                  placeholder="At least 8 characters" 
                  required 
                  size="md"
                  leftSection={<IconLock size={rem(18)} stroke={1.5} />}
                  {...form.getInputProps('password')}
                />
                <PasswordInput 
                  label="Confirm Password" 
                  placeholder="Repeat your password" 
                  required 
                  size="md"
                  leftSection={<IconLock size={rem(18)} stroke={1.5} />}
                  {...form.getInputProps('password_confirmation')}
                />
                
                <Button 
                  fullWidth 
                  mt="xl" 
                  size="md" 
                  type="submit" 
                  loading={loading}
                  radius="md"
                  rightSection={<IconUserPlus size={18} />}
                  style={{
                    background: 'linear-gradient(45deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                    boxShadow: 'var(--mantine-shadow-md)'
                  }}
                >
                  Register
                </Button>
              </Stack>
            </form>

            <Text ta="center" mt="md" size="sm">
              Already have an account?{' '}
              <Anchor component={Link} to="/login" fw={700} c="blue.6">
                Login here
              </Anchor>
            </Text>
          </Paper>

          <Text c="dimmed" size="xs" ta="center">
            Secured Admin Access
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default RegisterPage;
