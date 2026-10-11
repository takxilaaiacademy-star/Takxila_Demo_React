// What is inside each course: the course page shows this as "What you'll learn", "Course content",
// "Requirements", "Description" and "Who this course is for".
//
// HOW TO EDIT: find the course by its id (the same id as in courses.ts) and change the text.
// - sections: each section has a title and a list of lectures as ["Lecture title", minutes].
//   The section count, lecture count and total length on the page are worked out from these.
// - Keep the quotes and commas as they are; `npm run build` will tell you if something is off.
// This file is loaded only when a course page opens, so it does not slow down the rest of the site.

export interface CourseSection {
  title: string;
  lectures: [title: string, minutes: number][];
}

export interface CourseContent {
  /** One line under the title */
  subtitle: string;
  /** "What you'll learn" */
  learn: string[];
  sections: CourseSection[];
  requirements: string[];
  /** "Who this course is for" */
  audience: string[];
  /** Paragraphs of the description */
  description: string[];
}

export const CONTENT: Record<string, CourseContent> = {
  "claude-7": {
    "subtitle": "Seven daily hands-on missions that take you from your first Claude chat to building a website and a working app with Claude Code.",
    "learn": [
      "Write clear Claude prompts using role, context, task and output format",
      "Use Claude's extended thinking to work through complex decisions step by step",
      "Research current topics with Claude web search and check every cited source",
      "Organise long-running work in Claude Projects with your own files and instructions",
      "Analyse PDFs and spreadsheets and turn the findings into shareable artifacts",
      "Delegate multi-step file and folder tasks to Claude Cowork safely",
      "Build and refine a simple website with Claude Code from a plain-English brief",
      "Plan, build and test a small functional app with Claude Code"
    ],
    "sections": [
      {
        "title": "Day 1: Getting Started with Claude Chat",
        "lectures": [
          ["Welcome and how the 7-day challenge works", 5],
          ["Setting up Claude and touring the interface", 10],
          ["Prompting basics: role, context, task and format", 15],
          ["Mission 1: rewrite a real work email with Claude", 15]
        ]
      },
      {
        "title": "Day 2: Thinking Mode and Smarter Prompts",
        "lectures": [
          ["Introduction: when deeper reasoning helps", 5],
          ["Using extended thinking for complex problems", 15],
          ["Iterating: follow-ups, critiques and rewrites", 10],
          ["Mission 2: plan a real decision with Claude", 15]
        ]
      },
      {
        "title": "Day 3: Research with Web Search",
        "lectures": [
          ["Turning on web search and reading citations", 10],
          ["Verifying sources and spotting weak answers", 10],
          ["Comparing options with tables and summaries", 10],
          ["Mission 3: build a one-page research brief", 15]
        ]
      },
      {
        "title": "Day 4: Files, Projects and Artifacts",
        "lectures": [
          ["Claude Projects: shared files and custom instructions", 10],
          ["Analysing PDFs and spreadsheets", 15],
          ["Creating documents and visuals as artifacts", 10],
          ["Mission 4: turn a report into a summary dashboard", 10]
        ]
      },
      {
        "title": "Day 5: Claude Cowork for Real Tasks",
        "lectures": [
          ["What Cowork is and how it works on desktop", 10],
          ["Delegating multi-step tasks across files and folders", 15],
          ["Permissions, checkpoints and reviewing the output", 10],
          ["Mission 5: organise a messy folder and write a summary", 10]
        ]
      },
      {
        "title": "Day 6: Build a Website with Claude Code",
        "lectures": [
          ["Installing Claude Code and terminal basics", 10],
          ["Writing a clear brief for your website", 10],
          ["Iterating on layout, content and styling", 15],
          ["Mission 6: preview and publish your website", 10]
        ]
      },
      {
        "title": "Day 7: Build a Functional App",
        "lectures": [
          ["Planning features and data for a small app", 10],
          ["Building the app step by step with Claude Code", 20],
          ["Testing, fixing bugs and adding polish", 10],
          ["Capstone review and your next steps with Claude", 5]
        ]
      }
    ],
    "requirements": [
      "A laptop or desktop with a stable internet connection",
      "A free Claude account; some features such as Cowork or Claude Code may need a paid plan",
      "No coding experience needed",
      "About 45 minutes a day for seven days"
    ],
    "audience": [
      "Professionals who want to use Claude confidently in daily work",
      "Business owners who want to build a simple website or tool without hiring a developer",
      "Students and job seekers who want practical, portfolio-ready AI skills",
      "Anyone who has tried chatbots casually and wants a structured path"
    ],
    "description": [
      "This free 7-day challenge turns Claude from a tool you try once into one you use every day. Each day has a short lesson and one practical mission, so by the end of the week you have built real habits and real outputs, not just watched videos.",
      "The first half of the week covers the foundations: clear prompting, extended thinking for harder problems, web search for current information, and Projects for keeping files and instructions in one place. Every mission uses your own work, such as an email, a decision you need to make, or a report you need to summarise.",
      "Day 5 introduces Claude Cowork, which lets Claude carry out multi-step tasks on files and folders on your computer. You will learn how to delegate a task, set sensible permissions and review what Claude did before you rely on it.",
      "Days 6 and 7 move into Claude Code. You will describe a website in plain English and refine it with Claude, then plan and build a small functional app, test it and fix problems. No prior coding is assumed; the focus is on giving clear instructions and checking results.",
      "By the end you will have a set of prompts you trust, a research brief, a website and a working app, plus a clear idea of which Claude feature to reach for in which situation. You can repeat any mission later with new material to keep building the habit."
    ]
  },
  "mastery-14": {
    "subtitle": "Fourteen days, thirteen AI platforms: one practical task a day across research, writing, analysis, creation, building and automation.",
    "learn": [
      "Apply a reusable prompt framework across ChatGPT, Claude and Gemini",
      "Research topics with Perplexity and verify answers against cited sources",
      "Analyse your own documents with NotebookLM and produce briefing notes",
      "Clean, summarise and chart spreadsheet data using ChatGPT data analysis",
      "Create on-brand images and social graphics with Midjourney and Canva AI",
      "Build a presentation deck from an outline in minutes using Gamma",
      "Generate a working website and a simple app from plain-English prompts",
      "Automate a repetitive task end to end with an AI workflow in n8n"
    ],
    "sections": [
      {
        "title": "Week 1: Research, Writing and Analysis",
        "lectures": [
          ["Day 1: Welcome, setup and the prompt framework in ChatGPT", 45],
          ["Day 2: Long-form writing and editing with Claude", 45],
          ["Day 3: Gemini for research inside Google Workspace", 45],
          ["Day 4: Cited research and fact-checking with Perplexity", 45],
          ["Day 5: Analysing your documents with NotebookLM", 45],
          ["Day 6: Spreadsheet analysis and charts with ChatGPT", 45],
          ["Day 7: Week 1 project: an AI-assisted research report", 45]
        ]
      },
      {
        "title": "Week 2: Creation, Building and Automation",
        "lectures": [
          ["Day 8: Image generation with Midjourney", 45],
          ["Day 9: Social graphics and design with Canva AI", 45],
          ["Day 10: Presentations from an outline with Gamma", 45],
          ["Day 11: Voiceovers and audio with ElevenLabs", 45],
          ["Day 12: Building a website and an app with Lovable", 45],
          ["Day 13: Automating a workflow with Zapier and n8n", 45],
          ["Day 14: Capstone: your personal AI workflow", 45]
        ]
      }
    ],
    "requirements": [
      "A laptop or desktop with internet access",
      "Free accounts on the tools covered; free tiers are enough for most tasks",
      "No technical or coding background required"
    ],
    "audience": [
      "Working professionals who want a broad, practical AI toolkit quickly",
      "Freelancers and creators who want to produce more in less time",
      "Small business owners who want to see where AI fits in their work",
      "Beginners who prefer daily structure over a long self-paced course"
    ],
    "description": [
      "The 14 Days AI Mastery Challenge gives you a fast, practical tour of thirteen AI platforms, with one focused task every day. Instead of reading about tools, you use each one on a real piece of work and keep the result.",
      "Week 1 is about thinking work: writing, research and analysis. You start with a prompt framework you can reuse anywhere, then apply it in ChatGPT, Claude and Gemini. You learn to research with citations in Perplexity, study your own documents in NotebookLM and analyse spreadsheets with ChatGPT. The week ends with a complete research report.",
      "Week 2 is about making and building. You create images in Midjourney, design graphics in Canva, turn an outline into a deck with Gamma and produce voiceovers with ElevenLabs. You then build a website and a simple app with Lovable and connect tools together with Zapier and n8n.",
      "Each day is designed to fit into about 45 minutes, so it works alongside a full-time job. The final day brings everything together into a personal AI workflow that you can keep using after the challenge ends. Short videos explain each tool, and every task uses your own work so the results are immediately useful."
    ]
  },
  "mastery-28": {
    "subtitle": "A 28-day guided path through 25+ AI tools for research, writing, design, video, productivity, marketing and automation.",
    "learn": [
      "Research faster with Perplexity, Gemini and NotebookLM while checking sources",
      "Draft, edit and repurpose content with ChatGPT and Claude",
      "Design social posts, thumbnails and brand visuals with Midjourney and Canva",
      "Produce short videos with AI video tools and AI voiceovers",
      "Organise your week with AI in Notion, Gmail and Google Calendar",
      "Plan and write a marketing campaign with AI from idea to calendar",
      "Connect apps and automate routine tasks using Zapier and n8n",
      "Combine several tools into one repeatable workflow for your work or business"
    ],
    "sections": [
      {
        "title": "Week 1: Research and Writing",
        "lectures": [
          ["Day 1: Welcome, setup and how to prompt well", 45],
          ["Day 2: Deep research with Perplexity", 45],
          ["Day 3: Gemini and NotebookLM for study and documents", 45],
          ["Day 4: Writing and editing with ChatGPT", 45],
          ["Day 5: Long documents and tone with Claude", 45],
          ["Day 6: Repurposing one idea into many formats", 45],
          ["Day 7: Week 1 project: a researched article", 45]
        ]
      },
      {
        "title": "Week 2: Design and Visuals",
        "lectures": [
          ["Day 8: Image prompting fundamentals", 45],
          ["Day 9: Midjourney styles and variations", 45],
          ["Day 10: Canva AI for social media design", 45],
          ["Day 11: Logos, brand kits and consistent visuals", 45],
          ["Day 12: Presentations with Gamma", 45],
          ["Day 13: Photo editing and background removal with AI", 45],
          ["Day 14: Week 2 project: a visual brand pack", 45]
        ]
      },
      {
        "title": "Week 3: Video, Audio and Productivity",
        "lectures": [
          ["Day 15: Short-form video scripting with AI", 45],
          ["Day 16: Text-to-video with Kling and Runway", 45],
          ["Day 17: AI avatars and presenters with HeyGen", 45],
          ["Day 18: Voiceovers and audio with ElevenLabs", 45],
          ["Day 19: Editing videos and captions with CapCut", 45],
          ["Day 20: AI for email, notes and meetings", 45],
          ["Day 21: Week 3 project: a 60-second explainer video", 45]
        ]
      },
      {
        "title": "Week 4: Marketing and Automation",
        "lectures": [
          ["Day 22: Marketing strategy and audience research with AI", 45],
          ["Day 23: Ad copy, landing pages and A/B ideas", 45],
          ["Day 24: Building a content calendar", 45],
          ["Day 25: Automation basics with Zapier", 45],
          ["Day 26: Building an AI workflow in n8n", 45],
          ["Day 27: AI chat assistants for customer questions", 45],
          ["Day 28: Capstone: your end-to-end AI system", 45]
        ]
      }
    ],
    "requirements": [
      "A computer with internet access",
      "Free accounts on the tools covered; some optional features need paid plans",
      "Around 45 minutes a day for 28 days"
    ],
    "audience": [
      "Professionals who want to master a wide range of AI tools in a structured month",
      "Marketers, creators and freelancers producing content regularly",
      "Business owners who want to save time on research, design and admin",
      "Beginners ready to move from occasional use to daily mastery"
    ],
    "description": [
      "This 28-day challenge is a structured month of AI practice. Every day introduces a tool or technique and ends with a short task, and every week ends with a project, so you finish with four finished pieces of work and the confidence to use more than 25 AI tools.",
      "Week 1 builds the core skills of research and writing with Perplexity, Gemini, NotebookLM, ChatGPT and Claude. Week 2 moves to design, covering Midjourney, Canva AI, Gamma and AI photo editing, so you can create consistent visuals for any brand.",
      "Week 3 covers video, audio and productivity: scripting, text-to-video with Kling and Runway, avatar videos with HeyGen, voiceovers with ElevenLabs and editing in CapCut, plus AI for email, notes and meetings. The week ends with a 60-second explainer video that you plan, generate, voice and edit yourself using these tools.",
      "Week 4 focuses on marketing and automation. You plan a campaign, write ad copy and build a content calendar, then connect your tools with Zapier and n8n and set up a simple AI assistant for customer questions. Each step is explained for beginners, so you do not need any previous automation or coding experience.",
      "The final capstone asks you to combine what you learned into one end-to-end system for your own job or business, which is the habit that makes AI genuinely useful over time. You will also have a clear list of the tools worth keeping in your routine and the prompts that work best for you."
    ]
  },
  "junior": {
    "subtitle": "28 fun, safe AI missions for kids aged 8 to 12, taught in their own language: quizzes, art, stories and real Scratch games.",
    "learn": [
      "Explain what AI is and how it is different from a human brain",
      "Follow simple rules for using AI safely with a parent nearby",
      "Ask Claude clear questions to learn, check homework ideas and explore topics",
      "Create illustrated short stories by planning characters, settings and endings",
      "Make quizzes on favourite subjects and test family and friends",
      "Use Scratch sprites, backdrops, motion and sound blocks with confidence",
      "Build a complete Scratch game with scores, levels and a winning screen",
      "Present a final project and explain how it was made"
    ],
    "sections": [
      {
        "title": "Week 1: Meet AI and Stay Safe",
        "lectures": [
          ["Day 1: Welcome! What is AI and where do we see it?", 30],
          ["Day 2: Being a safe and smart AI explorer", 30],
          ["Day 3: Talking to Claude: asking good questions", 30],
          ["Day 4: AI as a study buddy for school topics", 30],
          ["Day 5: Fact or fiction? Checking AI answers", 30],
          ["Day 6: Make your first AI quiz", 30],
          ["Day 7: Mission review and quiz show with family", 30]
        ]
      },
      {
        "title": "Week 2: Stories and Art with AI",
        "lectures": [
          ["Day 8: Planning a story: hero, place and problem", 30],
          ["Day 9: Writing a story together with Claude", 30],
          ["Day 10: Drawing characters from your story", 30],
          ["Day 11: Comic strips and story panels", 30],
          ["Day 12: Poems, riddles and jokes with AI", 30],
          ["Day 13: Making a mini storybook", 30],
          ["Day 14: Storytelling day: share your book", 30]
        ]
      },
      {
        "title": "Week 3: Scratch Coding Basics",
        "lectures": [
          ["Day 15: Hello Scratch: sprites, stage and blocks", 30],
          ["Day 16: Moving and animating sprites", 30],
          ["Day 17: Sounds, costumes and backdrops", 30],
          ["Day 18: Events and keyboard controls", 30],
          ["Day 19: Loops and if-then decisions", 30],
          ["Day 20: Variables: keeping score", 30],
          ["Day 21: Mini project: an animated greeting card", 30]
        ]
      },
      {
        "title": "Week 4: Build Your Own Game",
        "lectures": [
          ["Day 22: Planning a game idea with Claude", 30],
          ["Day 23: Building the player and the world", 30],
          ["Day 24: Adding enemies, coins and collisions", 30],
          ["Day 25: Levels, timers and a game-over screen", 30],
          ["Day 26: Fixing bugs and asking Claude for hints", 30],
          ["Day 27: Testing with friends and improving", 30],
          ["Day 28: Game showcase and certificate day", 30]
        ]
      }
    ],
    "requirements": [
      "A computer or laptop with internet access; a tablet works for most AI missions",
      "A parent or guardian to set up and supervise the AI account",
      "A free Scratch account (scratch.mit.edu)",
      "No coding experience needed"
    ],
    "audience": [
      "Children aged 8 to 12 who are curious about AI, games and creating things",
      "Parents who want a safe, guided introduction to AI for their child",
      "Kids who learn best in their regional language",
      "Schools and tutors looking for a ready-made AI and coding activity plan"
    ],
    "description": [
      "The 28 Days Junior AI Challenge is a playful, step-by-step introduction to AI and coding for children aged 8 to 12. Each day is a short hands-on mission of around 30 minutes, taught in the child's regional language so the ideas are easy to follow.",
      "Week 1 explains what AI is and how to use it safely. Children learn to ask Claude good questions with a parent nearby, check answers instead of trusting them blindly, and create their first quiz. Week 2 is all about creativity: planning stories, writing with AI help, drawing characters and making a mini storybook.",
      "In Weeks 3 and 4 children move into Scratch, the free block-based coding platform. They learn sprites, motion, sounds, loops, decisions and variables, then plan and build their own game with scores, levels and a game-over screen, using Claude for ideas and hints when they get stuck.",
      "Safety is built into every mission. AI accounts are set up and supervised by a parent, children never share personal details, and the focus is always on thinking for themselves with AI as a helper. The challenge ends with a showcase where each child presents their game."
    ]
  },
  "ready": {
    "subtitle": "Build practical AI skills in 28 days: research, writing, analysis, visuals, video, audio, marketing and automation for everyday work.",
    "learn": [
      "Use AI to research a topic quickly and present verified findings",
      "Write professional emails, reports and proposals with ChatGPT and Claude",
      "Analyse spreadsheets and turn numbers into clear charts and insights",
      "Summarise meetings, documents and long threads into action points",
      "Create visuals, presentations and short videos for work with AI tools",
      "Produce clean voiceovers and audio content with ElevenLabs",
      "Plan marketing content and campaigns with AI assistance",
      "Automate a repetitive work task using no-code AI workflows"
    ],
    "sections": [
      {
        "title": "Week 1: Research and Writing for Work",
        "lectures": [
          ["Day 1: Welcome, setup and the AI-ready mindset", 45],
          ["Day 2: Prompting for reliable work outputs", 45],
          ["Day 3: Fast research with Perplexity and Gemini", 45],
          ["Day 4: Professional emails and messages", 45],
          ["Day 5: Reports, proposals and SOPs with Claude", 45],
          ["Day 6: Editing, tone and proofreading with AI", 45],
          ["Day 7: Week 1 task: a research-backed proposal", 45]
        ]
      },
      {
        "title": "Week 2: Analysis and Productivity",
        "lectures": [
          ["Day 8: Spreadsheet analysis with ChatGPT", 45],
          ["Day 9: Formulas, cleaning and pivot ideas with AI", 45],
          ["Day 10: Charts and dashboards from raw data", 45],
          ["Day 11: Document Q&A with NotebookLM", 45],
          ["Day 12: Meetings, notes and action items", 45],
          ["Day 13: Planning your week with AI", 45],
          ["Day 14: Week 2 task: a data insights brief", 45]
        ]
      },
      {
        "title": "Week 3: Visuals, Video and Audio",
        "lectures": [
          ["Day 15: Image generation for work visuals", 45],
          ["Day 16: Presentations with Gamma and Canva", 45],
          ["Day 17: Infographics and social graphics", 45],
          ["Day 18: Short videos with AI video tools", 45],
          ["Day 19: AI avatars for training videos", 45],
          ["Day 20: Voiceovers and podcasts with ElevenLabs", 45],
          ["Day 21: Week 3 task: a presentation with video", 45]
        ]
      },
      {
        "title": "Week 4: Marketing and Automation",
        "lectures": [
          ["Day 22: Customer research and personas with AI", 45],
          ["Day 23: Social posts, captions and ad copy", 45],
          ["Day 24: Email campaigns and newsletters", 45],
          ["Day 25: Introduction to automation with Zapier", 45],
          ["Day 26: Building an AI workflow in n8n", 45],
          ["Day 27: Measuring results and improving prompts", 45],
          ["Day 28: Capstone: your AI-ready work system", 45]
        ]
      }
    ],
    "requirements": [
      "A laptop or desktop with internet access",
      "Free accounts on the tools covered",
      "Basic computer and spreadsheet familiarity is helpful but not required"
    ],
    "audience": [
      "Employees who want to work faster and stand out with AI skills",
      "Managers and team leads introducing AI into their teams",
      "Job seekers who want practical AI skills to show employers",
      "Self-employed professionals handling many tasks at once"
    ],
    "description": [
      "The 28-Day AI Ready Challenge is about one thing: changing how you work. Every day you apply AI to a realistic work task, so the skills transfer straight into your job instead of staying theoretical. Each mission takes about 45 minutes and uses examples from typical office, sales and management roles.",
      "Week 1 covers research and writing: prompting for reliable outputs, researching with Perplexity and Gemini, and writing emails, reports, proposals and SOPs with ChatGPT and Claude. Week 2 covers analysis and productivity, including spreadsheet analysis, charts, document Q&A in NotebookLM and turning meetings into action items.",
      "Week 3 adds visuals, video and audio. You create work visuals, build decks with Gamma and Canva, make short videos and avatar-led training clips, and record clean voiceovers with ElevenLabs. You will finish the week with a short presentation that includes your own AI-made visuals, video clip and narration.",
      "Week 4 focuses on marketing and automation: customer research, social and ad copy, email campaigns, and simple automations with Zapier and n8n. You also learn to review results and improve your prompts over time. No coding is needed for any of these automations, and each one is built step by step.",
      "Each week ends with a task you can show to your manager or add to your portfolio, and the final capstone helps you design a personal AI work system that you will keep using. You can repeat the daily tasks with new material whenever your role or tools change."
    ]
  },
  "n8n-agents": {
    "subtitle": "Build AI agents, voice agents, RAG chatbots and multi-agent systems in n8n, then package and sell them to real clients.",
    "learn": [
      "Build n8n workflows with triggers, nodes, expressions, credentials and error handling",
      "Create AI agents in n8n with chat models, memory and tools",
      "Write reliable system prompts and structured outputs using a 100+ prompt library",
      "Build RAG chatbots that answer from business documents using vector stores",
      "Connect agents to external tools using n8n's MCP Client and MCP Server nodes",
      "Design multi-agent systems with an orchestrator and specialist sub-agents",
      "Build phone voice agents with Vapi, Retell AI or ElevenLabs connected to n8n",
      "Price, propose, deliver and maintain AI agent projects for clients"
    ],
    "sections": [
      {
        "title": "n8n Foundations",
        "lectures": [
          ["Welcome: what you will build and sell", 8],
          ["What AI agents are and where they fit", 22],
          ["n8n Cloud vs self-hosted: setting up your workspace", 32],
          ["Nodes, triggers, credentials and executions", 36],
          ["Your first workflow: form to Google Sheets to email", 42],
          ["Quiz: n8n foundations", 10]
        ]
      },
      {
        "title": "Data, Expressions and Integrations",
        "lectures": [
          ["Understanding JSON and items in n8n", 31],
          ["Expressions and the Code node", 42],
          ["The HTTP Request node and working with APIs", 42],
          ["Google Sheets, Gmail and Slack integrations", 36],
          ["Branching, merging and error workflows", 36],
          ["Quiz: data and integrations", 10]
        ]
      },
      {
        "title": "Your First AI Agent",
        "lectures": [
          ["The AI Agent node explained", 26],
          ["Connecting OpenAI, Claude and Gemini chat models", 31],
          ["Adding memory to an agent", 31],
          ["Giving agents tools: Sheets, Calendar and HTTP", 47],
          ["Project: a customer FAQ agent", 52],
          ["Quiz: AI agents", 10]
        ]
      },
      {
        "title": "Prompt Engineering for Agents",
        "lectures": [
          ["System prompts that agents actually follow", 36],
          ["Structured output parsers and JSON responses", 36],
          ["Guardrails, fallbacks and handling bad input", 31],
          ["Walking through the 100+ prompt library", 42],
          ["Project: a lead qualification agent", 47],
          ["Quiz: prompts", 10]
        ]
      },
      {
        "title": "RAG: Agents That Know Your Business",
        "lectures": [
          ["How retrieval-augmented generation works", 26],
          ["Embeddings, chunking and document loaders", 42],
          ["Vector stores: Supabase, Pinecone and Qdrant", 47],
          ["Keeping the knowledge base up to date", 31],
          ["Project: a document Q&A chatbot", 52],
          ["Quiz: RAG", 10]
        ]
      },
      {
        "title": "MCP: Model Context Protocol",
        "lectures": [
          ["What MCP is and why it matters", 26],
          ["Using the MCP Client Tool node in an agent", 42],
          ["Exposing n8n workflows with the MCP Server Trigger", 42],
          ["Connecting n8n to Claude Desktop and other MCP clients", 36],
          ["Project: an MCP-powered business assistant", 47],
          ["Quiz: MCP", 10]
        ]
      },
      {
        "title": "Multi-Agent Systems",
        "lectures": [
          ["When one agent is not enough", 26],
          ["Orchestrator and specialist agent patterns", 42],
          ["Sub-workflows and agents as tools", 42],
          ["Routing, hand-offs and shared memory", 36],
          ["Project: a multi-agent content team", 57],
          ["Quiz: multi-agent systems", 10]
        ]
      },
      {
        "title": "Voice AI Agents",
        "lectures": [
          ["How voice agents work: speech, LLM and voice", 26],
          ["Building a voice agent in Vapi", 47],
          ["Retell AI and ElevenLabs agents compared", 36],
          ["Connecting voice agents to n8n webhooks and calendars", 47],
          ["Project: an appointment booking voice agent", 57],
          ["Quiz: voice AI", 10]
        ]
      },
      {
        "title": "Agents for Real Businesses",
        "lectures": [
          ["WhatsApp and website chat agents", 47],
          ["Email triage and auto-reply agents", 42],
          ["CRM updates and lead follow-up agents", 42],
          ["Reporting and summary agents", 36],
          ["Project: an end-to-end client support agent", 52],
          ["Quiz: business use cases", 10]
        ]
      },
      {
        "title": "Deploy, Monitor and Scale",
        "lectures": [
          ["Self-hosting n8n with Docker", 47],
          ["Queue mode, scaling and reliability", 36],
          ["Monitoring, logging and error alerts", 36],
          ["Controlling LLM costs and rate limits", 31],
          ["Security, credentials and data privacy", 31],
          ["Quiz: deployment", 10]
        ]
      },
      {
        "title": "Package and Sell AI Agents",
        "lectures": [
          ["Finding a niche and spotting automation opportunities", 36],
          ["Pricing models: projects, retainers and usage", 36],
          ["Discovery calls, demos and proposals", 42],
          ["Client onboarding, handover and documentation", 36],
          ["Maintenance and support agreements", 31],
          ["Quiz: selling AI agents", 10]
        ]
      },
      {
        "title": "Capstone Projects and Final Review",
        "lectures": [
          ["Capstone brief: build a sellable agent", 16],
          ["Capstone build: agent, RAG and voice", 60],
          ["Capstone build: testing and client demo", 52],
          ["Final review: 200+ quiz questions", 52],
          ["Next steps and building your portfolio", 16]
        ]
      }
    ],
    "requirements": [
      "A computer with internet access",
      "An n8n Cloud account or the ability to self-host n8n (setup is covered)",
      "API keys for an LLM provider such as OpenAI or Anthropic; usage is billed by the provider",
      "No coding required, though basic comfort with spreadsheets helps"
    ],
    "audience": [
      "Freelancers and agencies who want to offer AI agent services",
      "Business owners who want to automate support, sales and operations",
      "Developers and no-code builders moving into agentic AI",
      "Professionals who want a practical, project-based path into AI agents"
    ],
    "description": [
      "This is a complete, hands-on course on building AI agents with n8n and turning them into services you can sell. Over more than 40 hours you go from your first workflow to multi-agent systems, RAG chatbots, MCP integrations and phone voice agents.",
      "The first sections build a solid n8n foundation: triggers, nodes, expressions, APIs and error handling. You then create your first AI agent with the AI Agent node, connect chat models such as OpenAI, Claude and Gemini, add memory and give the agent real tools.",
      "Next you learn the techniques that make agents useful in business. Prompt engineering with a library of more than 100 prompts, structured outputs and guardrails make agents reliable. RAG with vector stores lets them answer from company documents. MCP lets them use external tools and lets other AI apps call your n8n workflows.",
      "You then build multi-agent systems with orchestrators and specialists, and voice agents with Vapi, Retell AI or ElevenLabs that can answer calls and book appointments through n8n. Every section ends with a project and a quiz, with more than 200 questions in total.",
      "The final sections cover deployment, monitoring, cost control and security, then the business side: choosing a niche, pricing, proposals, onboarding and maintenance. Results depend on your own effort and market, but you will leave with working agents and a clear process for delivering them to clients."
    ]
  },
  "wa-agent": {
    "subtitle": "Build a working WhatsApp bulk messaging agent with n8n, Meta's WhatsApp Cloud API and Google Sheets in four easy steps.",
    "learn": [
      "Create a Meta developer app and enable the WhatsApp Cloud API",
      "Generate access tokens and find your phone number ID",
      "Create and submit a WhatsApp message template for approval",
      "Structure a Google Sheet of opted-in contacts for bulk sending",
      "Connect Google Sheets and WhatsApp credentials inside n8n",
      "Build an n8n workflow that sends a personalised template to every row",
      "Test safely with your own number before sending to a list",
      "Log delivery status back to the sheet and follow WhatsApp messaging rules"
    ],
    "sections": [
      {
        "title": "Step 1: Set Up Meta and WhatsApp Cloud API",
        "lectures": [
          ["Welcome: what you will build in 30 minutes", 3],
          ["Creating a Meta app and adding WhatsApp", 3],
          ["Access token, phone number ID and a message template", 3]
        ]
      },
      {
        "title": "Step 2: Prepare Your Google Sheet",
        "lectures": [
          ["Contact sheet layout: names, numbers and status", 3],
          ["Opt-in rules and number formatting", 3]
        ]
      },
      {
        "title": "Step 3: Build the n8n Workflow",
        "lectures": [
          ["Connecting Google Sheets and WhatsApp in n8n", 3],
          ["Looping rows and sending personalised templates", 3]
        ]
      },
      {
        "title": "Step 4: Test and Send in Bulk",
        "lectures": [
          ["Testing with your own number", 3],
          ["Running the campaign and logging status", 3],
          ["Next steps: adding AI replies", 3]
        ]
      }
    ],
    "requirements": [
      "A Facebook account to access Meta for Developers",
      "A phone number not already registered on WhatsApp, or the free test number Meta provides",
      "A free n8n account and a Google account"
    ],
    "audience": [
      "Small business owners who want to message customers in bulk",
      "Marketers running WhatsApp offers and reminders",
      "Beginners who want a quick first win with n8n automation"
    ],
    "description": [
      "This short free course shows you how to build your own WhatsApp bulk messaging agent in about 15 minutes of build time, using n8n, Meta's WhatsApp Cloud API and Google Sheets. The whole course runs in roughly half an hour and is split into four easy steps.",
      "In step one you create a Meta developer app, add WhatsApp, collect your access token and phone number ID, and set up a message template. In step two you prepare a Google Sheet of contacts with the right number format and a status column.",
      "In step three you build the n8n workflow that reads each row and sends a personalised template message. In step four you test with your own number, then run the campaign and log the results back to your sheet. Every node is explained, so you understand how to change it later.",
      "Throughout, the course follows WhatsApp's rules: only message people who have opted in, use approved templates for business-initiated messages, and respect messaging limits so your number stays in good standing. You will finish with a working agent and a clear idea of how to add AI replies next."
    ]
  },
  "agentic": {
    "subtitle": "Design and build autonomous AI agents with LangChain, LangGraph, CrewAI, AutoGen and n8n, from first principles to deployment.",
    "learn": [
      "Explain how agents plan, use tools, keep memory and act autonomously",
      "Call LLMs from Python and implement tool calling with structured outputs",
      "Build chains, tools and retrieval pipelines with LangChain",
      "Model agent workflows as stateful graphs with LangGraph",
      "Add human-in-the-loop approvals and persistent checkpoints in LangGraph",
      "Orchestrate role-based agent teams with CrewAI crews and tasks",
      "Build conversational multi-agent systems with AutoGen",
      "Evaluate, monitor and deploy agents as reliable APIs"
    ],
    "sections": [
      {
        "title": "Module 1: Foundations of AI Agents",
        "lectures": [
          ["Welcome and course roadmap", 5],
          ["From chatbots to autonomous agents", 15],
          ["The agent loop: perceive, plan, act, reflect", 20],
          ["Agent patterns: ReAct, planning and reflection", 20]
        ]
      },
      {
        "title": "Module 2: LLMs, Prompts and Tool Calling",
        "lectures": [
          ["Python environment and API keys", 15],
          ["Calling LLMs from Python", 15],
          ["Tool calling and function schemas", 20],
          ["Structured outputs with Pydantic", 15]
        ]
      },
      {
        "title": "Module 3: LangChain Essentials",
        "lectures": [
          ["LangChain building blocks and LCEL", 15],
          ["Prompt templates and output parsers", 15],
          ["Creating and binding custom tools", 15],
          ["Building your first LangChain agent", 20]
        ]
      },
      {
        "title": "Module 4: Memory and RAG",
        "lectures": [
          ["Short-term and long-term memory", 15],
          ["Embeddings and vector stores", 14],
          ["Building a retrieval pipeline", 19],
          ["Agentic RAG: agents that decide when to search", 14]
        ]
      },
      {
        "title": "Module 5: LangGraph Fundamentals",
        "lectures": [
          ["Why graphs: state, nodes and edges", 14],
          ["Conditional edges and loops", 14],
          ["Tool nodes and the ReAct agent in LangGraph", 19],
          ["Streaming and debugging graphs", 10]
        ]
      },
      {
        "title": "Module 6: Advanced LangGraph",
        "lectures": [
          ["Checkpointers and persistent state", 14],
          ["Human-in-the-loop interrupts and approvals", 14],
          ["Subgraphs and multi-agent supervisors", 19],
          ["Project: a research agent with approvals", 14]
        ]
      },
      {
        "title": "Module 7: CrewAI",
        "lectures": [
          ["Agents, tasks and crews", 14],
          ["Sequential and hierarchical processes", 14],
          ["Tools and memory in CrewAI", 14],
          ["Project: a content research crew", 19]
        ]
      },
      {
        "title": "Module 8: AutoGen",
        "lectures": [
          ["AutoGen AgentChat concepts", 14],
          ["Assistant and user proxy agents", 14],
          ["Group chats and team patterns", 14],
          ["Project: a coding and review team", 14]
        ]
      },
      {
        "title": "Module 9: No-Code Agents with n8n",
        "lectures": [
          ["The n8n AI Agent node", 14],
          ["Memory, tools and vector stores in n8n", 14],
          ["Triggering agents from apps and webhooks", 14],
          ["Project: a business automation agent", 19]
        ]
      },
      {
        "title": "Module 10: Evaluation, Observability and Safety",
        "lectures": [
          ["Tracing agents with LangSmith", 14],
          ["Building evaluation datasets", 14],
          ["Guardrails, permissions and prompt injection", 19],
          ["Cost and latency optimisation", 10]
        ]
      },
      {
        "title": "Module 11: Deploying Agents",
        "lectures": [
          ["Serving agents with FastAPI", 19],
          ["Containerising with Docker", 14],
          ["Background jobs, queues and scaling", 14],
          ["Choosing a framework for production", 10]
        ]
      },
      {
        "title": "Module 12: Capstone Project",
        "lectures": [
          ["Capstone brief: an autonomous multi-agent system", 10],
          ["Designing the architecture", 14],
          ["Building and testing the system", 24],
          ["Deployment, review and next steps", 10]
        ]
      }
    ],
    "requirements": [
      "Basic Python knowledge (variables, functions, installing packages)",
      "A computer that can run Python 3.10 or later",
      "API keys for an LLM provider such as OpenAI or Anthropic; usage is billed by the provider"
    ],
    "audience": [
      "Developers who want to build production-ready AI agents",
      "Data and ML practitioners moving into agentic AI",
      "Technical founders and product builders exploring autonomous systems",
      "No-code builders ready to add Python frameworks to their toolkit"
    ],
    "description": [
      "This course teaches you how to design and build intelligent autonomous systems using today's main agent frameworks: LangChain, LangGraph, CrewAI, AutoGen and n8n. It is organised into 12 modules that move steadily from beginner concepts to advanced, deployable agents. Each module mixes short explanations with hands-on coding.",
      "You begin with the fundamentals: what makes an agent different from a chatbot, the agent loop, and common patterns such as ReAct and reflection. You then work directly with LLMs in Python, implementing tool calling and structured outputs so you understand what frameworks do for you.",
      "The core of the course covers each framework in depth. LangChain gives you the building blocks for tools, prompts and retrieval. LangGraph lets you model agents as stateful graphs with checkpoints and human approvals. CrewAI and AutoGen show two different approaches to multi-agent teamwork, and n8n shows how to build agents visually.",
      "Later modules cover what it takes to run agents for real: tracing and evaluation with LangSmith, guardrails against prompt injection, cost control and deployment with FastAPI and Docker. You will learn how to compare frameworks honestly and choose the right one for each project instead of following trends.",
      "The capstone brings it together in an autonomous multi-agent system you design, build, test and deploy, giving you a strong portfolio project. Along the way you document your design decisions, test cases and trade-offs, so you can explain the system clearly to employers or clients."
    ]
  },
  "wa-mastery": {
    "subtitle": "Master WhatsApp Business automation: bulk campaigns, templates, webhooks, AI assistants, customer journeys, commerce and analytics.",
    "learn": [
      "Set up Meta Business, a WhatsApp Business Account and the Cloud API",
      "Write message templates that get approved across marketing and utility categories",
      "Run compliant bulk campaigns to segmented, opted-in audiences",
      "Receive messages and delivery statuses through webhooks in n8n",
      "Build an AI assistant that answers customer questions on WhatsApp",
      "Design automated journeys such as onboarding, reminders and win-back flows",
      "Sell with catalogues, product messages, interactive buttons and payment links",
      "Track delivery, read and reply rates and improve campaign performance"
    ],
    "sections": [
      {
        "title": "Module 1: Welcome and the WhatsApp Ecosystem",
        "lectures": [
          ["Welcome and course roadmap", 5],
          ["WhatsApp app vs Business app vs Business Platform", 21],
          ["How the WhatsApp Cloud API works", 21],
          ["Use cases across industries", 21],
          ["Course tools: Meta, n8n and Google Sheets", 16]
        ]
      },
      {
        "title": "Module 2: Meta Business and Account Setup",
        "lectures": [
          ["Creating a Meta Business portfolio", 21],
          ["WhatsApp Business Account and phone numbers", 21],
          ["Business verification and display names", 21],
          ["Permanent access tokens and system users", 21]
        ]
      },
      {
        "title": "Module 3: Message Templates",
        "lectures": [
          ["Template categories: marketing, utility and authentication", 21],
          ["Variables, media headers and buttons", 26],
          ["Writing templates that get approved", 21],
          ["Handling rejections and template quality", 16]
        ]
      },
      {
        "title": "Module 4: Compliance and Number Health",
        "lectures": [
          ["Opt-in rules and consent collection", 21],
          ["The 24-hour customer service window", 16],
          ["Quality rating and messaging limits", 21],
          ["Pricing and managing messaging costs", 21]
        ]
      },
      {
        "title": "Module 5: Contacts and Segmentation",
        "lectures": [
          ["Building a clean contact database", 21],
          ["Tags, segments and personalisation fields", 21],
          ["Importing from Google Sheets and CRMs", 21],
          ["Unsubscribes and suppression lists", 21]
        ]
      },
      {
        "title": "Module 6: Bulk Campaign Workflows",
        "lectures": [
          ["Planning a campaign end to end", 16],
          ["Building a bulk sender in n8n", 32],
          ["Batching, throttling and retries", 21],
          ["Scheduling campaigns", 21]
        ]
      },
      {
        "title": "Module 7: Webhooks and Two-Way Messaging",
        "lectures": [
          ["Configuring the Cloud API webhook", 21],
          ["Receiving and parsing incoming messages", 21],
          ["Tracking sent, delivered and read statuses", 21],
          ["Logging conversations to a database", 21]
        ]
      },
      {
        "title": "Module 8: AI Assistants on WhatsApp",
        "lectures": [
          ["Designing an AI assistant for your business", 16],
          ["Connecting ChatGPT or Claude in n8n", 26],
          ["Answering from your FAQs and documents", 26],
          ["Escalating to a human agent", 16]
        ]
      },
      {
        "title": "Module 9: Customer Journeys",
        "lectures": [
          ["Mapping a customer journey", 16],
          ["Welcome and onboarding sequences", 21],
          ["Reminders, follow-ups and feedback requests", 26],
          ["Re-engagement and win-back flows", 21]
        ]
      },
      {
        "title": "Module 10: Interactive Messages and Flows",
        "lectures": [
          ["Reply buttons and list messages", 21],
          ["Call-to-action and quick replies", 21],
          ["WhatsApp Flows for forms and bookings", 26],
          ["Project: an appointment booking flow", 21]
        ]
      },
      {
        "title": "Module 11: Commerce on WhatsApp",
        "lectures": [
          ["Catalogues and product messages", 21],
          ["Taking orders in chat", 21],
          ["Sending payment links and order updates", 21],
          ["Abandoned cart and post-purchase messages", 21]
        ]
      },
      {
        "title": "Module 12: Customer Engagement and Support",
        "lectures": [
          ["Support workflows and response times", 21],
          ["Shared inbox and human handover", 21],
          ["Feedback, reviews and loyalty messages", 21],
          ["Broadcast etiquette that keeps customers subscribed", 16]
        ]
      },
      {
        "title": "Module 13: Analytics and Optimisation",
        "lectures": [
          ["Key metrics: delivery, read and reply rates", 21],
          ["Building a campaign dashboard in Google Sheets", 26],
          ["A/B testing templates and send times", 21],
          ["Calculating cost per conversion", 16]
        ]
      },
      {
        "title": "Module 14: Scaling, Reliability and Security",
        "lectures": [
          ["Handling high volumes and rate limits", 21],
          ["Error handling and alerting", 21],
          ["Protecting tokens and customer data", 21],
          ["Running multiple numbers and brands", 21]
        ]
      },
      {
        "title": "Module 15: Capstone Project",
        "lectures": [
          ["Capstone brief: a full WhatsApp automation system", 10],
          ["Building campaigns, AI assistant and journeys", 37],
          ["Testing, analytics and launch checklist", 26],
          ["Next steps and course wrap-up", 10]
        ]
      }
    ],
    "requirements": [
      "A Facebook account and a business you can verify, or a demo business for practice",
      "A phone number that can be registered with the WhatsApp Business Platform",
      "A free n8n account and a Google account",
      "No coding experience required"
    ],
    "audience": [
      "Business owners who sell or support customers over WhatsApp",
      "Digital marketers and agencies running WhatsApp campaigns",
      "Customer support teams that want to automate common queries",
      "Automation builders who want to offer WhatsApp solutions to clients"
    ],
    "description": [
      "WhatsApp is where many customers already prefer to talk to businesses. This course shows you how to automate that channel properly, from account setup and approved templates to AI assistants, customer journeys, commerce and analytics, across 15 modules and more than 21 hours.",
      "You start with the WhatsApp ecosystem and the Cloud API, then set up a Meta Business portfolio, a WhatsApp Business Account and permanent tokens. You learn template categories, how to write templates that get approved, and the rules on opt-in, the 24-hour window, quality ratings and messaging limits.",
      "With the foundation in place, you build bulk campaign workflows in n8n with segmentation, batching and scheduling, then set up webhooks to receive replies and delivery statuses. You add an AI assistant using ChatGPT or Claude that answers from your FAQs and hands over to a human when needed.",
      "Later modules cover customer journeys, interactive buttons and lists, WhatsApp Flows for bookings and forms, catalogues, orders and payment links. You also build a simple analytics dashboard and learn to test templates and send times. Each topic includes a ready-to-adapt n8n workflow so you can apply it to your own business quickly.",
      "The course ends with scaling, security and a capstone in which you build a complete WhatsApp automation system for a real or sample business. You will combine campaigns, an AI assistant, journeys and analytics into one working setup, with a launch checklist you can reuse for future clients or brands."
    ]
  },
  "omni-master": {
    "subtitle": "Create cinematic AI videos with Omni AI: the 5-part prompt formula, consistent characters, native audio, Scenebuilder and avatars.",
    "learn": [
      "Write text-to-video prompts using the 5-part prompt formula",
      "Control camera movement, lighting and style for a cinematic look",
      "Keep characters consistent across shots using reference images and descriptions",
      "Generate native audio, sound effects and spoken dialogue in your clips",
      "Assemble multi-shot sequences in Scenebuilder and extend scenes smoothly",
      "Edit clips conversationally with Omni Flash instead of regenerating from scratch",
      "Create presenter videos with AI avatars in Google Vids",
      "Plan and deliver a complete short cinematic film"
    ],
    "sections": [
      {
        "title": "Getting Started with Omni AI",
        "lectures": [
          ["Welcome and what you will create", 4],
          ["Accessing Omni AI and touring the workspace", 8],
          ["Credits, settings and output formats", 6],
          ["Your first text-to-video clip", 10]
        ]
      },
      {
        "title": "Text-to-Video and the 5-Part Prompt Formula",
        "lectures": [
          ["The formula: subject, action, setting, camera and style", 10],
          ["Camera language: shots, angles and movement", 10],
          ["Lighting, mood and colour", 9],
          ["Practice: rewriting weak prompts", 11]
        ]
      },
      {
        "title": "Character Consistency",
        "lectures": [
          ["Why characters drift between shots", 7],
          ["Character sheets and reference images", 11],
          ["Reusing characters across scenes", 11],
          ["Practice: one character, five scenes", 11]
        ]
      },
      {
        "title": "Native Audio and Dialogue",
        "lectures": [
          ["How native audio generation works", 7],
          ["Prompting ambience and sound effects", 9],
          ["Writing dialogue and voice direction", 11],
          ["Practice: a two-character dialogue scene", 11]
        ]
      },
      {
        "title": "Scenebuilder and Scene Extensions",
        "lectures": [
          ["Planning a multi-shot sequence", 9],
          ["Building scenes in Scenebuilder", 13],
          ["Extending scenes for continuity", 11],
          ["Transitions and pacing", 9]
        ]
      },
      {
        "title": "Conversational Editing with Omni Flash",
        "lectures": [
          ["What Omni Flash can change in a clip", 7],
          ["Editing with natural-language instructions", 11],
          ["Fixing common problems: hands, faces and motion", 9],
          ["Practice: iterate a clip to final", 9]
        ]
      },
      {
        "title": "AI Avatars and Google Vids",
        "lectures": [
          ["Introduction to Google Vids", 7],
          ["Creating avatar presenter videos", 11],
          ["Combining avatars with Omni footage", 9],
          ["Practice: a short explainer video", 9]
        ]
      },
      {
        "title": "Capstone: Your Cinematic Short Film",
        "lectures": [
          ["Capstone brief and storyboard", 9],
          ["Generating and assembling the shots", 16],
          ["Audio, edits and final export", 11],
          ["Review and next steps", 4]
        ]
      }
    ],
    "requirements": [
      "A computer with internet access",
      "Access to Omni AI and a Google account for Google Vids; some features need a paid plan",
      "No video editing experience needed"
    ],
    "audience": [
      "Content creators who want cinematic videos without a film crew",
      "Marketers producing ads, reels and product videos",
      "Educators and trainers who need explainer and avatar videos",
      "Aspiring AI filmmakers learning shot-by-shot storytelling"
    ],
    "description": [
      "Master the Omni AI is a focused course on making cinematic AI video. In just over five hours you learn how to write prompts that produce controlled, film-like shots, keep characters consistent, add sound and dialogue, and assemble everything into a finished short.",
      "The course starts with text-to-video and the 5-part prompt formula, which breaks every prompt into subject, action, setting, camera and style. You practise camera language, lighting and mood so that your results stop looking random and start looking directed. Every lesson includes practice prompts to try.",
      "Next you tackle the hardest problems in AI video. You use reference images and character sheets for consistency, generate native audio and dialogue, build multi-shot sequences in Scenebuilder and extend scenes for continuity. You also learn conversational editing with Omni Flash, changing a clip with simple instructions rather than starting again.",
      "A dedicated section covers AI avatars in Google Vids for presenter and explainer videos. The course ends with a capstone in which you storyboard, generate, edit and export your own cinematic short film. You will finish with a polished film and a prompt library you can reuse on future projects."
    ]
  },
  "kling-master": {
    "subtitle": "Go deep on Kling AI 3.0 and Video 3.0 Omni: motion control, multi-shot stories, consistent characters, lip sync and a capstone film.",
    "learn": [
      "Navigate Kling AI 3.0, its models, settings and credit costs",
      "Generate strong starting frames with Kling text-to-image",
      "Animate still images into natural motion with image-to-video",
      "Use Video 3.0 Omni with references for richer, controlled scenes",
      "Direct camera moves and character actions with motion control",
      "Plan and generate multi-shot sequences that tell one story",
      "Keep characters and elements consistent across an entire film",
      "Write cinematic prompts with Claude and add lip sync and voiceovers"
    ],
    "sections": [
      {
        "title": "Welcome to Kling AI 3.0",
        "lectures": [
          ["Welcome and what you will create", 6],
          ["Kling AI 3.0 interface tour", 14],
          ["Models, modes, resolutions and credits", 14],
          ["Your first generation", 14],
          ["Reading results and planning iterations", 11]
        ]
      },
      {
        "title": "Text-to-Image in Kling",
        "lectures": [
          ["Text-to-image basics", 14],
          ["Composition, lighting and styles", 17],
          ["Creating key frames for video", 17],
          ["Practice: a mood board for your film", 14]
        ]
      },
      {
        "title": "Image-to-Video",
        "lectures": [
          ["How image-to-video works", 11],
          ["Prompting motion from a still frame", 17],
          ["Start and end frames", 17],
          ["Fixing distortion and unwanted motion", 14],
          ["Practice: animate five key frames", 14]
        ]
      },
      {
        "title": "Video 3.0 Omni",
        "lectures": [
          ["What Video 3.0 Omni adds", 11],
          ["Text-to-video with references", 20],
          ["Combining images, video and instructions", 18],
          ["Practice: a reference-driven scene", 15]
        ]
      },
      {
        "title": "Claude AI Cinematic Prompting",
        "lectures": [
          ["Shot types, lenses and camera language", 15],
          ["Using Claude to write shot lists", 18],
          ["Turning a script into Kling prompts", 18],
          ["A reusable cinematic prompt template", 15]
        ]
      },
      {
        "title": "Motion Control",
        "lectures": [
          ["Camera control: pan, tilt, dolly and orbit", 18],
          ["Motion control from reference video", 20],
          ["Directing character actions", 15],
          ["Practice: an action sequence", 15]
        ]
      },
      {
        "title": "Multi-Shot Storytelling",
        "lectures": [
          ["Storyboarding for AI video", 15],
          ["Generating multi-shot sequences", 20],
          ["Continuity of light, costume and setting", 15],
          ["Practice: a 30-second story", 18]
        ]
      },
      {
        "title": "Character and Element Consistency",
        "lectures": [
          ["Why consistency breaks", 12],
          ["Using Elements and reference images", 20],
          ["Building a character library", 15],
          ["Practice: one hero across ten shots", 18]
        ]
      },
      {
        "title": "Lip Sync and Voiceovers",
        "lectures": [
          ["Writing dialogue and narration", 12],
          ["Generating voiceovers", 15],
          ["Kling lip sync workflow", 20],
          ["Sound effects and music", 15]
        ]
      },
      {
        "title": "Editing and Finishing",
        "lectures": [
          ["Assembling clips in an editor", 18],
          ["Colour, pacing and transitions", 15],
          ["Upscaling and export settings", 12],
          ["Preparing for YouTube and social media", 12]
        ]
      },
      {
        "title": "Capstone Cinematic Film Project",
        "lectures": [
          ["Capstone brief and script", 12],
          ["Storyboard and prompt pack with Claude", 20],
          ["Generating, consistency checks and lip sync", 29],
          ["Final edit, review and next steps", 15]
        ]
      }
    ],
    "requirements": [
      "A computer with internet access",
      "A Kling AI account; paid credits are needed for longer or higher-quality generations",
      "A free Claude account for prompt writing",
      "Any basic video editor such as CapCut or DaVinci Resolve"
    ],
    "audience": [
      "Creators and YouTubers who want cinematic AI video",
      "Filmmakers and editors adding AI to their pipeline",
      "Marketers and agencies producing video ads",
      "Beginners who want an in-depth, single-tool mastery course"
    ],
    "description": [
      "Kling AI is one of the most capable AI video tools available, and this course goes deep into it. Over more than 12 hours you learn Kling AI 3.0 and Video 3.0 Omni from first generation to a finished cinematic film.",
      "You begin with the interface, models and credit costs, then learn text-to-image to create strong key frames and image-to-video to bring them to life. You then move to Video 3.0 Omni, using references to get richer and more controlled scenes.",
      "A full section is dedicated to cinematic prompting with Claude, turning a script into shot lists and precise Kling prompts. You then practise motion control for camera moves and character actions, and multi-shot storytelling for sequences that hold together. Every lesson includes practice exercises.",
      "Consistency is where most AI films fall apart, so you learn to use Elements and reference images to keep characters and objects stable across shots. You add dialogue with voiceovers and Kling lip sync, then finish your clips with editing, colour and export.",
      "The capstone cinematic film project takes you through script, storyboard, prompt pack, generation and final edit, leaving you with a complete short film for your portfolio. You will also keep the prompt templates, character library and shot lists you build along the way for future projects and client work."
    ]
  },
  "genai-complete": {
    "subtitle": "The complete generative AI course: 50+ tools for text, images, video, audio and automation, including ChatGPT, Claude and Midjourney.",
    "learn": [
      "Explain how large language models and diffusion models generate content",
      "Write effective prompts using proven frameworks for any AI tool",
      "Use ChatGPT custom GPTs and data analysis for everyday work",
      "Work with long documents, Projects and Artifacts in Claude",
      "Create professional images with Midjourney and DALL-E 3",
      "Produce AI videos, avatars and voiceovers with leading tools",
      "Build presentations and designs quickly with Gamma and Canva",
      "Automate workflows with Zapier and n8n and use AI responsibly"
    ],
    "sections": [
      {
        "title": "Module 1: Introduction to Generative AI",
        "lectures": [
          ["Welcome and how to use this course", 5],
          ["What generative AI is and what it can do", 16],
          ["The landscape of 50+ AI tools", 22],
          ["Setting up your AI toolkit", 22]
        ]
      },
      {
        "title": "Module 2: How Generative AI Works",
        "lectures": [
          ["Large language models in plain English", 22],
          ["Tokens, context windows and hallucinations", 16],
          ["How image and video diffusion models work", 16],
          ["Choosing the right model for the task", 16]
        ]
      },
      {
        "title": "Module 3: Prompt Engineering",
        "lectures": [
          ["Anatomy of a great prompt", 16],
          ["Prompt frameworks and templates", 16],
          ["Few-shot examples and step-by-step reasoning", 16],
          ["Practice: a personal prompt library", 22]
        ]
      },
      {
        "title": "Module 4: ChatGPT Deep Dive",
        "lectures": [
          ["ChatGPT features tour", 16],
          ["Custom GPTs for repeat tasks", 22],
          ["Data analysis with spreadsheets", 16],
          ["Practice: build your own GPT", 15]
        ]
      },
      {
        "title": "Module 5: Claude for Thinking and Writing",
        "lectures": [
          ["Claude features tour", 15],
          ["Projects and long documents", 15],
          ["Artifacts for documents and mini apps", 15],
          ["Practice: a report from raw notes", 21]
        ]
      },
      {
        "title": "Module 6: Research with Gemini and Perplexity",
        "lectures": [
          ["Gemini in Google Workspace", 15],
          ["Cited research with Perplexity", 15],
          ["NotebookLM for studying sources", 15],
          ["Practice: a fact-checked brief", 15]
        ]
      },
      {
        "title": "Module 7: Image Generation with Midjourney",
        "lectures": [
          ["Getting started with Midjourney", 15],
          ["Styles, parameters and aspect ratios", 21],
          ["Character and style references", 15],
          ["Practice: a brand image set", 15]
        ]
      },
      {
        "title": "Module 8: DALL-E 3 and Other Image Tools",
        "lectures": [
          ["DALL-E 3 and image generation in ChatGPT", 15],
          ["Adobe Firefly and Leonardo AI", 15],
          ["Editing, inpainting and upscaling", 15],
          ["Practice: product and social visuals", 15]
        ]
      },
      {
        "title": "Module 9: AI Video",
        "lectures": [
          ["Text-to-video and image-to-video with Runway and Kling", 21],
          ["Avatar videos with HeyGen", 15],
          ["Editing and captions with CapCut", 15],
          ["Practice: a 30-second promo video", 15]
        ]
      },
      {
        "title": "Module 10: AI Audio and Voice",
        "lectures": [
          ["Voiceovers and voice cloning with ElevenLabs", 21],
          ["Music generation with Suno", 15],
          ["Transcription and podcast clean-up", 15],
          ["Practice: a narrated explainer", 15]
        ]
      },
      {
        "title": "Module 11: Presentations, Documents and Design",
        "lectures": [
          ["Decks in minutes with Gamma", 15],
          ["Design with Canva AI", 15],
          ["Websites from prompts", 15],
          ["Practice: a pitch deck and landing page", 15]
        ]
      },
      {
        "title": "Module 12: Automation and AI Agents",
        "lectures": [
          ["Automation basics with Zapier", 15],
          ["AI workflows in n8n", 21],
          ["Introduction to AI agents", 15],
          ["Practice: automate a weekly task", 15]
        ]
      },
      {
        "title": "Module 13: Responsible and Ethical AI",
        "lectures": [
          ["Copyright, ownership and licensing", 15],
          ["Privacy and protecting your data", 15],
          ["Bias, accuracy and fact-checking", 15],
          ["Using AI at work responsibly", 10]
        ]
      },
      {
        "title": "Module 14: Capstone Project",
        "lectures": [
          ["Capstone brief: a multi-tool AI project", 10],
          ["Planning and building your project", 26],
          ["Presenting your portfolio", 15],
          ["Next steps in generative AI", 10]
        ]
      }
    ],
    "requirements": [
      "A computer with internet access",
      "Free accounts on the tools covered; some, such as Midjourney, need a paid plan",
      "No technical background required"
    ],
    "audience": [
      "Beginners who want one complete course covering all of generative AI",
      "Professionals who want to apply AI across writing, design and video",
      "Content creators and marketers building a modern AI toolkit",
      "Students preparing for AI-enabled careers"
    ],
    "description": [
      "The Complete Generative AI Mastery brings together text, image, video, audio and automation in one structured course. Across 14 modules and more than 15 hours you work with over 50 AI tools, including ChatGPT, Claude, Midjourney and DALL-E 3. Every module includes hands-on practice.",
      "The first modules explain how generative AI actually works, from large language models and context windows to diffusion models for images and video. You then learn prompt engineering frameworks that work with any tool, and build your own prompt library.",
      "Next come in-depth modules on the major assistants: ChatGPT with custom GPTs and data analysis, Claude with Projects and Artifacts, and research with Gemini, Perplexity and NotebookLM. You then move into images with Midjourney, DALL-E 3, Firefly and Leonardo. Each tool is shown on a real task.",
      "The creative modules continue with video using Runway, Kling and HeyGen, audio with ElevenLabs and Suno, and fast design with Gamma and Canva. You also learn to connect tools and automate work with Zapier and n8n, and get an introduction to AI agents.",
      "A module on responsible AI covers copyright, privacy, bias and fact-checking. The course closes with a capstone project that combines several tools into one portfolio piece. You will plan it, build it with the tools that suit it best and present the result, finishing with a clear picture of how to keep learning as generative AI continues to change."
    ]
  },
  "mj-advanced": {
    "subtitle": "Go beyond basic prompts: control style, characters, parameters and video in Midjourney for professional, client-ready creative work.",
    "learn": [
      "Build advanced prompts that control composition, lens, lighting and mood precisely",
      "Use Style Reference and style codes to lock a consistent visual identity",
      "Keep characters consistent across scenes with Omni Reference and image prompts",
      "Tune outputs with stylize, chaos, weird, aspect ratio and version parameters",
      "Refine images using Vary Region, Remix, Pan, Zoom and upscalers",
      "Turn still images into short animated clips with Midjourney video",
      "Create personalized style profiles and moodboards for repeatable brand looks",
      "Deliver a complete professional campaign from brief to final exported assets"
    ],
    "sections": [
      {
        "title": "Welcome and the Advanced Mindset",
        "lectures": [
          ["Welcome and how this course is structured", 5],
          ["Reviewing the Midjourney web interface and settings", 12],
          ["From casual prompting to directed creative work", 14],
          ["Setting up your project folders and naming system", 9]
        ]
      },
      {
        "title": "Advanced Prompt Architecture",
        "lectures": [
          ["Anatomy of a professional prompt", 16],
          ["Subject, environment, composition and medium", 19],
          ["Camera language: lens, angle and framing", 21],
          ["Prompt weights and multi prompts", 17],
          ["Negative prompting with --no", 12]
        ]
      },
      {
        "title": "Mastering Parameters",
        "lectures": [
          ["Stylize, chaos and weird explained with examples", 21],
          ["Aspect ratios for social, print and web", 14],
          ["Model versions, raw mode and when to switch", 17],
          ["Seeds and repeatable experiments", 14],
          ["Building a personal parameter cheat sheet", 12]
        ]
      },
      {
        "title": "Lighting, Color and Mood",
        "lectures": [
          ["Lighting setups that read as professional", 21],
          ["Color palettes and grading through prompts", 17],
          ["Time of day, weather and atmosphere", 16],
          ["Exercise: one subject, five moods", 17]
        ]
      },
      {
        "title": "Style Reference and Style Codes",
        "lectures": [
          ["How Style Reference works", 16],
          ["Combining and weighting multiple style images", 17],
          ["Discovering and saving style codes", 16],
          ["Building a reusable brand style kit", 21]
        ]
      },
      {
        "title": "Personalization and Moodboards",
        "lectures": [
          ["Training your personalization profile", 14],
          ["Creating moodboards for projects", 16],
          ["Mixing personalization with style references", 16],
          ["Case study: a consistent editorial look", 19]
        ]
      },
      {
        "title": "Character Consistency with Omni Reference",
        "lectures": [
          ["Omni Reference fundamentals", 17],
          ["Controlling omni weight for likeness and freedom", 17],
          ["Placing one character in many scenes", 21],
          ["Outfits, expressions and poses for the same character", 19],
          ["Common consistency problems and fixes", 14]
        ]
      },
      {
        "title": "Editing: Vary Region, Remix, Pan and Zoom",
        "lectures": [
          ["Vary Region for targeted fixes", 17],
          ["Remix mode for controlled iteration", 16],
          ["Pan and Zoom Out to extend scenes", 16],
          ["Using the editor with external images", 17],
          ["Retexture and restyling existing images", 14]
        ]
      },
      {
        "title": "Upscaling and Output Quality",
        "lectures": [
          ["Subtle vs creative upscaling", 14],
          ["Preparing files for print and large formats", 16],
          ["Fixing hands, text and small details", 17],
          ["Exporting and organizing final assets", 10]
        ]
      },
      {
        "title": "Image to Video",
        "lectures": [
          ["How Midjourney video works", 14],
          ["Low and high motion settings", 16],
          ["Writing motion prompts for clean animation", 19],
          ["Extending clips and choosing the best takes", 16],
          ["Combining clips into short reels", 17]
        ]
      },
      {
        "title": "Professional Creative Workflows",
        "lectures": [
          ["Product and e-commerce visuals", 21],
          ["Brand campaigns and ad creatives", 21],
          ["Book covers, posters and editorial art", 19],
          ["Thumbnails and social content at scale", 17],
          ["Usage rights, terms and client communication", 12]
        ]
      },
      {
        "title": "Capstone: Full Campaign Project",
        "lectures": [
          ["Writing the creative brief", 12],
          ["Building the style kit and character set", 24],
          ["Producing hero images and variations", 28],
          ["Creating the video teaser", 22],
          ["Final review, delivery and next steps", 12]
        ]
      }
    ],
    "requirements": [
      "A paid Midjourney subscription",
      "Comfort with basic Midjourney prompting and the web interface",
      "A computer with a stable internet connection"
    ],
    "audience": [
      "Designers and creators who want professional control over Midjourney outputs",
      "Marketers producing brand visuals and ad creatives",
      "Freelancers building client-ready AI image and video services",
      "Learners who completed an entry-level Midjourney course"
    ],
    "description": [
      "This advanced course is for people who already know how to type a prompt in Midjourney and now want reliable, professional results. Across 12 modules you move from loose experimentation to directed creative work, where you decide the composition, light, style and character before you generate, and get outputs you can actually use for clients and brands.",
      "You start with prompt architecture and a deep look at parameters such as stylize, chaos, weird, aspect ratio, seeds and raw mode. Each lesson uses side by side examples so you can see exactly what a change does, and you finish with your own parameter cheat sheet for daily work.",
      "The middle of the course focuses on consistency, the biggest challenge in AI imagery. You learn Style Reference and style codes for a repeatable look, personalization profiles and moodboards for your taste, and Omni Reference for keeping the same character across scenes, outfits and expressions.",
      "Next you master editing and output quality: Vary Region, Remix, Pan, Zoom, the editor, retexturing and upscaling for print. Then you bring images to life with Midjourney video, writing motion prompts, choosing motion levels and extending clips into short reels.",
      "The course ends with real workflows for products, ads, posters and social content, plus a capstone where you build a full campaign from a written brief to final images and a video teaser. You leave with a portfolio piece and a process you can repeat."
    ]
  },
  "claude-code": {
    "subtitle": "Use Claude Code to plan, build, debug and ship real projects with MCP, CLAUDE.md, skills, subagents and automation.",
    "learn": [
      "Install Claude Code and run it confidently in your terminal and IDE",
      "Plan features with plan mode before letting Claude write any code",
      "Write a CLAUDE.md that teaches Claude your project rules and conventions",
      "Debug, refactor and test code through clear, iterative Claude Code sessions",
      "Connect external tools and data to Claude Code using MCP servers",
      "Create custom slash commands, skills, hooks and plugins for repeat tasks",
      "Delegate focused work to subagents and run automated headless routines",
      "Build, connect and deploy a complete real project from idea to live"
    ],
    "sections": [
      {
        "title": "Getting Started with Claude Code",
        "lectures": [
          ["Welcome and what Claude Code can do", 5],
          ["Installing Claude Code and signing in", 12],
          ["Terminal basics you need for this course", 14],
          ["Your first session: reading a codebase", 16],
          ["Using Claude Code inside VS Code and JetBrains", 12]
        ]
      },
      {
        "title": "Plan, Build and Edit",
        "lectures": [
          ["Plan mode: thinking before coding", 18],
          ["Writing clear task prompts for code", 16],
          ["Reviewing and accepting edits safely", 14],
          ["Permissions and approval modes", 14],
          ["Checkpoints, undo and recovering from mistakes", 12]
        ]
      },
      {
        "title": "Debugging, Refactoring and Testing",
        "lectures": [
          ["Reading errors and stack traces with Claude", 16],
          ["Debugging a broken feature step by step", 20],
          ["Refactoring without breaking behaviour", 18],
          ["Writing and running tests with Claude Code", 20],
          ["Git workflows: commits, branches and pull requests", 18]
        ]
      },
      {
        "title": "CLAUDE.md and Project Memory",
        "lectures": [
          ["What CLAUDE.md is and where it lives", 12],
          ["Writing project rules, commands and conventions", 18],
          ["Context management and the /compact command", 14],
          ["Keeping memory accurate as projects grow", 12]
        ]
      },
      {
        "title": "MCP: Connecting Tools and Data",
        "lectures": [
          ["What the Model Context Protocol is", 14],
          ["Adding MCP servers to Claude Code", 16],
          ["Working with GitHub, databases and docs via MCP", 20],
          ["Browser and design tool connections", 16],
          ["Security and permission basics for MCP", 12]
        ]
      },
      {
        "title": "Skills, Slash Commands, Hooks and Plugins",
        "lectures": [
          ["Custom slash commands for repeat tasks", 16],
          ["Creating and using Agent Skills", 18],
          ["Hooks: running checks automatically", 18],
          ["Installing and sharing plugins", 14]
        ]
      },
      {
        "title": "Subagents and Automation Routines",
        "lectures": [
          ["What subagents are and when to use them", 14],
          ["Creating a reviewer and a tester subagent", 20],
          ["Headless mode and scripted runs", 16],
          ["Running Claude Code in GitHub Actions", 18],
          ["Designing reliable automation routines", 14]
        ]
      },
      {
        "title": "Capstone: Build, Connect and Deploy",
        "lectures": [
          ["Project brief and planning session", 14],
          ["Building the app feature by feature", 29],
          ["Connecting data and services through MCP", 20],
          ["Testing, review and fixing issues", 18],
          ["Deploying the project live", 18],
          ["Your ongoing AI development workflow", 8]
        ]
      }
    ],
    "requirements": [
      "A computer running macOS, Linux or Windows",
      "A Claude Pro, Max or API account to use Claude Code",
      "Basic familiarity with code is helpful but not required"
    ],
    "audience": [
      "Developers who want a faster, AI-assisted coding workflow",
      "Founders and makers building their own products and tools",
      "Students moving from chat-based AI to agentic coding",
      "Tech-curious professionals who want to automate work with code"
    ],
    "description": [
      "Claude Code is Anthropic's agentic coding tool. It reads your project, plans changes, edits files, runs commands and helps you ship. This 10 hour course teaches you to use it the way experienced builders do: with a plan, clear instructions and the right guardrails, so the work is fast and stays under your control.",
      "You begin with installation, terminal basics and your first session reading a real codebase. Then you learn the core loop of plan, build and edit, including plan mode, permission settings, reviewing diffs and recovering with checkpoints when something goes wrong.",
      "Next comes daily development work: debugging from error messages, refactoring safely, writing tests and handling Git commits, branches and pull requests. You also write a strong CLAUDE.md so Claude remembers your project's commands, rules and style across every session. By the end of this module Claude works inside your conventions instead of guessing them.",
      "The advanced modules open up the full platform. You connect tools and data with MCP servers, create custom slash commands and Agent Skills, add hooks that run checks automatically, install plugins, delegate focused jobs to subagents and run Claude Code headlessly in scripts and GitHub Actions.",
      "Everything comes together in a capstone where you plan, build, connect and deploy a real project from start to finish. You leave with a practical AI development workflow you can apply to your own apps, client work or internal tools."
    ]
  },
  "claude-master": {
    "subtitle": "Master Claude from first prompt to agentic workflows: Projects, Artifacts, analysis, connectors, MCP, Claude Code and Cowork.",
    "learn": [
      "Write clear, structured prompts that get reliable answers from Claude",
      "Organize ongoing work with Projects, knowledge files and custom instructions",
      "Create documents, apps and visuals with Claude Artifacts",
      "Analyze PDFs, spreadsheets and data files with Claude's analysis tools",
      "Connect Claude to Google Drive, Gmail and other apps using connectors",
      "Understand MCP and add tools that extend what Claude can do",
      "Hand off multi-step desktop and file tasks to Claude Cowork",
      "Design agentic workflows that combine research, files and automation"
    ],
    "sections": [
      {
        "title": "Getting Started with Claude",
        "lectures": [
          ["Welcome and course roadmap", 5],
          ["Claude plans, models and where to use Claude", 12],
          ["A tour of the Claude interface", 14],
          ["Your first useful conversations", 14]
        ]
      },
      {
        "title": "Prompting Foundations",
        "lectures": [
          ["The anatomy of a good prompt", 16],
          ["Giving context, examples and constraints", 18],
          ["Asking for formats: tables, lists and drafts", 14],
          ["Iterating and correcting Claude's answers", 14],
          ["Prompt templates for everyday work", 14]
        ]
      },
      {
        "title": "Projects and Knowledge",
        "lectures": [
          ["Creating Projects for ongoing work", 14],
          ["Adding knowledge files and instructions", 16],
          ["Styles and personal preferences", 10],
          ["Memory and chat search", 12],
          ["Example: a client project workspace", 16]
        ]
      },
      {
        "title": "Artifacts",
        "lectures": [
          ["What Artifacts are and when they appear", 12],
          ["Documents, reports and slide outlines", 16],
          ["Building small apps and calculators", 20],
          ["Charts, diagrams and visual pages", 16],
          ["Sharing and remixing Artifacts", 10]
        ]
      },
      {
        "title": "Files, Research and Analysis",
        "lectures": [
          ["Working with PDFs and long documents", 16],
          ["Analyzing spreadsheets and CSV data", 20],
          ["Web search and Research mode", 18],
          ["Fact-checking and citing sources", 12]
        ]
      },
      {
        "title": "Connectors and MCP",
        "lectures": [
          ["What connectors do", 12],
          ["Connecting Google Drive, Gmail and Calendar", 18],
          ["Understanding the Model Context Protocol", 14],
          ["Adding MCP servers and extensions", 16]
        ]
      },
      {
        "title": "Claude Code and Cowork",
        "lectures": [
          ["Claude Code basics for non-coders and coders", 18],
          ["Building a small project with Claude Code", 22],
          ["Cowork: delegating tasks on your computer", 18],
          ["Organizing files and producing documents with Cowork", 18]
        ]
      },
      {
        "title": "Agentic AI Workflows",
        "lectures": [
          ["From single prompts to workflows", 14],
          ["Combining research, files and connectors", 18],
          ["Recurring tasks and reusable skills", 16],
          ["Safety, review and human checkpoints", 12]
        ]
      },
      {
        "title": "Capstone: Your Claude Operating System",
        "lectures": [
          ["Mapping your work to Claude features", 12],
          ["Building your project, prompts and artifacts", 28],
          ["Connecting tools and running a full workflow", 24],
          ["Review and next steps", 8]
        ]
      }
    ],
    "requirements": [
      "A free or paid Claude account (some features need a paid plan)",
      "A computer with internet access",
      "No coding or AI experience needed"
    ],
    "audience": [
      "Professionals who want to use Claude for real daily work",
      "Business owners and freelancers saving time on documents and research",
      "Students and beginners who want a complete Claude foundation",
      "Intermediate users ready for connectors, MCP and agentic workflows"
    ],
    "description": [
      "This course takes you from your first conversation with Claude to running complete AI workflows. It is designed for beginners, but moves steadily into advanced features so that experienced users also find new ways to work faster and better with Claude.",
      "You start with prompting foundations: how to give context, examples and constraints, how to ask for the exact format you need and how to iterate when the first answer is not right. You also build a set of prompt templates for writing, planning and analysis tasks.",
      "Next you organize your work with Projects, knowledge files, styles and memory, then create real outputs with Artifacts, from reports and slide outlines to small interactive apps and charts. You learn to analyze PDFs and spreadsheets and use web search and Research for well sourced answers.",
      "The advanced half covers connectors for apps like Google Drive, Gmail and Calendar, the Model Context Protocol, Claude Code for building projects and Cowork for delegating multi-step tasks on your computer. Each lesson shows practical examples rather than theory. You will see how each feature fits into a normal working day, so you know when to reach for it.",
      "Finally you combine everything into agentic workflows with human checkpoints and finish with a capstone: your own Claude operating system for the work you do every week. You map your weekly tasks to the right Claude features, build the prompts, Projects and Artifacts you need, connect your tools and run a full workflow from start to finish. You leave with a setup you can keep improving long after the course ends."
    ]
  },
  "claude-excel": {
    "subtitle": "Move from manual Excel to AI-assisted Excel: use Claude to write formulas, clean data, build pivots and create dashboards.",
    "learn": [
      "Describe spreadsheet problems clearly so Claude returns working Excel formulas",
      "Write and debug XLOOKUP, IF, SUMIFS and text formulas with Claude",
      "Clean messy data: duplicates, spacing, dates and inconsistent entries",
      "Analyze data with pivot tables and summaries guided by Claude",
      "Upload spreadsheets to Claude for instant analysis and insights",
      "Build clear charts and dashboards for monthly business reporting",
      "Automate repetitive tasks with Claude-written macros and Power Query steps",
      "Complete a full sales report project from raw data to dashboard"
    ],
    "sections": [
      {
        "title": "Getting Started: Excel Meets Claude",
        "lectures": [
          ["Welcome and how this course works", 5],
          ["Setting up Claude and your Excel workspace", 10],
          ["How to describe a spreadsheet to Claude", 14],
          ["Sharing data safely with Claude", 10]
        ]
      },
      {
        "title": "Formulas and Functions with Claude",
        "lectures": [
          ["Generating formulas from plain English", 14],
          ["Lookups: XLOOKUP and INDEX MATCH", 14],
          ["Logic formulas: IF, IFS and nested conditions", 12],
          ["Explaining and fixing broken formulas", 10]
        ]
      },
      {
        "title": "Text, Dates and Conditional Math",
        "lectures": [
          ["Text functions for names, codes and emails", 12],
          ["Working with dates and time periods", 12],
          ["SUMIFS, COUNTIFS and AVERAGEIFS", 12],
          ["Formula practice set", 10]
        ]
      },
      {
        "title": "Data Cleaning",
        "lectures": [
          ["Spotting messy data with Claude", 10],
          ["Removing duplicates and fixing spacing", 12],
          ["Standardizing dates, cases and categories", 12],
          ["Splitting and combining columns", 10],
          ["Power Query basics with Claude's help", 12]
        ]
      },
      {
        "title": "Analysis and Pivot Tables",
        "lectures": [
          ["Asking Claude the right analysis questions", 12],
          ["Building pivot tables step by step", 14],
          ["Grouping, filtering and calculated fields", 12],
          ["Uploading files to Claude for analysis", 12]
        ]
      },
      {
        "title": "Charts, Dashboards and Reports",
        "lectures": [
          ["Choosing the right chart for your data", 12],
          ["Building a one page dashboard", 16],
          ["Conditional formatting that highlights insights", 10],
          ["Writing report summaries with Claude", 10]
        ]
      },
      {
        "title": "Automation",
        "lectures": [
          ["Recording and writing simple macros with Claude", 14],
          ["Reusable templates for monthly reports", 12],
          ["Prompt library for Excel tasks", 8]
        ]
      },
      {
        "title": "Capstone: Sales Report from Raw Data",
        "lectures": [
          ["Project brief and raw dataset", 6],
          ["Cleaning and preparing the data", 14],
          ["Analysis, pivots and dashboard", 18],
          ["Final report and next steps", 8]
        ]
      }
    ],
    "requirements": [
      "Microsoft Excel (or Google Sheets for most lessons)",
      "A free or paid Claude account",
      "Basic comfort opening and editing a spreadsheet"
    ],
    "audience": [
      "Office professionals who spend hours on manual Excel work",
      "Business owners tracking sales, expenses and inventory",
      "Students and job seekers improving their spreadsheet skills",
      "Analysts who want faster formula writing and reporting"
    ],
    "description": [
      "Most people use only a small part of Excel because formulas and data work feel slow and confusing. This course shows you how to use Claude as a patient Excel expert sitting beside you, turning plain English requests into working formulas, clean data and clear reports.",
      "You begin by learning how to describe your spreadsheet so Claude understands your columns and goals. Then you generate and debug lookups, logic formulas, text and date functions, and conditional math like SUMIFS and COUNTIFS, always checking results rather than trusting them blindly.",
      "Next you tackle data cleaning, the part of Excel work that wastes the most time. You fix duplicates, spacing, dates and inconsistent categories, split and combine columns and get started with Power Query using step by step help from Claude.",
      "In the analysis and reporting modules you build pivot tables, upload files to Claude for quick insights, choose the right charts and assemble a one page dashboard. You also learn to automate repeated tasks with simple macros and reusable templates.",
      "The course ends with a capstone project where you take a raw sales dataset through cleaning, analysis and a finished dashboard with a written summary, ready for a real monthly report. Every step is explained, so you can repeat the same process with your own data at work or in your business."
    ]
  },
  "claude-deep": {
    "subtitle": "Go from simple chats to complete AI workflows with advanced prompting, Projects, Artifacts, connectors, research and automation in Claude.",
    "learn": [
      "Apply advanced prompting techniques like role, structure, examples and chained prompts",
      "Use XML-style tags and templates for consistent, repeatable outputs",
      "Set up Projects with knowledge files and instructions for long-running work",
      "Build interactive Artifacts such as dashboards, tools and documents",
      "Run deep research with web search and Research mode, then verify sources",
      "Connect Claude to Drive, Gmail, Calendar and other apps with connectors",
      "Extend Claude with MCP servers and reusable skills",
      "Design and run multi-step automation workflows with human review points"
    ],
    "sections": [
      {
        "title": "Introduction: Thinking in Workflows",
        "lectures": [
          ["Welcome and what makes this a deep dive", 5],
          ["From chat to workflow: the mental shift", 12],
          ["Choosing the right Claude model and features", 12]
        ]
      },
      {
        "title": "Advanced Prompting",
        "lectures": [
          ["Structured prompts with sections and tags", 15],
          ["Few-shot examples and output formats", 15],
          ["Prompt chaining for complex tasks", 15],
          ["Using extended thinking for hard problems", 12]
        ]
      },
      {
        "title": "Prompt Systems and Templates",
        "lectures": [
          ["Building a reusable prompt library", 12],
          ["System style instructions and styles", 12],
          ["Evaluating and improving prompt results", 12]
        ]
      },
      {
        "title": "Projects in Depth",
        "lectures": [
          ["Designing a Project for a real role", 15],
          ["Knowledge files: what to include and exclude", 12],
          ["Project instructions that keep quality high", 12],
          ["Team and shared Project practices", 10]
        ]
      },
      {
        "title": "Artifacts in Depth",
        "lectures": [
          ["Interactive tools and calculators", 17],
          ["Dashboards and data visualizations", 15],
          ["Long documents and reports", 12],
          ["Iterating and publishing Artifacts", 10]
        ]
      },
      {
        "title": "Research and Analysis",
        "lectures": [
          ["Web search vs Research mode", 12],
          ["Running a multi-source research task", 17],
          ["Analyzing files and datasets", 15],
          ["Checking claims and citations", 10]
        ]
      },
      {
        "title": "Connectors",
        "lectures": [
          ["Connecting Google Workspace apps", 15],
          ["Working across email, calendar and documents", 15],
          ["Connector permissions and good habits", 8]
        ]
      },
      {
        "title": "MCP and Skills",
        "lectures": [
          ["How MCP extends Claude", 12],
          ["Adding MCP servers in Claude Desktop", 15],
          ["Skills for repeatable, specialised tasks", 15]
        ]
      },
      {
        "title": "Automation Workflows",
        "lectures": [
          ["Mapping a workflow end to end", 12],
          ["Research to report workflow", 17],
          ["Inbox and meeting prep workflow", 15],
          ["Content production workflow", 15],
          ["Review checkpoints and quality control", 8]
        ]
      },
      {
        "title": "Capstone: Your Complete AI Workflow",
        "lectures": [
          ["Choosing your workflow project", 8],
          ["Building it with Projects, connectors and Artifacts", 25],
          ["Testing, refining and documenting", 15],
          ["Next steps", 6]
        ]
      }
    ],
    "requirements": [
      "A paid Claude plan is recommended for Projects, Research and connectors",
      "Basic experience chatting with Claude or another AI assistant",
      "A computer with internet access"
    ],
    "audience": [
      "Intermediate Claude users ready to work at an advanced level",
      "Consultants, analysts and managers who handle research and reports",
      "Business owners building repeatable AI processes",
      "Anyone who wants Claude to do multi-step work, not just answer questions"
    ],
    "description": [
      "You already know how to chat with Claude. This deep dive teaches you how to turn those chats into complete workflows that research, analyze, create and deliver finished work with far less manual effort. Every module builds on the last, and each lesson uses realistic tasks from business, consulting and everyday knowledge work.",
      "The first modules sharpen your prompting with structure, tags, examples, chaining and extended thinking. You then build a prompt library and learn to evaluate outputs so quality stays consistent, not just occasionally good. By the end you will have tested templates you can reuse for research, writing, analysis and planning.",
      "Next you go deep on Projects and Artifacts. You design Projects for real roles with the right knowledge and instructions, and build interactive Artifacts such as calculators, dashboards and long reports that you can iterate on and share. You will also learn how to keep Projects tidy and useful as files and conversations pile up over weeks of real work.",
      "The research and connectors modules show you how to run multi-source research, analyze files, verify citations and connect Claude to Google Workspace apps. You also learn how MCP servers and skills extend Claude with new tools and specialised abilities. Each lesson includes good habits for permissions and privacy so you stay in control of what Claude can access.",
      "Finally you map and build automation workflows for research reports, inbox and meeting preparation and content production, each with review checkpoints. The capstone has you design, build and document a complete workflow for your own work. You leave with a working system, not just a list of tips, and a clear method for building more workflows later."
    ]
  },
  "perplexity": {
    "subtitle": "Use Perplexity AI to search smarter, run deep research, organize Spaces and files, and build reliable research workflows.",
    "learn": [
      "Ask precise questions that get accurate, well sourced Perplexity answers",
      "Evaluate sources and citations to separate reliable facts from weak claims",
      "Use focus options for web, academic, finance and social sources",
      "Run Deep Research to produce detailed, cited reports in minutes",
      "Organize ongoing topics with Spaces, custom instructions and files",
      "Analyze uploaded PDFs and documents alongside live web results",
      "Create Pages to turn research into shareable articles",
      "Build repeatable research workflows for work, study and business decisions"
    ],
    "sections": [
      {
        "title": "Getting Started with Perplexity",
        "lectures": [
          ["Welcome and course overview", 5],
          ["Perplexity vs search engines vs chatbots", 10],
          ["Account, plans and settings tour", 10],
          ["Your first searches and follow-ups", 12]
        ]
      },
      {
        "title": "AI Search and Sources",
        "lectures": [
          ["Writing better search questions", 12],
          ["Reading and checking citations", 12],
          ["Focus modes: web, academic, finance and social", 14],
          ["Choosing models and Pro Search", 10]
        ]
      },
      {
        "title": "Deep Research",
        "lectures": [
          ["What Deep Research does", 10],
          ["Running a Deep Research task", 14],
          ["Refining and extending research reports", 12],
          ["Exporting and sharing results", 8]
        ]
      },
      {
        "title": "Spaces and Files",
        "lectures": [
          ["Creating Spaces for ongoing topics", 12],
          ["Custom instructions for a Space", 10],
          ["Uploading PDFs and documents", 12],
          ["Combining files with web search", 12]
        ]
      },
      {
        "title": "Pages and Content Creation",
        "lectures": [
          ["Turning research into Pages", 12],
          ["Editing and structuring a Page", 10],
          ["Summaries, briefs and comparison tables", 12]
        ]
      },
      {
        "title": "Research Workflows",
        "lectures": [
          ["Market and competitor research", 14],
          ["Study and academic research", 12],
          ["News tracking and fact-checking", 12],
          ["Buying decisions and product comparisons", 10]
        ]
      },
      {
        "title": "Capstone: Full Research Project",
        "lectures": [
          ["Defining your research question", 6],
          ["Researching and organizing in a Space", 14],
          ["Building the final report and Page", 12],
          ["Review and next steps", 6]
        ]
      }
    ],
    "requirements": [
      "A free Perplexity account (Pro recommended for Deep Research and file limits)",
      "A computer or phone with internet access",
      "No prior AI experience needed"
    ],
    "audience": [
      "Students and researchers who need fast, cited answers",
      "Professionals preparing reports, briefs and market research",
      "Business owners comparing options and tracking competitors",
      "Anyone who wants to search smarter than a regular search engine"
    ],
    "description": [
      "Perplexity combines live web search with AI so you get direct answers backed by citations. This course shows you how to use it properly, so your research is faster, better sourced and easier to trust. Whether you are studying, working or running a business, you will learn habits that make every search more useful and every answer easier to verify.",
      "You start with the basics of asking strong questions, reading citations and choosing focus options for web, academic, finance and social sources. You also learn when Pro Search and different models make a difference. Simple exercises after each lesson help you compare answers and build the habit of checking where information comes from.",
      "Next you learn Deep Research, which reads many sources and produces a detailed, cited report. You practise running, refining and exporting reports, and learn to check claims before you rely on them. You will see how to steer a report with follow-up questions and how to turn long findings into short, decision-ready summaries.",
      "The Spaces and files module shows you how to organize ongoing topics, set custom instructions and analyze uploaded PDFs alongside the web. You then turn findings into clear Pages, briefs and comparison tables. These features turn Perplexity from a one-off search box into a research workspace you can return to every day.",
      "Finally you build research workflows for markets and competitors, study, news tracking and buying decisions, and complete a capstone research project from question to finished report. You finish with a finished report, an organized Space and a research process you can reuse for any topic in the future."
    ]
  },
  "deepseek": {
    "subtitle": "Use DeepSeek for search, DeepThink reasoning, research, business, marketing, coding, files and vision in practical workflows.",
    "learn": [
      "Navigate DeepSeek chat, settings and models with confidence",
      "Use Search mode to get current information with linked sources",
      "Apply DeepThink reasoning to solve complex, multi-step problems",
      "Write structured prompts that produce consistent, high quality outputs",
      "Create business plans, marketing copy and campaign ideas with DeepSeek",
      "Write, explain and debug code with DeepSeek's coding abilities",
      "Extract insights from uploaded files, documents and images",
      "Build end to end workflows that combine research, analysis and content"
    ],
    "sections": [
      {
        "title": "Getting Started with DeepSeek",
        "lectures": [
          ["Welcome and course overview", 5],
          ["What DeepSeek is and how it differs", 12],
          ["Interface, app and account setup", 12],
          ["Your first useful conversations", 14]
        ]
      },
      {
        "title": "Search Mode",
        "lectures": [
          ["When to turn Search on", 12],
          ["Getting current, sourced answers", 16],
          ["Checking sources and accuracy", 14],
          ["Search exercises", 14]
        ]
      },
      {
        "title": "DeepThink Reasoning",
        "lectures": [
          ["How DeepThink reasoning works", 14],
          ["Reading the reasoning process", 14],
          ["Solving logic and math problems", 17],
          ["Decision making with DeepThink", 16],
          ["When not to use DeepThink", 8]
        ]
      },
      {
        "title": "Prompting Mastery",
        "lectures": [
          ["Prompt structure for DeepSeek", 16],
          ["Roles, context and constraints", 14],
          ["Output formats and templates", 14],
          ["Iterating to better answers", 12]
        ]
      },
      {
        "title": "Research and Analysis",
        "lectures": [
          ["Combining Search and DeepThink for research", 17],
          ["Comparing options and building tables", 16],
          ["Problem solving frameworks", 16],
          ["Summaries and briefing notes", 12]
        ]
      },
      {
        "title": "Business and Marketing",
        "lectures": [
          ["Business ideas and plans", 16],
          ["Marketing strategy and audience research", 16],
          ["Copywriting for ads, emails and social", 17],
          ["Content calendars and campaigns", 14]
        ]
      },
      {
        "title": "Coding with DeepSeek",
        "lectures": [
          ["Writing code from plain English", 16],
          ["Explaining and debugging code", 16],
          ["Small automation scripts", 16],
          ["Building a simple web page", 14]
        ]
      },
      {
        "title": "Files and Vision",
        "lectures": [
          ["Uploading PDFs, documents and spreadsheets", 14],
          ["Extracting data and summaries from files", 14],
          ["Reading text and details from images", 14]
        ]
      },
      {
        "title": "Practical AI Workflows",
        "lectures": [
          ["Designing a repeatable workflow", 12],
          ["Research to report workflow", 16],
          ["Marketing content workflow", 16],
          ["Privacy and data handling good practice", 10]
        ]
      },
      {
        "title": "Capstone: Real-World Project",
        "lectures": [
          ["Choosing your project", 6],
          ["Research and planning with DeepSeek", 16],
          ["Building the final deliverables", 19],
          ["Review and next steps", 6]
        ]
      }
    ],
    "requirements": [
      "A free DeepSeek account",
      "A computer or phone with internet access",
      "No coding or AI experience required"
    ],
    "audience": [
      "Professionals who want a capable, free AI assistant for daily work",
      "Business owners and marketers creating plans and content",
      "Students solving problems and researching topics",
      "Beginner coders who want help writing and debugging code"
    ],
    "description": [
      "DeepSeek is a powerful AI assistant with web search, a DeepThink reasoning mode, file reading and strong coding ability. This course teaches you to use each of these features for real tasks, not just casual chat. Each module mixes short explanations with practical exercises, so you build real skill quickly even if you have never used an AI tool before.",
      "You start with the interface and simple conversations, then learn when to use Search for current, sourced answers and when to switch on DeepThink for logic, math and multi-step decisions. You also learn to read the reasoning DeepSeek shows and spot where it might be wrong. By the end of these modules you will know which mode to choose for a task and how to combine them.",
      "The prompting module gives you a clear structure for roles, context, constraints and formats. You apply it in research and analysis lessons, building comparison tables, problem solving frameworks and briefing notes. Each lesson comes with ready-to-use prompt examples that you can adapt for your own work and studies.",
      "Next you use DeepSeek for business and marketing work such as plans, audience research, ad and email copy and content calendars. The coding module covers writing, explaining and debugging code and building small scripts and a simple web page. You will also learn practical checks for accuracy before using any output.",
      "Finally you work with files and images, design repeatable workflows and complete a capstone project that combines research, analysis and finished deliverables. You pick a real task from your work or business, research and plan it with DeepSeek, produce the final deliverables and review them carefully. You leave with practical skills and a process you can reuse."
    ]
  },
  "lovable": {
    "subtitle": "Turn ideas into live products with Lovable: prompting, editing, importing, integrations, copy, publishing and MVP building.",
    "learn": [
      "Write clear Lovable prompts that turn an idea into a working app",
      "Edit layouts, styles and components using chat and visual edits",
      "Import designs and existing projects into Lovable",
      "Connect Supabase for databases, authentication and storage",
      "Add integrations like Stripe payments and GitHub sync",
      "Write conversion-focused copy for websites and landing pages",
      "Publish projects and connect a custom domain",
      "Plan, build, test and launch a complete MVP"
    ],
    "sections": [
      {
        "title": "Getting Started with Lovable",
        "lectures": [
          ["Welcome and what you will build", 5],
          ["How Lovable works", 12],
          ["Account, credits and workspace tour", 10],
          ["Your first app in 15 minutes", 18]
        ]
      },
      {
        "title": "Prompting for Apps",
        "lectures": [
          ["Writing a strong first prompt", 14],
          ["Breaking features into steps", 14],
          ["Using Chat mode to plan", 12],
          ["Fixing errors with prompts", 12]
        ]
      },
      {
        "title": "Editing and Design",
        "lectures": [
          ["Visual edits for quick changes", 12],
          ["Layouts, themes and responsive design", 14],
          ["Components, images and icons", 12],
          ["Keeping design consistent", 10]
        ]
      },
      {
        "title": "Websites and Landing Pages",
        "lectures": [
          ["Landing page structure that converts", 14],
          ["Writing headlines, offers and CTAs", 14],
          ["Building a full marketing website", 16],
          ["SEO basics and page settings", 10]
        ]
      },
      {
        "title": "Importing and Integrations",
        "lectures": [
          ["Importing designs and screenshots", 12],
          ["Supabase: database and authentication", 18],
          ["Stripe payments setup", 14],
          ["GitHub sync and version history", 12],
          ["Using APIs and other integrations", 12]
        ]
      },
      {
        "title": "Publishing",
        "lectures": [
          ["Publishing your project", 10],
          ["Custom domains", 10],
          ["Testing on devices and fixing bugs", 14]
        ]
      },
      {
        "title": "MVP Building",
        "lectures": [
          ["From idea to MVP scope", 12],
          ["User flows and core features", 16],
          ["Data, login and payments together", 18],
          ["Testing with real users", 12]
        ]
      },
      {
        "title": "Capstone: Launch Your MVP",
        "lectures": [
          ["Planning your MVP", 8],
          ["Building the product", 24],
          ["Copy, polish and publish", 14],
          ["Launch checklist and next steps", 8]
        ]
      }
    ],
    "requirements": [
      "A free Lovable account (a paid plan helps for larger builds)",
      "A computer with internet access",
      "No coding experience needed"
    ],
    "audience": [
      "Founders and entrepreneurs who want to launch faster",
      "Freelancers building websites and apps for clients",
      "Marketers creating landing pages without developers",
      "Non-technical creators with app ideas"
    ],
    "description": [
      "Lovable lets you build web apps and websites by describing what you want. This 7 hour course takes you from idea to a live product, teaching you to prompt, edit, integrate and publish with confidence. No coding experience is required, and every lesson is hands-on, so you build real projects as you learn instead of just watching.",
      "You start by building a first app in minutes, then learn how to write strong prompts, break features into steps, plan in Chat mode and fix errors without getting stuck in loops. You also learn how to keep projects organized so later changes stay easy as your app grows.",
      "The design and website modules cover visual edits, layouts, responsive design and the copy that makes landing pages work: headlines, offers and calls to action. You build a full marketing site and set up basic SEO. Each step is shown on screen so you can follow along and build your own version at the same time.",
      "Next you connect real functionality: Supabase for databases and logins, Stripe for payments, GitHub sync and other APIs. You then publish your work, connect a custom domain and test on different devices. These lessons explain each integration in simple language and show safe, step by step setup.",
      "Finally you learn a simple MVP process, scoping features, building user flows and testing with real users, and finish by launching your own MVP in the capstone. You plan the product, build it, polish the copy and publish it live, then follow a simple launch checklist so real users can start trying it."
    ]
  },
  "chatgpt-deep": {
    "subtitle": "Go beyond basic prompting with ChatGPT: build GPTs, connect apps, create, code, research, analyze data and automate work.",
    "learn": [
      "Write advanced prompts and custom instructions for consistent results",
      "Use ChatGPT memory and Projects to organize long-running work",
      "Build custom GPTs with instructions, knowledge files and actions",
      "Connect ChatGPT to Google Drive, Gmail and other apps with connectors",
      "Create images, documents and presentations with ChatGPT",
      "Write and debug code and build small apps using Canvas",
      "Run deep research and analyze spreadsheets and data files",
      "Automate recurring work with scheduled tasks and agent mode"
    ],
    "sections": [
      {
        "title": "Beyond Basic Prompting",
        "lectures": [
          ["Welcome and course roadmap", 5],
          ["Models and when to use each", 15],
          ["Advanced prompt structures", 20],
          ["Custom instructions and personalization", 15],
          ["Memory and Projects", 18]
        ]
      },
      {
        "title": "Build: Custom GPTs",
        "lectures": [
          ["What GPTs are and when to build one", 13],
          ["Writing GPT instructions", 20],
          ["Knowledge files and capabilities", 18],
          ["Actions and sharing your GPT", 18]
        ]
      },
      {
        "title": "Connect: Apps and Connectors",
        "lectures": [
          ["How connectors work", 13],
          ["Google Drive, Gmail and Calendar", 20],
          ["Working with your own files", 15],
          ["Privacy and permission basics", 11]
        ]
      },
      {
        "title": "Create: Images and Content",
        "lectures": [
          ["Image generation and editing", 20],
          ["Writing documents and reports", 18],
          ["Presentations and visual content", 18],
          ["Brand voice and content systems", 15]
        ]
      },
      {
        "title": "Code: Canvas and Programming",
        "lectures": [
          ["Canvas for writing and code", 15],
          ["Writing and explaining code", 18],
          ["Debugging and improving code", 18],
          ["Building a small web app", 22]
        ]
      },
      {
        "title": "Research: Search and Deep Research",
        "lectures": [
          ["Web search for current information", 13],
          ["Running deep research", 20],
          ["Verifying sources and claims", 13]
        ]
      },
      {
        "title": "Analyze: Data and Files",
        "lectures": [
          ["Uploading spreadsheets and CSVs", 15],
          ["Charts and data insights", 20],
          ["Analyzing PDFs and reports", 15],
          ["Business analysis examples", 15]
        ]
      },
      {
        "title": "Automate: Tasks and Agent",
        "lectures": [
          ["Scheduled tasks and reminders", 15],
          ["Agent mode for multi-step tasks", 20],
          ["Workflow design for productivity", 18]
        ]
      },
      {
        "title": "Practical Workplace Applications",
        "lectures": [
          ["Email and meeting workflows", 15],
          ["Sales and marketing workflows", 15],
          ["Operations and HR workflows", 15]
        ]
      },
      {
        "title": "Capstone: Your Connected AI Workflow",
        "lectures": [
          ["Planning the workflow", 9],
          ["Building GPT, connectors and outputs", 26],
          ["Testing and next steps", 11]
        ]
      }
    ],
    "requirements": [
      "A ChatGPT account (a paid plan is needed for some features like GPT building and agent mode)",
      "A computer with internet access",
      "Basic experience using ChatGPT"
    ],
    "audience": [
      "Professionals who want ChatGPT to handle real workplace tasks",
      "Business owners automating content, research and admin",
      "Team leads building GPTs and workflows for their teams",
      "Users who know the basics and want to go much further"
    ],
    "description": [
      "Most people use ChatGPT for quick questions. This deep dive shows you how to use the full platform to build, connect, create, code, research, analyze and automate, so it becomes a real part of how you work. The course is organized around seven verbs, so each module adds a new capability you can use right away in your job or business.",
      "You begin with advanced prompting, custom instructions, memory and Projects. Then you build your own custom GPTs with instructions, knowledge files and actions, and connect ChatGPT to apps such as Google Drive, Gmail and Calendar. Each step is demonstrated with practical examples you can copy and adapt for your own tasks.",
      "In the create and code modules you generate and edit images, write documents and presentations, use Canvas for writing and coding, and build a small web app even if you are new to programming. You also learn how to keep a consistent brand voice across everything you create.",
      "The research and analysis modules cover web search, deep research, source checking and data analysis on spreadsheets and PDFs, with charts and business insights. Then you automate recurring work with scheduled tasks and agent mode. You learn where human review is still needed and how to set up tasks so results stay reliable.",
      "The course closes with practical workplace workflows for email, meetings, sales, marketing, operations and HR, plus a capstone where you build a connected AI workflow for your own role. You plan the workflow, build the GPT and connections it needs, test the outputs and refine it until it saves you real time every week."
    ]
  },
  "omni-basics": {
    "subtitle": "Learn Google's AI image tools to create consistent characters, outfits, scenes, product visuals and story series with reusable workflows.",
    "learn": [
      "Understand how reference images guide Google's AI image generation and editing",
      "Create a consistent character with stable facial identity across images",
      "Change outfits, poses and expressions without losing the character",
      "Place characters in new scenes, environments and lighting",
      "Produce product and brand visuals with consistent styling",
      "Build multi-image visual stories and content series",
      "Write editing prompts that make precise, controlled changes",
      "Save reusable consistency workflows and prompt templates"
    ],
    "sections": [
      {
        "title": "Getting Started",
        "lectures": [
          ["Welcome and course overview", 5],
          ["Accessing Google's AI image tools", 12],
          ["How image generation and editing prompts work", 16],
          ["Your first edits with a reference image", 16]
        ]
      },
      {
        "title": "Consistent Characters and Facial Identity",
        "lectures": [
          ["Designing a character reference", 16],
          ["Character sheets and multiple angles", 18],
          ["Keeping the face consistent", 18],
          ["Fixing identity drift", 14]
        ]
      },
      {
        "title": "Outfits, Poses and Expressions",
        "lectures": [
          ["Changing outfits while keeping identity", 16],
          ["Poses and body language", 16],
          ["Facial expressions and emotions", 14],
          ["Accessories and styling details", 12]
        ]
      },
      {
        "title": "Scenes and Environments",
        "lectures": [
          ["Placing characters in new locations", 16],
          ["Lighting and time of day", 14],
          ["Background replacement and blending", 14],
          ["Combining multiple reference images", 16]
        ]
      },
      {
        "title": "Product and Brand Visuals",
        "lectures": [
          ["Product shots from a single photo", 16],
          ["Lifestyle and in-use scenes", 16],
          ["Brand colors and consistent styling", 14],
          ["Ad and social media formats", 14]
        ]
      },
      {
        "title": "Visual Stories and Content Series",
        "lectures": [
          ["Planning a visual story", 12],
          ["Storyboards and sequential images", 18],
          ["Content series for social media", 16]
        ]
      },
      {
        "title": "Reusable Consistency Workflows",
        "lectures": [
          ["Building prompt templates", 12],
          ["Organizing references and assets", 12],
          ["Quality checks before publishing", 10]
        ]
      },
      {
        "title": "Capstone: Character Story Series",
        "lectures": [
          ["Planning the series", 8],
          ["Creating the character and scenes", 20],
          ["Finishing and exporting the series", 12]
        ]
      }
    ],
    "requirements": [
      "A Google account with access to Gemini",
      "A computer or phone with internet access",
      "No design experience needed"
    ],
    "audience": [
      "Content creators who need consistent characters for social media",
      "Small business owners creating product and brand visuals",
      "Marketers producing campaign images quickly",
      "Storytellers and educators creating visual series"
    ],
    "description": [
      "Keeping a character or product consistent across many images is one of the hardest parts of AI image creation. This course teaches you how to do it with Google's AI image generation and editing tools, step by step. It is designed for beginners, with clear demonstrations and practical exercises in every module.",
      "You begin with how image prompts and reference images work, then create a character reference and character sheet. You learn how to keep the face consistent across images and how to fix drift when the identity starts to change. These techniques form the foundation for everything else in the course.",
      "Next you change outfits, poses, expressions and accessories while keeping the same character, then move them into new scenes with different lighting, backgrounds and combined reference images. Each lesson shows before and after examples so you can see exactly how a prompt change affects the result, and how to recover when an edit goes wrong.",
      "The product and brand module applies the same skills to business: product shots, lifestyle scenes, brand colors and ad formats. You then plan visual stories, storyboards and social content series. You will learn which details to repeat in every prompt so your series stays visually connected.",
      "Finally you build reusable consistency workflows with prompt templates and organized references, and complete a capstone character story series ready to publish. You plan the series, create the character and scenes and finish with a set of consistent images you can publish or present, along with templates you can reuse for future projects."
    ]
  },
  "mj-entry": {
    "subtitle": "Learn Midjourney from the ground up: prompting, composition, lighting, style, character consistency, Remix and image-to-video.",
    "learn": [
      "Navigate the Midjourney web app and create your first images",
      "Write prompts with clear subject, composition and camera framing",
      "Control lighting, color and style to set the mood of an image",
      "Use aspect ratio, stylize, chaos and other key parameters",
      "Keep characters consistent with Omni Reference and image prompts",
      "Refine images through variations, Remix and Vary Region",
      "Animate still images into short clips with image-to-video",
      "Build a small professional portfolio using a repeatable workflow"
    ],
    "sections": [
      {
        "title": "Getting Started with Midjourney",
        "lectures": [
          ["Welcome and what you will create", 5],
          ["Plans and setting up your account", 12],
          ["Tour of the Midjourney web app", 16],
          ["Creating your first images", 19]
        ]
      },
      {
        "title": "Professional Prompting and Composition",
        "lectures": [
          ["The structure of a good prompt", 19],
          ["Subject and composition basics", 19],
          ["Camera framing and angles", 19],
          ["Image prompts and blending", 16]
        ]
      },
      {
        "title": "Lighting, Style and Output Control",
        "lectures": [
          ["Lighting that sets the mood", 19],
          ["Color and artistic styles", 19],
          ["Aspect ratio, stylize and chaos", 21],
          ["Style Reference basics", 16],
          ["Raw mode and model versions", 14]
        ]
      },
      {
        "title": "Character Consistency and Omni Reference",
        "lectures": [
          ["Why characters change between images", 12],
          ["Using Omni Reference", 21],
          ["Same character, different scenes", 19],
          ["Tips for stable results", 14]
        ]
      },
      {
        "title": "Remix and Iterative Refinement",
        "lectures": [
          ["Variations: subtle and strong", 14],
          ["Remix mode", 16],
          ["Vary Region for fixes", 16],
          ["Upscaling your best images", 14]
        ]
      },
      {
        "title": "Image-to-Video",
        "lectures": [
          ["Animating an image", 16],
          ["Motion settings and prompts", 16],
          ["Extending and saving clips", 14]
        ]
      },
      {
        "title": "Professional Creative Workflows",
        "lectures": [
          ["Social media visuals", 16],
          ["Product and brand images", 16],
          ["Organizing and exporting work", 12]
        ]
      },
      {
        "title": "Capstone: Your First Portfolio",
        "lectures": [
          ["Planning your portfolio set", 9],
          ["Creating the images and a short clip", 28],
          ["Review and next steps", 9]
        ]
      }
    ],
    "requirements": [
      "A paid Midjourney subscription",
      "A computer with internet access",
      "No design or AI experience needed"
    ],
    "audience": [
      "Complete beginners who want to create AI art and visuals",
      "Social media creators and small business owners",
      "Designers exploring AI image tools",
      "Students building a creative portfolio"
    ],
    "description": [
      "This course is the easiest way to start creating professional images with Midjourney. You learn the tools and techniques in a clear order, so you go from your first image to a small portfolio with confidence. No design background is needed, and every lesson includes simple exercises you can follow on screen.",
      "You begin with account setup and a tour of the Midjourney web app, then learn how to write prompts with a clear subject, composition and camera framing. You also try image prompts and blending. Each idea is shown with clear before and after examples, so you understand what every change in your prompt does.",
      "Next you control lighting, color and style, and learn the key parameters such as aspect ratio, stylize and chaos, plus Style Reference basics, raw mode and model versions. You will practise each setting on the same subject, which makes the differences easy to see and remember.",
      "Then you tackle character consistency with Omni Reference, refine images with variations, Remix and Vary Region, and upscale your best work. You also animate images with image-to-video. These are the techniques that turn a lucky image into a result you can repeat on purpose whenever you need it.",
      "The course ends with workflows for social media and product visuals and a capstone where you build your first portfolio set, including a short animated clip. You plan the set, create the images and clip and review your work against simple quality checks. You leave with a portfolio and a workflow you can use for future projects."
    ]
  },
  "kling-basics": {
    "subtitle": "Create cinematic AI videos with Kling: text-to-video, image-to-video, camera motion, character consistency and refinement.",
    "learn": [
      "Navigate Kling AI and understand its video models and settings",
      "Generate clips from text prompts with clear subject, action and setting",
      "Animate still images into video with image-to-video",
      "Direct camera motion like pans, zooms, tracking and orbit shots",
      "Keep characters consistent across multiple clips using references",
      "Write prompts that tell a visual story shot by shot",
      "Refine results with negative prompts, start and end frames and motion control",
      "Assemble clips into a short finished AI film"
    ],
    "sections": [
      {
        "title": "Getting Started with Kling AI",
        "lectures": [
          ["Welcome and course overview", 5],
          ["Kling account, credits and plans", 10],
          ["Interface tour and video settings", 14],
          ["Your first AI video", 15]
        ]
      },
      {
        "title": "Text-to-Video",
        "lectures": [
          ["Prompt structure for video", 15],
          ["Subject, action and setting", 15],
          ["Duration, aspect ratio and quality modes", 14],
          ["Text-to-video exercises", 15]
        ]
      },
      {
        "title": "Image-to-Video",
        "lectures": [
          ["Choosing good source images", 12],
          ["Animating images with motion prompts", 15],
          ["Start and end frames", 15],
          ["Image-to-video exercises", 14]
        ]
      },
      {
        "title": "Camera Motion and Cinematic Shots",
        "lectures": [
          ["Camera language for AI video", 14],
          ["Pans, tilts, zooms and tracking", 17],
          ["Cinematic shot types", 15],
          ["Mood, lighting and pacing", 14]
        ]
      },
      {
        "title": "Character Consistency",
        "lectures": [
          ["Why consistency is hard in video", 10],
          ["Using reference images for characters", 17],
          ["Same character across shots", 15]
        ]
      },
      {
        "title": "Prompting and Visual Storytelling",
        "lectures": [
          ["Planning a story in shots", 14],
          ["Writing a shot list", 14],
          ["Transitions and continuity", 14]
        ]
      },
      {
        "title": "Refinement and Motion Control",
        "lectures": [
          ["Negative prompts and fixes", 12],
          ["Motion brush and controlled movement", 15],
          ["Extending and upscaling clips", 14]
        ]
      },
      {
        "title": "Professional AI Video Workflows",
        "lectures": [
          ["Editing clips together", 14],
          ["Adding music, voice and text", 14],
          ["Formats for social media and ads", 12]
        ]
      },
      {
        "title": "Capstone: Your First AI Short Film",
        "lectures": [
          ["Planning your short", 8],
          ["Generating all shots", 19],
          ["Editing and final export", 12]
        ]
      }
    ],
    "requirements": [
      "A Kling AI account (paid credits recommended)",
      "A computer with internet access",
      "Free video editing software such as CapCut is helpful"
    ],
    "audience": [
      "Content creators who want cinematic AI video",
      "Marketers producing short ads and reels",
      "Filmmakers and storytellers exploring AI tools",
      "Beginners curious about AI video creation"
    ],
    "description": [
      "Kling AI turns text and images into realistic video clips. This course teaches you the fundamentals of creating cinematic AI video, from your first clip to a finished short film. Every lesson is practical and beginner friendly, with exercises that help you understand exactly how prompts and settings change your results.",
      "You start with the interface, credits and settings, then learn text-to-video prompting: subject, action, setting, duration, aspect ratio and quality modes. Hands-on exercises help you see what each choice changes. You also learn how to choose settings that save credits while you are still experimenting with ideas.",
      "Next you animate still images with image-to-video, use start and end frames and direct the camera with pans, tilts, zooms, tracking and cinematic shot types that give your clips a professional feel. Each technique is demonstrated with examples you can recreate in your own Kling account.",
      "The middle modules focus on character consistency with reference images and visual storytelling with shot lists, transitions and continuity. You then refine results with negative prompts, motion control, extending and upscaling. These lessons help you plan before you generate, which saves credits and gives you better results.",
      "Finally you learn a professional workflow for editing clips together with music, voice and text, and complete a capstone AI short film ready for social media. You plan your story, generate every shot, edit the clips together and export a final film. You leave with a portfolio piece and a repeatable workflow for future AI video projects."
    ]
  },
  "canva-ai": {
    "subtitle": "Design faster with Canva AI: Magic Design, Magic Write, AI images, Brand Kits and a full month of social content in hours.",
    "learn": [
      "Generate polished first drafts of posts, decks and flyers with Magic Design",
      "Write captions, headlines and slide copy quickly using Magic Write prompts",
      "Create original images with Canva's AI image generator and Dream Lab",
      "Edit photos with Magic Edit, Magic Eraser, Magic Expand and Background Remover",
      "Set up a Brand Kit with logos, colours and fonts for consistent designs",
      "Resize one design into every social format instantly with Magic Switch",
      "Build reusable templates that keep your whole team on brand",
      "Plan, design and schedule a month of social media content inside Canva"
    ],
    "sections": [
      {
        "title": "Getting Started with Canva AI",
        "lectures": [
          ["Welcome and how this course works", 4],
          ["Tour of the Canva editor and Magic Studio", 9],
          ["Free vs Pro: which AI features you get", 6],
          ["Setting up your workspace and folders", 6]
        ]
      },
      {
        "title": "Magic Design: AI-Generated Layouts",
        "lectures": [
          ["What Magic Design does well and where it needs you", 6],
          ["Turning a prompt into a social post design", 9],
          ["Generating presentations from a short brief", 11],
          ["Customising AI layouts so they look like yours", 9],
          ["Practice: three designs from one idea", 7]
        ]
      },
      {
        "title": "Magic Write: AI Copy Inside Your Designs",
        "lectures": [
          ["Magic Write basics and good prompts", 7],
          ["Captions, hooks and headlines for social posts", 9],
          ["Rewriting tone: formal, friendly, persuasive", 7],
          ["Writing slide content and speaker notes", 7],
          ["Translating designs with Magic Switch", 6]
        ]
      },
      {
        "title": "AI Images and Graphics",
        "lectures": [
          ["Text to image: writing prompts that work", 9],
          ["Choosing styles and aspect ratios", 7],
          ["Dream Lab for richer, realistic images", 9],
          ["Generating icons, patterns and backgrounds", 7],
          ["Using AI images responsibly and legally", 6]
        ]
      },
      {
        "title": "AI Photo Editing Tools",
        "lectures": [
          ["Background Remover for clean product shots", 7],
          ["Magic Eraser to remove distractions", 7],
          ["Magic Edit to replace or add objects", 8],
          ["Magic Expand and Magic Grab for flexible layouts", 8],
          ["Before and after editing practice", 7]
        ]
      },
      {
        "title": "Brand Kits and Consistent Design",
        "lectures": [
          ["Why brand consistency matters online", 5],
          ["Building your Brand Kit: logo, colours, fonts", 11],
          ["Brand templates your team can reuse", 9],
          ["Applying brand styles to AI generated designs", 8]
        ]
      },
      {
        "title": "Social Media Content at Speed",
        "lectures": [
          ["Planning a content calendar with AI", 9],
          ["Instagram posts, carousels and Reels covers", 11],
          ["Resizing for LinkedIn, Facebook and YouTube with Magic Switch", 8],
          ["Short videos with Canva's video editor and AI tools", 11],
          ["Scheduling posts with Canva Content Planner", 7]
        ]
      },
      {
        "title": "Capstone: Your 30-Day Content Pack",
        "lectures": [
          ["Project brief: one brand, one month of posts", 5],
          ["Building the content pack step by step", 19],
          ["Review checklist and quality fixes", 7],
          ["Exporting, sharing and next steps", 6]
        ]
      }
    ],
    "requirements": [
      "A free Canva account (Canva Pro unlocks more AI features)",
      "A laptop or desktop with a modern browser",
      "No design experience needed"
    ],
    "audience": [
      "Small business owners who create their own marketing posts",
      "Students and professionals who need clean presentations fast",
      "Social media managers and freelancers handling multiple brands",
      "Beginners who want to design without learning complex software"
    ],
    "description": [
      "Canva has quietly become one of the most useful AI tools for anyone who needs to look professional online. This course shows you how to use Canva's AI features, collected under Magic Studio, to go from a blank page to a finished, on-brand design in minutes rather than hours. You will work through real tasks such as social posts, presentations, flyers and short videos.",
      "We start with Magic Design, which turns a short prompt into ready-made layouts, and Magic Write, which drafts captions, headlines and slide text inside your design. You will learn how to guide these tools with clear prompts, and how to edit the results so they reflect your own style instead of looking generic.",
      "Next you will create original visuals with Canva's AI image generator and fix photos using Background Remover, Magic Eraser, Magic Edit, Magic Expand and Magic Grab. These tools let you produce clean product shots and banners without opening any other software.",
      "Consistency is what makes a brand recognisable, so a full module covers Brand Kits and brand templates. You will set up your logo, colours and fonts once, then apply them across everything you create, including designs that AI generates for you.",
      "The course ends with a capstone project where you plan and design a 30-day social media content pack, resize it for every platform with Magic Switch and schedule it using Canva's Content Planner. You leave with a working system you can reuse every month."
    ]
  },
  "gemini": {
    "subtitle": "Use Google Gemini like a pro: better prompts, custom Gems, Deep Research, Gmail, Docs and Sheets, and multimodal tasks.",
    "learn": [
      "Write clear, structured prompts that get reliable answers from Gemini",
      "Build custom Gems that act as reusable assistants for repeated tasks",
      "Run Deep Research to produce sourced reports on any topic",
      "Draft, summarise and reply to emails faster with Gemini in Gmail",
      "Write and edit documents with Gemini in Google Docs",
      "Organise data, build formulas and summarise tables with Gemini in Sheets",
      "Analyse images, PDFs, audio and video files with Gemini's multimodal abilities",
      "Combine Gemini tools into a personal workflow that saves hours each week"
    ],
    "sections": [
      {
        "title": "Introduction to Gemini",
        "lectures": [
          ["Welcome and course roadmap", 4],
          ["Gemini app, models and plans explained", 11],
          ["Setting up your account and settings", 8],
          ["Your first useful conversation", 8]
        ]
      },
      {
        "title": "Prompting Fundamentals",
        "lectures": [
          ["Anatomy of a good prompt: role, task, context, format", 13],
          ["Giving examples and constraints", 11],
          ["Iterating: follow-ups that improve answers", 11],
          ["Common prompting mistakes and fixes", 8],
          ["Prompt library you can reuse", 8]
        ]
      },
      {
        "title": "Gems: Your Custom AI Assistants",
        "lectures": [
          ["What Gems are and when to use them", 6],
          ["Building your first Gem step by step", 13],
          ["Writing strong Gem instructions", 11],
          ["Adding files and knowledge to a Gem", 8],
          ["Five practical Gems for work and study", 13]
        ]
      },
      {
        "title": "Deep Research",
        "lectures": [
          ["How Deep Research works", 8],
          ["Planning a research question", 8],
          ["Reviewing the research plan and sources", 11],
          ["Turning reports into summaries and slides", 11],
          ["Checking facts and citations", 8]
        ]
      },
      {
        "title": "Gemini in Gmail",
        "lectures": [
          ["Enabling Gemini in Google Workspace", 6],
          ["Summarising long email threads", 8],
          ["Drafting replies with Help me write", 11],
          ["Searching your inbox with natural language", 8]
        ]
      },
      {
        "title": "Gemini in Docs and Sheets",
        "lectures": [
          ["Drafting and rewriting in Google Docs", 13],
          ["Summaries, outlines and tone changes", 11],
          ["Gemini in Sheets: tables, formulas and insights", 15],
          ["Cleaning and organising data with prompts", 13],
          ["Linking Drive files to your prompts", 8]
        ]
      },
      {
        "title": "Multimodal Tasks",
        "lectures": [
          ["Analysing images and screenshots", 11],
          ["Working with PDFs and long documents", 11],
          ["Audio and video understanding", 11],
          ["Generating images in the Gemini app", 11],
          ["Gemini Live for voice conversations", 8]
        ]
      },
      {
        "title": "Capstone: Your Gemini Workflow",
        "lectures": [
          ["Mapping your weekly tasks to Gemini tools", 8],
          ["Building a research to report pipeline", 16],
          ["Privacy, accuracy and responsible use", 8],
          ["Final checklist and next steps", 5]
        ]
      }
    ],
    "requirements": [
      "A Google account (some features need a Google AI or Workspace plan)",
      "Basic comfort with Gmail, Docs and Sheets",
      "No AI or coding experience required"
    ],
    "audience": [
      "Professionals who live in Gmail, Docs and Sheets every day",
      "Students and researchers who want faster, sourced research",
      "Business owners looking to automate routine writing and analysis",
      "Anyone new to AI who wants a practical starting point"
    ],
    "description": [
      "Gemini is Google's AI assistant, and it now sits inside the tools many of us already use every day. This course teaches you how to use it properly, from writing good prompts in the Gemini app to getting real work done in Gmail, Docs and Sheets. Every lesson is practical, with examples you can copy and adapt.",
      "You will begin with prompting fundamentals: how to give Gemini a role, a clear task, enough context and the right output format. Then you will learn to save that effort by building Gems, custom assistants that remember your instructions so you can reuse them for repeated tasks like content drafting, study help or report writing.",
      "The Deep Research module shows you how to turn a single question into a structured, sourced report, and how to check the sources before you rely on them. This is one of the most valuable features for students, consultants and anyone who regularly needs to understand a new topic quickly.",
      "Next you will bring Gemini into Google Workspace. You will summarise long email threads, draft replies, write and edit documents, and use Gemini in Sheets to organise data and explain formulas. You will also explore multimodal tasks such as analysing images, PDFs, audio and video files.",
      "In the final capstone you will design your own Gemini workflow based on your weekly tasks, so the course ends with a system you actually use, not just a list of features. Each lesson includes ready-to-use prompts and short exercises, so you can apply what you learn to your own work the same day."
    ]
  },
  "portfolio": {
    "subtitle": "Use AI to build a professional portfolio, job-ready case studies, a strong personal brand and confident interview skills.",
    "learn": [
      "Audit your profile and identify skill gaps against your target roles",
      "Build a clean professional portfolio website using AI tools",
      "Showcase skills, projects and achievements with clear, measurable impact",
      "Write job-ready case studies that explain your problem solving process",
      "Optimise your LinkedIn profile and personal brand with AI assistance",
      "Prepare for technical and HR interviews using AI mock interviews",
      "Craft strong answers using the STAR method with AI feedback",
      "Create a 30-day plan to close skill gaps and grow your profile"
    ],
    "sections": [
      {
        "title": "Introduction: Building a Winning Profile",
        "lectures": [
          ["Welcome and what recruiters look for", 5],
          ["How AI fits into your job search", 8],
          ["Setting your target roles", 7]
        ]
      },
      {
        "title": "Skill-Gap Identification",
        "lectures": [
          ["Analysing job descriptions with AI", 10],
          ["Mapping your current skills", 8],
          ["Finding gaps and prioritising them", 8],
          ["Creating a learning plan", 7]
        ]
      },
      {
        "title": "AI-Powered Professional Portfolio",
        "lectures": [
          ["Choosing a portfolio platform", 8],
          ["Generating structure and copy with ChatGPT or Claude", 12],
          ["Designing visuals with Canva AI", 10],
          ["Publishing and sharing your portfolio", 8]
        ]
      },
      {
        "title": "Skills, Projects and Achievement Showcase",
        "lectures": [
          ["Turning tasks into achievements", 10],
          ["Writing impact focused project summaries", 10],
          ["Presenting certificates and skills", 7],
          ["Adding visuals and proof of work", 8]
        ]
      },
      {
        "title": "Job-Ready Case Studies",
        "lectures": [
          ["Case study structure: problem, approach, result", 10],
          ["Drafting a case study with AI", 12],
          ["Editing for clarity and honesty", 8],
          ["Practice: write your first case study", 12]
        ]
      },
      {
        "title": "Professional Profile and Personal Branding",
        "lectures": [
          ["Your personal brand statement", 8],
          ["LinkedIn headline, About and Featured sections", 12],
          ["Content ideas to stay visible", 8],
          ["Networking messages that get replies", 8]
        ]
      },
      {
        "title": "AI-Powered Interview Preparation",
        "lectures": [
          ["Researching the company with AI", 8],
          ["Predicting likely interview questions", 8],
          ["STAR answers with AI feedback", 10]
        ]
      },
      {
        "title": "Technical and HR Interview Practice",
        "lectures": [
          ["Running mock interviews with AI", 12],
          ["Technical question practice", 10],
          ["HR and behavioural question practice", 10],
          ["Final review: portfolio and interview checklist", 7]
        ]
      }
    ],
    "requirements": [
      "A free ChatGPT, Claude or Gemini account",
      "Your current resume or a list of your work and projects",
      "No design or coding skills needed"
    ],
    "audience": [
      "Students and fresh graduates preparing for their first job",
      "Professionals switching careers or roles",
      "Job seekers who get few interview calls",
      "Freelancers who want a stronger online presence"
    ],
    "description": [
      "A resume alone rarely shows what you can actually do. This course helps you build a portfolio and profile that prove your skills, using AI to speed up every step while keeping the content honest and personal. Every step includes prompts and examples you can adapt, so you spend your time improving content instead of staring at a blank page.",
      "You will start by identifying exactly what your target roles require. Using AI to analyse job descriptions, you will map your current skills, find the gaps and create a short, realistic learning plan to close them. Throughout, the focus stays on accuracy: AI helps you express your real experience clearly, never invent experience you do not have.",
      "Next you will build a professional portfolio, using ChatGPT or Claude to draft structure and copy and Canva AI to design visuals. You will learn how to turn everyday tasks into clear achievements and how to write job-ready case studies that explain your problem, your approach and your results.",
      "Personal branding comes next. You will refine your LinkedIn headline, About section and Featured content, and learn simple ways to stay visible to recruiters without spending hours posting. You will practise each step on your own material, so by the end of the module your profile is updated and ready to share.",
      "The final modules focus on interviews. You will use AI to research companies, predict likely questions, practise technical and HR rounds, and improve STAR format answers with instant feedback. You finish with a complete portfolio and a clear preparation routine."
    ]
  },
  "job-agent": {
    "subtitle": "Build your own AI job application agent that scores roles, filters the best matches and prepares tailored applications.",
    "learn": [
      "Define your career direction and analyse skill gaps with AI",
      "Create an AI-optimised resume that adapts to each job description",
      "Score your profile against job listings using a clear job-fit rubric",
      "Automate job matching and filtering so only relevant roles reach you",
      "Shortlist jobs smartly based on fit, salary, location and growth",
      "Generate job-specific resumes and cover letters in minutes",
      "Set up an auto-apply workflow with human review before submission",
      "Run a repeatable weekly job search system that tracks every application"
    ],
    "sections": [
      {
        "title": "Introduction: Your AI Job Application Agent",
        "lectures": [
          ["Welcome and the agent we will build", 6],
          ["How AI agents work in plain language", 9],
          ["Tools you need and setup", 9]
        ]
      },
      {
        "title": "Career Direction and Skill Gap Analysis",
        "lectures": [
          ["Choosing target roles and industries", 9],
          ["Skill gap analysis with ChatGPT or Claude", 11],
          ["Turning gaps into a short action plan", 8]
        ]
      },
      {
        "title": "AI-Powered Resume and CV",
        "lectures": [
          ["Building a master resume", 13],
          ["ATS friendly formatting", 9],
          ["Writing achievement bullet points with AI", 11]
        ]
      },
      {
        "title": "Profile and Job-Fit Scoring",
        "lectures": [
          ["Designing a job-fit scoring rubric", 11],
          ["Prompting AI to score a job description", 11],
          ["Testing and calibrating your scores", 9]
        ]
      },
      {
        "title": "Automated Job Matching and Filtering",
        "lectures": [
          ["Collecting job listings from portals and alerts", 11],
          ["Organising jobs in Google Sheets or Notion", 11],
          ["Automating scoring with no-code tools", 15],
          ["Filtering rules that remove poor matches", 9]
        ]
      },
      {
        "title": "Smart Job Shortlisting",
        "lectures": [
          ["Ranking by fit, salary and growth", 9],
          ["Researching companies with AI", 9],
          ["Building your weekly shortlist", 8]
        ]
      },
      {
        "title": "Job-Specific Applications and Auto-Apply Workflow",
        "lectures": [
          ["Tailoring resumes to each job", 13],
          ["Cover letters and recruiter messages", 11],
          ["Auto-apply workflow with human review", 15],
          ["Avoiding spam and keeping quality high", 7]
        ]
      },
      {
        "title": "Your Repeatable AI Job Search System",
        "lectures": [
          ["Tracking applications and follow-ups", 9],
          ["Weekly review routine", 8],
          ["Capstone: run the full agent end to end", 17],
          ["Next steps and maintaining your system", 4]
        ]
      }
    ],
    "requirements": [
      "A free ChatGPT, Claude or Gemini account",
      "A Google account for Sheets, or a Notion account",
      "Basic computer skills, no coding required"
    ],
    "audience": [
      "Job seekers applying to many roles who want to save time",
      "Graduates entering a competitive job market",
      "Professionals planning a career switch",
      "Anyone who wants a structured, organised job search"
    ],
    "description": [
      "Applying for jobs is repetitive, and most of that repetition can be handled by AI. In this course you will build a simple AI job application agent that helps you score listings, filter out poor matches and prepare tailored applications, while you stay in control of every final decision.",
      "You will start with direction: choosing target roles, analysing your skill gaps and creating a strong master resume. This becomes the foundation the agent uses for every application. You stay in charge of every decision: the agent does the repetitive sorting and drafting, and you approve what gets sent to employers.",
      "Next you will design a job-fit scoring rubric and teach AI to apply it to real job descriptions. You will collect listings into Google Sheets or Notion, automate the scoring with no-code tools and set filtering rules so only relevant roles reach your shortlist.",
      "From the shortlist, the agent helps you tailor a resume, cover letter and recruiter message for each role. You will set up an auto-apply workflow that includes a human review step, so quality stays high and applications never look automated.",
      "Finally you will turn everything into a repeatable weekly routine with tracking and follow-ups. The capstone walks you through running the complete system end to end, so you leave with a working process rather than just theory. All of this runs on free or low-cost tools, so you can set it up quickly without writing code or buying expensive software."
    ]
  },
  "meta-ads": {
    "subtitle": "Plan, create, launch and optimise Facebook and Instagram ads with AI, and prepare for the Meta 410-101 certification exam.",
    "learn": [
      "Navigate Meta Business Suite, Business Manager and Meta Ads Manager confidently",
      "Install the Meta Pixel and Conversions API to track results accurately",
      "Research audiences, competitors and offers using AI and the Meta Ad Library",
      "Write ad copy and hooks with ChatGPT and Claude that match your audience",
      "Build campaigns with the right objective, budget, placements and bidding",
      "Set up retargeting and lookalike audiences to recover lost customers",
      "Read Ads Manager reports and optimise for cost per result and ROAS",
      "Prepare for the Meta Certified Media Buying Professional 410-101 exam"
    ],
    "sections": [
      {
        "title": "Introduction to Meta Advertising",
        "lectures": [
          ["Welcome and course roadmap", 7],
          ["How the Meta ads ecosystem works", 18],
          ["Facebook vs Instagram: audiences and formats", 14],
          ["Using AI throughout the ads workflow", 14],
          ["Setting realistic goals and budgets", 14]
        ]
      },
      {
        "title": "Setting Up Your Meta Business Foundation",
        "lectures": [
          ["Creating a Business Portfolio in Meta Business Suite", 18],
          ["Facebook Page and Instagram account connection", 14],
          ["Creating an ad account and payment method", 14],
          ["Users, roles and permissions", 12],
          ["Business verification basics", 12]
        ]
      },
      {
        "title": "Tracking: Meta Pixel and Conversions API",
        "lectures": [
          ["What the Meta Pixel does", 14],
          ["Installing the Pixel on your website", 21],
          ["Standard events and custom conversions", 21],
          ["Conversions API overview", 18],
          ["Testing with Events Manager", 14]
        ]
      },
      {
        "title": "AI-Powered Market and Audience Research",
        "lectures": [
          ["Defining your customer avatar with AI", 21],
          ["Competitor research with the Meta Ad Library", 21],
          ["Finding pain points and offers with ChatGPT", 18],
          ["Audience interest research", 18],
          ["Practice: build a research brief", 18]
        ]
      },
      {
        "title": "AI Ad Copywriting",
        "lectures": [
          ["Principles of high-converting ad copy", 18],
          ["Hooks and primary text with AI prompts", 21],
          ["Headlines, descriptions and CTAs", 14],
          ["Copy frameworks: AIDA and PAS", 18],
          ["Creating copy variations for testing", 18]
        ]
      },
      {
        "title": "AI Ad Creatives: Images, Carousels and Reels",
        "lectures": [
          ["Creative best practices for Meta placements", 18],
          ["Designing image ads with Canva AI", 23],
          ["Carousel ads that tell a story", 18],
          ["Short video and Reels ads with AI tools", 26],
          ["Using Meta's Advantage+ creative features", 14]
        ]
      },
      {
        "title": "Campaign Structure and Objectives",
        "lectures": [
          ["Campaign, ad set and ad levels", 18],
          ["Choosing the right objective", 18],
          ["Budgets: campaign vs ad set", 18],
          ["Bid strategies explained", 18],
          ["Placements and Advantage+ placements", 14]
        ]
      },
      {
        "title": "Building and Launching Campaigns",
        "lectures": [
          ["Awareness campaign walkthrough", 21],
          ["Traffic and engagement campaign", 21],
          ["Leads campaign with Instant Forms", 26],
          ["Sales campaign with Pixel events", 26],
          ["Pre-launch checklist and ad review", 14]
        ]
      },
      {
        "title": "Retargeting and Lookalike Audiences",
        "lectures": [
          ["Custom audiences from website, video and engagement", 26],
          ["Building a retargeting funnel", 26],
          ["Lookalike audiences", 18],
          ["Exclusions and audience overlap", 14]
        ]
      },
      {
        "title": "Analytics and Optimisation",
        "lectures": [
          ["Reading Ads Manager columns and breakdowns", 26],
          ["Key metrics: CTR, CPM, CPC, CPA and ROAS", 23],
          ["A/B testing in Ads Manager", 21],
          ["Using AI to analyse results", 21],
          ["Scaling winning campaigns", 21]
        ]
      },
      {
        "title": "Capstone Project: Full Funnel Campaign",
        "lectures": [
          ["Project brief and planning", 14],
          ["Research and copy with AI", 26],
          ["Creatives and campaign build", 35],
          ["Launch, review and optimisation plan", 23]
        ]
      },
      {
        "title": "Meta 410-101 Exam Preparation",
        "lectures": [
          ["Exam format and how to register", 14],
          ["Key topics and official study resources", 23],
          ["Practice question walkthroughs", 35],
          ["Exam tips and final revision plan", 18]
        ]
      }
    ],
    "requirements": [
      "A Facebook account and an Instagram account",
      "A free ChatGPT or Claude account and a free Canva account",
      "A small ad budget is helpful for practice but not mandatory"
    ],
    "audience": [
      "Business owners who want to run their own Facebook and Instagram ads",
      "Aspiring digital marketers and freelancers",
      "Marketing professionals preparing for the Meta 410-101 exam",
      "Beginners with basic social media knowledge"
    ],
    "description": [
      "Facebook and Instagram remain two of the most powerful places to reach customers, but Meta Ads Manager can feel overwhelming at first. This course takes you step by step from account setup to running full funnel campaigns, using AI to make research, copywriting and creative production faster.",
      "You will begin by setting up your business foundation correctly in Meta Business Suite, connecting your Facebook Page and Instagram account, and installing the Meta Pixel and Conversions API so your results are tracked accurately from day one. Getting this foundation right prevents common problems later, such as missing conversion data, disabled ad accounts or confusing permission issues for your team.",
      "Next you will use AI and the Meta Ad Library to research customers and competitors, then write ad copy with ChatGPT and Claude using proven frameworks. You will design image, carousel and Reels creatives with Canva AI and learn how to produce variations for testing.",
      "The campaign modules cover objectives, budgets, bid strategies and placements, followed by hands-on builds for awareness, traffic, leads and sales campaigns. You will also set up retargeting and lookalike audiences to bring people back and reach similar customers. Every exercise uses a sample business, so you can follow along even if you do not yet have your own product or client.",
      "Analytics and optimisation get a full module: reading Ads Manager reports, understanding CTR, CPM, CPA and ROAS, running A/B tests and scaling what works. A capstone project brings everything together in one complete campaign. Throughout the course, the emphasis is on testing ideas with small budgets and letting real data decide what to scale, rather than guessing.",
      "The final module prepares you for the Meta Certified Media Buying Professional 410-101 exam, with a review of key topics, official resources and practice question walkthroughs. Use this module as a structured revision guide alongside Meta's own Blueprint learning materials before you book your exam."
    ]
  },
  "ai-marketing": {
    "subtitle": "Build a complete AI-powered marketing system: strategy, copy, email, visuals, ad copy, analytics and a 30-day plan.",
    "learn": [
      "Define a clear USP and marketing strategy for your business with AI",
      "Write website, social and sales copy using ChatGPT, Claude and Jasper",
      "Plan and write email sequences that nurture leads into customers",
      "Create on-brand visuals with Canva AI and Midjourney",
      "Produce a steady flow of social content without starting from scratch",
      "Write and test paid ad copy for Meta and Google campaigns",
      "Use AI to analyse marketing data and turn it into decisions",
      "Organise everything in a 30-day AI marketing system in Notion"
    ],
    "sections": [
      {
        "title": "Introduction to AI Marketing",
        "lectures": [
          ["Welcome and the system we will build", 5],
          ["Choosing the right AI tools", 9],
          ["Setting up your marketing workspace in Notion", 9]
        ]
      },
      {
        "title": "USP and Marketing Strategy",
        "lectures": [
          ["Finding your USP with AI", 11],
          ["Customer personas and pain points", 11],
          ["Positioning and messaging", 9],
          ["Building your one-page strategy", 9]
        ]
      },
      {
        "title": "AI Copywriting and Email Marketing",
        "lectures": [
          ["Website and landing page copy", 11],
          ["Copy frameworks with ChatGPT and Claude", 11],
          ["Using Jasper with brand voice", 9],
          ["Welcome and nurture email sequences", 14],
          ["Subject lines and testing", 7]
        ]
      },
      {
        "title": "Visuals and Social Content",
        "lectures": [
          ["Brand visuals with Canva AI", 11],
          ["Image generation with Midjourney", 11],
          ["Social content pillars and calendar", 9],
          ["Repurposing one idea into many posts", 11]
        ]
      },
      {
        "title": "Paid Ad Copy",
        "lectures": [
          ["Ad copy for Meta ads", 11],
          ["Search ad copy for Google Ads", 11],
          ["Creating variations to test", 9]
        ]
      },
      {
        "title": "AI-Assisted Analytics",
        "lectures": [
          ["Key marketing metrics to track", 9],
          ["Analysing data with ChatGPT and Claude", 14],
          ["Turning insights into next actions", 9]
        ]
      },
      {
        "title": "Your 30-Day AI Marketing System",
        "lectures": [
          ["Building the 30-day plan in Notion", 14],
          ["Weekly routine and prompts library", 11],
          ["Capstone: launch your first week", 16],
          ["Next steps and scaling", 5]
        ]
      }
    ],
    "requirements": [
      "Free accounts for ChatGPT, Claude, Canva and Notion",
      "Paid tools like Jasper and Midjourney are optional",
      "Basic knowledge of your own business or product"
    ],
    "audience": [
      "Small business owners and founders doing their own marketing",
      "Marketers who want to work faster with AI",
      "Freelancers and consultants serving multiple clients",
      "Students exploring a career in digital marketing"
    ],
    "description": [
      "Most businesses use AI for marketing in random bursts: a caption here, an email there. This course helps you build a complete, connected marketing system where AI supports every step, from strategy to analytics. Each step comes with prompts and templates you can reuse, so you are not starting from a blank page every time you need new content.",
      "You will begin by defining your USP, customer personas and positioning with AI, then turn them into a one-page marketing strategy. This strategy guides everything you create afterwards, so your messaging stays consistent. You will also learn how to keep a consistent brand voice across tools, so content written by different AI assistants still sounds like your business.",
      "Next you will write website copy, social posts and email sequences using ChatGPT, Claude and Jasper, and create visuals with Canva AI and Midjourney. You will learn how to repurpose a single idea into many pieces of content and plan a social calendar that is easy to maintain.",
      "Paid ad copy for Meta and Google, along with AI-assisted analytics, completes the toolkit. You will learn which metrics matter and how to ask AI to explain your data in plain language so you can decide what to do next.",
      "Finally you will assemble everything into a 30-day AI marketing system in Notion, with a weekly routine and a reusable prompt library, and launch your first week in the capstone. By the end you will have a simple, repeatable routine that takes a few hours a week rather than consuming your entire schedule."
    ]
  },
  "ai-finance": {
    "subtitle": "Use AI for bookkeeping, tax research, reconciliation, financial analysis, forecasting and client advisory, with no prior AI experience.",
    "learn": [
      "Categorise transactions and speed up bookkeeping with AI prompts",
      "Research tax questions with AI and verify answers against official sources",
      "Detect anomalies and duplicates during bank and ledger reconciliation",
      "Extract and summarise data from invoices, statements and financial reports",
      "Perform variance analysis and explain the drivers behind the numbers",
      "Build simple revenue and cash flow forecasts with AI assistance",
      "Write clear client emails, reports and advisory notes with AI",
      "Set up a reusable AI accounting hub of prompts and templates"
    ],
    "sections": [
      {
        "title": "Introduction to AI for Accounting",
        "lectures": [
          ["Welcome and course roadmap", 5],
          ["What AI can and cannot do in accounting", 10],
          ["Choosing tools: ChatGPT, Claude, Gemini and Copilot", 10],
          ["Data privacy and confidentiality", 10]
        ]
      },
      {
        "title": "AI-Assisted Bookkeeping",
        "lectures": [
          ["Categorising transactions with AI", 14],
          ["Cleaning messy data in Excel and Sheets", 14],
          ["Writing formulas with AI help", 12],
          ["Month-end checklist automation", 10]
        ]
      },
      {
        "title": "Tax Research with AI",
        "lectures": [
          ["Asking good tax research questions", 10],
          ["Summarising rules and circulars", 12],
          ["Verifying answers against official sources", 10],
          ["Documenting research for files", 8]
        ]
      },
      {
        "title": "Anomaly Detection and Reconciliation",
        "lectures": [
          ["Spotting unusual transactions", 12],
          ["Finding duplicates and missing entries", 12],
          ["Bank reconciliation workflow with AI", 15],
          ["Exception reports", 8]
        ]
      },
      {
        "title": "Financial Document Analysis",
        "lectures": [
          ["Extracting data from invoices and PDFs", 12],
          ["Reading financial statements with AI", 14],
          ["Ratio analysis made simple", 12],
          ["Summarising annual reports", 10]
        ]
      },
      {
        "title": "Variance Analysis and Forecasting",
        "lectures": [
          ["Budget vs actual variance analysis", 14],
          ["Explaining variance drivers", 10],
          ["Building a revenue forecast", 14],
          ["Cash flow forecasting", 12],
          ["Scenario planning", 10]
        ]
      },
      {
        "title": "Client Communication and Advisory",
        "lectures": [
          ["Writing clear client emails", 10],
          ["Turning numbers into insights", 12],
          ["Preparing advisory reports", 12],
          ["Meeting prep and follow-ups", 8]
        ]
      },
      {
        "title": "Capstone: Your Reusable AI Accounting Hub",
        "lectures": [
          ["Designing your prompt library", 10],
          ["Templates for recurring tasks", 10],
          ["Capstone walkthrough: month-end with AI", 15],
          ["Review and next steps", 5]
        ]
      }
    ],
    "requirements": [
      "Basic knowledge of accounting or bookkeeping",
      "Access to Excel or Google Sheets",
      "A free ChatGPT, Claude or Gemini account",
      "No prior AI experience required"
    ],
    "audience": [
      "Accountants and bookkeepers who want to save time",
      "Finance professionals working on analysis and reporting",
      "Tax practitioners and consultants",
      "Commerce students preparing for finance roles"
    ],
    "description": [
      "Accounting work involves a lot of repetitive steps that AI can now handle quickly, from categorising transactions to drafting client emails. This course shows accountants and finance professionals how to use AI tools safely and effectively, with no prior AI experience required.",
      "You will start with bookkeeping: categorising transactions, cleaning messy data in Excel or Google Sheets and writing formulas with AI help. Then you will learn to research tax questions with AI while always verifying answers against official sources, because accuracy matters.",
      "The reconciliation module shows how to spot anomalies, duplicates and missing entries, and how to build an exception report. You will also use AI to extract information from invoices, statements and annual reports, and to perform ratio analysis. Throughout the course, you will learn how to protect client data, review AI output carefully and keep a clear audit trail of your work.",
      "Next you will run budget versus actual variance analysis, explain the drivers behind the numbers and build simple revenue and cash flow forecasts with scenarios. These are the skills that move you from data entry towards advisory work. Each technique is shown with realistic sample data in Excel or Google Sheets, so you can repeat the steps with your own clients straight away.",
      "Finally you will practise client communication and assemble a reusable AI accounting hub: a library of prompts and templates you can apply to every month-end close. This hub becomes your personal toolkit, ready to adapt for new clients, new reporting needs and the regular cycle of monthly and quarterly work."
    ]
  },
  "ai-pm": {
    "subtitle": "Apply ChatGPT, Claude, Perplexity and Gemini across the product lifecycle, from discovery and PRDs to launch and growth.",
    "learn": [
      "Run customer discovery and synthesise interviews and feedback with AI",
      "Research markets and competitors quickly using Perplexity and Gemini",
      "Prioritise features using RICE and other frameworks with AI support",
      "Write PRDs, user stories and acceptance criteria with ChatGPT and Claude",
      "Build product roadmaps that communicate clear outcomes",
      "Define MVPs and create quick prototypes and design briefs",
      "Plan launches, growth experiments and success metrics",
      "Create a reusable AI product hub of prompts and templates"
    ],
    "sections": [
      {
        "title": "Introduction: AI for Product Managers",
        "lectures": [
          ["Welcome and course roadmap", 5],
          ["The product lifecycle and where AI helps", 11],
          ["Comparing ChatGPT, Claude, Perplexity and Gemini", 13]
        ]
      },
      {
        "title": "Discovery and Customer Research",
        "lectures": [
          ["Planning discovery with AI", 11],
          ["Interview scripts and survey design", 13],
          ["Synthesising interviews and feedback", 15],
          ["Market and competitor research with Perplexity", 15]
        ]
      },
      {
        "title": "Strategy and Prioritisation",
        "lectures": [
          ["Vision, goals and OKRs", 11],
          ["Prioritisation with RICE and MoSCoW", 15],
          ["Opportunity solution trees", 11],
          ["Making trade-off decisions", 11]
        ]
      },
      {
        "title": "PRDs, User Stories and Roadmaps",
        "lectures": [
          ["Writing a PRD with AI", 18],
          ["User stories and acceptance criteria", 15],
          ["Edge cases and requirements review", 11],
          ["Building outcome based roadmaps", 13]
        ]
      },
      {
        "title": "MVP, Design and Agile Workflows",
        "lectures": [
          ["Defining an MVP", 11],
          ["Wireframes and design briefs with AI", 13],
          ["AI prototyping tools overview", 13],
          ["Sprint planning and backlog grooming", 13],
          ["Release notes and documentation", 9]
        ]
      },
      {
        "title": "Launch, Growth and Experimentation",
        "lectures": [
          ["Go-to-market planning", 13],
          ["Launch messaging and FAQs", 11],
          ["Success metrics and dashboards", 13],
          ["Designing A/B experiments", 13],
          ["Analysing results with AI", 11]
        ]
      },
      {
        "title": "Capstone: Your Reusable AI Product Hub",
        "lectures": [
          ["Organising prompts and templates", 13],
          ["Capstone: from idea to launch plan", 24],
          ["Responsible AI use in product work", 9],
          ["Next steps", 4]
        ]
      }
    ],
    "requirements": [
      "Basic understanding of how software products are built",
      "Free accounts for ChatGPT, Claude, Perplexity or Gemini",
      "No coding required"
    ],
    "audience": [
      "Product managers and product owners",
      "Aspiring PMs moving from engineering, design or business roles",
      "Founders building their first product",
      "Business analysts working with product teams"
    ],
    "description": [
      "Product managers juggle research, strategy, documentation and stakeholder communication every day. This course shows you how to use ChatGPT, Claude, Perplexity and Gemini at each stage of the product lifecycle so you spend less time on drafts and more time on decisions.",
      "You will begin with discovery: planning research, writing interview scripts, synthesising customer feedback and researching markets and competitors. AI helps you find patterns quickly, while you stay responsible for judgement. Every module includes prompts and templates you can copy into your own work, along with tips on which tool suits each task best.",
      "Next comes strategy and prioritisation. You will set goals and OKRs and use frameworks like RICE, MoSCoW and opportunity solution trees, with AI helping you structure trade-offs and explain them clearly to stakeholders. You will learn to use AI to challenge your own assumptions too, which leads to stronger, better reasoned product decisions.",
      "The documentation module covers PRDs, user stories, acceptance criteria and outcome based roadmaps. You will then define MVPs, write design briefs, explore AI prototyping tools and run agile workflows such as sprint planning and backlog grooming. Each document is created with a worked example, so you can see what good looks like and adapt the template for your own product.",
      "Finally you will plan launches, define success metrics and design experiments, then build a reusable AI product hub you can bring into any product role. The capstone takes one product idea from discovery to a complete launch plan, so you can see the entire workflow working together."
    ]
  },
  "ai-projects": {
    "subtitle": "Use ChatGPT, Claude, Perplexity and Gemini to plan, run and close projects: charters, WBS, Gantt, RACI, risks and reporting.",
    "learn": [
      "Draft project charters and scope statements quickly with AI",
      "Break work into a clear WBS and convert it into a Gantt schedule",
      "Build RACI matrices that clarify roles and responsibilities",
      "Identify, score and plan responses for project risks with AI",
      "Plan resources and manage change requests with proper control",
      "Write status reports, meeting minutes and stakeholder updates faster",
      "Set up quality checklists and lessons learned for project closure",
      "Build a reusable AI project hub covering initiation to closure"
    ],
    "sections": [
      {
        "title": "Introduction: AI for Project Management",
        "lectures": [
          ["Welcome and course roadmap", 6],
          ["Project lifecycle: initiation to closure", 11],
          ["Choosing ChatGPT, Claude, Perplexity or Gemini", 11]
        ]
      },
      {
        "title": "Initiation: Charter and Scope",
        "lectures": [
          ["Writing a project charter with AI", 16],
          ["Stakeholder identification", 11],
          ["Scope statement and assumptions", 11]
        ]
      },
      {
        "title": "Planning: WBS, Gantt and RACI",
        "lectures": [
          ["Building a WBS with AI", 16],
          ["Estimating durations", 11],
          ["Creating a Gantt chart in Excel or Sheets", 16],
          ["RACI matrix", 11]
        ]
      },
      {
        "title": "Risk, Resources and Change Control",
        "lectures": [
          ["Risk identification and register", 13],
          ["Risk scoring and responses", 11],
          ["Resource planning", 11],
          ["Change requests and change log", 11]
        ]
      },
      {
        "title": "Execution: Reporting and Communication",
        "lectures": [
          ["Status reports with AI", 13],
          ["Meeting agendas and minutes", 11],
          ["Stakeholder communication plan", 11],
          ["Handling difficult updates", 9]
        ]
      },
      {
        "title": "Quality and Monitoring",
        "lectures": [
          ["Quality plans and checklists", 11],
          ["Tracking progress and issues", 11],
          ["Dashboards and KPIs", 11]
        ]
      },
      {
        "title": "Closure and Your Reusable AI Project Hub",
        "lectures": [
          ["Project closure report", 11],
          ["Lessons learned", 9],
          ["Building your AI project hub", 13],
          ["Capstone: run a sample project end to end", 18],
          ["Next steps", 4]
        ]
      }
    ],
    "requirements": [
      "Basic familiarity with how projects run at work",
      "Access to Excel or Google Sheets",
      "A free ChatGPT, Claude, Perplexity or Gemini account"
    ],
    "audience": [
      "Project managers and coordinators",
      "Team leads who manage projects without a formal PM title",
      "Professionals preparing for PMP or CAPM style roles",
      "Consultants and freelancers managing client projects"
    ],
    "description": [
      "Project management involves a lot of documentation, and much of it follows predictable patterns. This course shows you how to use ChatGPT, Claude, Perplexity and Gemini to create project documents faster and communicate more clearly, across the full lifecycle from initiation to closure.",
      "You will start by drafting a project charter, identifying stakeholders and writing a scope statement. Then you will plan the work: building a WBS, estimating durations, creating a Gantt chart in Excel or Google Sheets and defining roles with a RACI matrix.",
      "The risk and control module covers risk registers, scoring and responses, resource planning and change control. AI helps you think of risks you might have missed, while you decide what matters for your project. Each document is created with a worked example, so you can follow along and then adapt the same template to your real projects at work.",
      "During execution you will write status reports, meeting minutes and stakeholder updates in minutes rather than hours, and set up quality checklists, dashboards and KPIs to keep the project on track. You will also learn how to review AI output carefully, so your plans remain realistic, accurate and suited to your organisation's way of working.",
      "Finally you will close the project with a closure report and lessons learned, and build a reusable AI project hub. The capstone walks through a sample project from start to finish. Prompts and templates are provided throughout, so you build a practical toolkit as you progress through each stage of the lifecycle."
    ]
  },
  "gads-mastery": {
    "subtitle": "Make Google Ads profitable with AI: Search, Performance Max and Demand Gen, with 101 practical prompts and data-driven decisions.",
    "learn": [
      "Plan Google Ads campaigns around clear goals, budgets and conversions",
      "Research keywords and match types using Keyword Planner and AI prompts",
      "Write responsive search ads with strong headlines and descriptions",
      "Build Performance Max campaigns with quality asset groups and signals",
      "Create Demand Gen campaigns for YouTube, Discover and Gmail",
      "Choose the right bidding strategy and manage budgets confidently",
      "Analyse search terms, metrics and reports to find waste and wins",
      "Optimise and scale campaigns using the rule: AI suggests, you verify, data decides"
    ],
    "sections": [
      {
        "title": "Introduction: AI-Powered Google Ads",
        "lectures": [
          ["Welcome and how to use the 101 prompts", 7],
          ["How Google Ads works today", 16],
          ["AI suggests, you verify, data decides", 13],
          ["Account structure overview", 13]
        ]
      },
      {
        "title": "Foundations: Goals, Tracking and Budgets",
        "lectures": [
          ["Setting business goals and KPIs", 13],
          ["Conversion tracking with Google Tag and GA4", 22],
          ["Budget planning with AI", 15],
          ["Pre-campaign checklist", 9]
        ]
      },
      {
        "title": "Keyword Research with AI",
        "lectures": [
          ["Keyword Planner walkthrough", 20],
          ["Expanding keyword ideas with AI prompts", 16],
          ["Match types and search intent", 16],
          ["Negative keyword lists", 15]
        ]
      },
      {
        "title": "Search Campaigns",
        "lectures": [
          ["Building a Search campaign step by step", 27],
          ["Writing responsive search ads with AI", 22],
          ["Assets: sitelinks, callouts and more", 15],
          ["Landing page relevance", 13]
        ]
      },
      {
        "title": "Performance Max Campaigns",
        "lectures": [
          ["How Performance Max works", 16],
          ["Asset groups and creatives with AI", 24],
          ["Audience signals and search themes", 16],
          ["Reading PMax insights", 15]
        ]
      },
      {
        "title": "Demand Gen Campaigns",
        "lectures": [
          ["Demand Gen on YouTube, Discover and Gmail", 16],
          ["Image and video creatives", 20],
          ["Audiences and lookalike segments", 16],
          ["Demand Gen reporting", 11]
        ]
      },
      {
        "title": "Bidding and Budget Management",
        "lectures": [
          ["Smart Bidding strategies explained", 20],
          ["Target CPA and target ROAS", 16],
          ["Budget pacing and shared budgets", 13]
        ]
      },
      {
        "title": "Analysis, Optimisation and Scaling",
        "lectures": [
          ["Key metrics and custom columns", 16],
          ["Search terms report and wasted spend", 20],
          ["Analysing data with AI prompts", 20],
          ["Experiments and A/B testing", 16],
          ["Capstone: optimise and scale an account", 27]
        ]
      }
    ],
    "requirements": [
      "A Google account to create a Google Ads account",
      "A website or landing page is helpful",
      "A free ChatGPT, Claude or Gemini account",
      "Basic understanding of online marketing"
    ],
    "audience": [
      "Business owners running or planning Google Ads",
      "Digital marketers who want better results from Google Ads",
      "Freelancers and agency staff managing client accounts",
      "Marketers moving from Meta ads to Google Ads"
    ],
    "description": [
      "Google Ads can bring high-intent customers to your business, but only if campaigns are set up and managed well. This course teaches you how to use AI to plan, build and optimise campaigns across Search, Performance Max and Demand Gen, guided by one simple rule: AI suggests, you verify, data decides.",
      "You will start with foundations: business goals, conversion tracking with the Google tag and GA4, and budget planning. Then you will research keywords with Keyword Planner, expand ideas with AI prompts and organise them by match type and intent, including negative keyword lists.",
      "Each campaign type gets its own module. You will build Search campaigns with responsive search ads and assets, create Performance Max campaigns with strong asset groups and audience signals, and launch Demand Gen campaigns for YouTube, Discover and Gmail. Every lesson shows the actual Google Ads interface, so you can follow along in your own account and apply each step immediately.",
      "A dedicated module covers Smart Bidding strategies, target CPA and target ROAS, and budget pacing. You will learn when automated bidding helps and when you need more data first. You will learn how to brief AI with your business context, so the suggestions you get are relevant instead of generic.",
      "The final module focuses on analysis and optimisation: custom columns, search terms reports, experiments and AI-assisted analysis. With 101 practical prompts included, you will have a ready toolkit for every stage of campaign management. This approach keeps decisions grounded in real performance data, which is the most reliable way to improve results over time."
    ]
  },
  "ai-seo": {
    "subtitle": "Use AI to research keywords, study competitors, plan and write content, optimise pages and improve your search rankings.",
    "learn": [
      "Find keywords and understand search intent with AI and free SEO tools",
      "Analyse competitors to discover content gaps and opportunities",
      "Plan topic clusters and a content calendar that builds authority",
      "Write helpful SEO content with AI while keeping it original",
      "Optimise titles, meta descriptions, headings and internal links",
      "Improve existing pages using data from Google Search Console",
      "Make your content easier for AI search features to understand and cite",
      "Follow a repeatable workflow: search, research, plan, create, optimise, improve"
    ],
    "sections": [
      {
        "title": "Introduction to AI for SEO",
        "lectures": [
          ["Welcome and the SEO workflow", 5],
          ["How search engines and AI search work", 11],
          ["Tools we will use", 8]
        ]
      },
      {
        "title": "Keyword and Search Intent Research",
        "lectures": [
          ["Keyword research with AI prompts", 13],
          ["Using Google Keyword Planner and Search Console", 13],
          ["Understanding search intent", 11],
          ["Prioritising keywords", 9]
        ]
      },
      {
        "title": "Competitor Analysis",
        "lectures": [
          ["Identifying real search competitors", 9],
          ["Analysing competitor content with AI", 13],
          ["Finding content gaps", 11]
        ]
      },
      {
        "title": "Content Planning and Creation",
        "lectures": [
          ["Topic clusters and pillar pages", 11],
          ["Content briefs with AI", 11],
          ["Writing SEO content with ChatGPT or Claude", 15],
          ["Editing for quality, accuracy and E-E-A-T", 11]
        ]
      },
      {
        "title": "On-Page SEO and Content Optimisation",
        "lectures": [
          ["Titles and meta descriptions", 9],
          ["Headings, structure and readability", 9],
          ["Internal linking", 9],
          ["Image SEO and schema basics", 11]
        ]
      },
      {
        "title": "SEO Analysis and Improvement",
        "lectures": [
          ["Reading Google Search Console reports", 13],
          ["Refreshing underperforming pages", 11],
          ["Visibility in AI search results", 11],
          ["Capstone: optimise one page end to end", 15],
          ["Next steps", 4]
        ]
      }
    ],
    "requirements": [
      "A website or blog you can edit is helpful",
      "A free ChatGPT, Claude or Gemini account",
      "A Google account for Search Console",
      "No technical SEO background needed"
    ],
    "audience": [
      "Business owners who want more customers from Google",
      "Bloggers and content writers",
      "Digital marketers new to SEO",
      "Freelancers offering SEO services"
    ],
    "description": [
      "When customers search for what you offer, either they find you or they find your competitors. This course shows you how to use AI to make SEO faster and more practical, following a clear workflow: search, research, plan, create, optimise and improve.",
      "You will start with keyword research and search intent, combining AI prompts with Google Keyword Planner and Search Console. Then you will analyse competitors to understand what they rank for and where the content gaps are. Each step uses free or low-cost tools, and every lesson includes prompts you can copy and adapt for your own website straight away.",
      "Next you will plan topic clusters and write content briefs with AI, then create SEO content using ChatGPT or Claude. You will learn how to edit AI drafts so they are accurate, original and genuinely useful to readers. Along the way, you will learn to check AI suggestions against real search data, so your strategy is based on evidence rather than guesswork.",
      "The on-page module covers titles, meta descriptions, headings, internal links, image SEO and schema basics. Finally you will use Google Search Console to find pages that need improvement, refresh them and make your content easier for AI search features to understand.",
      "The capstone walks you through optimising one real page from start to finish, so you have a process you can repeat for every page on your site. You will also learn how to measure progress over time, so you can see which changes actually helped your pages perform better."
    ]
  },
  "gads-setup": {
    "subtitle": "Set up Google Ads step by step with AI: research, build and launch Search, Performance Max and Demand Gen campaigns, then optimise.",
    "learn": [
      "Create and configure a Google Ads account with conversion tracking",
      "Research customers, competitors and keywords with 101 practical AI prompts",
      "Choose targeting for locations, languages, audiences and devices",
      "Build and launch Search campaigns with responsive search ads and assets",
      "Set up Performance Max and Demand Gen campaigns with quality creatives",
      "Understand CPC, CTR, CPA, conversion rate and ROAS with confidence",
      "Diagnose underperforming campaigns and run structured tests",
      "Use the Campaign Master Workbook and a 30-day optimisation plan"
    ],
    "sections": [
      {
        "title": "Welcome and Google Ads Basics",
        "lectures": [
          ["Welcome and how to use the workbook", 7],
          ["How Google Ads auctions work", 17],
          ["Campaign types: Search, PMax and Demand Gen", 17],
          ["Using AI prompts responsibly", 11]
        ]
      },
      {
        "title": "Account Setup and Conversion Tracking",
        "lectures": [
          ["Creating your Google Ads account", 17],
          ["Billing and account settings", 11],
          ["Installing the Google tag", 21],
          ["Setting up conversions and GA4 linking", 23],
          ["Testing tracking with Tag Assistant", 14]
        ]
      },
      {
        "title": "AI-Powered Business and Customer Research",
        "lectures": [
          ["Defining offers and goals", 14],
          ["Customer personas with AI", 17],
          ["Competitor research with Ads Transparency Center", 17],
          ["Writing your campaign brief", 14]
        ]
      },
      {
        "title": "Keyword Research",
        "lectures": [
          ["Keyword Planner step by step", 23],
          ["Expanding keywords with AI prompts", 17],
          ["Match types and grouping", 21],
          ["Negative keywords", 16],
          ["Practice: build your keyword plan", 17]
        ]
      },
      {
        "title": "Targeting and Audiences",
        "lectures": [
          ["Locations and languages", 14],
          ["Audience segments", 17],
          ["Devices and ad schedule", 11],
          ["Customer Match and remarketing lists", 17]
        ]
      },
      {
        "title": "Building Search Campaigns",
        "lectures": [
          ["Campaign settings walkthrough", 23],
          ["Ad groups and keywords", 21],
          ["Responsive search ads with AI", 25],
          ["Assets: sitelinks, callouts and images", 17],
          ["Launch checklist", 11]
        ]
      },
      {
        "title": "Building Performance Max Campaigns",
        "lectures": [
          ["When to use Performance Max", 14],
          ["Asset groups and creatives with AI", 25],
          ["Audience signals and search themes", 17],
          ["Brand exclusions and URL settings", 14],
          ["Launching PMax", 11]
        ]
      },
      {
        "title": "Building Demand Gen Campaigns",
        "lectures": [
          ["Demand Gen explained", 14],
          ["Image and video ads", 23],
          ["Audiences and lookalike segments", 17],
          ["Launching Demand Gen", 14]
        ]
      },
      {
        "title": "Bidding and Budgets",
        "lectures": [
          ["Bidding strategies for beginners", 21],
          ["Budget planning", 14],
          ["When to switch to Smart Bidding", 14]
        ]
      },
      {
        "title": "Performance Analysis: CPC, CTR, CPA and ROAS",
        "lectures": [
          ["Reading the Google Ads dashboard", 21],
          ["Key metrics explained", 23],
          ["Custom columns and segments", 17],
          ["Analysing reports with AI", 21]
        ]
      },
      {
        "title": "Diagnose, Testing and Optimisation",
        "lectures": [
          ["Diagnosing low impressions and clicks", 21],
          ["Fixing low conversions", 21],
          ["Search terms and wasted spend", 17],
          ["Experiments and ad variations", 21],
          ["Optimisation score and recommendations", 14]
        ]
      },
      {
        "title": "Campaign Master Workbook and 30-Day Plan",
        "lectures": [
          ["Workbook walkthrough", 17],
          ["Your 30-day optimisation plan", 21],
          ["Capstone: build and launch your campaign", 34],
          ["Next steps", 7]
        ]
      }
    ],
    "requirements": [
      "A Google account",
      "A website or landing page for your business",
      "A free ChatGPT, Claude or Gemini account",
      "No prior Google Ads experience needed"
    ],
    "audience": [
      "Beginners launching their first Google Ads campaign",
      "Small business owners who want to manage ads themselves",
      "Marketing students and junior marketers",
      "Freelancers building a Google Ads service"
    ],
    "description": [
      "If you have never run Google Ads before, this course takes you from an empty account to live, tracked campaigns, one step at a time. AI supports every stage with 101 practical prompts, while you learn to check its suggestions against real data.",
      "You will create your Google Ads account, set up billing and install conversion tracking with the Google tag and GA4. Then you will research your customers, competitors and keywords, using Keyword Planner, the Ads Transparency Center and AI prompts to build a solid campaign brief.",
      "Next you will set up targeting and build three campaign types: Search, Performance Max and Demand Gen. Each build is shown step by step, including responsive search ads, asset groups, audience signals and creatives. Each step is demonstrated inside the real Google Ads interface, so you can follow along in your own account at your own pace.",
      "Once campaigns are live, you will learn to read performance data. CPC, CTR, CPA, conversion rate and ROAS are explained in plain language, and you will use AI to help interpret reports and spot problems. Understanding these numbers helps you make sensible decisions about budgets and know when a campaign needs changes or simply more time.",
      "The diagnose and optimise module teaches you how to fix low impressions, low clicks and low conversions, reduce wasted spend and run experiments. You finish with the Campaign Master Workbook and a 30-day optimisation plan to keep improving after launch."
    ]
  },
  "nocode-web": {
    "subtitle": "Build, launch and sell websites, apps and dashboards with Lovable, Bolt.new and Zapier, without traditional coding.",
    "learn": [
      "Plan a website or app from a clear brief, user flow and page list",
      "Generate working web apps from prompts using Lovable and Bolt.new",
      "Add AI-powered features such as chat assistants, summaries and smart forms",
      "Build simple dashboards that display data from forms and spreadsheets",
      "Automate leads, emails and notifications between apps with Zapier",
      "Test layouts on mobile and desktop and fix common UX problems",
      "Connect a custom domain, publish your site and track visitor performance",
      "Price, scope and deliver no-code website projects for paying clients"
    ],
    "sections": [
      {
        "title": "Getting Started with No-Code Building",
        "lectures": [
          ["Welcome and how this course works", 4],
          ["What no-code can and cannot do today", 9],
          ["Tour of Lovable, Bolt.new and Zapier", 11],
          ["Writing a clear project brief and page list", 10]
        ]
      },
      {
        "title": "Building Websites with Lovable",
        "lectures": [
          ["Your first site from a single prompt", 13],
          ["Editing layouts, sections and styles with follow-up prompts", 15],
          ["Adding pages, navigation and contact forms", 12],
          ["Writing website copy with AI", 9]
        ]
      },
      {
        "title": "Building Apps with Bolt.new",
        "lectures": [
          ["From idea to app: describing screens and data", 11],
          ["Generating a working app in Bolt.new", 15],
          ["Adding user login and saved data", 13],
          ["Fixing errors by prompting step by step", 10]
        ]
      },
      {
        "title": "AI-Powered Features",
        "lectures": [
          ["Adding an AI chat assistant to your site", 12],
          ["Smart forms that summarise and sort responses", 10],
          ["Generating content and images inside your app", 9]
        ]
      },
      {
        "title": "Dashboards and Data",
        "lectures": [
          ["Planning a simple business dashboard", 7],
          ["Building charts and tables from your data", 13],
          ["Connecting spreadsheets and form data", 10]
        ]
      },
      {
        "title": "Automation with Zapier",
        "lectures": [
          ["Zapier basics: triggers, actions and Zaps", 9],
          ["Sending form leads to email, sheets and WhatsApp tools", 12],
          ["Multi-step automations with AI steps", 10]
        ]
      },
      {
        "title": "UX, Testing and Integrations",
        "lectures": [
          ["UX checklist for clean, usable pages", 9],
          ["Testing on mobile, tablet and desktop", 7],
          ["Integrating payments, calendars and analytics", 10]
        ]
      },
      {
        "title": "Launch, Domains and Client Projects",
        "lectures": [
          ["Connecting a custom domain and publishing", 9],
          ["Tracking visitors and performance after launch", 7],
          ["Hands-on project: build and launch a complete business site", 22],
          ["Pricing, proposals and handing over client projects", 10]
        ]
      }
    ],
    "requirements": [
      "A laptop or desktop with a modern web browser",
      "Free accounts on Lovable, Bolt.new and Zapier (free tiers are enough to start)",
      "No coding experience needed"
    ],
    "audience": [
      "Business owners who want their own website or app without hiring a developer",
      "Freelancers who want to offer website and app building as a service",
      "Professionals and students who want a practical, portfolio-ready AI skill",
      "Marketers who need landing pages and automations quickly"
    ],
    "description": [
      "This course shows you how to build real websites, apps and dashboards using AI no-code tools. Instead of learning a programming language, you describe what you want in plain English and use tools like Lovable and Bolt.new to generate working pages, then refine them step by step until they look and behave the way you need.",
      "You start with planning, because a clear brief makes every AI tool work better. You then build a business website in Lovable, create a small app with login and saved data in Bolt.new, and add AI-powered features such as a chat assistant and smart forms that summarise responses for you.",
      "Next you connect everything together. You build a simple dashboard from form and spreadsheet data, then use Zapier to automate the work that usually happens by hand: sending leads to your inbox, updating sheets, and triggering follow-up messages. You also learn how to add payments, calendars and analytics.",
      "Before launch, you test your work on different screen sizes and use a practical UX checklist to fix common problems. You then connect a custom domain, publish your project and set up basic tracking so you can see how visitors use it.",
      "The final part covers turning this skill into client work: how to scope a project, price it sensibly, write a proposal and hand over a finished site. By the end you will have built and launched a complete project you can show in your portfolio."
    ]
  },
  "film-1": {
    "subtitle": "Use ChatGPT and Claude to turn ideas into stories, scripts, shot lists and reusable prompt systems for AI filmmaking.",
    "learn": [
      "Understand how LLMs like ChatGPT, Claude and Gemini respond to prompts",
      "Write structured prompts using role, context, task and format",
      "Develop a short film idea into a logline, synopsis and story beats",
      "Write a short screenplay scene with dialogue using an LLM as co-writer",
      "Break a script into a detailed shot list with camera angles",
      "Build reusable prompt templates for image and video tools",
      "Create a character and world bible to keep your film consistent",
      "Set up the story foundation for the series short film project"
    ],
    "sections": [
      {
        "title": "Welcome to the AI Filmmaking Framework",
        "lectures": [
          ["Welcome and how the 9-part series fits together", 4],
          ["The short film project you will build across the series", 6],
          ["Setting up ChatGPT, Claude and Gemini", 8]
        ]
      },
      {
        "title": "How LLMs Think",
        "lectures": [
          ["What a large language model actually does", 9],
          ["Strengths, limits and hallucinations", 8],
          ["Choosing the right LLM for each creative task", 7]
        ]
      },
      {
        "title": "Prompt Engineering Fundamentals",
        "lectures": [
          ["The role, context, task, format structure", 11],
          ["Iterating: refining outputs with follow-up prompts", 9],
          ["Few-shot examples and style references", 8],
          ["Common prompt mistakes and how to fix them", 6]
        ]
      },
      {
        "title": "Story Development with AI",
        "lectures": [
          ["From idea to logline", 8],
          ["Building a synopsis and three-act structure", 11],
          ["Story beats and emotional arc", 8]
        ]
      },
      {
        "title": "Scriptwriting with an LLM",
        "lectures": [
          ["Screenplay format basics", 6],
          ["Writing scenes and dialogue with AI as co-writer", 11],
          ["Editing the script for pace and clarity", 8]
        ]
      },
      {
        "title": "Shot Lists and Visual Planning",
        "lectures": [
          ["Camera angles, shot sizes and movement explained", 8],
          ["Turning a script into a shot list", 9],
          ["Writing visual descriptions for each shot", 7]
        ]
      },
      {
        "title": "Prompt Systems for the Series",
        "lectures": [
          ["Character and world bible", 8],
          ["Reusable prompt templates for image and video tools", 9],
          ["Hands-on project: script and shot list for your short film", 15]
        ]
      }
    ],
    "requirements": [
      "A computer or phone with internet access",
      "A free ChatGPT, Claude or Gemini account",
      "No filmmaking or writing experience needed"
    ],
    "audience": [
      "Aspiring filmmakers and content creators starting with AI",
      "Marketers and business owners who want to produce video content",
      "Writers who want to use AI as a creative collaborator",
      "Anyone planning to complete the full AI Filmmaking Framework series"
    ],
    "description": [
      "Part 1 of the AI Filmmaking Framework lays the foundation for everything that follows. Every AI image, video, voice and song starts with words, so this part teaches you to use large language models like ChatGPT and Claude as your writer, script editor and planning assistant.",
      "You begin by understanding how LLMs respond to prompts and where they make mistakes. You then learn a clear prompt structure built on role, context, task and format, and practise refining outputs through follow-up prompts rather than accepting the first answer.",
      "With those skills in place, you develop a short film idea into a logline, synopsis and story beats, then write a short script with dialogue. You learn screenplay basics and how to edit an AI draft so it reads like your own work.",
      "Finally, you translate the script into a shot list with camera angles and visual descriptions, and build a character and world bible plus reusable prompt templates. These become the inputs for Part 2, where you turn your shots into cinematic AI images.",
      "By the end of this part you will have the story, script and prompt system for the short film you build across the series. You will also have a repeatable prompting habit that saves time in every later part, whether you are describing a character for an image tool, a camera move for a video tool or the mood of a song."
    ]
  },
  "film-2": {
    "subtitle": "Create cinematic AI images, consistent characters, locations and full storyboards with Midjourney, ChatGPT and other image tools.",
    "learn": [
      "Write image prompts that control subject, lighting, lens and composition",
      "Generate cinematic frames in Midjourney, ChatGPT image generation and Leonardo",
      "Keep characters consistent across scenes using references and seeds",
      "Design locations and sets that match your film's world bible",
      "Apply a consistent colour palette and visual style across every frame",
      "Edit, expand and fix images with inpainting and outpainting",
      "Upscale images to high resolution ready for video generation",
      "Build a complete storyboard for your series short film"
    ],
    "sections": [
      {
        "title": "Introduction to AI Image Creation",
        "lectures": [
          ["Welcome to Part 2 and recap of your script", 4],
          ["Overview of Midjourney, ChatGPT images, Leonardo and Ideogram", 12],
          ["Setting up your image tools", 9]
        ]
      },
      {
        "title": "Image Prompting for Film",
        "lectures": [
          ["Anatomy of a cinematic image prompt", 12],
          ["Lighting, lenses and camera language in prompts", 13],
          ["Composition and framing for storytelling", 11],
          ["Using parameters, aspect ratios and style settings", 11]
        ]
      },
      {
        "title": "Character Design and Consistency",
        "lectures": [
          ["Designing your main characters", 12],
          ["Character reference images and sheets", 14],
          ["Keeping faces and outfits consistent across scenes", 13]
        ]
      },
      {
        "title": "Locations and Worldbuilding",
        "lectures": [
          ["Creating locations from your world bible", 11],
          ["Time of day, weather and mood", 9],
          ["Props and set details", 7]
        ]
      },
      {
        "title": "Visual Style and Colour",
        "lectures": [
          ["Defining a visual style for your film", 11],
          ["Colour palettes and grading looks", 9],
          ["Style references for consistency", 9]
        ]
      },
      {
        "title": "Editing and Enhancing Images",
        "lectures": [
          ["Inpainting and outpainting", 12],
          ["Fixing hands, faces and artefacts", 9],
          ["Upscaling for video generation", 7]
        ]
      },
      {
        "title": "Storyboarding Your Film",
        "lectures": [
          ["From shot list to storyboard frames", 12],
          ["Hands-on project: full storyboard for your short film", 27],
          ["Organising assets for Part 3", 5]
        ]
      }
    ],
    "requirements": [
      "Completed Part 1 or have a short script and shot list ready",
      "A Midjourney subscription or access to a free image tool such as ChatGPT or Leonardo",
      "A computer with internet access"
    ],
    "audience": [
      "Creators continuing the AI Filmmaking Framework series",
      "Filmmakers and designers who want to storyboard faster",
      "Marketers creating visuals for ads and social media",
      "Anyone who wants consistent, cinematic AI images"
    ],
    "description": [
      "Part 2 turns the script and shot list you wrote in Part 1 into cinematic images. Every AI video starts with a strong frame, so the quality of your images decides the quality of your film. This part teaches you to create those frames deliberately rather than by luck.",
      "You learn how to write image prompts that control subject, lighting, lens, composition and mood, and how to use tools such as Midjourney, ChatGPT image generation and Leonardo. Each tool has strengths, and you will learn when to use which.",
      "The biggest challenge in AI filmmaking is consistency. You will design your main characters, create reference sheets, and use reference images and style settings to keep faces, outfits and locations the same from shot to shot. You will see why references matter more than long prompts.",
      "You also define a visual style and colour palette for your film, then edit images with inpainting and outpainting, fix common artefacts and upscale frames to the resolution video tools need. These finishing steps are what separate a usable frame from a frame that falls apart once it starts to move.",
      "The part ends with a full storyboard for your short film, organised and ready to animate in Part 3: AI Video Mastery. You will also learn a simple folder and naming system so your frames, references and prompts stay easy to find when you start generating video clips."
    ]
  },
  "film-3": {
    "subtitle": "Turn storyboard frames into moving scenes with Kling, Runway and Veo, controlling camera motion, continuity and the final edit.",
    "learn": [
      "Compare Kling, Runway, Veo and other leading AI video generators",
      "Animate still frames with image-to-video and write effective motion prompts",
      "Control camera moves such as dolly, pan, orbit and crane shots",
      "Generate text-to-video scenes when no reference image is needed",
      "Maintain character and scene continuity across multiple clips",
      "Use start and end frames to create smooth transitions",
      "Edit clips into a sequence in CapCut with pacing and colour",
      "Assemble a silent rough cut of your series short film"
    ],
    "sections": [
      {
        "title": "Introduction to AI Video",
        "lectures": [
          ["Welcome to Part 3 and your storyboard recap", 5],
          ["How AI video generation works", 14],
          ["Tool overview: Kling, Runway, Veo, Hailuo and Luma", 18],
          ["Credits, costs and choosing a workflow", 10]
        ]
      },
      {
        "title": "Image-to-Video Fundamentals",
        "lectures": [
          ["Preparing frames for animation", 12],
          ["Writing motion prompts", 16],
          ["Controlling subject movement and expressions", 15],
          ["Reviewing and regenerating weak clips", 10]
        ]
      },
      {
        "title": "Camera Motion and Cinematic Shots",
        "lectures": [
          ["Camera language for AI video", 12],
          ["Dolly, pan, tilt and orbit shots", 16],
          ["Crane, drone and tracking shots", 14]
        ]
      },
      {
        "title": "Text-to-Video Generation",
        "lectures": [
          ["When to use text-to-video", 8],
          ["Prompting establishing shots and b-roll", 14],
          ["Generating video with native audio in Veo", 12]
        ]
      },
      {
        "title": "Scene Continuity",
        "lectures": [
          ["Keeping characters consistent across clips", 16],
          ["Start and end frames for transitions", 14],
          ["Matching lighting and colour between shots", 10]
        ]
      },
      {
        "title": "Advanced Techniques",
        "lectures": [
          ["Extending clips and longer sequences", 12],
          ["Effects, slow motion and stylised looks", 12],
          ["Upscaling and frame interpolation", 10]
        ]
      },
      {
        "title": "Editing Your Film",
        "lectures": [
          ["Editing basics in CapCut", 14],
          ["Pacing, cuts and shot order", 12],
          ["Colour correction and final export", 10],
          ["Hands-on project: silent rough cut of your short film", 28]
        ]
      }
    ],
    "requirements": [
      "Completed Part 2 or have a storyboard of image frames",
      "Access to at least one AI video tool such as Kling, Runway or Veo (paid credits recommended)",
      "CapCut or any basic video editor"
    ],
    "audience": [
      "Creators continuing the AI Filmmaking Framework series",
      "Content creators who want cinematic videos without a camera crew",
      "Agencies and marketers producing short video ads",
      "Filmmakers exploring AI for previsualisation and production"
    ],
    "description": [
      "Part 3 brings your storyboard to life. Using the frames you created in Part 2, you learn to generate moving scenes with leading AI video tools such as Kling, Runway and Veo, and to direct them like a filmmaker rather than hoping for a lucky result.",
      "You start with image-to-video, the most reliable way to keep control over how your film looks. You learn to write motion prompts, direct subject movement and expressions, and recognise when a clip should be regenerated. You will also learn to budget credits sensibly.",
      "Next you add camera language: dolly moves, pans, orbits, crane and tracking shots. You also learn when text-to-video is the better choice, for example for establishing shots and b-roll, and how native audio generation in Veo can help. Each move is practised on your own frames.",
      "Continuity is what makes a sequence feel like a film. You practise keeping characters, lighting and colour consistent across clips, and use start and end frames to build smooth transitions. You also learn how to extend clips into longer sequences, add slow motion or stylised effects, and upscale your final shots.",
      "Finally, you edit everything in CapCut, working on pacing, shot order and colour, and export a silent rough cut of your short film. In Part 4 you add voices, sound effects and music. The rough cut becomes the timeline for every part that follows."
    ]
  },
  "film-4": {
    "subtitle": "Add voiceovers, dialogue, sound effects and music to your AI film with ElevenLabs, Suno and simple mixing techniques.",
    "learn": [
      "Generate natural voiceovers and character voices with ElevenLabs",
      "Direct emotion, pace and emphasis in AI voice performances",
      "Create dialogue scenes and sync voices to your video clips",
      "Dub your film into other languages, including Hindi",
      "Generate sound effects and ambient soundscapes for each scene",
      "Create background music and score cues with Suno",
      "Mix dialogue, effects and music to balanced, clear levels",
      "Complete the full soundtrack for your series short film"
    ],
    "sections": [
      {
        "title": "Introduction to AI Audio",
        "lectures": [
          ["Welcome to Part 4 and your rough cut recap", 5],
          ["Why sound makes or breaks a film", 10],
          ["Tool overview: ElevenLabs, Suno and CapCut audio", 12]
        ]
      },
      {
        "title": "AI Voiceovers",
        "lectures": [
          ["Text-to-speech basics in ElevenLabs", 12],
          ["Choosing and designing character voices", 14],
          ["Directing emotion, pace and emphasis", 12]
        ]
      },
      {
        "title": "Dialogue and Dubbing",
        "lectures": [
          ["Recording scratch dialogue and voice changing", 12],
          ["Syncing dialogue to video", 12],
          ["Dubbing into Hindi and other languages", 12]
        ]
      },
      {
        "title": "Sound Effects and Ambience",
        "lectures": [
          ["Generating sound effects from text", 12],
          ["Building ambient soundscapes", 10],
          ["Foley and timing effects to action", 10]
        ]
      },
      {
        "title": "Music and Score",
        "lectures": [
          ["Generating background music with Suno", 14],
          ["Matching music to mood and scene", 10],
          ["Editing music to fit your cut", 8]
        ]
      },
      {
        "title": "Mixing and Finishing",
        "lectures": [
          ["Balancing levels: dialogue, effects, music", 12],
          ["Cleaning noise and improving clarity", 8],
          ["Hands-on project: complete soundtrack for your short film", 22],
          ["Exporting your finished film", 5]
        ]
      }
    ],
    "requirements": [
      "Completed Part 3 or have a rough cut video to work with",
      "Free or paid accounts on ElevenLabs and Suno",
      "Headphones for checking your mix"
    ],
    "audience": [
      "Creators continuing the AI Filmmaking Framework series",
      "YouTubers and podcasters who want professional voiceovers",
      "Marketers who need multilingual video content",
      "Filmmakers who want fast, affordable sound design"
    ],
    "description": [
      "Part 4 is where your film starts to feel real. Viewers forgive imperfect visuals far more easily than poor sound, so this part teaches you to build a complete soundtrack for the rough cut you edited in Part 3. No recording studio is needed.",
      "You begin with voice. Using ElevenLabs, you create narration and character voices, then learn to direct emotion, pace and emphasis so performances sound natural. You also sync dialogue to your clips and dub your film into Hindi or other languages to reach a wider audience.",
      "Next you design the world around your characters with AI-generated sound effects and ambient soundscapes, timed to the action on screen. You then create background music and score cues with Suno and edit them to fit your cut. Each sound is layered to support the story.",
      "Finally, you mix everything: balancing dialogue, effects and music, cleaning noise and exporting a finished version of your short film. In Part 5 you add AI avatars and presenters to expand what your film and campaign can do. You will finish with a film that sounds complete."
    ]
  },
  "film-5": {
    "subtitle": "Create realistic talking AI avatars and presenters with HeyGen, lip sync and multilingual video for your film and campaign.",
    "learn": [
      "Understand the main types of AI avatars and when to use each",
      "Create a talking avatar video in HeyGen from a script",
      "Design a custom avatar from your own photo or AI image",
      "Animate a still character image to speak with lip sync",
      "Translate avatar videos into Hindi and other languages",
      "Write presenter scripts that sound natural on camera",
      "Use avatars ethically with clear consent and disclosure",
      "Produce a presenter-led trailer for your series short film"
    ],
    "sections": [
      {
        "title": "Introduction to AI Avatars",
        "lectures": [
          ["Welcome to Part 5 and series recap", 5],
          ["Types of AI avatars: stock, custom and animated", 11],
          ["Tool overview: HeyGen, Synthesia and Hedra", 11]
        ]
      },
      {
        "title": "Your First Talking Avatar",
        "lectures": [
          ["Creating an avatar video from a script in HeyGen", 14],
          ["Choosing voices, backgrounds and layouts", 9],
          ["Writing scripts for presenters", 9]
        ]
      },
      {
        "title": "Custom Avatars",
        "lectures": [
          ["Creating an avatar from your own footage or photo", 14],
          ["Turning an AI-generated character into an avatar", 11],
          ["Improving realism: framing, lighting and gestures", 9]
        ]
      },
      {
        "title": "Lip Sync and Character Animation",
        "lectures": [
          ["Lip syncing still images to voice", 13],
          ["Bringing your film characters to life", 11],
          ["Fixing sync and expression problems", 7]
        ]
      },
      {
        "title": "Multilingual Avatar Video",
        "lectures": [
          ["Video translation and dubbing", 11],
          ["Reviewing translations for accuracy", 6],
          ["Ethics, consent and disclosure", 7]
        ]
      },
      {
        "title": "Avatar Project",
        "lectures": [
          ["Planning a presenter-led trailer", 6],
          ["Hands-on project: avatar trailer for your short film", 20],
          ["Exporting for social platforms", 5]
        ]
      }
    ],
    "requirements": [
      "Completed Parts 1 to 4 or have a script and character images",
      "A HeyGen account (free plan is enough to practise)",
      "A computer with internet access"
    ],
    "audience": [
      "Creators continuing the AI Filmmaking Framework series",
      "Educators and coaches who want to create video without filming",
      "Businesses producing training or explainer videos",
      "Creators who want multilingual content for Indian audiences"
    ],
    "description": [
      "Part 5 adds a powerful new element to your toolkit: AI avatars. Talking avatars and presenters let you create explainer videos, trailers and character scenes without filming anyone, and they are one of the fastest growing uses of AI video.",
      "You start by creating a talking avatar video in HeyGen from a script, choosing voices, backgrounds and layouts. You then build custom avatars from a photo, your own footage or an AI-generated character from your film, and learn the framing and lighting choices that make them look more realistic.",
      "Next you work on lip sync, making still character images speak, and fix common sync and expression problems. You also translate avatar videos into Hindi and other languages, and check translations for accuracy. These skills let you reuse the characters from your film as narrators and hosts.",
      "You will learn the ethics of avatar use, including consent and disclosure, before producing a presenter-led trailer for your short film. In Part 6, you use these skills to create AI influencers and UGC style ads. You will also learn how to export avatar videos in the right formats for Instagram, YouTube and WhatsApp."
    ]
  },
  "film-6": {
    "subtitle": "Design AI influencer personas and produce UGC style product ads with strong hooks, scripts and consistent characters.",
    "learn": [
      "Design an AI influencer persona with a clear niche and voice",
      "Keep your influencer's face and style consistent across content",
      "Write scroll-stopping hooks and short ad scripts with an LLM",
      "Produce UGC style product videos with avatars and AI video tools",
      "Create product shots and lifestyle images featuring your influencer",
      "Edit vertical ads for Instagram Reels, YouTube Shorts and Meta ads",
      "Test ad variations and read basic performance metrics",
      "Follow platform rules on disclosure and AI generated content"
    ],
    "sections": [
      {
        "title": "Introduction to AI Influencers and UGC",
        "lectures": [
          ["Welcome to Part 6 and series recap", 5],
          ["What UGC ads are and why they work", 11],
          ["AI influencers: opportunities and limits", 9]
        ]
      },
      {
        "title": "Designing Your AI Influencer",
        "lectures": [
          ["Choosing a niche and audience", 9],
          ["Building the persona: look, voice and personality", 13],
          ["Creating a consistent face with reference images", 15]
        ]
      },
      {
        "title": "Content Creation for Your Influencer",
        "lectures": [
          ["Lifestyle images and product shots", 13],
          ["Short videos with Kling and HeyGen", 15],
          ["Planning a content calendar", 8]
        ]
      },
      {
        "title": "Hooks and Ad Scripts",
        "lectures": [
          ["Anatomy of a scroll-stopping hook", 11],
          ["Writing UGC ad scripts with ChatGPT or Claude", 13],
          ["Problem, solution and call-to-action structures", 9]
        ]
      },
      {
        "title": "Producing UGC Ads",
        "lectures": [
          ["Product unboxing and review style videos", 14],
          ["Testimonial-style ads done honestly", 9],
          ["Editing vertical ads in CapCut", 13],
          ["Captions, music and on-screen text", 8]
        ]
      },
      {
        "title": "Ad Performance and Testing",
        "lectures": [
          ["Creating ad variations to test", 9],
          ["Reading basic metrics: views, CTR and cost per result", 11],
          ["Platform rules and AI content disclosure", 8]
        ]
      },
      {
        "title": "Influencer and Ad Project",
        "lectures": [
          ["Planning your campaign: product, audience and angle", 8],
          ["Hands-on project: a 3-ad UGC campaign for your film", 22],
          ["Packaging your campaign for clients", 6]
        ]
      }
    ],
    "requirements": [
      "Completed Parts 1 to 5 or have basic AI image, video and avatar skills",
      "Access to an image tool, a video tool and HeyGen",
      "CapCut or any basic video editor"
    ],
    "audience": [
      "Creators continuing the AI Filmmaking Framework series",
      "D2C brands and small businesses that need ad creatives",
      "Freelancers and agencies offering UGC ad production",
      "Social media managers looking for faster content"
    ],
    "description": [
      "Part 6 applies everything you have learned so far to one of the most in-demand uses of AI video: influencer content and UGC style ads. Brands spend heavily on short, authentic looking product videos, and AI lets you produce them faster and at lower cost.",
      "You start by designing an AI influencer persona with a clear niche, look, voice and personality, and use reference images to keep the face consistent. You then create lifestyle images, product shots and short videos using the image, video and avatar tools from earlier parts.",
      "The heart of any ad is the hook. You learn how scroll-stopping hooks work and write UGC scripts with ChatGPT or Claude using problem, solution and call-to-action structures. You then produce unboxing, review and demo style ads, and edit them as vertical videos in CapCut.",
      "You also learn to create ad variations, read basic metrics like click-through rate and cost per result, and follow platform rules on disclosure. The part ends with a three-ad campaign promoting your short film. You will also learn how to package a campaign so you can offer it to brands as a freelance service."
    ]
  },
  "film-7": {
    "subtitle": "Use Google NotebookLM to research, plan and repurpose content with notebooks, Audio Overviews, Video Overviews and study guides.",
    "learn": [
      "Set up NotebookLM notebooks with PDFs, websites, YouTube videos and notes",
      "Ask grounded questions and get answers cited to your sources",
      "Research film topics, audiences and competitors faster",
      "Generate Audio Overviews and customise their focus",
      "Create Video Overviews to explain topics visually",
      "Build study guides, briefing docs, FAQs and mind maps",
      "Repurpose NotebookLM outputs into scripts and social content",
      "Create a research notebook and content pack for your campaign"
    ],
    "sections": [
      {
        "title": "Introduction to NotebookLM",
        "lectures": [
          ["Welcome to Part 7 and series recap", 5],
          ["What NotebookLM is and how it differs from a chatbot", 12],
          ["Creating your first notebook", 10]
        ]
      },
      {
        "title": "Working with Sources",
        "lectures": [
          ["Adding PDFs, Google Docs, websites and YouTube links", 14],
          ["Organising sources for a project", 10],
          ["Discovering new sources inside NotebookLM", 10]
        ]
      },
      {
        "title": "Grounded Research and Chat",
        "lectures": [
          ["Asking questions with cited answers", 14],
          ["Prompting NotebookLM for deeper analysis", 12],
          ["Saving responses as notes", 8]
        ]
      },
      {
        "title": "Audio Overviews",
        "lectures": [
          ["Generating an Audio Overview", 12],
          ["Customising focus, length and audience", 12],
          ["Using Audio Overviews as podcast-style content", 10]
        ]
      },
      {
        "title": "Video Overviews and Visual Outputs",
        "lectures": [
          ["Creating Video Overviews", 14],
          ["Mind maps for exploring topics", 10],
          ["Turning visuals into presentation material", 8]
        ]
      },
      {
        "title": "Study Guides and Documents",
        "lectures": [
          ["Briefing documents and study guides", 12],
          ["FAQs, timelines and summaries", 10],
          ["Using outputs for teaching and training", 8]
        ]
      },
      {
        "title": "Creator Workflows",
        "lectures": [
          ["Research to script: feeding NotebookLM into ChatGPT or Claude", 14],
          ["Repurposing outputs into posts, reels and newsletters", 12],
          ["Hands-on project: research notebook and content pack for your campaign", 22]
        ]
      }
    ],
    "requirements": [
      "A Google account to access NotebookLM",
      "Some documents, links or videos on a topic you want to explore",
      "No prior experience with NotebookLM needed"
    ],
    "audience": [
      "Creators continuing the AI Filmmaking Framework series",
      "Students, teachers and trainers who work with lots of material",
      "Professionals who research and summarise information",
      "Content creators who want to repurpose research into content"
    ],
    "description": [
      "Part 7 introduces NotebookLM, Google's research and note-taking tool built around your own sources. Unlike a general chatbot, NotebookLM answers questions using the documents, websites and videos you give it, with citations back to the original material, which makes it a reliable research partner.",
      "You start by creating notebooks and adding PDFs, Google Docs, websites and YouTube links, then organise them around a project. You learn to ask grounded questions, prompt for deeper analysis and save useful answers as notes. You will also see how NotebookLM can discover new sources on a topic for you.",
      "Next you explore the creative outputs: Audio Overviews that turn your sources into podcast-style conversations, Video Overviews that explain topics visually, and mind maps for exploring ideas. You also create briefing documents, study guides, FAQs and timelines. Each output can be customised for a specific audience.",
      "Finally, you build creator workflows that move research into ChatGPT or Claude for scripting and repurpose outputs into posts, reels and newsletters. You finish with a research notebook and content pack for your film campaign, which you use in Part 8 for lead generation."
    ]
  },
  "film-8": {
    "subtitle": "Turn AI video content into a lead generation system with funnels, landing pages, lead magnets, ads and follow-up automation.",
    "learn": [
      "Map a simple lead generation funnel for your offer or film",
      "Create lead magnets with AI, such as guides, checklists and mini videos",
      "Build a landing page with AI tools that captures leads",
      "Write landing page and ad copy with ChatGPT or Claude",
      "Use short AI videos to drive traffic from Instagram, YouTube and WhatsApp",
      "Automate follow-up emails and messages with Zapier or Make",
      "Track sign-ups, conversions and cost per lead",
      "Launch a complete lead generation campaign for your project"
    ],
    "sections": [
      {
        "title": "Introduction to AI Lead Generation",
        "lectures": [
          ["Welcome to Part 8 and series recap", 5],
          ["How lead generation works", 11],
          ["Mapping your funnel: attract, capture, nurture, convert", 11]
        ]
      },
      {
        "title": "Lead Magnets with AI",
        "lectures": [
          ["Choosing the right lead magnet", 9],
          ["Creating guides and checklists with AI", 13],
          ["Video lead magnets using your film assets", 11]
        ]
      },
      {
        "title": "Landing Pages",
        "lectures": [
          ["What makes a landing page convert", 11],
          ["Building a landing page with an AI website builder", 17],
          ["Writing landing page copy with AI", 11],
          ["Forms and connecting leads to a sheet or CRM", 9]
        ]
      },
      {
        "title": "Driving Traffic with AI Video",
        "lectures": [
          ["Short-form video strategy for leads", 11],
          ["Repurposing your film into reels and shorts", 11],
          ["Running simple Meta and YouTube ads", 13]
        ]
      },
      {
        "title": "Follow-Up Automation",
        "lectures": [
          ["Email and WhatsApp follow-up sequences", 11],
          ["Automating with Zapier or Make", 15],
          ["Personalising messages with AI", 8]
        ]
      },
      {
        "title": "Tracking and Improving Results",
        "lectures": [
          ["Key metrics: sign-ups, conversion rate and cost per lead", 9],
          ["A/B testing pages, hooks and offers", 9],
          ["Data privacy and consent basics", 6]
        ]
      },
      {
        "title": "Lead Generation Project",
        "lectures": [
          ["Planning your campaign: offer, audience and channels", 8],
          ["Hands-on project: launch a full lead generation campaign", 23],
          ["Reviewing results and next steps", 6]
        ]
      }
    ],
    "requirements": [
      "Completed earlier parts or have some AI video content ready",
      "A free account on an AI website builder and Zapier or Make",
      "Basic familiarity with social media platforms"
    ],
    "audience": [
      "Creators continuing the AI Filmmaking Framework series",
      "Business owners and coaches who need a steady flow of leads",
      "Freelancers and agencies offering marketing services",
      "Marketers who want to connect video content to sales"
    ],
    "description": [
      "Part 8 connects your creative work to real business results. Great videos are only useful if they bring people to you, so this part shows you how to build a simple, AI-powered lead generation system around your film, your services or your business.",
      "You start by mapping a funnel: how people discover you, how you capture their details, and how you follow up. You then create lead magnets with AI, including guides, checklists and short videos made from your film assets. Each lead magnet is built to match your audience.",
      "Next you build a landing page with an AI website builder, write persuasive copy with ChatGPT or Claude, and connect forms to a sheet or CRM. You then drive traffic using short-form video, repurposed reels and simple Meta and YouTube ads.",
      "Leads go cold without follow-up, so you set up email and WhatsApp sequences and automate them with Zapier or Make. You learn to track sign-ups and cost per lead, test improvements and respect data privacy. You will also learn how AI can personalise follow-up messages without sounding robotic.",
      "The part ends with a complete lead generation campaign. You will review your results, note what worked and plan the next round of improvements, so the system keeps getting better over time. In Part 9 you finish the series by creating an original AI song for your film."
    ]
  },
  "film-9": {
    "subtitle": "Write, produce and release original AI songs with Suno, add AI music videos, and complete your AI Filmmaking Framework project.",
    "learn": [
      "Write song lyrics with structure, rhyme and emotion using an LLM",
      "Generate full songs in Suno with style, genre and mood prompts",
      "Shape melody, vocals and arrangement through prompts and remixes",
      "Create songs in Hindi and other Indian languages",
      "Extend, edit and improve tracks inside Suno",
      "Produce a music video using AI image and video tools",
      "Understand licensing, ownership and distribution of AI music",
      "Release a theme song and music video for your short film"
    ],
    "sections": [
      {
        "title": "Introduction to AI Music",
        "lectures": [
          ["Welcome to Part 9 and series recap", 5],
          ["How AI music generation works", 11],
          ["Tool overview: Suno and other AI music tools", 11]
        ]
      },
      {
        "title": "Songwriting with AI",
        "lectures": [
          ["Song structure: verse, chorus and bridge", 11],
          ["Writing lyrics with ChatGPT or Claude", 14],
          ["Rhyme, rhythm and emotion in lyrics", 9]
        ]
      },
      {
        "title": "Generating Songs in Suno",
        "lectures": [
          ["Your first song in Suno", 11],
          ["Style, genre and mood prompts", 14],
          ["Custom lyrics mode and meta tags", 13]
        ]
      },
      {
        "title": "Vocals, Melody and Arrangement",
        "lectures": [
          ["Choosing vocal styles", 9],
          ["Shaping melody and arrangement", 11],
          ["Hindi and regional language songs", 13]
        ]
      },
      {
        "title": "Editing and Improving Tracks",
        "lectures": [
          ["Extending and remixing songs", 11],
          ["Replacing sections and fixing weak parts", 9],
          ["Final polish and export", 8]
        ]
      },
      {
        "title": "AI Music Videos",
        "lectures": [
          ["Planning a music video from your song", 8],
          ["Creating visuals with AI image and video tools", 15],
          ["Syncing visuals to the beat in CapCut", 13]
        ]
      },
      {
        "title": "Release and Promotion",
        "lectures": [
          ["Licensing and ownership of AI music", 8],
          ["Distributing to streaming platforms", 8],
          ["Hands-on project: theme song and music video for your film", 21],
          ["Series wrap-up: your complete AI film project", 5]
        ]
      }
    ],
    "requirements": [
      "Completed earlier parts or have basic AI video skills",
      "A Suno account (free plan is enough to practise)",
      "No music theory or singing experience needed"
    ],
    "audience": [
      "Creators completing the AI Filmmaking Framework series",
      "Musicians and lyricists exploring AI tools",
      "Content creators who need original music for videos",
      "Brands that want jingles and theme songs"
    ],
    "description": [
      "Part 9 completes the AI Filmmaking Framework with something every film can use: an original song. Using Suno and an LLM as your songwriting partner, you learn to create full tracks with vocals, even if you have never written or produced music before.",
      "You begin with songwriting: structure, lyrics, rhyme and emotion. You write lyrics with ChatGPT or Claude, then generate songs in Suno using style, genre and mood prompts, custom lyrics and meta tags. You also create songs in Hindi and other Indian languages.",
      "Next you shape vocals, melody and arrangement, then extend, remix and fix tracks until they sound finished. You turn your song into a music video using the image and video skills from Parts 2 and 3, synced to the beat in CapCut.",
      "Finally, you learn the basics of licensing, ownership and distribution for AI music, and release a theme song and music video for your short film. This brings together everything from the series into one finished creative project. You leave with a finished body of work."
    ]
  },
};
