import { Text, SimpleGrid, Card, Group, ThemeIcon, rem, Stack, Progress, Badge, Avatar, ActionIcon, LoadingOverlay } from '@mantine/core';
import { 
  IconCode, 
  IconFolder, 
  IconUser, 
  IconMessages, 
  IconTrendingUp, 
  IconArrowUpRight,
  IconBriefcase,
  IconClock
} from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/api';

const iconMap: Record<string, any> = {
  IconCode,
  IconFolder,
  IconBriefcase,
  IconMessages,
};

const Dashboard = () => {
  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  const stats = dashboardResponse?.data?.stats || [];
  const activities = dashboardResponse?.data?.recent_activities || [];
  const completion = dashboardResponse?.data?.completion || [];

  return (
    <Stack gap="xl">
      <PageHeader
        title="Dashboard"
        description="Quick overview of your professional portfolio status."
      />

      <div style={{ position: 'relative', minHeight: rem(100) }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          {stats.map((stat: any, index: number) => {
            const Icon = iconMap[stat.icon] || IconCode;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card withBorder padding="lg" radius="lg" style={{ overflow: 'visible' }}>
                  <Group justify="space-between" align="flex-start" mb="md">
                    <ThemeIcon
                      color={stat.color}
                      variant="light"
                      size={48}
                      radius="md"
                      style={{ boxShadow: `0 8px 16px -4px var(--mantine-color-${stat.color}-light)` }}
                    >
                      <Icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
                    </ThemeIcon>
                    <Badge variant="dot" color={stat.color} size="sm">{stat.trend}</Badge>
                  </Group>

                  <Text c="dimmed" tt="uppercase" fw={800} fz="xs" style={{ letterSpacing: '0.05em' }}>
                    {stat.title}
                  </Text>
                  <Text fz={rem(28)} fw={900}>
                    {stat.value}
                  </Text>
                </Card>
              </motion.div>
            );
          })}
        </SimpleGrid>
      </div>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
        <Card withBorder radius="lg">
          <Group justify="space-between" mb="xl">
            <div>
              <Text fw={800} fz="lg">Profile Completion</Text>
              <Text size="xs" c="dimmed">Complete your profile to stand out</Text>
            </div>
            <IconTrendingUp size={24} color="var(--mantine-color-violet-6)" />
          </Group>

          <Stack gap="md">
            {completion.map((item: any) => (
              <div key={item.label}>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={600}>{item.label}</Text>
                  <Text size="sm" c="violet.6" fw={700}>{item.value}%</Text>
                </Group>
                <Progress value={item.value} color="violet" size="sm" radius="xl" />
              </div>
            ))}
            {completion.length === 0 && !isLoading && <Text size="sm" c="dimmed">No completion data available.</Text>}
          </Stack>
        </Card>

        <Card withBorder radius="lg">
          <Group justify="space-between" mb="xl">
            <Text fw={800} fz="lg">Recent Activities</Text>
            <ActionIcon variant="subtle" color="gray">
              <IconArrowUpRight size={18} />
            </ActionIcon>
          </Group>

          <Stack gap="lg">
            {activities.map((activity: any) => (
              <Group key={activity.id} gap="md">
                <Avatar radius="xl" color="violet" variant="light">
                  <IconClock size={20} />
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={700}>{activity.activity}</Text>
                  <Text size="xs" c="dimmed">{activity.user?.name || 'System'}</Text>
                </div>
                <Text size="xs" c="dimmed">{new Date(activity.created_at).toLocaleTimeString()}</Text>
              </Group>
            ))}
            {activities.length === 0 && !isLoading && <Text size="sm" c="dimmed">No recent activities found.</Text>}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

export default Dashboard;
