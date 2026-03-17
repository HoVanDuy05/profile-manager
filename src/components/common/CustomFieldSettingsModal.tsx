import React from 'react';
import {
  Modal,
  Stack,
  Group,
  TextInput,
  NumberInput,
  Switch,
  Tabs,
  Button,
  Grid,
  Select,
  Textarea,
  Text,
  Divider,
  ActionIcon,
  Tooltip,
  Card,
} from '@mantine/core';
import {
  IconSettings,
  IconEye,
  IconCheck,
  IconLayout,
  IconAdjustments,
  IconPlus,
  IconTrash,
  IconHelp,
} from '@tabler/icons-react';

interface CustomFieldSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  index: number;
  form: any;
}

export function CustomFieldSettingsModal({ opened, onClose, index, form }: CustomFieldSettingsModalProps) {
  const fieldPath = `custom_fields.${index}`;
  const fieldValues = form.values.custom_fields[index];

  // Helper to handle options as array of {label, value}
  const options = Array.isArray(fieldValues?.options) 
    ? fieldValues.options 
    : [];

  const addOption = () => {
    const newOptions = [...options, { label: '', value: '' }];
    form.setFieldValue(`${fieldPath}.options`, newOptions);
  };

  const removeOption = (optIndex: number) => {
    const newOptions = options.filter((_: any, i: number) => i !== optIndex);
    form.setFieldValue(`${fieldPath}.options`, newOptions);
  };

  const updateOption = (optIndex: number, key: 'label' | 'value', val: string) => {
    const newOptions = [...options];
    newOptions[optIndex] = { ...newOptions[optIndex], [key]: val };
    form.setFieldValue(`${fieldPath}.options`, newOptions);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconSettings size={22} color="var(--mantine-color-violet-6)" />
          <Text fw={800} fz="lg">Field Settings: {fieldValues?.name || `Field ${index + 1}`}</Text>
        </Group>
      }
      size="xl"
      radius="lg"
      overlayProps={{ blur: 3, opacity: 0.55 }}
    >
      <Tabs defaultValue="behavior" variant="pills" color="violet">
        <Tabs.List mb="xl">
          <Tabs.Tab value="behavior" leftSection={<IconAdjustments size={16} />}>General & Type</Tabs.Tab>
          <Tabs.Tab value="validation" leftSection={<IconCheck size={16} />}>Validation Rules</Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<IconLayout size={16} />}>UI & Styling</Tabs.Tab>
          <Tabs.Tab value="visibility" leftSection={<IconEye size={16} />}>Visibility</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="behavior">
          <Stack gap="lg">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  label="Display As"
                  description="How this field looks in the form"
                  data={[
                    { label: 'Standard Input', value: 'input' },
                    { label: 'Textarea (Multi-line)', value: 'textarea' },
                    { label: 'Select Dropdown', value: 'select' },
                    { label: 'Multi-Select', value: 'multiselect' },
                    { label: 'Radio Buttons', value: 'radio' },
                    { label: 'Checkbox', value: 'checkbox' },
                    { label: 'Switch (On/Off)', value: 'switch' },
                    { label: 'Date Picker', value: 'date' },
                    { label: 'Rich Text Editor', value: 'richtext' },
                    { label: 'Icon Picker', value: 'icon' },
                  ]}
                  {...form.getInputProps(`${fieldPath}.display_as`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  label="Category / Group"
                  placeholder="e.g. Technical Details"
                  {...form.getInputProps(`${fieldPath}.group`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Sort Order"
                  placeholder="0"
                  {...form.getInputProps(`${fieldPath}.sort_order`)}
                />
              </Grid.Col>
            </Grid>

            {['select', 'multiselect', 'radio'].includes(fieldValues?.display_as) && (
              <Card withBorder padding="md" radius="md">
                <Group justify="space-between" mb="xs">
                  <Text fw={700} size="sm">Selection Options</Text>
                  <Button size="compact-xs" variant="light" leftSection={<IconPlus size={14} />} onClick={addOption}>
                    Add Option
                  </Button>
                </Group>
                <Stack gap="xs">
                  {options.length === 0 && <Text size="xs" c="dimmed" ta="center" py="sm">No options defined. Click 'Add Option' to start.</Text>}
                  {options.map((opt: any, optIdx: number) => (
                    <Group key={optIdx} gap="xs">
                      <TextInput
                        placeholder="Label (Visible)"
                        style={{ flex: 1 }}
                        value={opt.label}
                        onChange={(e) => updateOption(optIdx, 'label', e.currentTarget.value)}
                      />
                      <TextInput
                        placeholder="Value (Saved)"
                        style={{ flex: 1 }}
                        value={opt.value}
                        onChange={(e) => updateOption(optIdx, 'value', e.currentTarget.value)}
                      />
                      <ActionIcon color="red" variant="subtle" onClick={() => removeOption(optIdx)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}

            <Divider label="Status" labelPosition="center" />
            <Group gap="xl" justify="center">
              <Switch
                label="Field is Active"
                {...form.getInputProps(`${fieldPath}.is_active`, { type: 'checkbox' })}
              />
              <Switch
                label="Is Required"
                {...form.getInputProps(`${fieldPath}.required`, { type: 'checkbox' })}
              />
              <Switch
                label="Read Only"
                {...form.getInputProps(`${fieldPath}.readonly`, { type: 'checkbox' })}
              />
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="validation">
          <Stack gap="md">
            <Text fw={700} size="sm">Basic Constraints</Text>
            <Grid gutter="sm">
              <Grid.Col span={6}>
                <NumberInput label="Min Characters" placeholder="No limit" {...form.getInputProps(`${fieldPath}.min_length`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Max Characters" placeholder="No limit" {...form.getInputProps(`${fieldPath}.max_length`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Min Value (Numbers)" {...form.getInputProps(`${fieldPath}.min_value`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Max Value (Numbers)" {...form.getInputProps(`${fieldPath}.max_value`)} />
              </Grid.Col>
            </Grid>

            <Divider label="Pattern Matching" labelPosition="center" />
            <Grid align="flex-end">
              <Grid.Col span={10}>
                <TextInput 
                  label="Validation Pattern (Regex)" 
                  placeholder="e.g. ^[0-9]+$" 
                  description="Advanced users only. Leave blank for no custom pattern."
                  {...form.getInputProps(`${fieldPath}.pattern`)} 
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Tooltip label="Examples: ^[0-9]+$ (Numbers only), ^[a-zA-Z]+$ (Letters only)">
                  <ActionIcon variant="light" size="lg" radius="md">
                    <IconHelp size={20} />
                  </ActionIcon>
                </Tooltip>
              </Grid.Col>
            </Grid>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="appearance">
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput label="Placeholder Text" placeholder="e.g. Enter value..." {...form.getInputProps(`${fieldPath}.placeholder`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Help Text (Small hint below)" {...form.getInputProps(`${fieldPath}.help_text`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Field Icon Name" placeholder="IconUser, IconCode, etc." {...form.getInputProps(`${fieldPath}.icon`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Custom CSS Class" {...form.getInputProps(`${fieldPath}.class`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Control Width" placeholder="100% or 200px" {...form.getInputProps(`${fieldPath}.width`)} />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Input Rows (Textarea/Editor)" {...form.getInputProps(`${fieldPath}.rows`)} />
              </Grid.Col>
            </Grid>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="visibility">
          <Stack gap="md">
            <Card withBorder radius="md">
              <Stack gap="sm">
                <Switch
                  label="Hide this field in the main forms"
                  description="Use this for internal metadata fields that shouldn't be edited by hand."
                  {...form.getInputProps(`${fieldPath}.hidden`, { type: 'checkbox' })}
                />
                <Switch
                  label="Disable interactions"
                  description="Prevents any input but remains visible."
                  {...form.getInputProps(`${fieldPath}.disabled`, { type: 'checkbox' })}
                />
              </Stack>
            </Card>
            <Text size="xs" c="dimmed" fs="italic">Note: These settings are applied dynamically on the frontend rendering engine.</Text>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt={30}>
        <Button onClick={onClose} size="md" radius="md" color="violet">Done Setting Up</Button>
      </Group>
    </Modal>
  );
}
