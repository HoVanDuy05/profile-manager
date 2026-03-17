import { AppShell, Burger, Group, NavLink, Title, ActionIcon, useMantineColorScheme, Tooltip, Stack, Text, Box, rem, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDashboard,
  IconUser,
  IconCode,
  IconBriefcase,
  IconFolder,
  IconMessages,
  IconLogout,
  IconFingerprint,
  IconPhoto,
  IconSettings
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { ColorSchemeToggle } from '../common/ColorSchemeToggle';
import { APP_CONFIG, ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const navLinks = [
  { icon: IconDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
  { icon: IconUser, label: 'Profile', path: ROUTES.PROFILE },
  { icon: IconCode, label: 'Skills', path: ROUTES.SKILLS },
  { icon: IconFolder, label: 'Projects', path: ROUTES.PROJECTS },
  { icon: IconBriefcase, label: 'Experience', path: ROUTES.EXPERIENCE },
  { icon: IconPhoto, label: 'Media', path: ROUTES.MEDIA },
  { icon: IconMessages, label: 'Messages', path: ROUTES.MESSAGES },
  { icon: IconSettings, label: 'Settings', path: ROUTES.SETTINGS },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [opened, { toggle }] = useDisclosure();
  const [collapsed, { toggle: toggleCollapsed }] = useDisclosure(false);
  const location = useLocation();
  const { colorScheme } = useMantineColorScheme();
  const { logout, user } = useAuth();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: collapsed ? 80 : 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding={0}
    >
      <AppShell.Header style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Group h="100%" px="xl" justify="space-between">
          <Group gap="lg">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Box component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Group gap="xs">
                <IconFingerprint size={28} color="var(--mantine-color-violet-6)" stroke={2} />
                <Title order={3} fz="lg" fw={900} style={{ letterSpacing: '-0.02em' }}>
                  {APP_CONFIG.APP_NAME.split(' ')[0]} <Text span c="violet.6" inherit>{APP_CONFIG.APP_NAME.split(' ')[1]}</Text>
                </Title>
              </Group>
            </Box>
            <Burger 
              opened={!collapsed} 
              onClick={toggleCollapsed} 
              visibleFrom="sm"
              size="sm"
            />
          </Group>

          <Group gap="md">
            {!opened && (
              <Box visibleFrom="xs">
                <Text size="sm" fw={700}>{user?.name}</Text>
                <Text size="xs" c="dimmed" ta="right">Administrator</Text>
              </Box>
            )}
            <ColorSchemeToggle />
            <ActionIcon 
              variant="light" 
              color="red" 
              size="lg" 
              radius="md"
              onClick={logout}
              title="Logout"
            >
              <IconLogout size={18} stroke={2} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}>
        <AppShell.Section grow component={ScrollArea} mx="-md" px="md">
          <Stack gap={4} align={collapsed ? "center" : "stretch"}>
            {!collapsed && (
              <Box px="md" mb={12} mt="lg">
                <Text 
                  size="xs" 
                  fw={900} 
                  c="violet.9" 
                  tt="uppercase" 
                  style={{ 
                    letterSpacing: '2px', 
                    fontSize: rem(9),
                    opacity: 0.6
                  }}
                >
                  General
                </Text>
                <Box h={1} bg="violet.1" mt={4} style={{ borderRadius: 1 }} />
              </Box>
            )}
            {navLinks.map((item) => (
              <Tooltip key={item.path} label={collapsed ? item.label : ''} position="right" transitionProps={{ duration: 0 }}>
                {collapsed ? (
                  <ActionIcon
                    component={Link}
                    to={item.path}
                    variant={location.pathname === item.path ? 'light' : 'subtle'}
                    color={location.pathname === item.path ? 'violet' : 'gray'}
                    size={46}
                    radius="md"
                    mb={4}
                    onClick={opened ? toggle : undefined}
                  >
                    <item.icon size={22} stroke={2} />
                  </ActionIcon>
                ) : (
                  <NavLink
                    component={Link}
                    to={item.path}
                    label={<Text fw={600} fz="sm">{item.label}</Text>}
                    leftSection={<item.icon size={20} stroke={2} color={location.pathname === item.path ? 'var(--mantine-color-violet-6)' : 'var(--mantine-color-gray-6)'} />}
                    active={location.pathname === item.path}
                    onClick={opened ? toggle : undefined}
                    h={46}
                    variant="light"
                    color="violet"
                    styles={{
                      root: {
                        borderRadius: 'var(--mantine-radius-md)',
                        transition: 'all 0.2s ease',
                        marginBottom: rem(2),
                      },
                      label: {
                        color: location.pathname === item.path ? 'var(--mantine-color-violet-9)' : 'var(--mantine-color-gray-7)',
                      }
                    }}
                  />
                )}
              </Tooltip>
            ))}
          </Stack>
        </AppShell.Section>
 
        <AppShell.Section pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
          {collapsed ? (
             <Box p="xs" style={{ display: 'flex', justifyContent: 'center' }}>
                <Box 
                  w={12} 
                  h={12} 
                  bg="green.5" 
                  style={{ 
                    borderRadius: '50%',
                    boxShadow: '0 0 0 2px var(--mantine-color-green-1)',
                    animation: 'pulse 2s infinite'
                  }} 
                />
             </Box>
          ) : (
            <Box 
              p="md" 
              style={{ 
                borderRadius: 'var(--mantine-radius-lg)',
                background: 'linear-gradient(135deg, var(--mantine-color-violet-0) 0%, var(--mantine-color-white) 100%)',
                border: '1px solid var(--mantine-color-violet-1)',
                boxShadow: 'var(--mantine-shadow-xs)'
              }}
            >
              <Text size="xs" fw={800} c="violet.9" mb={6} tt="uppercase" style={{ letterSpacing: '1px' }}>System Status</Text>
              <Group gap={8}>
                <Box 
                  w={10} 
                  h={10} 
                  bg="green.5" 
                  style={{ 
                    borderRadius: '50%',
                    boxShadow: '0 0 0 2px var(--mantine-color-green-1)',
                    animation: 'pulse 2s infinite'
                  }} 
                />
                <Text size="xs" fw={600} c="gray.7">Connected to TiDB</Text>
              </Group>
            </Box>
          )}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box p="xl">
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
