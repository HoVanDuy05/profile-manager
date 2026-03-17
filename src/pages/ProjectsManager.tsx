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
  LoadingOverlay,
  Image,
  Box,
  Tooltip,
  ThemeIcon,
  Divider
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBrandGithub,
  IconExternalLink,
  IconStar,
  IconWorld,
  IconSettings,
  IconFileZip
} from '@tabler/icons-react';
import { PageHeader } from '../components/common/PageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, getImageUrl } from '../services/api';
import { notifications } from '@mantine/notifications';
import { Project } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProjectsManager = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
  });

  const projects = projectsResponse?.data || [] as Project[];

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
          <Button leftSection={<IconPlus size={18} />} color="violet" onClick={() => navigate('/projects/new')}>
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
                      src={getImageUrl(project.image)}
                      height={200}
                      fallbackSrc="https://placehold.co/600x400?text=No+Image"
                    />
                    <Group pos="absolute" top={10} right={10} gap={5}>
                      {project.is_featured && (
                        <Badge color="yellow" variant="filled" leftSection={<IconStar size={12} />}>
                          Featured
                        </Badge>
                      )}
                      {project.source_code_zip && (
                        <Tooltip label="Source ZIP available">
                          <ThemeIcon color="blue" size="sm" radius="xl" variant="light">
                            <IconFileZip size={14} />
                          </ThemeIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Box>

                  <Stack p="lg" gap="sm" style={{ flex: 1 }}>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Box>
                        <Text fw={800} fz="lg" lineClamp={1}>{project.title}</Text>
                        <Text fz="xs" c="dimmed" lineClamp={1}>{project.subtitle || 'Personal Project'}</Text>
                      </Box>
                      <Group gap={4} wrap="nowrap">
                        <ActionIcon
                          variant="subtle"
                          color="violet"
                          onClick={() => navigate(`/projects/${project.id}`)}
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
                      {project.custom_fields_count && project.custom_fields_count > 0 ? (
                        <Badge size="xs" variant="outline" color="violet" leftSection={<IconSettings size={10} />}>
                          {project.custom_fields_count} fields
                        </Badge>
                      ) : null}
                    </Group>

                    <Text 
                      size="sm" 
                      c="dimmed" 
                      lineClamp={2} 
                      style={{ flex: 1 }}
                      component="div"
                      dangerouslySetInnerHTML={{ __html: project.description || '' }}
                    />

                    <Divider variant="dashed" />

                    <Group gap="xs" mt="auto" pt={5} wrap="nowrap">
                      {project.demo_link && (
                        <Tooltip label="View Demo">
                          <ActionIcon component="a" href={project.demo_link} target="_blank" variant="light" color="blue">
                            <IconExternalLink size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {project.live_link && (
                        <Tooltip label="View Live Site">
                          <ActionIcon component="a" href={project.live_link} target="_blank" variant="light" color="green">
                            <IconWorld size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {project.github_link && (
                        <Tooltip label="View Source">
                          <ActionIcon component="a" href={project.github_link} target="_blank" variant="light" color="gray">
                            <IconBrandGithub size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      
                      <Box style={{ marginLeft: 'auto' }}>
                         <Badge size="xs" variant="dot" color="gray">#{project.sort_order}</Badge>
                      </Box>
                    </Group>
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </div>
    </Stack>
  );
};

export default ProjectsManager;

