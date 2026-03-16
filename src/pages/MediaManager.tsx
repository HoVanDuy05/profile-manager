import { MediaGallery } from '../components/common/MediaGallery';
import { Stack, Card } from '@mantine/core';
import { PageHeader } from '../components/common/PageHeader';

const MediaManager = () => {
  return (
    <Stack gap="xl">
      <PageHeader
        title="Asset Management"
        description="Organize your files, images, and documents in one central hub."
      />

      <Card withBorder radius="lg" padding={0} style={{ overflow: 'hidden' }}>
        <MediaGallery isStandalone={true} />
      </Card>
    </Stack>
  );
};

export default MediaManager;
