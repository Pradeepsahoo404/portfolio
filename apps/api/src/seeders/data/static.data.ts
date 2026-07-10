export const PROJECT_CATEGORIES = [
  { name: "Web Applications", color: "#3b82f6" },
  { name: "Mobile Apps", color: "#8b5cf6" },
  { name: "UI/UX Design", color: "#ec4899" },
  { name: "E-Commerce", color: "#f59e0b" },
  { name: "SaaS Platforms", color: "#10b981" },
  { name: "Open Source", color: "#6366f1" },
  { name: "Enterprise", color: "#64748b" },
  { name: "Landing Pages", color: "#14b8a6" },
];

export const BLOG_CATEGORIES = [
  { name: "Web Development", color: "#3b82f6" },
  { name: "Career Growth", color: "#8b5cf6" },
  { name: "Tutorials", color: "#10b981" },
  { name: "Architecture", color: "#f59e0b" },
  { name: "DevOps", color: "#6366f1" },
  { name: "Design Systems", color: "#ec4899" },
];

export const BLOG_TAGS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "MongoDB",
  "GraphQL", "AWS", "Docker", "Performance", "Security", "Testing",
  "CSS", "Tailwind", "API Design",
];

export const TECHNOLOGIES = [
  { name: "React", category: "Frontend", color: "#61dafb", website: "https://react.dev" },
  { name: "Next.js", category: "Frontend", color: "#000000", website: "https://nextjs.org" },
  { name: "TypeScript", category: "Language", color: "#3178c6", website: "https://typescriptlang.org" },
  { name: "Node.js", category: "Backend", color: "#339933", website: "https://nodejs.org" },
  { name: "Express.js", category: "Backend", color: "#000000", website: "https://expressjs.com" },
  { name: "MongoDB", category: "Database", color: "#47A248", website: "https://mongodb.com" },
  { name: "PostgreSQL", category: "Database", color: "#4169E1", website: "https://postgresql.org" },
  { name: "Redis", category: "Database", color: "#DC382D", website: "https://redis.io" },
  { name: "GraphQL", category: "API", color: "#E10098", website: "https://graphql.org" },
  { name: "Docker", category: "DevOps", color: "#2496ED", website: "https://docker.com" },
  { name: "AWS", category: "Cloud", color: "#FF9900", website: "https://aws.amazon.com" },
  { name: "Tailwind CSS", category: "Frontend", color: "#06B6D4", website: "https://tailwindcss.com" },
  { name: "Framer Motion", category: "Frontend", color: "#0055FF", website: "https://framer.com/motion" },
  { name: "Prisma", category: "ORM", color: "#2D3748", website: "https://prisma.io" },
  { name: "Vue.js", category: "Frontend", color: "#4FC08D", website: "https://vuejs.org" },
  { name: "Python", category: "Language", color: "#3776AB", website: "https://python.org" },
  { name: "Kubernetes", category: "DevOps", color: "#326CE5", website: "https://kubernetes.io" },
  { name: "Figma", category: "Design", color: "#F24E1E", website: "https://figma.com" },
  { name: "Stripe", category: "Payments", color: "#635BFF", website: "https://stripe.com" },
  { name: "Socket.io", category: "Realtime", color: "#010101", website: "https://socket.io" },
];

export const CLIENTS = [
  { name: "TechVenture Inc", industry: "Technology" },
  { name: "GreenLeaf Organics", industry: "E-Commerce" },
  { name: "FinEdge Capital", industry: "Finance" },
  { name: "HealthPulse", industry: "Healthcare" },
  { name: "EduSpark Learning", industry: "Education" },
  { name: "UrbanNest Realty", industry: "Real Estate" },
  { name: "CloudNine SaaS", industry: "Software" },
  { name: "Artisan Coffee Co", industry: "Food & Beverage" },
  { name: "MotionDrive Motors", industry: "Automotive" },
  { name: "PixelPerfect Agency", industry: "Marketing" },
  { name: "DataStream Analytics", industry: "Data" },
  { name: "WellnessHub", industry: "Health & Fitness" },
  { name: "LegalEdge Partners", industry: "Legal" },
  { name: "TravelNova", industry: "Travel" },
  { name: "BuildRight Construction", industry: "Construction" },
  { name: "StyleVault Fashion", industry: "Fashion" },
  { name: "GameForge Studios", industry: "Gaming" },
  { name: "AgriSmart Solutions", industry: "Agriculture" },
  { name: "MediaPulse Digital", industry: "Media" },
  { name: "SecureNet Systems", industry: "Cybersecurity" },
];

