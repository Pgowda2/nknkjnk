export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; note: string; icon: string }[];
}

export interface StudentProject {
  id: string;
  title: string;
  gradeBand: string;
  platform: string;
  description: string;
  learningOutcomes: string[];
  techStack: string[];
  image: string;
  badge: string;
}

export interface GradeCurriculum {
  band: string;
  grades: string;
  ages: string;
  focus: string;
  description: string;
  tools: string[];
  keyMilestones: string[];
  sampleProject: string;
}

export const PERSONAL_INFO = {
  name: 'Aishwarya Gowda S R',
  role: 'Senior Coding Instructor & STEM Educator',
  subRoles: [
    'Online Coding Instructor (Grades 1–12)',
    'STEM Curriculum & Lesson Designer',
    'Python & Block-Based Coding Mentor',
    'AI/ML for Kids & App Inventor Specialist',
  ],
  tagline: 'Empowering young minds from Grades 1–12 with computational thinking, creativity, and real-world coding skills through engaging, project-based virtual classrooms.',
  availability: 'Available for Online Classes, 1-on-1 Mentorship & Curriculum Consultation',
  email: 'aishwaryagowda227@gmail.com',
  phone: '+91 83105 89119',
  location: 'Mysuru, Karnataka, India 570023',
  linkedin: 'https://www.linkedin.com/in/aishwarya-s-r-2806aa17b',
  codingal: 'https://www.codingal.com/@aishwaryagsr219/',
  avatar: '/aishwarya_profile.jpg',
  yearsExperience: '8+ Years',
  studentsTaught: '1,200+',
  classesDelivered: '4,500+',
  codingalClasses: '1,934+',
  codingalRating: '4.9★',
  retentionRate: '98%',
  aboutStory: `I am an experienced Coding Instructor with over 8 years of online teaching experience, dedicated to making programming intuitive, exciting, and empowering for students across Grades 1–12. My teaching covers a wide spectrum from visual block coding (Scratch, Code.org, EduBlocks, MIT App Inventor, Thunkable, and AI/ML for Kids) to text-based syntax (Python, Java, HTML5, CSS3, and JavaScript).

I believe coding is not just about syntax—it is a superpower for logical reasoning, resilience, and creative expression. By connecting theoretical concepts to hands-on game design, mobile app building, and real-world simulations, I help students transition from passive technology consumers into confident digital creators.

As an empathetic educator and strong communicator, I work closely with parents through structured progress tracking and regular Parent-Teacher Meetings (PTMs) to foster an inclusive, motivating learning journey tailored to each child's unique pace and curiosity.`,
  stats: [
    { label: 'Teaching Experience', value: '8+ Years' },
    { label: 'Student Age Range', value: 'Grades 1–12' },
    { label: 'Coding Platforms', value: '10+ EdTech' },
    { label: 'Parent Retention', value: '98%' },
  ],
};

export const CORE_COMPETENCIES = [
  'Online Coding Instruction',
  'STEM Education',
  'Curriculum & Lesson Planning',
  'Student Engagement',
  'Computational Thinking',
  'Project-Based Learning',
  'Classroom Management',
  'Parent Communication',
  'Student Progress Assessment',
  'Educational Technology',
  'Cross-Cultural Communication',
];

