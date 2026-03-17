export const TECHNOLOGY_CATEGORIES = [
  {
    group: 'Frontend',
    items: [
      'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 
      'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind', 
      'Bootstrap', 'Mantine UI', 'Chakra UI', 'Sass', 'Redux', 
      'React Query', 'Framer Motion'
    ]
  },
  {
    group: 'Backend',
    items: [
      'Node.js', 'Express', 'NestJS', 'PHP', 'Laravel', 'Python', 
      'Django', 'Flask', 'Go', 'Java', 'Spring Boot', 'Ruby on Rails',
      'C#', '.NET'
    ]
  },
  {
    group: 'Database',
    items: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 
      'Prisma', 'Drizzle', 'Supabase', 'Firebase', 'TiDB'
    ]
  },
  {
    group: 'Mobile',
    items: [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Expo'
    ]
  },
  {
    group: 'DevOps & Tools',
    items: [
      'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 
      'Vercel', 'Netlify', 'GitHub Actions', 'Git', 'Nginx'
    ]
  },
  {
    group: 'Other',
    items: [
      'GraphQL', 'WebSockets', 'REST API', 'Microservices', 
      'Unity', 'Web3', 'Blockchain'
    ]
  }
];

export const ALL_TECHNOLOGIES = TECHNOLOGY_CATEGORIES.flatMap(cat => cat.items).sort();