export const SKILL_CATEGORIES = [
  "Frontend", "Backend", "Database", "DevOps", "Cloud", "Mobile",
  "Design", "Testing", "Architecture", "Soft Skills", "Tools", "Security",
];

export const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  Frontend: [
    "React", "Next.js", "Vue.js", "Angular", "Svelte", "HTML5", "CSS3",
    "Tailwind CSS", "Sass/SCSS", "Framer Motion", "GSAP", "Webpack", "Vite",
    "Responsive Design", "Accessibility (WCAG)", "Progressive Web Apps",
  ],
  Backend: [
    "Node.js", "Express.js", "NestJS", "Python", "Django", "FastAPI",
    "GraphQL", "REST API Design", "Microservices", "WebSockets", "gRPC",
    "Message Queues", "Serverless Functions",
  ],
  Database: [
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch",
    "Database Design", "Query Optimization", "Mongoose", "Prisma", "SQL",
  ],
  DevOps: [
    "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Jenkins",
    "Terraform", "Nginx", "Linux Administration", "Monitoring", "Logging",
  ],
  Cloud: [
    "AWS", "Google Cloud", "Azure", "Vercel", "Cloudinary", "S3",
    "Lambda", "EC2", "CloudFront", "Route 53",
  ],
  Mobile: [
    "React Native", "Flutter", "iOS Development", "Android Development",
    "Expo", "Mobile UI Design",
  ],
  Design: [
    "Figma", "Adobe XD", "UI Design", "UX Research", "Design Systems",
    "Prototyping", "Wireframing", "Brand Identity",
  ],
  Testing: [
    "Jest", "Vitest", "Cypress", "Playwright", "Unit Testing",
    "Integration Testing", "E2E Testing", "TDD",
  ],
  Architecture: [
    "System Design", "Clean Architecture", "Domain-Driven Design",
    "Event-Driven Architecture", "Scalability Patterns", "SOLID Principles",
  ],
  "Soft Skills": [
    "Team Leadership", "Communication", "Problem Solving", "Agile/Scrum",
    "Project Management", "Mentoring", "Client Relations", "Time Management",
  ],
  Tools: [
    "Git", "GitHub", "VS Code", "Postman", "Jira", "Notion", "Slack",
    "npm/pnpm", "Turborepo",
  ],
  Security: [
    "JWT Authentication", "OAuth 2.0", "HTTPS/TLS", "OWASP", "Rate Limiting",
    "Input Validation", "CORS", "Helmet.js",
  ],
};