export const TECHNICAL_SKILLS_CATEGORIES: SkillCategory[] = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'Python', level: 95, note: 'Turtle graphics, OOP, algorithmic logic, data structures', icon: 'FileCode' },
      { name: 'Java', level: 88, note: 'Foundational syntax, classes, methods, problem solving', icon: 'Code' },
      { name: 'JavaScript', level: 88, note: 'Interactive web scripting, DOM, event handling', icon: 'Cpu' },
      { name: 'HTML5 & CSS3', level: 92, note: 'Semantic structure, styling, flexbox, kid-friendly web design', icon: 'Layout' },
    ],
  },
  {
    title: 'Coding Platforms & EdTech',
    skills: [
      { name: 'Scratch 3.0 & Scratch Jr', level: 98, note: 'Block logic, animation, game physics, broadcasts', icon: 'Blocks' },
      { name: 'Code.org', level: 95, note: 'Hour of Code, CS Fundamentals, Express Courses, App Lab', icon: 'Terminal' },
      { name: 'MIT App Inventor', level: 94, note: 'Mobile apps, sensors, cloud DB, block architecture', icon: 'Smartphone' },
      { name: 'Thunkable', level: 92, note: 'Cross-platform native apps, API integrations, UX design', icon: 'Smartphone' },
      { name: 'AI/ML for Kids', level: 90, note: 'Image/text model training, machine learning scratch blocks', icon: 'Sparkles' },
      { name: 'EduBlocks & Python Turtle', level: 92, note: 'Visual-to-text bridge, mathematical geometric art', icon: 'PenTool' },
    ],
  },
  {
    title: 'Virtual Teaching & EdTech Tools',
    skills: [
      { name: 'Virtual Classrooms', level: 96, note: 'Google Classroom, Google Meet, Zoom, Microsoft Teams', icon: 'Video' },
      { name: 'Development Tools', level: 90, note: 'Visual Studio Code, Replit, Python IDLE', icon: 'Laptop' },
      { name: 'Productivity Suites', level: 95, note: 'Google Workspace, Microsoft Office Suite', icon: 'FileText' },
    ],
  },
];

export const PROFESSIONAL_EXPERIENCE = [
  {
    id: 'codingal',
    role: 'Coding Instructor',
    company: 'Codingal',
    duration: 'Mar 2025 – Present',
    status: 'Present',
    type: 'Full-time / Lead Online Instructor',
    location: 'Virtual Classroom (Global & India)',
    highlight: 'Grades 1–12 Live Personalized Coding & STEM Mentorship',
    profileUrl: 'https://www.codingal.com/@aishwaryagsr219/',
    stats: {
      classesTaught: '1,934+',
      studentsTaught: '253+',
      rating: '4.9 / 5.0 (1,632+ Reviews)',
      punctuality: '99.8%',
      countries: '20+ Countries',
    },
    responsibilities: [
      'Deliver live online coding classes to students from Grades 1–12, adapting lessons to diverse learning styles and abilities.',
      'Teach Scratch, Python, HTML, CSS, JavaScript, Java, Code.org, MIT App Inventor, Thunkable, AI/ML for Kids, EduBlocks, and Python Turtle through engaging, project-based learning.',
      'Design interactive coding projects that strengthen computational thinking, logical reasoning, creativity, and problem-solving skills.',
      'Develop personalized lesson plans based on individual learning goals and academic progress.',
      'Conduct Parent-Teacher Meetings (PTMs), providing constructive feedback and actionable learning plans.',
      'Foster an engaging and inclusive virtual classroom environment, contributing to high student retention and satisfaction.',
    ],
    techStack: [
      'Python',
      'Scratch',
      'Java',
      'MIT App Inventor',
      'Thunkable',
      'AI/ML for Kids',
      'HTML/CSS',
      'JavaScript',
      'Code.org',
    ],
  },
  {
    id: 'byjus-futureschool',
    role: 'Coding Instructor',
    company: "BYJU'S FutureSchool (WhiteHat Jr)",
    duration: 'Jul 2021 – Feb 2025',
    status: '3 yrs 8 mos',
    type: 'Senior Online Coding Educator',
    location: 'Virtual Classroom (India & International Markets)',
    highlight: 'Global Virtual Instruction Across India, US, UK, Australia & UAE',
    responsibilities: [
      'Delivered live online coding classes to students across India and international markets.',
      'Taught Scratch, Python, HTML, CSS, JavaScript, and foundational programming concepts using project-based learning.',
      'Customized lessons to accommodate different learning styles and skill levels from elementary to high school.',
      'Guided students from beginner to advanced programming through hands-on, end-to-end projects.',
      'Maintained high student engagement through interactive teaching strategies and continuous progress monitoring.',
      'Collaborated with parents to discuss student development and recommend tailored learning pathways.',
    ],
    techStack: [
      'Scratch',
      'Python',
      'JavaScript',
      'HTML5/CSS3',
      'Block Logic',
      'Game Design',
      'STEM Pedagogy',
    ],
  },
];

