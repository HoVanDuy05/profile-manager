import {
  Title,
  Card,
  Text,
  Stack,
  Group,
  ActionIcon,
  Badge,
  ScrollArea,
  Table,
  rem,
  LoadingOverlay,
  Menu,
  Box
} from '@mantine/core';
import {
  IconTrash,
  IconMail,
  IconMailOpened,
  IconDotsVertical,
  IconChevronRight
} from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/api';
import { notifications } from '@mantine/notifications';
import { ContactMessage } from '../types';
import dayjs from 'dayjs';

const MessagesInbox = () => {
  const queryClient = useQueryClient();

  const { data: msgResponse, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => messageService.getAll(),
  });

  const messages = msgResponse?.data || [] as ContactMessage[];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => messageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      notifications.show({ title: 'Deleted', message: 'Message removed', color: 'gray' });
    },
  });

  return (
    <Stack gap="xl">
      <PageHeader
        title="Messages Inbox"
        description="View and manage messages sent from your portfolio contact form."
      />

      <Card withBorder radius="lg" padding={0} style={{ overflow: 'hidden' }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />

        <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
          <Group justify="space-between">
            <Text fw={800} fz="lg">Latest Inquiries</Text>
            <Badge variant="light" color="violet">{messages.length} Total</Badge>
          </Group>
        </Box>

        <ScrollArea h={600}>
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead bg="gray.0" style={{ dark: { background: 'var(--mantine-color-dark-7)' } }}>
              <Table.Tr fz="xs" tt="uppercase" fw={700}>
                <Table.Th px="xl">Sender</Table.Th>
                <Table.Th>Message Preview</Table.Th>
                <Table.Th>Received At</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {messages.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4} py={80}>
                    <Stack align="center" gap="xs">
                      <IconMail size={40} color="var(--mantine-color-gray-4)" />
                      <Text c="dimmed" size="sm">No messages found in your inbox.</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              ) : (
                messages.map((msg: ContactMessage) => (
                  <Table.Tr key={msg.id}>
                    <Table.Td px="xl">
                      <Group gap="sm">
                        <IconMail size={18} color={msg.is_read ? 'gray' : 'var(--mantine-color-violet-6)'} />
                        <div>
                          <Text fw={700} size="sm">{msg.name}</Text>
                          <Text size="xs" c="dimmed">{msg.email}</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={1} style={{ maxWidth: rem(400) }}>
                        {msg.message}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {dayjs(msg.created_at).format('MMM D, YYYY • HH:mm')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconMailOpened size={14} />}>Mark as Read</Menu.Item>
                          <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => deleteMutation.mutate(msg.id)}>
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>
  );
};

export default MessagesInbox;
