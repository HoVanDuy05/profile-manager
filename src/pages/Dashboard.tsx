import { Text, SimpleGrid, Card, Group, ThemeIcon, rem, Stack, Progress, Badge, Avatar, ActionIcon } from '@mantine/core';
import { IconCode, IconFolder, IconUser, IconMessages, IconTrendingUp, IconArrowUpRight } from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const stats = [
    { title: 'Total Skills', value: '18', icon: IconCode, color: 'blue', trend: '+2 this month' },
    { title: 'Active Projects', value: '6', icon: IconFolder, color: 'violet', trend: '1 featured' },
    { title: 'Experience', value: '4 yrs', icon: IconUser, color: 'teal', trend: 'Senior Level' },
    { title: 'Unread Messages', value: '3', icon: IconMessages, color: 'pink', trend: 'High priority' },
  ];

  return (
    <Stack gap="xl">
      <PageHeader
        title="Dashboard"
        description="Quick overview of your professional portfolio status."
      />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
        {stats.map((stat, index) => (
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
                  <stat.icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
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
        ))}
      </SimpleGrid>

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
            <div>
              <Group justify="space-between" mb={5}>
                <Text size="sm" fw={600}>Basic Information</Text>
                <Text size="sm" c="violet.6" fw={700}>100%</Text>
              </Group>
              <Progress value={100} color="violet" size="sm" radius="xl" />
            </div>

            <div>
              <Group justify="space-between" mb={5}>
                <Text size="sm" fw={600}>Project Documentation</Text>
                <Text size="sm" c="violet.6" fw={700}>65%</Text>
              </Group>
              <Progress value={65} color="violet" size="sm" radius="xl" />
            </div>

            <div>
              <Group justify="space-between" mb={5}>
                <Text size="sm" fw={600}>Skills Endorsement</Text>
                <Text size="sm" c="violet.4" fw={700}>40%</Text>
              </Group>
              <Progress value={40} color="violet.3" size="sm" radius="xl" />
            </div>
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
            {[1, 2, 3].map((i) => (
              <Group key={i} gap="md">
                <Avatar radius="xl" color="violet" variant="light">
                  <IconMessages size={20} />
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={700}>New message from Recruiter</Text>
                  <Text size="xs" c="dimmed">"Hi Duy, I saw your portfolio and..."</Text>
                </div>
                <Text size="xs" c="dimmed">2h ago</Text>
              </Group>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

export default Dashboard;
