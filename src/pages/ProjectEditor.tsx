import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  Stack,
  Group,
  Button,
  Paper,
  Title,
  Text,
  Grid,
  Switch,
  MultiSelect,
  NumberInput,
  ActionIcon,
  rem,
  Box,
  Image,
  Tabs,
  ScrollArea,
  Divider,
  FileButton,
  Badge,
  Tooltip,
  Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconExternalLink,
  IconBrandGithub,
  IconWorld,
  IconFileZip,
  IconFolder,
  IconFile,
  IconChevronRight,
  IconChevronDown,
  IconLayout2,
  IconFileText,
  IconSettings
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, mediaService, getImageUrl } from '../services/api';
import { notifications } from '@mantine/notifications';
import { RichEditor } from '../components/common/RichEditor';
import JSZip from 'jszip';
import { ALL_TECHNOLOGIES, TECHNOLOGY_CATEGORIES } from '../constants/technologies';
import { PageHeader } from '../components/common/PageHeader';
import { FolderTree, TreeNode } from '../components/common/FolderTree';
import { MediaLibrary } from '../components/common/MediaLibrary';
import { CustomFieldSettingsModal } from '../components/common/CustomFieldSettingsModal';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [mediaOpened, setMediaOpened] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('general');
  const [fieldSettingsIndex, setFieldSettingsIndex] = useState<number | null>(null);

  const { data: projectResponse, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id!),
    enabled: isEditing,
  });

  const form = useForm({
    initialValues: {
      title: '',
      subtitle: '',
      description: '',
      content: '',
      image: '',
      tags: [] as string[],
      demo_link: '',
      github_link: '',
      live_link: '',
      is_featured: false,
      sort_order: 0,
      folder_structure: [] as TreeNode[],
      custom_fields: [] as Array<{
        id?: number;
        name: string;
        value: string;
        type: string;
        icon?: string;
        group?: string;
        sort_order?: number;
        is_active?: boolean;
        options?: { label: string; value: string }[];
        validation_rules?: string[];
        display_as?: string;
        placeholder?: string;
        help_text?: string;
        class?: string;
        width?: string;
        height?: string;
        max_length?: number;
        min_length?: number;
        max_value?: number;
        min_value?: number;
        step?: string;
        rows?: number;
        cols?: number;
        pattern?: string;
        required?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        hidden?: boolean;
      }>,
    },
    validate: {
      title: (value: string) => (value.length < 2 ? 'Required' : null),
      description: (value: string) => (value.length < 10 ? 'Description is too short' : null),
    },
  });

  useEffect(() => {
    const project = projectResponse?.data;
    if (project) {
      console.log('Project data loaded:', project);

      form.setValues({
        title: project.title ?? '',
        subtitle: project.subtitle ?? '',
        description: project.description ?? '',
        content: project.content ?? '',
        image: project.image ?? '',
        demo_link: project.demo_link ?? '',
        github_link: project.github_link ?? '',
        live_link: project.live_link ?? '',
        is_featured: Boolean(project.is_featured),
        sort_order: Number(project.sort_order ?? 0),
        tags: Array.isArray(project.tags) ? project.tags : [],
        folder_structure: Array.isArray(project.folder_structure) ? project.folder_structure : [],
        custom_fields: (project.custom_fields || []).map((f: any) => ({
          ...f,
          options: typeof f.options === 'string' ? JSON.parse(f.options || '[]') : (Array.isArray(f.options) ? f.options : []),
          validation_rules: typeof f.validation_rules === 'string' ? JSON.parse(f.validation_rules || '[]') : (Array.isArray(f.validation_rules) ? f.validation_rules : []),
        })),
      });
    }
  }, [projectResponse]);

  const mutation = useMutation({
    mutationFn: (data: FormData | any) => isEditing
      ? projectService.update(id!, data)
      : projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notifications.show({
        title: 'Success',
        message: isEditing ? 'Project updated' : 'Project created',
        color: 'green'
      });
      navigate('/projects');
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Something went wrong',
        color: 'red'
      });
    }
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Starting Project Submission...', values);
    const formData = new FormData();

    // Create a copy of values to avoid modifying the UI state during processing
    const processedValues = { ...values };

    // Append all fields
    Object.entries(processedValues).forEach(([key, value]) => {
      // Handle array fields separately to ensure PHP array notation
      if (key === 'tags' && Array.isArray(value)) {
        (value as string[]).forEach((tag) => formData.append('tags[]', tag));
      } else if (key === 'folder_structure' || key === 'custom_fields') {
        formData.append(key, JSON.stringify(value || []));
      } else if (key === 'is_featured') {
        formData.append(key, value ? '1' : '0');
      } else if (value instanceof File) {
        // Correctly append file objects (like ZIP source code)
        formData.append(key, value);
      } else if (value !== null && value !== undefined && typeof value !== 'object') {
        formData.append(key, String(value));
      }
    });

    if (zipFile) {
      formData.append('source_code_file', zipFile);
    }

    // Debug: Log FormData entries (for developers with F12)
    console.log('FormData Entries:');
    for (const pair of (formData as any).entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    mutation.mutate(formData);
  };

  const handleZipChange = async (file: File | null) => {
    setZipFile(file);
    if (!file) return;

    try {
      const zip = await JSZip.loadAsync(file);
      const nodes: TreeNode[] = [];

      const findOrCreateDir = (pathParts: string[], currentNodes: TreeNode[]): TreeNode[] => {
        let current = currentNodes;
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          if (!part) continue;

          let node = current.find(n => n.name === part && n.type === 'folder');
          if (!node) {
            node = {
              id: Math.random().toString(36).substr(2, 9),
              name: part,
              type: 'folder',
              children: []
            };
            current.push(node);
          }
          current = node.children!;
        }
        return current;
      };

      for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;
        const parts = path.split('/');
        const fileName = parts.pop()!;
        const dirNodes = findOrCreateDir(parts, nodes);
        dirNodes.push({
          id: Math.random().toString(36).substr(2, 9),
          name: fileName,
          type: 'file'
        });
      }

      form.setFieldValue('folder_structure', nodes);
    } catch (error) {
      console.error('Error reading zip:', error);
      notifications.show({ title: 'Error', message: 'Failed to read ZIP structure', color: 'red' });
    }
  };

  // Helper to add node to tree
  const addTreeNode = (parentId: string | null = null, type: 'folder' | 'file' = 'file') => {
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: type === 'folder' ? 'New Folder' : 'index.js',
      type,
      children: type === 'folder' ? [] : undefined
    };

    if (!parentId) {
      form.setFieldValue('folder_structure', [...form.values.folder_structure, newNode]);
    } else {
      const updateChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newNode] };
          }
          if (node.children) {
            return { ...node, children: updateChildren(node.children) };
          }
          return node;
        });
      };
      form.setFieldValue('folder_structure', updateChildren(form.values.folder_structure));
    }
  };

  const removeTreeNode = (nodeId: string) => {
    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.filter(node => {
        if (node.id === nodeId) return false;
        if (node.children) node.children = filterNodes(node.children);
        return true;
      });
    };
    form.setFieldValue('folder_structure', filterNodes(form.values.folder_structure));
  };

  const updateNodeName = (nodeId: string, name: string) => {
    const update = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) return { ...node, name };
        if (node.children) return { ...node, children: update(node.children) };
        return node;
      });
    };
    form.setFieldValue('folder_structure', update(form.values.folder_structure));
  };

  return (
    <Stack gap="xl">
      <PageHeader
        title={isEditing ? 'Edit Project' : 'New Project'}
        description="Craft a detailed showcase for your work with rich content and technical details."
        leftSection={
          <ActionIcon variant="subtle" color="gray" onClick={() => navigate('/projects')}>
            <IconArrowLeft size={18} />
          </ActionIcon>
        }
        rightSection={
          <Group gap="sm">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => navigate('/projects')}
              visibleFrom="sm"
            >
              Cancel
            </Button>
            <Button
              form="project-form"
              type="submit"
              loading={mutation.isPending}
              leftSection={isEditing ? <IconDeviceFloppy size={18} /> : <IconPlus size={18} />}
              color="violet"
              style={{ background: 'linear-gradient(45deg, var(--mantine-color-violet-6) 0%, var(--mantine-color-violet-8) 100%)' }}
            >
              {isEditing ? 'Save Changes' : 'Create Project'}
            </Button>
          </Group>
        }
      />

      <form id="project-form" onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
                <Tabs.List>
                  <Tabs.Tab value="general" leftSection={<IconLayout2 size={16} />}>General Info</Tabs.Tab>
                  <Tabs.Tab value="content" leftSection={<IconFileText size={16} />}>Article Content</Tabs.Tab>
                  <Tabs.Tab value="technical" leftSection={<IconFolder size={16} />}>Technical (Tree/Zip)</Tabs.Tab>
                  <Tabs.Tab value="custom" leftSection={<IconSettings size={16} />}>Custom Fields</Tabs.Tab>
                </Tabs.List>

                <Paper withBorder p="xl" mt="md" radius="md">
                  <Tabs.Panel value="general">
                    <Stack gap="md">
                      <TextInput
                        label="Project Title"
                        placeholder="My Awesome Project"
                        required
                        {...form.getInputProps('title')}
                      />
                      <TextInput
                        label="Subtitle / Tagline"
                        placeholder="Enterprise ERP Solution"
                        {...form.getInputProps('subtitle')}
                      />

                      <RichEditor
                        label="Short Description (Listing card)"
                        value={form.values.description}
                        onChange={(val) => form.setFieldValue('description', val)}
                        minHeight={150}
                      />

                      <MultiSelect
                        label="Technologies Used"
                        placeholder="Pick technologies"
                        data={TECHNOLOGY_CATEGORIES}
                        searchable
                        clearable
                        nothingFoundMessage="Nothing found..."
                        {...form.getInputProps('tags')}
                      />

                      <Grid>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Demo URL"
                            placeholder="https://demo.example.com"
                            leftSection={<IconExternalLink size={16} />}
                            {...form.getInputProps('demo_link')}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Live Website URL"
                            placeholder="https://mysite.com"
                            leftSection={<IconWorld size={16} />}
                            {...form.getInputProps('live_link')}
                          />
                        </Grid.Col>
                      </Grid>

                      <TextInput
                        label="GitHub Repository"
                        placeholder="https://github.com/user/repo"
                        leftSection={<IconBrandGithub size={16} />}
                        {...form.getInputProps('github_link')}
                      />
                    </Stack>
                  </Tabs.Panel>
                  <Tabs.Panel value="content">
                    <Stack gap="md" py="md">
                      <RichEditor
                        label="Detailed Article Content"
                        value={form.values.content}
                        onChange={(val) => form.setFieldValue('content', val)}
                        minHeight={500}
                      />
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="technical">
                    <Stack gap="xl">
                      <Box>
                        <Title order={5} mb="sm">Source Code Package</Title>
                        <Group align="center">
                          <FileButton onChange={handleZipChange} accept="application/zip">
                            {(props) => (
                              <Button {...props} variant="light" leftSection={<IconFileZip size={18} />}>
                                {zipFile ? 'Change ZIP' : 'Upload Source ZIP'}
                              </Button>
                            )}
                          </FileButton>
                          {zipFile && (
                            <Group gap="xs">
                              <Badge color="blue" size="lg" variant="light">{zipFile.name}</Badge>
                              <ActionIcon color="red" variant="subtle" onClick={() => setZipFile(null)}>
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          )}
                        </Group>
                      </Box>

                      <Divider />

                      <Box>
                        <Group justify="space-between" mb="sm">
                          <Title order={5}>Project Folder Structure</Title>
                          <Group gap="xs">
                            <Button size="xs" variant="light" leftSection={<IconFolder size={14} />} onClick={() => addTreeNode(null, 'folder')}>Add Folder</Button>
                            <Button size="xs" variant="light" color="cyan" leftSection={<IconFile size={14} />} onClick={() => addTreeNode(null, 'file')}>Add File</Button>
                          </Group>
                        </Group>

                        <Paper withBorder radius="md" p="md" bg="gray.0">
                          <ScrollArea h={400} offsetScrollbars>
                            <FolderTree
                              nodes={form.values.folder_structure}
                              onAdd={addTreeNode}
                              onRemove={removeTreeNode}
                              onUpdate={updateNodeName}
                            />
                          </ScrollArea>
                        </Paper>
                      </Box>
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="custom">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Title order={5}>Extensions & Custom Fields</Title>
                        <Button
                          size="xs"
                          variant="light"
                          leftSection={<IconPlus size={14} />}
                          onClick={() => form.insertListItem('custom_fields', {
                            name: '',
                            value: '',
                            type: 'text',
                            display_as: 'input',
                            options: [],
                            validation_rules: [],
                            is_active: true,
                            sort_order: form.values.custom_fields.length,
                            required: false,
                          })}
                        >
                          Add Field
                        </Button>
                      </Group>

                      {form.values.custom_fields.map((_, index) => (
                        <Stack key={index} gap="xs" p="md" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: rem(8) }}>
                          <Group align="flex-end" wrap="nowrap">
                            <TextInput
                              label="Field Name"
                              placeholder="e.g. Client"
                              style={{ flex: 1.5 }}
                              {...form.getInputProps(`custom_fields.${index}.name`)}
                            />
                            <Select
                              label="Type"
                              style={{ flex: 1 }}
                              data={[
                                { label: 'Text', value: 'text' },
                                { label: 'Number', value: 'number' },
                                { label: 'Date', value: 'date' },
                                { label: 'Link', value: 'url' },
                                { label: 'Icon', value: 'icon' },
                              ]}
                              {...form.getInputProps(`custom_fields.${index}.type`)}
                            />
                            <Box style={{ flex: 2 }}>
                              {form.values.custom_fields[index].type === 'date' ? (
                                <TextInput
                                  type="date"
                                  label="Value"
                                  placeholder="Select date"
                                  {...form.getInputProps(`custom_fields.${index}.value`)}
                                />
                              ) : form.values.custom_fields[index].type === 'number' ? (
                                <NumberInput
                                  label="Value"
                                  placeholder="Value"
                                  {...form.getInputProps(`custom_fields.${index}.value`)}
                                />
                              ) : form.values.custom_fields[index].display_as === 'textarea' || form.values.custom_fields[index].type === 'textarea' ? (
                                <Textarea
                                  label="Value"
                                  placeholder="Value"
                                  minRows={2}
                                  maxRows={5}
                                  autosize
                                  {...form.getInputProps(`custom_fields.${index}.value`)}
                                />
                              ) : (
                                <TextInput
                                  label="Value"
                                  placeholder="Value"
                                  {...form.getInputProps(`custom_fields.${index}.value`)}
                                />
                              )}
                            </Box>
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="lg"
                              onClick={() => setFieldSettingsIndex(index)}
                            >
                              <IconSettings size={18} />
                            </ActionIcon>
                            <ActionIcon color="red" variant="subtle" size="lg" onClick={() => form.removeListItem('custom_fields', index)}>
                              <IconTrash size={18} />
                            </ActionIcon>
                          </Group>
                        </Stack>
                      ))}

                      <CustomFieldSettingsModal
                        opened={fieldSettingsIndex !== null}
                        onClose={() => setFieldSettingsIndex(null)}
                        index={fieldSettingsIndex ?? 0}
                        form={form}
                      />

                      {form.values.custom_fields.length === 0 && (
                        <Text c="dimmed" ta="center" size="sm" py="xl">Add custom attributes like Client Name, Project Duration, or Budget.</Text>
                      )}
                    </Stack>
                  </Tabs.Panel>
                </Paper>
              </Tabs>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Paper withBorder p="xl" radius="md" visibleFrom="md">
                <Title order={5} mb="md">Publishing</Title>
                <Stack gap="sm">
                  <Switch
                    label="Featured Project"
                    description="Highlight this on the top of your portfolio"
                    {...form.getInputProps('is_featured', { type: 'checkbox' })}
                  />
                  <NumberInput
                    label="Sort Order"
                    description="Higher values appear first"
                    {...form.getInputProps('sort_order')}
                  />
                </Stack>
              </Paper>

              <Paper withBorder p="xl" radius="md">
                <Title order={5} mb="md">Project Image</Title>
                <Stack gap="md">
                  <Box
                    pos="relative"
                    h={200}
                    style={{
                      borderRadius: rem(8),
                      overflow: 'hidden',
                      background: 'var(--mantine-color-gray-1)',
                      border: '1px dashed var(--mantine-color-gray-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {form.values.image ? (
                      <Image
                        key={form.values.image}
                        src={getImageUrl(form.values.image)}
                        h={200}
                        w="100%"
                        style={{ objectFit: 'cover' }}
                        fallbackSrc="https://placehold.co/600x400?text=Error+Loading"
                      />
                    ) : (
                      <Stack align="center" gap={4} c="dimmed">
                        <IconPhoto size={32} />
                        <Text size="xs">No image selected</Text>
                      </Stack>
                    )}
                  </Box>
                  <Button variant="outline" color="violet" onClick={() => setMediaOpened(true)}>
                    Select from Media Library
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>

      <MediaLibrary
        opened={mediaOpened}
        onClose={() => setMediaOpened(false)}
        onSelect={(url) => {
          form.setFieldValue('image', url);
          setMediaOpened(false);
        }}
        title="Select Featured Image"
      />
    </Stack>
  );
}
