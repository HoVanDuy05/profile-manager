import {
  Title,
  Card,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Grid,
  Avatar,
  ActionIcon,
  rem,
  Divider,
  LoadingOverlay,
  Box,
  Container
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconDeviceFloppy,
  IconPhoto,
  IconCloudUpload,
  IconUser,
  IconBriefcase,
  IconAlignLeft,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconAt,
  IconPhone,
  IconMapPin,
  IconSchool,
  IconTrophy,
  IconFolder,
  IconUsers,
  IconCake
} from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { PageHeader } from '../components/common/PageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/api';
import { notifications } from '@mantine/notifications';
import { Profile } from '../types';
import { useDisclosure } from '@mantine/hooks';
import { MediaLibrary } from '../components/common/MediaLibrary';
import { useEffect } from 'react';

const ProfileManager = () => {
  const [mediaOpened, { open: openMedia, close: closeMedia }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.get(),
  });

  const profile = profileResponse?.data?.profile as Profile;

  const form = useForm({
    initialValues: {
      name: '',
      title: '',
      bio: '',
      avatar: '',
      github: '',
      linkedin: '',
      facebook: '',
      email: '',
      phone: '',
      location: '',
      education: '',
      birthday: null as Date | null,
      experience_years: '',
      projects_count: '',
      clients_count: '',
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (profile) {
      form.setValues({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        github: profile.social_links?.github || profile.github || '',
        linkedin: profile.social_links?.linkedin || profile.linkedin || '',
        facebook: profile.social_links?.facebook || '',
        email: profile.social_links?.email || profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        education: profile.education || '',
        birthday: profile.birthday ? new Date(profile.birthday) : null,
        experience_years: profile.experience_years || '',
        projects_count: profile.projects_count || '',
        clients_count: profile.clients_count || '',
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (values: any) => profileService.update(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    },
  });

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || mutation.isPending} overlayProps={{ radius: 'sm', blur: 2 }} />

      <PageHeader
        title="Profile Settings"
        description="Update your personal information and social presence."
        rightSection={
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            color="violet"
            onClick={() => mutation.mutate(form.values)}
            loading={mutation.isPending}
          >
            Save Changes
          </Button>
        }
      />

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="xl">
            <Card withBorder radius="lg" ta="center">
              <Stack align="center" gap="md">
                <Box pos="relative">
                  <Avatar
                    src={form.values.avatar ? (form.values.avatar.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${form.values.avatar}` : form.values.avatar) : null}
                    size={rem(160)}
                    radius={rem(80)}
                    mx="auto"
                    style={{ border: '4px solid var(--mantine-color-violet-1)' }}
                  />
                  <ActionIcon
                    variant="filled"
                    color="violet"
                    radius="xl"
                    size="xl"
                    pos="absolute"
                    bottom={5}
                    right={5}
                    style={{ border: '3px solid var(--mantine-color-body)' }}
                    onClick={openMedia}
                  >
                    <IconPhoto size={20} />
                  </ActionIcon>
                </Box>
                <div>
                  <Text fw={800} fz="xl">{form.values.name || 'Your Name'}</Text>
                  <Text c="dimmed" size="sm">{form.values.title || 'Your Professional Title'}</Text>
                </div>
                <Button
                  variant="light"
                  color="violet"
                  fullWidth
                  leftSection={<IconCloudUpload size={18} />}
                  onClick={openMedia}
                >
                  Change Avatar
                </Button>
              </Stack>
            </Card>

            <MediaLibrary
              opened={mediaOpened}
              onClose={closeMedia}
              onSelect={(url) => form.setFieldValue('avatar', url)}
              title="Select Avatar"
            />

            <Card withBorder radius="lg">
              <Text fw={800} mb="md">Social Profiles</Text>
              <Stack gap="sm">
                <TextInput
                  label="GitHub"
                  placeholder="https://github.com/username"
                  leftSection={<IconBrandGithub size={18} />}
                  {...form.getInputProps('github')}
                />
                <TextInput
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  leftSection={<IconBrandLinkedin size={18} />}
                  {...form.getInputProps('linkedin')}
                />
                <TextInput
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                  leftSection={<IconBrandFacebook size={18} />}
                  {...form.getInputProps('facebook')}
                />
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  leftSection={<IconAt size={18} />}
                  {...form.getInputProps('email')}
                />
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="lg">
            <Text fw={800} fz="lg" mb="xl">Basic Information</Text>
            <Stack gap="lg">
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                    leftSection={<IconUser size={18} />}
                    {...form.getInputProps('name')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Professional Title"
                    placeholder="e.g. Senior Fullstack Developer"
                    required
                    leftSection={<IconBriefcase size={18} />}
                    {...form.getInputProps('title')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Phone Number"
                    placeholder="Enter phone number"
                    leftSection={<IconPhone size={18} />}
                    {...form.getInputProps('phone')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Location"
                    placeholder="City, Country"
                    leftSection={<IconMapPin size={18} />}
                    {...form.getInputProps('location')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Education"
                    placeholder="University/College Name"
                    leftSection={<IconSchool size={18} />}
                    {...form.getInputProps('education')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="Date of Birth"
                    placeholder="Select your birthday"
                    clearable
                    valueFormat="YYYY-MM-DD"
                    leftSection={<IconCake size={18} />}
                    {...form.getInputProps('birthday')}
                  />
                </Grid.Col>
              </Grid>

              <Divider my="sm" label="Metrics & Stats" labelPosition="center" />
              <Grid>
                <Grid.Col span={{ base: 4 }}>
                  <TextInput
                    label="Years of Exp"
                    placeholder="e.g. 5+"
                    leftSection={<IconTrophy size={18} />}
                    {...form.getInputProps('experience_years')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 4 }}>
                  <TextInput
                    label="Projects Count"
                    placeholder="e.g. 50+"
                    leftSection={<IconFolder size={18} />}
                    {...form.getInputProps('projects_count')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 4 }}>
                  <TextInput
                    label="Clients Count"
                    placeholder="e.g. 20+"
                    leftSection={<IconUsers size={18} />}
                    {...form.getInputProps('clients_count')}
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Professional Bio"
                placeholder="Write a brief introduction about yourself..."
                minRows={6}
                required
                leftSection={<IconAlignLeft size={18} />}
                {...form.getInputProps('bio')}
              />

              <Divider my="md" label="Additional Actions" labelPosition="center" />

              <Group justify="flex-end">
                <Button variant="subtle" color="gray">Cancel</Button>
                <Button
                  color="violet"
                  leftSection={<IconDeviceFloppy size={18} />}
                  onClick={() => mutation.mutate(form.values)}
                  loading={mutation.isPending}
                >
                  Update Profile
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default ProfileManager;