export const SERVICES = [
  {
    title: "Full-Stack Web Development",
    shortDescription: "End-to-end web applications with modern stacks",
    features: ["Custom architecture", "API development", "Database design", "Deployment"],
  },
  {
    title: "React & Next.js Development",
    shortDescription: "High-performance frontend applications",
    features: ["SSR/SSG", "Component libraries", "State management", "Performance optimization"],
  },
  {
    title: "UI/UX Design",
    shortDescription: "Beautiful, user-centered interface design",
    features: ["Wireframes", "Prototypes", "Design systems", "User research"],
  },
  {
    title: "API Development",
    shortDescription: "Scalable REST and GraphQL APIs",
    features: ["RESTful design", "GraphQL schemas", "Documentation", "Versioning"],
  },
  {
    title: "E-Commerce Solutions",
    shortDescription: "Online stores that convert visitors to customers",
    features: ["Product catalogs", "Payment integration", "Inventory management", "Analytics"],
  },
  {
    title: "SaaS Product Development",
    shortDescription: "Multi-tenant SaaS platforms from MVP to scale",
    features: ["Subscription billing", "User management", "Analytics dashboard", "Admin panels"],
  },
  {
    title: "Mobile App Development",
    shortDescription: "Cross-platform mobile applications",
    features: ["React Native", "Push notifications", "Offline support", "App store deployment"],
  },
  {
    title: "DevOps & Cloud Infrastructure",
    shortDescription: "Reliable deployment and infrastructure automation",
    features: ["CI/CD pipelines", "Docker/Kubernetes", "AWS setup", "Monitoring"],
  },
  {
    title: "Performance Optimization",
    shortDescription: "Make your applications blazing fast",
    features: ["Core Web Vitals", "Bundle optimization", "Caching strategies", "CDN setup"],
  },
  {
    title: "Technical Consulting",
    shortDescription: "Expert guidance on architecture and technology decisions",
    features: ["Code audits", "Architecture review", "Tech stack selection", "Team training"],
  },
  {
    title: "CMS Development",
    shortDescription: "Custom content management systems",
    features: ["Headless CMS", "Media management", "Role-based access", "SEO tools"],
  },
  {
    title: "Database Design & Migration",
    shortDescription: "Efficient data modeling and seamless migrations",
    features: ["Schema design", "Query optimization", "Data migration", "Backup strategies"],
  },
  {
    title: "Authentication Systems",
    shortDescription: "Secure user authentication and authorization",
    features: ["JWT/OAuth", "SSO integration", "RBAC", "Multi-factor auth"],
  },
  {
    title: "Real-time Applications",
    shortDescription: "Live chat, notifications, and collaborative tools",
    features: ["WebSockets", "Socket.io", "Live updates", "Presence detection"],
  },
  {
    title: "Landing Page Design",
    shortDescription: "High-converting landing pages for products and campaigns",
    features: ["A/B testing ready", "Animation", "Mobile-first", "Analytics integration"],
  },
  {
    title: "WordPress to Headless Migration",
    shortDescription: "Modernize legacy WordPress sites to JAMstack",
    features: ["Content migration", "URL preservation", "SEO retention", "Performance boost"],
  },
  {
    title: "Portfolio & Agency Websites",
    shortDescription: "Stunning portfolio sites that showcase your work",
    features: ["Custom animations", "CMS integration", "Contact forms", "SEO optimized"],
  },
  {
    title: "Code Review & Refactoring",
    shortDescription: "Improve code quality and maintainability",
    features: ["Best practices", "Type safety", "Test coverage", "Documentation"],
  },
  {
    title: "Maintenance & Support",
    shortDescription: "Ongoing support to keep your applications running smoothly",
    features: ["Bug fixes", "Security updates", "Feature additions", "24/7 monitoring"],
  },
  {
    title: "AI Integration",
    shortDescription: "Integrate AI capabilities into your products",
    features: ["OpenAI API", "Chatbots", "Content generation", "Recommendation engines"],
  },
];

export const PROJECT_TITLES = [
  "NovaCommerce Platform", "HealthTrack Dashboard", "FinLedger Analytics",
  "EduLearn LMS", "TravelBuddy App", "SmartHome IoT Hub", "CryptoVault Wallet",
  "FoodDash Delivery", "FitPulse Tracker", "LegalDocs Manager", "ArtGallery Online",
  "MusicStream Pro", "RealEstate Portal", "JobConnect Platform", "EventHub Planner",
  "ChatFlow Messenger", "CloudStore SaaS", "InvoiceGen Pro", "TaskMaster PM",
  "BlogCraft CMS", "PhotoEdit Studio", "WeatherNow API", "StockAlert Trading",
  "PetCare Booking", "GreenEnergy Monitor", "AutoParts Marketplace", "MindfulMe Meditation",
  "RecipeBox Social", "FleetTrack Logistics", "SurveyPro Analytics", "HRPortal Suite",
  "CodeReview Tool", "DevPortfolio Builder", "API Gateway Manager", "DataViz Dashboard",
  "SocialScheduler", "EmailCraft Campaigns", "VideoStream Platform", "PodcastHub",
  "BookingEngine Pro", "InventoryMaster", "CustomerCRM Plus", "SupportDesk Help",
  "AnalyticsEngine", "PaymentFlow Checkout", "DocumentSigner", "TeamCollab Workspace",
  "MarketResearch Tool", "AIDocGenerator", "SmartCalendar App",
];

