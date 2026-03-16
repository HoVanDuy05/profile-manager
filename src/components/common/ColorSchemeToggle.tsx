import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
        radius="md"
      >
        {computedColorScheme === 'light' ? (
          <IconMoon size={20} stroke={1.5} />
        ) : (
          <IconSun size={20} stroke={1.5} />
        )}
      </ActionIcon>
    </motion.div>
  );
}
