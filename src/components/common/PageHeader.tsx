import { Title, Text, Group, Breadcrumbs, Anchor, rem, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, leftSection, rightSection }: PageHeaderProps) {
  const items = breadcrumbs?.map((item, index) => (
    <Anchor component={Link} to={item.href || '#'} key={index} size="xs" c="dimmed">
      {item.title}
    </Anchor>
  ));

  return (
    <Box
      style={{
        position: 'sticky',
        top: 70,
        zIndex: 90,
        backgroundColor: 'var(--mantine-color-body)',
        opacity: 0.95,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--mantine-color-default-border)',
        margin: 'calc(var(--mantine-spacing-xl) * -1)',
        marginBottom: rem(40),
        padding: 'var(--mantine-spacing-xl)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {items && items.length > 0 && <Breadcrumbs mb="xs">{items}</Breadcrumbs>}

        <Group justify="space-between" align="flex-end" wrap="nowrap">
          <Group gap="md" align="flex-start" wrap="nowrap">
            {leftSection && <Box pt={4}>{leftSection}</Box>}
            <div>
              <Title order={1} fz={rem(18)} fw={800} style={{ letterSpacing: '-0.02em' }}>
                {title}
              </Title>
              {description && (
                <Text c="dimmed" size="sm" mt={4}>
                  {description}
                </Text>
              )}
            </div>
          </Group>
          {rightSection && <div>{rightSection}</div>}
        </Group>
      </motion.div>
    </Box>
  );
}
