import React from 'react';
import {
  Stack,
  Group,
  TextInput,
  ActionIcon,
  Tooltip,
  rem,
  Text,
  Box,
  Button
} from '@mantine/core';
import {
  IconFolder,
  IconFile,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

interface FolderTreeProps {
  nodes: TreeNode[];
  onAdd: (parentId: string | null, type: 'folder' | 'file') => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
  depth?: number;
  readOnly?: boolean;
}

export const FolderTree = ({ 
  nodes, 
  onAdd, 
  onRemove, 
  onUpdate, 
  depth = 0,
  readOnly = false 
}: FolderTreeProps) => {
  if (nodes.length === 0 && depth === 0) {
    return (
      <Box py="xl" ta="center">
        <Text c="dimmed" size="sm" mb="md">Cấu trúc thư mục trống.</Text>
        <Group justify="center" gap="sm">
          <Button 
            size="xs" 
            variant="light" 
            leftSection={<IconFolder size={14} />} 
            onClick={() => onAdd(null, 'folder')}
          >
            Thêm Thư mục Gốc
          </Button>
          <Button 
            size="xs" 
            variant="light" 
            color="cyan" 
            leftSection={<IconFile size={14} />} 
            onClick={() => onAdd(null, 'file')}
          >
            Thêm File Gốc
          </Button>
        </Group>
      </Box>
    );
  }

  return (
    <Stack gap={4} ml={depth > 0 ? 20 : 0} style={{ borderLeft: depth > 0 ? '1px dashed var(--mantine-color-gray-3)' : 'none' }}>
      {nodes.map(node => (
        <React.Fragment key={node.id}>
          <Group gap="xs" wrap="nowrap" py={2}>
            {node.type === 'folder' ? (
              <IconFolder size={18} color="var(--mantine-color-orange-5)" stroke={1.5} />
            ) : (
              <IconFile size={18} color="var(--mantine-color-gray-5)" stroke={1.5} />
            )}
            
            {readOnly ? (
              <Text size="sm" style={{ flex: 1 }}>{node.name}</Text>
            ) : (
              <TextInput 
                variant="unstyled" 
                size="xs" 
                className="folder-node-input"
                value={node.name} 
                onChange={(e) => onUpdate(node.id, e.currentTarget.value)}
                style={{ flex: 1 }}
                styles={{ input: { height: rem(24), padding: 0, fontSize: '0.85rem' } }}
              />
            )}

            {!readOnly && (
              <Group gap={4} wrap="nowrap">
                {node.type === 'folder' && (
                  <>
                    <Tooltip label="Add File" position="top">
                      <ActionIcon size="sm" variant="subtle" color="cyan" onClick={() => onAdd(node.id, 'file')}>
                        <IconPlus size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Add Subfolder" position="top">
                      <ActionIcon size="sm" variant="subtle" color="orange" onClick={() => onAdd(node.id, 'folder')}>
                        <IconFolder size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </>
                )}
                <ActionIcon size="sm" variant="subtle" color="red" onClick={() => onRemove(node.id)}>
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            )}
          </Group>
          {node.children && node.children.length > 0 && (
            <FolderTree 
              nodes={node.children} 
              onAdd={onAdd} 
              onRemove={onRemove} 
              onUpdate={onUpdate}
              depth={depth + 1} 
              readOnly={readOnly}
            />
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
};
