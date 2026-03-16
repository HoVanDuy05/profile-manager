import { Modal, Text } from '@mantine/core';
import { MediaGallery } from './MediaGallery';
 
interface MediaLibraryProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}
 
export const MediaLibrary = ({ opened, onClose, onSelect, title = "Media Library" }: MediaLibraryProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={800} fz="lg">{title}</Text>}
      size="85%"
      radius="lg"
      centered
      padding={0}
      styles={{
        header: { padding: '20px 24px', borderBottom: '1px solid var(--mantine-color-gray-2)', marginBottom: 0 },
        body: { padding: 0 }
      }}
    >
      <MediaGallery onSelect={(url) => { onSelect(url); onClose(); }} />
    </Modal>
  );
};
