export type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  stack: string[];
  /** one-liner shown on the card */
  blurb: string;
  /** Luke's role on the project */
  role: string;
  /** longer framing shown at the top of the case study */
  overview: string;
  /** detailed highlights, shown in the case study */
  highlights: string[];
  link: string;
  /** hex accent for the card's clash color (drives a CSS var, not a Tailwind class) */
  accent: string;
  /** hex text color used when the accent fills the card on hover */
  accentFg: string;
  featured?: boolean;
};

/** Source of truth: ../Resume/luke-zhang-resume projects section. */
export const PROJECTS: Project[] = [
  {
    id: 'icemeister',
    title: 'IceMeister',
    year: '2026',
    category: 'Embedded / Robotics',
    stack: ['C++', 'LiDAR', 'Embedded', 'Path-Planning'],
    blurb:
      'The perception and navigation stack for an autonomous mini-Zamboni: fuses LiDAR scans to map an ice surface and localize in real time, with coverage path-planning and obstacle avoidance running on bare-metal firmware.',
    role: 'Perception & Navigation',
    overview:
      'A Mechatronics capstone: an autonomous mini-Zamboni that maps an ice surface and resurfaces it with zero human control. I own the perception and navigation stack.',
    highlights: [
      'Fuses LiDAR scans to build a live map of the ice surface and localize the robot in real time.',
      'Implements embedded C++ firmware on the onboard microcontroller for real-time sensor interfacing and closed-loop motor control.',
      'Runs coverage path-planning and obstacle avoidance for precise, repeatable resurfacing.',
      'Tunes the sensor pipeline and frame budget to keep perception real-time on constrained hardware.',
    ],
    link: 'https://lukeypookster.com/IceMeister/',
    accent: '#1A1AFF',
    accentFg: '#ECEAE3',
    featured: true,
  },
  {
    id: 'alpha-connect-4',
    title: 'Alpha Connect 4',
    year: '2023',
    category: 'Reinforcement Learning',
    stack: ['Python', 'PyTorch', 'ONNX', 'TypeScript'],
    blurb:
      'An AlphaZero-style Connect 4 agent trained via parallel self-play - a 9-block ResNet paired with 600-simulation MCTS - exported to ONNX and run client-side in a Web Worker, so it plays in-browser with zero server cost.',
    role: 'Solo - ML & Frontend',
    overview:
      'An AlphaZero-style agent that learns Connect 4 purely from self-play, then runs entirely in your browser - no server, no cost.',
    highlights: [
      'Trained via 8 iterations of parallel self-play (100 concurrent games, 500 games per iteration).',
      'Pairs a 9-block ResNet (128 hidden channels) with 600-simulation MCTS and Dirichlet exploration noise to converge on optimal play.',
      'Exported the trained model to ONNX and ran inference client-side via onnxruntime-web in a Web Worker.',
      'Shipped a TypeScript/React frontend to Vercel so the agent plays fully in-browser.',
    ],
    link: 'https://alpha-connect-four.vercel.app',
    accent: '#C6FF1A',
    accentFg: '#0A0A0A',
    featured: true,
  },
  {
    id: 'spotify-indie',
    title: 'Spotify Indie',
    year: '2024',
    category: 'Web / API',
    stack: ['JavaScript', 'Spotify API', 'Vercel'],
    blurb:
      "A music-discovery engine that paginates 1,000 genre results to surface the 24 least-popular artists' debut albums, with a rate-limit-aware request queue and a 'Surprise Me' probe across candidate genres.",
    role: 'Solo',
    overview:
      'A music-discovery platform that hunts down the most obscure artists on Spotify - deliberately the opposite of the algorithm.',
    highlights: [
      "Paginates up to 1,000 genre results, re-ranks by popularity ascending, and surfaces the 24 least-popular artists' debut albums.",
      "Album-search fallback for ghost-artist genres, plus a 'Surprise Me' probe that retries up to 12 candidate genres before committing.",
      'Rate-limit-aware request queue and multi-market filtering across NA, EU, and APAC.',
      'Mixpanel analytics; deployed on Vercel with automatic OAuth token refresh before expiry.',
    ],
    link: 'https://spotify-indie.vercel.app/',
    accent: '#FF1FA0',
    accentFg: '#ECEAE3',
  },
  {
    id: 'finanseer',
    title: 'Finanseer',
    year: '2023',
    category: 'Full-Stack / MERN',
    stack: ['React', 'Node', 'MongoDB', 'Recharts'],
    blurb:
      'A full-stack personal-finance dashboard for tracking expenses, income, and budgets - interactive charts, KPIs, and month-over-month trend analysis over a RESTful Node/Express + MongoDB API.',
    role: 'Solo',
    overview:
      'A full-stack personal-finance dashboard (MERN) for tracking expenses, income, and budgets at a glance.',
    highlights: [
      'Interactive charts, KPIs, and month-over-month trend analysis.',
      'RESTful Node/Express API with MongoDB persistence.',
      'Reusable Material UI component system.',
      'Recharts-driven visualizations, deployed on Netlify.',
    ],
    link: 'https://finanseer.netlify.app/',
    accent: '#FFD400',
    accentFg: '#0A0A0A',
  },
];
