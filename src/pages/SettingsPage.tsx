import React from 'react';
import {
  Paper,
  Tabs,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Table,
  ScrollArea,
  Box,
  rem,
  ThemeIcon,
  Timeline,
  Card,
  Grid,
  Code
} from '@mantine/core';
import {
  IconSettings,
  IconShieldLock,
  IconHistory,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconFingerprint,
  IconClock,
  IconWorld,
  IconCircleCheck
} from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const SettingsPage = () => {
  const { data: loginHistory } = useQuery({
    queryKey: ['login-history'],
    queryFn: () => settingsService.getLoginHistory().then(res => res.data),
  });

  const { data: activityLogs } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => settingsService.getActivityLogs().then(res => res.data),
  });

  const { data: activeSessions } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: () => settingsService.getActiveSessions().then(res => res.data),
  });

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mobile': return <IconDeviceMobile size={18} />;
      case 'tablet': return <IconDeviceTablet size={18} />;
      default: return <IconDeviceDesktop size={18} />;
    }
  };

  return (
    <Stack gap="lg">
      <PageHeader
        title="Settings"
        description="Manage your account security and view activity logs"
      />

      <Tabs defaultValue="security" variant="outline" radius="md">
        <Tabs.List mb="md">
          <Tabs.Tab value="security" leftSection={<IconShieldLock size={16} />}>Security & Sessions</Tabs.Tab>
          <Tabs.Tab value="activity" leftSection={<IconHistory size={16} />}>Activity Log</Tabs.Tab>
          <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>General</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="security">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Paper withBorder p="xl" radius="md">
                <Title order={4} mb="lg">Session History</Title>
                <ScrollArea h={400}>
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Device / Browser</Table.Th>
                        <Table.Th>IP Address</Table.Th>
                        <Table.Th>Location</Table.Th>
                        <Table.Th>Last Login</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {loginHistory?.map((item: any) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <Group gap="sm">
                              <ThemeIcon variant="light" color="violet" size="md">
                                {getDeviceIcon(item.device_type)}
                              </ThemeIcon>
                              <Box>
                                <Text size="sm" fw={600}>{item.browser} on {item.os}</Text>
                                <Text size="xs" c="dimmed">v1.0</Text>
                              </Box>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              <IconWorld size={14} color="gray" />
                              <Text size="sm">{item.ip_address}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">Ho Chi Minh, VN</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              <IconClock size={14} color="gray" />
                              <Text size="sm">{dayjs(item.login_at).fromNow()}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Badge color="green" variant="light" size="sm">Success</Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Paper withBorder p="xl" radius="md">
                <Title order={4} mb="lg">Active Sessions</Title>
                <Stack gap="md">
                  {activeSessions?.map((session: any) => (
                    <Card key={session.id} withBorder padding="md">
                      <Group justify="space-between" mb={4}>
                        <Text size="sm" fw={700}>{session.name}</Text>
                        <Badge color="green" size="xs">Active Now</Badge>
                      </Group>
                      <Text size="xs" c="dimmed" mb={8}>Last used: {dayjs(session.last_used_at).fromNow()}</Text>
                      <Code size="xs">ID: {session.id.toString().substring(0, 8)}...</Code>
                    </Card>
                  ))}
                  {(!activeSessions || activeSessions.length === 0) && (
                    <Text size="sm" c="dimmed" ta="center" py="xl">No other active sessions found.</Text>
                  )}
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="activity">
          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="xl">Activity Timeline</Title>
            <Box px="md">
              <Timeline active={0} bulletSize={32} lineWidth={2}>
                {activityLogs?.map((log: any) => (
                  <Timeline.Item
                    key={log.id}
                    bullet={
                      <ThemeIcon color="violet" radius="xl">
                        {log.action === 'login' ? <IconFingerprint size={16} /> : <IconCircleCheck size={16} />}
                      </ThemeIcon>
                    }
                    title={<Text fw={700}>{log.action.charAt(0).toUpperCase() + log.action.slice(1)}</Text>}
                  >
                    <Text c="dimmed" size="sm" mb={4}>{log.description}</Text>
                    <Group gap="xs" mt={4}>
                      <Text size="xs" c="cyan" fw={600}>IP: {log.ip_address}</Text>
                      <Text size="xs" c="dimmed">{dayjs(log.created_at).format('MMM D, YYYY HH:mm:ss')}</Text>
                    </Group>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Box>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="general">
          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md">General Settings</Title>
            <Text c="dimmed">General settings options will be available here soon.</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default SettingsPage;
