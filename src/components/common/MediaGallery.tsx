import {
  SimpleGrid,
  Card,
  Image,
  Text,
  Button,
  Group,
  Stack,
  rem,
  LoadingOverlay,
  FileButton,
  Box,
  Grid
} from '@mantine/core';
import {
  IconUpload,
  IconPhoto,
} from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService } from '../../services/api';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
 
interface Media {
  id: number;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
}
 
interface MediaGalleryProps {
  onSelect?: (url: string) => void;
  isStandalone?: boolean;
}
 
export const MediaGallery = ({ onSelect, isStandalone = false }: MediaGalleryProps) => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
 
  const { data: mediaResponse, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => mediaService.getAll(),
  });
 
  const mediaList = mediaResponse?.data || [] as Media[];
 
  const uploadMutation = useMutation({
    mutationFn: (file: File) => mediaService.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      notifications.show({ title: 'Success', message: 'Image uploaded', color: 'green' });
    },
    onError: () => {
      notifications.show({ title: 'Error', message: 'Upload failed', color: 'red' });
    },
    onSettled: () => setUploading(false)
  });
 
  const deleteMutation = useMutation({
    mutationFn: (id: number) => mediaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      notifications.show({ title: 'Deleted', message: 'Image removed', color: 'gray' });
    }
  });
 
  const handleUpload = (file: File | null) => {
    if (file) {
      setUploading(true);
      uploadMutation.mutate(file);
    }
  };
 
  return (
    <Box pos="relative" mih={rem(500)}>
      <LoadingOverlay visible={isLoading || uploading} overlayProps={{ radius: 'sm', blur: 2 }} />
      
      <Grid gutter={0} mih={rem(500)}>
        <Grid.Col span={selectedItem ? 9 : 12} p="xl" bg="gray.0" style={{ borderRight: selectedItem ? '1px solid var(--mantine-color-gray-2)' : 'none' }}>
          <Stack gap="md">
            <Group justify="space-between" mb="md">
              <Text size="sm" c="dimmed">Select an image from your library or upload a new one.</Text>
              <FileButton onChange={handleUpload} accept="image/png,image/jpeg,image/webp">
                {(props) => (
                  <Button {...props} leftSection={<IconUpload size={18} />} color="violet">
                    Upload New
                  </Button>
                )}
              </FileButton>
            </Group>
 
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: selectedItem ? 4 : 5 }} spacing="md">
              {mediaList.map((item: Media) => (
                <Card
                  key={item.id}
                  withBorder
                  padding={rem(4)}
                  radius="md"
                  style={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    border: selectedItem?.id === item.id ? '3px solid var(--mantine-color-violet-6)' : '1px solid var(--mantine-color-gray-3)',
                    boxShadow: selectedItem?.id === item.id ? 'var(--mantine-shadow-md)' : 'none',
                    transform: selectedItem?.id === item.id ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  <Image
                    src={item.url.startsWith('/storage') ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${item.url}` : item.url}
                    height={120}
                    radius="sm"
                    fit="contain"
                    bg="gray.1"
                    fallbackSrc="https://placehold.co/200x200?text=No+Preview"
                  />
                </Card>
              ))}
              {mediaList.length === 0 && !isLoading && (
                <Stack align="center" justify="center" py={100} style={{ gridColumn: '1 / -1' }}>
                  <IconPhoto size={60} color="var(--mantine-color-gray-3)" />
                  <Text c="dimmed" fw={600}>Your media library is empty.</Text>
                </Stack>
              )}
            </SimpleGrid>
          </Stack>
        </Grid.Col>
 
        {selectedItem && (
          <Grid.Col span={3} p="xl">
            <Stack gap="md">
              <Text fw={800} fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: '1px' }}>Attachment Details</Text>
 
              <Box style={{ 
                overflow: 'hidden', 
                border: '1px solid var(--mantine-color-gray-2)', 
                borderRadius: 'var(--mantine-radius-md)',
                backgroundColor: 'var(--mantine-color-gray-0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image
                  src={selectedItem.url.startsWith('/storage') ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${selectedItem.url}` : selectedItem.url}
                  fallbackSrc="https://placehold.co/200x200?text=No+Preview"
                  mah={220}
                  style={{ objectFit: 'contain', width: '100%' }}
                />
              </Box>
 
              <Stack gap={4}>
                <Text fw={700}>{selectedItem.filename}</Text>
                <Text size="xs" c="dimmed">{new Date().toLocaleDateString()}</Text>
                <Text size="xs" c="dimmed">{(selectedItem.size / 1024).toFixed(2)} KB</Text>
                <Text size="xs" c="dimmed">{selectedItem.mime_type}</Text>
              </Stack>
 
              <Group grow>
                {onSelect && (
                  <Button
                    variant="filled"
                    color="violet"
                    onClick={() => {
                      onSelect(selectedItem.url);
                    }}
                  >
                    Select Image
                  </Button>
                )}
                <Button
                  variant="light"
                  color="red"
                  onClick={() => {
                    if (confirm('Permanently delete this item?')) {
                      deleteMutation.mutate(selectedItem.id);
                      setSelectedItem(null);
                    }
                  }}
                >
                  Delete
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
        )}
      </Grid>
    </Box>
  );
};
