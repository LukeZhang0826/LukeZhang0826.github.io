export type Discipline = 'dev' | '3d' | 'design' | 'architecture' | 'music';

export type Experience = {
  company: string;
  /** short descriptor of what the company is */
  companyNote: string;
  /** company website - omitted where the correct URL isn't verified */
  url?: string;
  role: string;
  /** what Luke was to the company - team / seniority (shown collapsed) */
  summary: string;
  start: string;
  end: string;
  location: string;
  /** full detail, revealed on expand */
  bullets: string[];
  tags: string[];
  /** which section this role belongs to */
  discipline: Discipline;
};

/**
 * Source of truth: ../Resume/luke-zhang-resume + Luke's LinkedIn. Ordered most-recent
 * first. `discipline` routes roles to their section: 'dev' renders in Development,
 * the rest are reserved for 3D / Graphic / Music.
 */
export const EXPERIENCE: Experience[] = [
  {
    company: 'BitGo',
    companyNote: 'Digital-asset trust & security - safeguarding $100B+ in assets',
    url: 'https://www.bitgo.com',
    role: 'Software Engineer Intern',
    summary:
      'Software engineer on the CaaS (Crypto-as-a-Service) team, building institutional onboarding and hardening platform security.',
    start: 'May 2026',
    end: 'Present',
    location: 'Toronto, ON',
    bullets: [
      'Shipped a self-serve admin onboarding invites page on bitgo-retail for nearly 100 institutional CaaS clients, replacing manual CSM onboarding with a four-eyes approval flow and automated email notifications while consolidating duplicate onboarding paths across the CaaS and Custody Services teams onto a single platform.',
      'Built a customers page on the new CaaS dashboard enabling clients to track child-enterprise KYC/KYB verification, product onboarding status, and balances across NA, EU, and APAC compliance regimes.',
      'Untangled shared pending-approval and policy logic between the CaaS and Custody Services platforms, introducing feature flags to disambiguate endpoint and controller ownership across five frontend and backend surfaces.',
      'Discovered and remediated an authentication vulnerability where unauthenticated internal endpoints were exposed through the bitgo-retail BFF, closing a proxy path that let external callers reach intra-cluster services.',
    ],
    tags: ['React', 'TypeScript', 'BFF', 'Security'],
    discipline: 'dev',
  },
  {
    company: 'BitGo',
    companyNote: 'Digital-asset trust & security - safeguarding $100B+ in assets',
    url: 'https://www.bitgo.com',
    role: 'Software Engineer Intern',
    summary:
      'Software engineer on the CaaS team, leading the dashboard migration and helping architect the access-control model.',
    start: 'Sep 2025',
    end: 'Dec 2025',
    location: 'Toronto, ON',
    bullets: [
      "Led the migration of the legacy org.bitgo.com dashboard onto bitgo-retail, BitGo's modern source-of-truth platform, porting trades, transfers, webhooks, settings, and home surfaces and relaunching it as the CaaS dashboard where institutional clients monitor trade orders across the Go Accounts of every enterprise under their organization.",
      'Helped architect the CaaS access-control model spanning organization admins, enterprise admins, and parent/child enterprise hierarchies, defining how ownership and permissions propagate to institutional clients across the platform.',
      'Built and deployed a suite of REST APIs purpose-built for the service-user use case, alongside a virtualized, infinitely scrolling enterprise selector on the bitgo-ui and bitgo-retail frontends that cut P99 load times from minutes to under 500ms for large institutional clients.',
      'Refactored enterprise-access patterns across seven repositories, three of them production frontends, removing direct user.enterprises lookups that buckled for service users owning up to millions of enterprises and enabling sub-second enterprise resolution.',
    ],
    tags: ['React', 'REST', 'Access Control', 'Perf'],
    discipline: 'dev',
  },
  {
    company: 'Rakuten Kobo',
    companyNote: 'Global eBook & digital-reading leader - 40M+ users',
    url: 'https://www.kobo.com',
    role: 'Software Developer Intern',
    summary:
      'Developer on the Kobo Writing Life team - the self-publishing platform for independent authors.',
    start: 'Sep 2024',
    end: 'Apr 2025',
    location: 'Toronto, ON',
    bullets: [
      'Migrated all blogs from WordPress to Kobo’s centralized .NET-based CMS, increasing page views by 30%, reducing page latency, and lowering bounce rate by 20%.',
      'Developed a reusable QA testing SDK (QaServices) for .NET and Spring Boot, accelerating integration and end-to-end test creation and improving coverage by 40%.',
      'Integrated QaServices with Postman Flows to enable one-click manual testing workflows, reducing testing time by 80%.',
      'Migrated legacy frontend components from jQuery to React, improving maintainability and doubling EAA accessibility coverage.',
    ],
    tags: ['Kotlin', 'Java', '.NET', 'React'],
    discipline: 'dev',
  },
  {
    company: 'Azoma',
    companyNote: 'Generative-AI platform for e-commerce asset creation (formerly Ecomtent)',
    url: 'https://www.azoma.ai',
    role: 'Software Engineering Team Lead (Intern)',
    summary:
      'Founding engineer and software engineering team lead - an internship I helped scale from the ground up.',
    start: 'Jan 2024',
    end: 'Aug 2024',
    location: 'Toronto, ON',
    bullets: [
      'Led a team of six engineers to deliver an e-commerce analytics dashboard, contributing to a 1200% increase in MRR and supporting $2.2M in venture funding.',
      'Integrated generative AI microservices into a unified serverless full-stack platform using AWS Lambda, SageMaker, and Elastic Beanstalk, reducing customer churn by 30%.',
      'Re-architected the frontend using React, Vite, Tailwind, and Amplify, cutting CI/CD build and deployment time by 89% and reducing page load times by 66%.',
      'Automated serverless deployment pipelines using GitHub Actions, AWS SAM, and shell scripting, reducing first-time deployment time by 97%.',
    ],
    tags: ['React', 'AWS', 'GenAI', 'Leadership'],
    discipline: 'dev',
  },
  {
    company: 'Viva Wellness & Rehab',
    companyNote: 'Physical-therapy & wellness clinic in Toronto',
    url: 'https://vivawellnessrehab.com',
    role: 'Software Engineer Intern',
    summary:
      'Sole engineer and maintainer of their platform - throughout my term and after I left.',
    start: 'May 2023',
    end: 'Jul 2024',
    location: 'Toronto, ON',
    bullets: [
      'Reduced backend operating costs by 99.98% by migrating legacy infrastructure to a serverless AWS architecture, saving $2,800 annually.',
      'Built an online booking system using React FullCalendar, DynamoDB, and AWS Lambda, doubling the monthly active customer base to over 1,000 patients.',
      'Integrated a Strapi CMS and streamlined deployments with Docker and Kubernetes, reducing content update effort by 90%.',
      'Optimized frontend assets using lazy loading and S3, reducing page load times by 80% and improving SEO ranking by 40%.',
    ],
    tags: ['AWS', 'Lambda', 'DynamoDB', 'Docker'],
    discipline: 'dev',
  },
  {
    company: 'Clairify Education',
    companyNote: 'Education-technology venture',
    // url: TODO - confirm with Luke
    role: 'Technical Lead',
    summary:
      'Technical lead, building the MERN platform and steering engineering delivery.',
    start: 'Jun 2023',
    end: 'Apr 2024',
    location: 'Remote',
    bullets: [
      'Led engineering as technical lead, architecting and shipping a MERN-stack education platform.',
      'Drove project management and delivery across the product roadmap.',
    ],
    tags: ['MERN', 'React', 'Node', 'Leadership'],
    discipline: 'dev',
  },
  {
    company: 'EXO Insights',
    companyNote: 'VR / AR / MR simulation & data-visualization studio',
    // url: TODO - confirm with Luke
    role: '3D Modeler & Unity Developer Intern',
    summary:
      '3D modeler and Unity developer building immersive training simulations.',
    start: 'Sep 2022',
    end: 'Dec 2022',
    location: 'Kitchener, ON',
    bullets: [
      'Developed VR/MR Unity simulations in C# and Blender, cutting safety-training costs by an average of 76%.',
      'Engineered Python RESTful APIs with Flask, integrated into Unity (OOP) for real-time PostgreSQL data.',
      'Modeled 30+ low-poly 3D assets and 4 fully-rigged characters in Blender and Substance Painter from point clouds for VR/AR/MR scenes.',
      'Streamlined onboarding and workflow documentation in Jira and Confluence, boosting efficiency by 60%.',
    ],
    tags: ['Unity', 'C#', 'Blender', 'Flask'],
    discipline: '3d',
  },
  {
    company: 'SWON LLC',
    companyNote: 'Architecture & design consultancy',
    // url: TODO - confirm with Luke
    role: 'Architectural Engineering Consultant',
    summary:
      'Engineering consultant and designer working in structural tectonics and interior/massing design.',
    start: 'Jan 2022',
    end: 'Apr 2022',
    location: 'Toronto, ON',
    bullets: [
      'Designed and analyzed the structural tectonics of 4 architectural design proposals using physical models.',
      'Developed interior designs, massing studies, and building details for 6 residential and public buildings in Rhino, Enscape, and Lumion from site measurements.',
    ],
    tags: ['Rhino', 'Enscape', 'Lumion', 'Design'],
    discipline: 'architecture',
  },
  {
    company: 'KW Big Band Theory',
    companyNote: 'Kitchener–Waterloo big band',
    // url: TODO - confirm with Luke
    role: 'Performing Musician',
    summary:
      'Performing member of the Kitchener–Waterloo big-band scene across five seasons.',
    start: '2021',
    end: '2026',
    location: 'Waterloo, ON',
    bullets: [
      'Performed with KW Big Band Theory across the 2021–2026 seasons, covering brass, bass, and piano chairs as the book demanded.',
    ],
    tags: ['Big Band', 'Brass', 'Live'],
    discipline: 'music',
  },
  {
    company: 'KW Kool Swing Band',
    companyNote: 'Kitchener–Waterloo swing band',
    // url: TODO - confirm with Luke
    role: 'Performing Musician',
    summary:
      'Performing member of the Kitchener–Waterloo swing scene across five seasons.',
    start: '2021',
    end: '2026',
    location: 'Waterloo, ON',
    bullets: [
      'Performed with KW Kool Swing Band across the 2021–2026 seasons in the local swing and dance-band circuit.',
    ],
    tags: ['Swing', 'Brass', 'Live'],
    discipline: 'music',
  },
  {
    company: 'JAZZ.FM91',
    companyNote: "Canada's premier jazz radio station - 91.1 FM, Toronto",
    url: 'https://jazz.fm',
    role: 'Performing Artist',
    summary:
      'Performing artist, featured on-air and at station events.',
    start: 'Sep 2018',
    end: 'Aug 2021',
    location: 'Toronto, ON',
    bullets: [
      'Performed on-air and at JAZZ.FM91 events across a three-year tenure.',
    ],
    tags: ['Jazz', 'Brass', 'Performance'],
    discipline: 'music',
  },
];
