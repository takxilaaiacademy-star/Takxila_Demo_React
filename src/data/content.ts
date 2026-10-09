export const FAQ: [question: string, answer: string][] = [
  ['Is the WhatsApp agent course really free?', 'Yes. AI Agent for Bulk WhatsApp Messaging is a free 30-minute course. Enroll and it appears in My courses straight away.'],
  ['Do I need experience to start?', 'No. The mastery courses and the AI Ready Challenge run from beginner to advanced.'],
  ['Who is the Junior AI Challenge for?', 'Kids aged 8 to 12. It has 28 hands-on AI missions and is taught in regional language.'],
  ['Where do I find my courses after enrolling?', 'Under My courses and on your Dashboard, with a progress bar for each course.'],
];

// Course Finder on the home page: persona -> best first course
export const PERSONAS: [id: string, label: string, courseId: string][] = [
  ['pro', 'Working professional', 'ready'],
  ['biz', 'Business owner', 'wa-mastery'],
  ['parent', 'Parent of an 8–12 year old', 'junior'],
  ['dev', 'Developer or builder', 'agentic'],
  ['new', 'Just curious', 'wa-agent'],
];

export const STEPS: [num: string, title: string, text: string][] = [
  ['01', 'Learn', 'Step by step practical courses, from beginner to advanced.'],
  ['02', 'Practice', 'Hands-on projects with the real tools: n8n, LangChain, Claude AI and more.'],
  ['03', 'Build', 'Ship agents and automations you can use in your work and business.'],
  ['04', 'Grow', 'Track every course on your dashboard through to 100% complete.'],
];

export const TOOLS: string[] = ['AI Agents', 'n8n', 'LangChain', 'LangGraph', 'CrewAI', 'AutoGen', 'Claude AI', 'Scratch', 'WhatsApp Business'];