export const EDUCATION_DATA = [
  {
    id: 'mba',
    degree: 'Master of Business Administration (MBA)',
    specialization: 'Supply Chain Management',
    institution: 'B.N. Bahadur Institute of Management Sciences, Mysuru',
    location: 'Mysuru, Karnataka, India',
    period: 'Post-Graduate Degree',
    description: 'Developed advanced organizational leadership, project coordination, and structured communication methodologies that enhance student retention and institutional parent coordination.',
  },
  {
    id: 'be-eee',
    degree: 'Bachelor of Engineering (B.E.)',
    specialization: 'Electrical & Electronics Engineering',
    institution: 'GSSS Institute of Engineering & Technology for Women, Mysuru',
    location: 'Mysuru, Karnataka, India',
    period: 'Undergraduate Engineering Degree',
    description: 'Built a rigorous engineering mindset, circuit logic, systems thinking, and computational foundations that translate complex technical concepts into intuitive lessons for young learners.',
  },
];

export const LANGUAGES_DATA = [
  { language: 'English', proficiency: 'Professional Working Proficiency', level: '100%' },
  { language: 'Kannada', proficiency: 'Native Speaker', level: '100%' },
  { language: 'Hindi', proficiency: 'Conversational', level: '85%' },
];

export const GRADE_CURRICULA: GradeCurriculum[] = [
  {
    band: 'Grades 1 – 4',
    grades: 'Grades 1–4',
    ages: 'Ages 6 – 9',
    focus: 'Visual Logic, Storytelling & Block Mechanics',
    description: 'Students explore sequences, loops, conditions, and animations using drag-and-drop visual blocks without typing friction.',
    tools: ['Scratch Jr', 'Scratch 3.0', 'Code.org', 'EduBlocks'],
    keyMilestones: [
      'Understanding sequencing and coordinate axes (X, Y)',
      'Creating interactive animated storybooks',
      'Building arcade games with sprite collision and score counters',
      'Deconstructing problems into step-by-step logic',
    ],
    sampleProject: 'Space Dodger Arcade: Collision physics, health meter, and sound triggers',
  },
  {
    band: 'Grades 5 – 8',
    grades: 'Grades 5–8',
    ages: 'Ages 10 – 13',
    focus: 'Mobile App Architecture, AI Basics & Syntax Bridge',
    description: 'Students graduate to smartphone apps, machine learning models, and transitional block-to-Python text syntax.',
    tools: ['MIT App Inventor', 'Thunkable', 'AI/ML for Kids', 'Python Turtle'],
    keyMilestones: [
      'Designing functional mobile apps using phone sensors and camera',
      'Training machine learning models to detect images and sentiment',
      'Mathematical geometric art using Python Turtle and for-loops',
      'Introduction to variables, arrays, and conditional branches',
    ],
    sampleProject: 'Emergency Alert & Compass App built in MIT App Inventor',
  },
  {
    band: 'Grades 9 – 12',
    grades: 'Grades 9–12',
    ages: 'Ages 14 – 18',
    focus: 'Full Text Syntax, Data Structures & Real-World Projects',
    description: 'High school learners master industry languages like Python, Java, and modern Web technologies for academic and career readiness.',
    tools: ['Python 3', 'Java', 'HTML5 / CSS3 / JS', 'Replit', 'VS Code'],
    keyMilestones: [
      'Object-Oriented Programming (OOP): Classes, objects, methods',
      'Algorithmic problem solving and data handling',
      'Building interactive, responsive web applications',
      'Preparing for AP Computer Science, school exams, and STEM competitions',
    ],
    sampleProject: 'Interactive Expense Tracker & Quiz Engine in Python and Web JS',
  },
];

