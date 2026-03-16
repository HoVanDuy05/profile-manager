import {
  Title,
  Card,
  Text,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Badge,
  ActionIcon,
  rem,
  Modal,
  TextInput,
  Select,
  NumberInput,
  LoadingOverlay,
  Menu
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconCode,
  IconDeviceFloppy,
  IconCategory,
  IconTrendingUp
} from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillService } from '../services/api';
import { notifications } from '@mantine/notifications';
import { Skill } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const SkillsManager = () => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const { data: skillsResponse, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => skillService.getAll(),
  });

  const skills = skillsResponse?.data || [] as Skill[];

  const form = useForm({
    initialValues: {
      name: '',
      category: 'Frontend',
      level: 80,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: any) => editingSkill
      ? skillService.update(editingSkill.id, values)
      : skillService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      notifications.show({
        title: 'Success',
        message: editingSkill ? 'Skill updated' : 'Skill created',
        color: 'green'
      });
      close();
      form.reset();
      setEditingSkill(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => skillService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      notifications.show({ title: 'Deleted', message: 'Skill removed', color: 'gray' });
    },
  });

  const handleCreate = () => {
    setEditingSkill(null);
    form.reset();
    open();
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    form.setValues({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
    open();
  };

  return (
    <Stack gap="xl">
      <PageHeader
        title="Skills Inventory"
        description="Manage your technical stack and expertise levels."
        rightSection={
          <Button leftSection={<IconPlus size={18} />} color="violet" onClick={handleCreate}>
            Add New Skill
          </Button>
        }
      />

      <div style={{ position: 'relative', minHeight: rem(200) }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          <AnimatePresence>
            {skills.map((skill: Skill, index: number) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card withBorder style={{ height: '100%' }}>
                  <Group justify="space-between" mb="sm">
                    <Badge variant="light" color="violet">{skill.category}</Badge>
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(skill)}>Edit</Menu.Item>
                        <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(skill.id) }}>
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>

                  <Group gap="sm" mb="xs">
                    <IconCode size={20} color="var(--mantine-color-violet-6)" />
                    <Text fw={800} fz="lg">{skill.name}</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Proficiency Level</Text>
                    <Text size="xs" fw={700} c="violet.6">{skill.level}%</Text>
                  </Group>
                  <div style={{ background: 'var(--mantine-color-gray-1)', height: 6, borderRadius: 3, marginTop: 4 }}>
                    <div
                      style={{
                        background: 'linear-gradient(to right, var(--mantine-color-violet-4), var(--mantine-color-violet-6))',
                        height: '100%',
                        width: `${skill.level}%`,
                        borderRadius: 3
                      }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </div>

      <Modal
        opened={opened}
        onClose={() => { setEditingSkill(null); close(); }}
        title={<Text fw={800} fz="lg">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</Text>}
        centered
        radius="lg"
      >
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <TextInput
              label="Skill Name"
              placeholder="e.g. React"
              required
              leftSection={<IconCode size={18} />}
              {...form.getInputProps('name')}
            />
            <Select
              label="Category"
              leftSection={<IconCategory size={18} />}
              data={['Frontend', 'Backend', 'DevOps', 'Design', 'Other']}
              required
              {...form.getInputProps('category')}
            />
            <NumberInput
              label="Proficiency Level (%)"
              leftSection={<IconTrendingUp size={18} />}
              min={0}
              max={100}
              required
              {...form.getInputProps('level')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={() => { setEditingSkill(null); close(); }}>Cancel</Button>
              <Button
                type="submit"
                color="violet"
                leftSection={<IconDeviceFloppy size={18} />}
                loading={mutation.isPending}
              >
                {editingSkill ? 'Update Skill' : 'Save Skill'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default SkillsManager;