export const BLOG_TITLES = [
  "Building Scalable APIs with Node.js and Express",
  "Mastering React Server Components in Next.js 15",
  "MongoDB Aggregation Pipelines: A Complete Guide",
  "Clean Architecture Patterns for SaaS Applications",
  "Optimizing Core Web Vitals for Portfolio Sites",
  "JWT vs Session Auth: Choosing the Right Approach",
  "TypeScript Best Practices for Large Codebases",
  "Deploying Node.js Apps on AWS with Docker",
  "Design Systems That Scale Across Teams",
  "GraphQL vs REST: When to Use Each",
  "Implementing RBAC in Multi-Tenant Applications",
  "Framer Motion Animation Patterns for the Web",
  "Database Indexing Strategies for Performance",
  "Building a Headless CMS from Scratch",
  "Microservices vs Monolith: A Practical Comparison",
  "Testing Strategies for Full-Stack Applications",
  "SEO Best Practices for Next.js Applications",
  "Real-time Features with Socket.io and Redis",
  "Secure File Uploads with Cloudinary and Multer",
  "Career Tips for Senior Full-Stack Developers",
  "State Management in Modern React Applications",
  "CI/CD Pipelines with GitHub Actions",
  "Accessibility Guidelines for Web Developers",
  "Building Email Systems with Nodemailer",
  "Rate Limiting and Security Middleware in Express",
  "From Junior to Lead: My Development Journey",
  "Monorepo Setup with Turborepo and pnpm",
  "Caching Strategies for High-Traffic APIs",
  "Building Portfolio Sites That Get You Hired",
  "Event-Driven Architecture with Message Queues",
];

export const TESTIMONIAL_AUTHORS = [
  { name: "Sarah Chen", role: "CEO, TechVenture Inc" },
  { name: "Michael Rodriguez", role: "CTO, GreenLeaf Organics" },
  { name: "Emily Watson", role: "Product Manager, FinEdge Capital" },
  { name: "David Kim", role: "Founder, HealthPulse" },
  { name: "Lisa Thompson", role: "Director, EduSpark Learning" },
  { name: "James Wilson", role: "VP Engineering, CloudNine SaaS" },
  { name: "Anna Petrov", role: "Marketing Head, PixelPerfect Agency" },
  { name: "Robert Garcia", role: "COO, DataStream Analytics" },
  { name: "Jennifer Lee", role: "Design Lead, StyleVault Fashion" },
  { name: "Chris Anderson", role: "Founder, SecureNet Systems" },
];

export const TESTIMONIAL_CONTENT = [
  "Alex delivered an exceptional platform that exceeded our expectations. The attention to detail and performance optimization was outstanding.",
  "Working with Alex was seamless from start to finish. Our e-commerce conversion rate increased by 40% after the redesign.",
  "The most professional developer we've worked with. Complex financial dashboards delivered on time and under budget.",
  "Alex transformed our healthcare platform with modern architecture. Patient engagement improved significantly.",
  "Our learning management system is now fast, scalable, and beautiful. Students and teachers love the new experience.",
  "From MVP to production-ready SaaS in record time. Alex's full-stack expertise was invaluable to our startup.",
  "The portfolio site Alex built for our agency has generated more leads than any campaign we've run. Highly recommended.",
  "Data visualization dashboards that actually make sense. Our team makes better decisions thanks to Alex's work.",
  "Stunning design combined with rock-solid engineering. Our fashion brand's online presence has never been stronger.",
  "Security-first approach that gave us confidence in our platform. Alex is our go-to for all critical projects.",
];

export const SOCIAL_LINKS = [
  { platform: "github", label: "GitHub", url: "https://github.com/alexmorgan" },
  { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/alexmorgan" },
  { platform: "twitter", label: "Twitter", url: "https://twitter.com/alexmorgandev" },
  { platform: "dribbble", label: "Dribbble", url: "https://dribbble.com/alexmorgan" },
  { platform: "youtube", label: "YouTube", url: "https://youtube.com/@alexmorgandev" },
  { platform: "website", label: "Website", url: "https://alexmorgan.dev" },
];