export const STUDENT_PROJECTS_SHOWCASE: StudentProject[] = [
  {
    id: 'p1',
    title: 'AI Smart Plant Doctor (Scratch + AI/ML for Kids)',
    gradeBand: 'Grades 5–7',
    platform: 'AI/ML for Kids & Scratch',
    description: 'A machine learning model trained on image samples of plant leaves to diagnose healthy vs. diseased foliage, giving tailored care tips.',
    learningOutcomes: [
      'Supervised machine learning basics',
      'Confidence score thresholds',
      'Dynamic sprite dialogue & interactive UI',
    ],
    techStack: ['AI/ML for Kids', 'Scratch 3.0', 'Vision Model'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    badge: 'AI & Robotics',
  },
  {
    id: 'p2',
    title: 'EcoTracker Mobile App (MIT App Inventor)',
    gradeBand: 'Grades 6–9',
    platform: 'MIT App Inventor',
    description: 'An Android application that allows students to log daily carbon footprint habits, scan barcodes, and earn eco-badges stored in CloudDB.',
    learningOutcomes: [
      'Mobile UI layout and navigation',
      'Local TinyDB and CloudDB storage',
      'Device camera integration',
    ],
    techStack: ['MIT App Inventor', 'CloudDB', 'Sensor APIs'],
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    badge: 'Mobile App',
  },
  {
    id: 'p3',
    title: 'Python Algorithmic Geometric Canvas',
    gradeBand: 'Grades 7–10',
    platform: 'Python Turtle & Replit',
    description: 'A visual coding program computing mathematical spirals, fractals, and kaleidoscopic mandalas using nested loops and RGB color math.',
    learningOutcomes: [
      'Nested loops and algorithmic iteration',
      'Geometric angles and trigonometric properties',
      'Function definition with dynamic parameters',
    ],
    techStack: ['Python', 'Turtle Graphics', 'Math Modules'],
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    badge: 'Python Programming',
  },
  {
    id: 'p4',
    title: 'Galactic Defense Arcade Game',
    gradeBand: 'Grades 3–6',
    platform: 'Scratch 3.0',
    description: 'A space adventure game with smooth arrow key navigation, asteroid physics, laser velocity calculation, and multiple boss difficulty levels.',
    learningOutcomes: [
      'Cartesian coordinate movement (dx, dy)',
      'Broadcast messaging and event handlers',
      'Variable state tracking (score, lives, game over)',
    ],
    techStack: ['Scratch 3.0', 'Game Mechanics', 'Sound FX'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    badge: 'Game Design',
  },
  {
    id: 'p5',
    title: 'Interactive Periodic Table & Science Quiz',
    gradeBand: 'Grades 8–12',
    platform: 'HTML5, CSS3 & JavaScript',
    description: 'A responsive web application displaying element cards with modal overlays, element filters, and a timed scoring quiz test.',
    learningOutcomes: [
      'DOM manipulation and JSON data rendering',
      'CSS Grid layouts and media queries',
      'State-driven quiz evaluation logic',
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'DOM API'],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    badge: 'Web Development',
  },
  {
    id: 'p6',
    title: 'Java Student Grade Calculator & Report Generator',
    gradeBand: 'Grades 10–12',
    platform: 'Java & VS Code',
    description: 'A console and GUI Java program implementing OOP principles to calculate grade percentiles, generate statistics, and export student summaries.',
    learningOutcomes: [
      'Object-Oriented Programming (Classes, Methods, Encapsulation)',
      'Array manipulation and sorting algorithms',
      'Exception handling and clean code structure',
    ],
    techStack: ['Java', 'OOP', 'Data Structures'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    badge: 'Java Fundamentals',
  },
];

export const TEACHING_PHILOSOPHY = [
  {
    step: '01',
    title: 'Spark Genuine Curiosity',
    description: 'Start every lesson with real-world questions: "How does YouTube recommend videos?" or "How does Mario know when he hits an obstacle?" Connect code to what kids already love.',
  },
  {
    step: '02',
    title: 'Deconstruct Into Micro-Steps',
    description: 'Complex programming challenges are broken into small, approachable milestones so students experience quick wins without overwhelming cognitive fatigue.',
  },
  {
    step: '03',
    title: 'Active Coding Over Passive Watching',
    description: 'Students code 80% of every session. I provide live guidance, pair debugging, and instant hints while encouraging them to test hypotheses independently.',
  },
  {
    step: '04',
    title: 'Celebrate Creative Ownership',
    description: 'Every project includes a "make it your own" phase where learners customize sprite graphics, game rules, and features, fostering genuine ownership.',
  },
  {
    step: '05',
    title: 'Transparent Parent Partnership',
    description: 'Regular Parent-Teacher Meetings (PTMs) and written progress summaries ensure parents know exactly which concepts were mastered and the child’s next learning roadmap.',
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: 't1',
    name: 'Priya & Rajesh Sharma',
    relationship: 'Parents of Rohan (Grade 5, Bangalore)',
    quote: 'Aishwarya has a rare gift for patience. Rohan used to get easily frustrated by errors, but under her guidance in Scratch and Python Turtle, he now views bugs as puzzles to solve. He recently built his own maze game and couldn’t stop showing it to everyone!',
    rating: 5,
    tag: 'Scratch & Python Basics',
  },
  {
    id: 't2',
    name: 'Sarah Jenkins',
    relationship: 'Mother of Liam (Grade 8, London, UK)',
    quote: 'Liam has been taking online coding classes with Aishwarya for over a year. She transitioned him smoothly from block coding to Python and MIT App Inventor. Her PTM updates are thorough and actionable. We couldn’t ask for a better mentor.',
    rating: 5,
    tag: 'Python & App Inventor',
  },
  {
    id: 't3',
    name: 'Dr. Anita Nair',
    relationship: 'Mother of Ananya (Grade 10, Dubai, UAE)',
    quote: 'Aishwarya made Java and computer science fundamentals clear and approachable for Ananya’s high school curriculum. Her engineering background really shows in how she explains logic systematically. Ananya’s confidence skyrocketed.',
    rating: 5,
    tag: 'High School Java & Web',
  },
  {
    id: 't4',
    name: 'Vikram Mehta',
    relationship: 'Father of Aryan (Grade 3, New Delhi)',
    quote: 'Finding an instructor who can hold an 8-year-old’s attention online for an hour is almost impossible. Aishwarya keeps every minute engaging with games, animations, and interactive stories on Code.org and Scratch. Aryan counts down the days until his next class!',
    rating: 5,
    tag: 'Early Coders (Grade 1–4)',
  },
];

export const FAQ_DATA = [
  {
    q: 'What age groups and grades does Aishwarya teach?',
    a: 'Aishwarya teaches students from Grades 1 to 12 (typically ages 6 to 18), tailoring curriculum specifically for early visual learners (Grades 1–4), intermediate app/game creators (Grades 5–8), and high school syntax learners (Grades 9–12).',
  },
  {
    q: 'Does my child need any prior coding experience?',
    a: 'Not at all! Every course begins with an initial assessment to place the student at their comfortable baseline—whether starting from complete scratch with drag-and-drop blocks or advancing straight into Python and Java.',
  },
  {
    q: 'How are virtual classes conducted?',
    a: 'Classes are conducted 1-on-1 or in small interactive cohorts using Google Meet, Zoom, or Microsoft Teams with screen sharing, collaborative coding platforms (Replit, Scratch, Code.org), and interactive whiteboard sessions.',
  },
  {
    q: 'How are parents kept in the loop regarding student progress?',
    a: 'Detailed progress reports are shared after each curriculum milestone, complemented by scheduled Parent-Teacher Meetings (PTMs) to review completed student projects and discuss personalized learning pathways.',
  },
];
