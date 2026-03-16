import {
  Title,
  Card,
  Text,
  Button,
  Group,
  Stack,
  Timeline,
  ThemeIcon,
  rem,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  LoadingOverlay,
  Grid
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import {
  IconBriefcase,
  IconSchool,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDeviceFloppy,
  IconCalendar,
  IconBuildingSkyscraper,
  IconCertificate,
  IconAlignLeft,
  IconList
} from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceService } from '../services/api';
import { notifications } from '@mantine/notifications';
import { Experience } from '../types';
import { motion } from 'framer-motion';

const ExperienceManager = () => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: expResponse, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => experienceService.getAll(),
  });

  const experiences = expResponse?.data || [] as Experience[];

  const form = useForm({
    initialValues: {
      company: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
      type: 'work',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: any) => editingId
      ? experienceService.update(editingId, values)
      : experienceService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      notifications.show({
        title: 'Success',
        message: editingId ? 'Entry updated' : 'Entry added',
        color: 'green'
      });
      close();
      form.reset();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => experienceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      notifications.show({ title: 'Deleted', message: 'Entry removed', color: 'gray' });
    },
  });

  return (
    <Stack gap="xl">
      <PageHeader
        title="Experience & Education"
        description="Chronological history of your professional journey."
        rightSection={
          <Button leftSection={<IconPlus size={18} />} color="violet" onClick={open}>
            Add Entry
          </Button>
        }
      />

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />

        <Card withBorder radius="lg" padding="xl">
          <Timeline active={0} bulletSize={40} lineWidth={2}>
            {experiences.map((exp: Experience) => (
              <Timeline.Item
                key={exp.id}
                bullet={
                  <ThemeIcon size={40} radius="xl" color={exp.type === 'work' ? 'violet' : 'blue'}>
                    {exp.type === 'work' ? <IconBriefcase size={20} /> : <IconSchool size={20} />}
                  </ThemeIcon>
                }
                title={
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={800} fz="lg" component="span">{exp.position}</Text>
                      <Text span c="dimmed" mx="sm">•</Text>
                      <Text span fw={600} c="violet.6">{exp.company}</Text>
                    </div>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={() => {
                          setEditingId(exp.id);
                          form.setValues({
                            company: exp.company,
                            position: exp.position,
                            description: exp.description,
                            start_date: exp.start_date,
                            end_date: exp.end_date || '',
                            is_current: !!exp.is_current,
                            type: exp.type as any,
                          });
                          open();
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(exp.id) }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                }
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Group gap="xs" mb="sm">
                    <IconCalendar size={14} color="gray" />
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                      {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                    </Text>
                    {exp.is_current && <Badge size="xs" color="green">Current Role</Badge>}
                  </Group>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {exp.description}
                  </Text>
                </motion.div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </div>

      <Modal
        opened={opened}
        onClose={() => { setEditingId(null); close(); }}
        title={<Text fw={800} fz="lg">{editingId ? 'Edit Entry' : 'Add Experience/Education'}</Text>}
        radius="lg"
        size="lg"
      >
        <form onSubmit={form.onSubmit(values => mutation.mutate(values))}>
          <Stack>
            <Select
              label="Entry Type"
              leftSection={<IconList size={18} />}
              data={[{ value: 'work', label: 'Work Experience' }, { value: 'education', label: 'Education' }]}
              {...form.getInputProps('type')}
            />
            <TextInput
              label="Company / Institution"
              required
              leftSection={<IconBuildingSkyscraper size={18} />}
              {...form.getInputProps('company')}
            />
            <TextInput
              label="Position / Degree"
              required
              leftSection={<IconCertificate size={18} />}
              {...form.getInputProps('position')}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Start Date"
                  placeholder="MM/YYYY"
                  leftSection={<IconCalendar size={18} />}
                  {...form.getInputProps('start_date')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="End Date"
                  placeholder="MM/YYYY"
                  disabled={form.values.is_current}
                  leftSection={<IconCalendar size={18} />}
                  {...form.getInputProps('end_date')}
                />
              </Grid.Col>
            </Grid>

            <Checkbox label="I am currently working/studying here" {...form.getInputProps('is_current', { type: 'checkbox' })} />

            <Textarea
              label="Description"
              minRows={4}
              leftSection={<IconAlignLeft size={18} />}
              {...form.getInputProps('description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={() => { setEditingId(null); close(); }}>Cancel</Button>
              <Button
                type="submit"
                color="violet"
                leftSection={<IconDeviceFloppy size={18} />}
                loading={mutation.isPending}
              >
                {editingId ? 'Update Entry' : 'Save Entry'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default ExperienceManager;
