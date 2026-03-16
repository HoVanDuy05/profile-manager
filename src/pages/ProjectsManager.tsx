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
  Textarea,
  LoadingOverlay,
  Image,
  Switch,
  MultiSelect,
  Box,
  Grid
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBrandGithub,
  IconDeviceFloppy,
  IconPhoto,
  IconHeading,
  IconAlignLeft,
  IconTag,
  IconExternalLink,
  IconStar
} from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/api';
import { notifications } from '@mantine/notifications';
import { Project } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

import { MediaLibrary } from '../components/common/MediaLibrary';

const ProjectsManager = () => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [mediaOpened, { open: openMedia, close: closeMedia }] = useDisclosure(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
  });

  const projects = projectsResponse?.data || [] as Project[];

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      image: '',
      tags: [] as string[],
      demo_link: '',
      github_link: '',
      featured: false,
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title is required' : null),
      description: (value) => (value.length < 10 ? 'Description is too short' : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: any) => editingId
      ? projectService.update(editingId, values)
      : projectService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notifications.show({
        title: 'Success',
        message: editingId ? 'Project updated' : 'Project created',
        color: 'green'
      });
      close();
      form.reset();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notifications.show({ title: 'Deleted', message: 'Project removed', color: 'gray' });
    },
  });

  return (
    <Stack gap="xl">
      <PageHeader
        title="Project Showcase"
        description="Manage your portfolio projects and showcase your best work."
        rightSection={
          <Button leftSection={<IconPlus size={18} />} color="violet" onClick={() => { form.reset(); open(); }}>
            Add New Project
          </Button>
        }
      />

      <div style={{ position: 'relative', minHeight: rem(200) }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          <AnimatePresence>
            {projects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card withBorder padding={0} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box pos="relative">
                    <Image
                      src={project.image.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${project.image}` : project.image}
                      height={200}
                      fallbackSrc="https://placehold.co/600x400?text=No+Image"
                    />
                    {project.featured && (
                      <Badge pos="absolute" top={10} right={10} color="yellow" variant="filled">
                        Featured
                      </Badge>
                    )}
                  </Box>

                  <Stack p="lg" gap="sm" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text fw={800} fz="lg">{project.title}</Text>
                      <Group gap={4}>
                        <ActionIcon
                          variant="subtle"
                          color="violet"
                          onClick={() => {
                            setEditingId(project.id);
                            form.setValues({
                              title: project.title,
                              description: project.description,
                              image: project.image,
                              tags: project.tags,
                              demo_link: project.demo_link || '',
                              github_link: project.github_link || '',
                              featured: !!project.featured,
                            });
                            open();
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(project.id) }}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </Group>

                    <Group gap={5}>
                      {project.tags.map(tag => (
                        <Badge key={tag} size="xs" variant="light" color="gray">{tag}</Badge>
                      ))}
                    </Group>

                    <Text size="sm" c="dimmed" lineClamp={3}>
                      {project.description}
                    </Text>

                    <Group gap="xs" mt="auto" pt="md">
                      {project.demo_link && (
                        <Button component="a" href={project.demo_link} target="_blank" variant="light" size="xs" leftSection={<IconExternalLink size={14} />}>
                          Demo
                        </Button>
                      )}
                      {project.github_link && (
                        <Button component="a" href={project.github_link} target="_blank" variant="subtle" color="gray" size="xs" leftSection={<IconBrandGithub size={14} />}>
                          Source
                        </Button>
                      )}
                    </Group>
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </div>

      <Modal
        opened={opened}
        onClose={() => { setEditingId(null); close(); }}
        title={<Text fw={800} fz="lg">{editingId ? 'Edit Project' : 'Create New Project'}</Text>}
        size="lg"
        radius="lg"
      >
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack gap="md">
            <TextInput
              label="Project Title"
              required
              leftSection={<IconHeading size={18} />}
              {...form.getInputProps('title')}
            />
            <Textarea
              label="Description"
              required
              minRows={3}
              leftSection={<IconAlignLeft size={18} />}
              {...form.getInputProps('description')}
            />
            <Group align="flex-end">
              <TextInput
                label="Image URL"
                placeholder="Select from library"
                leftSection={<IconPhoto size={18} />}
                style={{ flex: 1 }}
                {...form.getInputProps('image')}
              />
              <Button variant="light" color="violet" onClick={openMedia}>
                Library
              </Button>
            </Group>

            <MediaLibrary
              opened={mediaOpened}
              onClose={closeMedia}
              onSelect={(url) => form.setFieldValue('image', url)}
              title="Select Project Image"
            />

            <MultiSelect
              label="Tags"
              placeholder="Pick tags"
              leftSection={<IconTag size={18} />}
              data={['React', 'Vite', 'Node.js', 'Laravel', 'PHP', 'Tailwind', 'TS', 'JS']}
              searchable
              {...form.getInputProps('tags')}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Demo Link"
                  leftSection={<IconExternalLink size={18} />}
                  {...form.getInputProps('demo_link')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="GitHub Link"
                  leftSection={<IconBrandGithub size={18} />}
                  {...form.getInputProps('github_link')}
                />
              </Grid.Col>
            </Grid>

            <Switch label="Featured Project" {...form.getInputProps('featured', { type: 'checkbox' })} />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={() => { setEditingId(null); close(); }}>Cancel</Button>
              <Button type="submit" color="violet" leftSection={<IconDeviceFloppy size={18} />} loading={mutation.isPending}>
                {editingId ? 'Update Project' : 'Save Project'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default ProjectsManager;
