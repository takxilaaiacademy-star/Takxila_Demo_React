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
  /** Paragraphs of the description. A paragraph starting with "• " shows as a list line. */
  description: string[];
  /** Optional "This course includes" lines; when set they replace the standard list on the course page */
  includes?: string[];
  /** Optional level shown under the title, e.g. "Beginner to Advanced" */
  level?: string;
  /** Optional language shown under the title, e.g. "English" */
  language?: string;
}

export const CONTENT: Record<string, CourseContent> = {
  "claude-7": {
    "subtitle": "Go from your first Claude conversation to building a real website and a working app in 7 days, one practical skill at a time. No coding experience needed.",
    "learn": [
      "Write prompts that get specific, useful answers using the simple Context, Role, Goal method",
      "Improve answers through follow-up messages, and respond well when Claude asks you a question back",
      "Fix your own writing: find exactly what's wrong, change the tone for a different audience, keep long documents consistent, and write sensitive messages with care",
      "Choose the right mode for each task: plain Chat, Extended Thinking or Web Search, and check sources before trusting a research answer",
      "Analyse real decisions using proven frameworks like SWOT and cost-benefit analysis, and combine them into one clear recommendation",
      "Hand off complete tasks to Claude Cowork safely: decide what to delegate, write a clear task brief, check the first result, and schedule recurring work",
      "Install Claude Code and build a real website just by describing it in plain English",
      "Build a working ticket booking app with search, filters, bookings and dark mode, then improve it using an honest AI design review"
    ],
    "sections": [
      {
        "title": "Day 1: Meeting Claude",
        "lectures": [
          ["Getting set up: create a free account, send your first message, choose a model", 8],
          ["Context, Role, Goal: the one habit that turns generic answers into useful ones", 8],
          ["Follow-ups: refine any answer without repeating yourself", 8],
          ["Clarifying questions: what to do when Claude asks you something back", 8],
          ["Claude vs ChatGPT vs Gemini: an honest comparison", 7],
          ["4 practice tasks + quiz", 11]
        ]
      },
      {
        "title": "Day 2: Writing & Editing with Claude",
        "lectures": [
          ["Diagnose before you fix: get Claude to name specific problems in your draft", 10],
          ["Change the tone for a different audience without changing the facts", 10],
          ["Check long documents for consistent tone and wording", 10],
          ["Write sensitive messages (price increases, difficult feedback) with the right balance", 10],
          ["4 practice tasks + quiz", 15]
        ]
      },
      {
        "title": "Day 3: The Right Tool at the Right Step",
        "lectures": [
          ["Plain Chat for quick everyday questions", 8],
          ["Extended Thinking for complex problems like scheduling with multiple conditions", 8],
          ["Web Search for current information, with sources you can verify", 8],
          ["3 checks before trusting any research answer", 8],
          ["Quick question vs detailed brief: knowing which one you're writing", 7],
          ["3 practice tasks + quiz", 11]
        ]
      },
      {
        "title": "Day 4: Enhancing Claude's Analysis",
        "lectures": [
          ["Choose the right analytical framework for your decision", 9],
          ["Apply SWOT analysis properly", 9],
          ["Combine two frameworks, such as SWOT with cost-benefit analysis", 9],
          ["Turn your analysis into one final recommendation with the biggest risk named", 9],
          ["3 practice tasks + quiz", 14]
        ]
      },
      {
        "title": "Day 5: Hand Off the Whole Task",
        "lectures": [
          ["What Cowork can do: 40 real tasks you can automate", 7],
          ["The 3-tier system for deciding what to delegate and what to keep", 7],
          ["Write a clear task brief with boundaries", 7],
          ["Live demo: Cowork researches content and saves a report to your computer", 10],
          ["Review the first run before trusting it", 7],
          ["Schedule recurring tasks daily or weekly", 7],
          ["4 practice tasks + quiz + video demos", 10]
        ]
      },
      {
        "title": "Day 6: From Idea to a Real Website",
        "lectures": [
          ["Install Claude Code step by step (Windows and Mac)", 8],
          ["Describe your page and get a working first version", 8],
          ["Make small, targeted edits and add new pages", 7],
          ["Install design skills for better fonts and layouts", 7],
          ["Use reference websites and screenshots to guide the design", 7],
          ["Open and check your finished site in a browser", 7],
          ["4 practice tasks + quiz + video demos", 11]
        ]
      },
      {
        "title": "Day 7: Functional Apps",
        "lectures": [
          ["Plan Mode: review the app structure before Claude builds it", 10],
          ["Build a ticket booking app with event listings, search, category filters, bookings and saved data", 9],
          ["Add new features: edit bookings, dark mode, show only active bookings", 9],
          ["Get an honest design review from Claude", 9],
          ["Fix every issue the review found", 9],
          ["4 practice tasks + quiz + video demo", 14]
        ]
      },
      {
        "title": "Challenge Complete: Your Recap",
        "lectures": [
          ["The 7-word summary: Frame, Revise, Choose, Analyse, Delegate, Build, Extend", 6],
          ["A quick-reference guide to every method you learned", 6],
          ["Everything you built this week", 6],
          ["The one habit to carry forward", 6],
          ["Final quiz", 6]
        ]
      }
    ],
    "requirements": [
      "No coding or AI experience needed",
      "A laptop or desktop computer (Windows or Mac)",
      "A free Claude account is enough for Days 1–4",
      "A paid Claude plan (Pro or higher) is needed for Day 5 (Cowork) and Days 6–7 (Claude Code)",
      "Claude desktop app (free download) for Cowork",
      "Google Chrome for the Cowork browser task",
      "Node.js (free). Installation is covered in Day 6"
    ],
    "audience": [
      "Complete beginners who have never used Claude seriously and want a fast, practical start",
      "Students who want to write, research and prepare for exams more effectively with AI",
      "Small business owners who want to save time on emails, analysis, content and routine tasks",
      "Working professionals who want to automate repetitive work and stand out with practical AI skills",
      "Content creators, trainers and anyone who wants to build a website or app without learning to code"
    ],
    "description": [
      "You've learned how to ask AI questions. Now learn how to put AI to work.",
      "Claude can be much more than a place to type a prompt. The 7-Day Claude AI Challenge is a structured, hands-on journey that takes you from better conversations to research, analysis, decision-making, task delegation, automation, website creation and app development.",
      "You learn alongside three people through the whole challenge: Ritika, a university student new to AI; Karan, who runs a small business; and Takshika, who designs training content.",
      "Every day follows the same simple pattern: see the steps, see a real example, then practise it yourself straight away. You don't read about four things and practise once at the end. You do each skill as you learn it.",
      "What you'll be able to do after 7 days:",
      "• WRITE more effectively",
      "• RESEARCH with greater depth",
      "• ANALYSE complex information",
      "• THINK through decisions",
      "• DELEGATE complete tasks",
      "• AUTOMATE repeatable work",
      "• BUILD websites and functional apps",
      "Why this challenge?",
      "Basic AI prompting is becoming common. What sets you apart is what you can do beyond the prompt. Can you use AI to research? Structure an analysis? Delegate an entire task? Build a webpage? Turn an idea into a working app?",
      "This challenge takes you step by step from everyday AI use to real-world workflows. By the end, you won't just know what Claude can do. You'll know how to put Claude to work on your own tasks.",
      "Chat → Think → Research → Analyse → Delegate → Automate → Build",
      "7 days. From AI conversation to AI capability."
    ],
    "includes": [
      "7 challenge days + 1 recap module (30–60 minutes a day)",
      "26 hands-on practice tasks you complete in Claude as you learn",
      "Ready-to-use example prompts for every skill",
      "40 ready-made Cowork automation prompts for email summaries, news briefings, competitor tracking, social media content, KPI reports and more",
      "Step-by-step video demos for Cowork, website building and app building",
      "Quizzes and interactive exercises after every skill",
      "2 real builds: a working website and a functional ticket booking app",
      "Certificate of completion",
      "Watch lessons on mobile or desktop (Days 5–7 practice needs a computer)"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "mastery-14": {
    "subtitle": "Learn 13 powerful AI tools in 14 days, one tool a day, with hands-on practice after every feature. Research, write, create images, videos, music and avatars, build apps and automate your work.",
    "learn": [
      "Use 13 leading AI tools in real depth: ChatGPT, Perplexity, NotebookLM, Claude, Gemini, DeepSeek, Gamma, Midjourney, Runway, Suno, HeyGen, Lovable and n8n",
      "Follow one simple 4-step method that works on every AI tool, now and in future: Clarify, Specify, Generate, Verify & Refine",
      "Research faster with cited sources, and turn your own documents into quizzes, flashcards, reports, mind maps and slide decks",
      "Use deep research, reasoning modes, file and data analysis, and voice conversations to get better answers",
      "Create professional presentations, product images, short promotional videos and original music",
      "Make AI avatar videos from a script and translate videos into Hindi and 175+ other languages",
      "Build and publish a working web app without coding",
      "Automate tasks with AI agents that make decisions, use tools and remember conversations",
      "Combine several tools into one connected project, from research to a live page with automated follow-ups"
    ],
    "sections": [
      {
        "title": "Day 1: ChatGPT — Master Your AI Assistant",
        "lectures": [
          ["Chat: write specific prompts that get usable answers", 9],
          ["Custom GPTs: find and use ready-made assistants", 8],
          ["Web Search: get current information with sources", 8],
          ["Deep Research: detailed reports for real decisions", 8],
          ["Data Analysis: upload a spreadsheet and get charts, no formulas needed", 8],
          ["Image Generation: create social media banners and visuals", 8],
          ["Voice Mode: practise interviews out loud", 8],
          ["7 practice tasks + quiz", 13]
        ]
      },
      {
        "title": "Day 2: Perplexity — AI-Powered Research",
        "lectures": [
          ["Basic Search with clickable citations", 9],
          ["Focus Modes: academic papers, news, YouTube, Reddit and more", 9],
          ["Pro Search for detailed multi-part comparisons", 8],
          ["Spaces: organise ongoing research projects", 8],
          ["File Upload: check your own document against current web data", 8],
          ["5 practice tasks + quiz", 13]
        ]
      },
      {
        "title": "Day 3: NotebookLM — Research from Your Own Documents",
        "lectures": [
          ["Upload sources and chat with answers linked to exact passages", 8],
          ["Quiz and Flashcards for exam prep", 8],
          ["Mind Map to see how ideas connect", 8],
          ["Reports: briefing docs, study guides, FAQs, timelines", 8],
          ["Data Table exported to Google Sheets", 8],
          ["Infographic in your own brand style", 8],
          ["Slide Deck exported to PowerPoint", 8],
          ["Audio Overview (podcast-style) and Video Overview", 8],
          ["9 practice tasks + quiz", 11]
        ]
      },
      {
        "title": "Day 4: Claude — Careful Writing & Reasoning",
        "lectures": [
          ["Chat with clear roles and boundaries", 9],
          ["Projects: save instructions and files so you never repeat yourself", 9],
          ["Extended Thinking for complex problems", 9],
          ["Web Search with sources", 9],
          ["File Analysis: understand contracts and documents in plain language", 8],
          ["Artifacts: build small working tools like a calculator", 8],
          ["6 practice tasks + quiz", 13]
        ]
      },
      {
        "title": "Day 5: Gemini — Google's AI Assistant",
        "lectures": [
          ["Chat for exam and viva preparation", 9],
          ["Gems: build your own reusable assistant", 9],
          ["Deep Research for detailed comparisons", 9],
          ["Canvas: create quizzes, documents and simple apps", 9],
          ["Image Generation and image editing", 8],
          ["Gemini Live: spoken conversations, with camera and screen sharing", 8],
          ["6 practice tasks + quiz", 13]
        ]
      },
      {
        "title": "Day 6: DeepSeek — Free Reasoning & Coding",
        "lectures": [
          ["Instant Mode for quick questions", 9],
          ["Expert Mode with DeepThink for step-by-step reasoning", 9],
          ["Web Search for current prices and facts", 9],
          ["Vision Mode: solve handwritten problems from a photo", 9],
          ["File Upload: analyse expenses and spreadsheets", 8],
          ["Coding: find bugs and understand code", 8],
          ["6 practice tasks + quiz", 13]
        ]
      },
      {
        "title": "Day 7: Gamma — AI Presentations",
        "lectures": [
          ["Create a full presentation from a prompt in under a minute", 8],
          ["Edit individual slides with AI", 8],
          ["Apply themes or your own brand colours and logo", 8],
          ["Gamma Agent: change the whole deck with one instruction", 8],
          ["Create a landing page website", 8],
          ["Analytics: see which slides your audience viewed most", 8],
          ["6 practice tasks + quiz", 12]
        ]
      },
      {
        "title": "Day 8: Midjourney — AI Image Generation",
        "lectures": [
          ["Write image prompts that produce professional results", 7],
          ["Draft Mode: explore many ideas cheaply", 7],
          ["Personalization: train it to your taste", 7],
          ["Variations: refine an image you like", 7],
          ["Image Prompts: keep your real product consistent", 7],
          ["Fix common image problems", 7],
          ["Commercial use rights explained", 7],
          ["6 practice tasks + quiz", 11]
        ]
      },
      {
        "title": "Day 9: Runway — AI Video Generation",
        "lectures": [
          ["Text-to-Video for promotional clips", 8],
          ["Image-to-Video: animate your product photos", 8],
          ["Motion Brush: animate just one part of an image", 8],
          ["Camera Controls: pan, zoom and tilt like a director", 8],
          ["Character Consistency across multiple scenes", 8],
          ["Video-to-Video: give your phone footage a cinematic look", 8],
          ["6 practice tasks + quiz", 12]
        ]
      },
      {
        "title": "Day 10: Suno — AI Music",
        "lectures": [
          ["Create songs and jingles with your own lyrics and style", 8],
          ["Personas: keep a consistent brand sound", 8],
          ["Voices: hear a song in your own voice", 8],
          ["Instrumental Mode and Stems for further editing", 8],
          ["Hum-to-Song: turn your hummed tune into a full song", 8],
          ["Suno Studio: loops, mashups and alternate sections", 8],
          ["6 practice tasks + quiz", 12]
        ]
      },
      {
        "title": "Day 11: HeyGen — AI Avatars",
        "lectures": [
          ["Create your own digital avatar from a short video or one photo", 8],
          ["Turn a script into a presenter video", 8],
          ["Translate videos into 175+ languages with matched lip movements", 8],
          ["Interactive Avatar that answers questions live", 8],
          ["Stock avatars and brand styling if you don't want to use your own face", 8],
          ["Credit costs and consent explained", 8],
          ["5 practice tasks + quiz", 12]
        ]
      },
      {
        "title": "Day 12: Lovable — Build Apps Without Coding",
        "lectures": [
          ["Build a working app from a description (e.g. a booking tool)", 9],
          ["Make precise edits to style, sections, layout and text", 9],
          ["Import a Figma design or screenshot", 9],
          ["Connect real tools like Stripe for payments", 9],
          ["Publish your app live", 8],
          ["Add a custom domain, including a free route", 8],
          ["5 practice tasks + quiz", 13]
        ]
      },
      {
        "title": "Day 13: n8n — AI Automation",
        "lectures": [
          ["Build your first automated workflow", 9],
          ["AI Agent node that makes real decisions", 9],
          ["Tools: let the agent check Google Sheets, Slack and more", 9],
          ["MCP Client: connect many tools at once", 9],
          ["Memory: agents that remember the conversation", 8],
          ["When to use a simple Chain instead of a full Agent", 8],
          ["6 practice tasks + quiz", 13]
        ]
      },
      {
        "title": "Day 14: Bringing It All Together",
        "lectures": [
          ["Research with Perplexity or NotebookLM", 8],
          ["Write messaging with ChatGPT or Claude", 8],
          ["Create visuals with Midjourney", 8],
          ["Build a pitch deck with Gamma", 8],
          ["Launch a landing page with Lovable", 8],
          ["Automate sign-up follow-ups with n8n", 8],
          ["7 practice checkpoints + quiz", 12]
        ]
      },
      {
        "title": "Challenge Complete: Your Recap",
        "lectures": [
          ["The 14-word summary, one word per day", 10],
          ["Quick guide: which tool to use for which task", 10],
          ["Everything you built during the challenge", 10],
          ["Final quiz", 10]
        ]
      }
    ],
    "requirements": [
      "No AI or coding experience needed",
      "A laptop or desktop computer with internet",
      "A Google account (most tools let you sign in with it)",
      "Most tools have a free plan that covers the practice tasks",
      "Midjourney has no free plan (paid plans start at about US$10/month)",
      "Some advanced features in Runway, HeyGen, Lovable and Gamma need a paid plan or free trial credits",
      "Without a paid plan, you can still learn every step and prepare your prompts for later"
    ],
    "audience": [
      "Beginners who want a practical tour of today's most useful AI tools",
      "Students who want better research, study aids, presentations and interview practice",
      "Small business owners who want marketing images, videos, a booking app and automated customer replies",
      "Working professionals, trainers and content creators who want to produce more, faster",
      "Anyone who wants to know which AI tool to use for which job"
    ],
    "description": [
      "AI isn't waiting. Are your skills keeping up?",
      "AI is changing how quickly people research, write, analyse, create, build and automate. The advantage isn't knowing that these tools exist. It's knowing how to put them to work.",
      "You learn alongside three people throughout the challenge: Ritika, a final-year student job-hunting and finishing coursework; Karan, who runs a small business; and Takshika, who designs training programs.",
      "The 14-Day AI Mastery Challenge gives you a structured, hands-on introduction to 13 powerful AI platforms, with a different tool each day. For every feature, you see the exact steps, see a real example, then practise it yourself straight away.",
      "13 AI platforms. One practical learning journey.",
      "• ChatGPT: thinking, writing, ideas, everyday AI help",
      "• Perplexity: search, research, source-backed answers",
      "• NotebookLM: documents, knowledge, research from your own files",
      "• Claude: reasoning, analysis, writing, structured work",
      "• Gemini: research, creation, Google's AI",
      "• DeepSeek: reasoning, analysis, problem solving, coding",
      "• Gamma: presentations, documents, visual storytelling",
      "• Midjourney: AI images, visual concepts, creative direction",
      "• Runway: AI video, motion, visual storytelling",
      "• Suno: music, songs, creative audio",
      "• HeyGen: AI avatars, talking videos, digital presenters",
      "• Lovable: websites, apps, prototypes",
      "• n8n: automation, connected workflows, AI-powered processes",
      "Research → Think → Create → Present → Build → Automate",
      "This isn't about collecting AI tools. It's about learning what you can do with them:",
      "• RESEARCH information faster",
      "• WRITE and communicate more effectively",
      "• ANALYSE ideas and information",
      "• CREATE professional images",
      "• PRODUCE AI-powered videos",
      "• GENERATE music and audio",
      "• BUILD presentations",
      "• CREATE AI avatars",
      "• BUILD websites and apps",
      "• AUTOMATE repeatable workflows",
      "Tools will keep changing. That's why the whole challenge is built on one 4-step method, Clarify, Specify, Generate, Verify & Refine, that you can apply to any new AI tool you meet in future.",
      "14 days. 13 AI tools. One goal: become AI-ready.",
      "Don't wait until AI skills become an expectation. Start building them now."
    ],
    "includes": [
      "14 challenge days + 1 recap module (about 60 minutes a day)",
      "13 AI tools covered in depth, with 80+ features explained step by step",
      "86 hands-on practice tasks you complete in the real tools as you learn",
      "Click-by-click instructions for every feature",
      "Ready-to-use example prompts for every feature",
      "Quizzes and interactive exercises every day",
      "A final capstone project combining 6 tools",
      "Honest notes on free vs paid plans, credit limits and responsible use",
      "Certificate of completion",
      "Watch lessons on mobile or desktop (practice works best on a computer)"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "mastery-28": {
    "subtitle": "Learn 28 practical AI tools in 28 days, one tool a day, across writing, design, video, marketing, sales, meetings, coding and productivity. Then combine 7 of them into one complete business launch project.",
    "learn": [
      "Use 28 AI tools for real work, from ChatGPT and DeepSeek to HubSpot, Canva, Synthesia, ClickUp and GitHub Copilot",
      "Follow one simple 4-step method that works on any AI tool: Clarify, Specify, Generate, Verify & Refine",
      "Create marketing content, product descriptions, SEO articles and social posts in your own brand voice",
      "Design graphics, product photos and presentations, and remove or replace photo backgrounds",
      "Produce training videos, AI avatar presenters and short social clips, and add subtitles in many languages",
      "Polish your writing with grammar, tone and paraphrasing tools, and use AI responsibly for academic work",
      "Set up AI for sales and customer support: CRM agents, chatbots for WhatsApp and Instagram, and lead follow-up",
      "Capture meeting notes and action items automatically, and get clear call audio from anywhere",
      "Use AI to write, review and secure code, even as a beginner",
      "Choose the right tool for each job, including when a tool is too expensive or not the right fit"
    ],
    "sections": [
      {
        "title": "Day 1: DeepSeek — Reasoning",
        "lectures": [
          ["Instant Mode for quick answers", 10],
          ["DeepThink for step-by-step reasoning on hard problems", 10],
          ["Web Search for current prices and facts", 10],
          ["Solve handwritten problems from a photo", 10],
          ["Analyse spreadsheets and documents", 10],
          ["Find and fix bugs in code", 10]
        ]
      },
      {
        "title": "Day 2: ChatGPT — Full Capabilities",
        "lectures": [
          ["Interview preparation with specific prompts", 12],
          ["Ready-made Custom GPTs", 12],
          ["Web Search and Deep Research for decisions", 12],
          ["Data analysis with charts, no formulas needed", 12],
          ["Image generation for social media banners", 11],
          ["Voice Mode for mock interviews", 11]
        ]
      },
      {
        "title": "Day 3: HubSpot Breeze AI — CRM & Marketing",
        "lectures": [
          ["Breeze Assistant (free): summarise deal history before a call", 12],
          ["Content Agent: landing pages in your brand voice", 12],
          ["Customer Agent: a 24/7 support chatbot", 12],
          ["Prospecting Agent: personalised outreach based on lead activity", 12],
          ["Social Media Agent: weekly post ideas", 12]
        ]
      },
      {
        "title": "Day 4: Canva AI — Design",
        "lectures": [
          ["Magic Design: a full design from one sentence", 12],
          ["Magic Write: copy for your designs", 12],
          ["Text to Image for illustrations", 12],
          ["Background Remover and Magic Expand", 12],
          ["Magic Charts: turn data into designed charts", 12]
        ]
      },
      {
        "title": "Day 5: Crystal Knows — Personality Insights for Sales",
        "lectures": [
          ["Personality (DISC) profiles from LinkedIn before a call", 11],
          ["Communication tips for each person", 11],
          ["Live tips during video meetings", 11],
          ["Tailored interview questions for hiring", 11],
          ["Using personality insights ethically", 11]
        ]
      },
      {
        "title": "Day 6: Gamma — AI Presentations",
        "lectures": [
          ["A full pitch deck from a prompt in under a minute", 12],
          ["Edit slides with AI, apply your brand theme", 12],
          ["Change the whole deck with one instruction", 12],
          ["Create a landing page website", 12],
          ["See which slides your audience viewed most", 12]
        ]
      },
      {
        "title": "Day 7: Copy.ai — Marketing Copy & Automation",
        "lectures": [
          ["Product descriptions, emails and ads from 90+ templates", 11],
          ["Brand Voice trained on your past content", 11],
          ["Workflows: research a lead and draft a personalised email automatically", 11],
          ["Infobase: keep pricing and policies accurate", 11],
          ["What it can't do well (SEO-specific content)", 11]
        ]
      },
      {
        "title": "Day 8: Lumen5 — Blog to Video",
        "lectures": [
          ["Turn a blog post into a video automatically", 11],
          ["AI voiceover without recording", 11],
          ["Brand Kit for consistent branding", 11],
          ["Royalty-free stock footage and music", 11],
          ["Export for YouTube, Instagram, LinkedIn", 11]
        ]
      },
      {
        "title": "Day 9: Midjourney — AI Images",
        "lectures": [
          ["Professional product photos from a prompt", 15],
          ["Draft Mode to explore logo ideas cheaply", 15],
          ["Personalization, Variations and reference images", 15],
          ["Fix common image problems", 15]
        ]
      },
      {
        "title": "Day 10: D-ID — Talking Avatars",
        "lectures": [
          ["Turn one photo into a talking presenter video", 11],
          ["Clone your own voice", 11],
          ["Live interactive avatar agents for your website", 11],
          ["AI-generated presenter faces", 11],
          ["Add avatars inside PowerPoint and Canva", 11]
        ]
      },
      {
        "title": "Day 11: Pictory — Script & Webinar to Video",
        "lectures": [
          ["Turn a script into a video with captions", 11],
          ["Turn a 60-minute webinar into a 60-second highlight", 11],
          ["Split one recording into 10+ social clips", 11],
          ["Turn a PowerPoint into a narrated video", 11],
          ["Review AI-matched visuals before publishing", 11]
        ]
      },
      {
        "title": "Day 12: QuillBot — Editing & Academic Writing",
        "lectures": [
          ["Paraphraser in 7 modes, including Academic", 11],
          ["Grammar Checker for cover letters and emails", 11],
          ["Summariser for long articles", 11],
          ["Citation Generator (APA, MLA, Chicago)", 11],
          ["AI Detector and Humanizer, used honestly", 11]
        ]
      },
      {
        "title": "Day 13: Speechify — Text to Speech",
        "lectures": [
          ["Listen to any document or article", 11],
          ["Scan a printed book page and hear it read aloud", 11],
          ["Clone your own voice for study notes", 11],
          ["Dub videos into Hindi and 60+ languages", 11],
          ["Study faster with adjustable reading speed", 11]
        ]
      },
      {
        "title": "Day 14: GitHub — AI Code Review & Security",
        "lectures": [
          ["Automatic AI review of code changes", 14],
          ["AI fixes for security vulnerabilities", 14],
          ["Custom review instructions for your project", 14],
          ["Staying safe with AI-generated code", 13]
        ]
      },
      {
        "title": "Day 15: GitHub Copilot — AI Coding",
        "lectures": [
          ["Code suggestions as you type", 12],
          ["Ask Mode to understand unfamiliar code", 12],
          ["Edit Mode for specific changes", 12],
          ["Agent Mode to complete whole tasks", 12],
          ["Copilot in the terminal, and safe approval settings", 12]
        ]
      },
      {
        "title": "Day 16: Rytr — Fast Short-Form Writing",
        "lectures": [
          ["40+ templates for descriptions, emails and posts", 13],
          ["20+ tones and your own brand voice", 13],
          ["AIDA and PAS copywriting frameworks", 12],
          ["When to choose a bigger tool instead", 12]
        ]
      },
      {
        "title": "Day 17: Pixlr — AI Photo Editing",
        "lectures": [
          ["Remove backgrounds from product photos", 10],
          ["Fix edges the AI missed", 10],
          ["Process a whole product catalogue at once", 10],
          ["Generate new backgrounds from a text prompt", 10],
          ["Save in the right format (PNG vs JPEG)", 10]
        ]
      },
      {
        "title": "Day 18: Grammarly — Writing Assistant Everywhere",
        "lectures": [
          ["Real-time corrections in Gmail, Slack, Docs and LinkedIn", 13],
          ["Tone Detector before you hit send", 13],
          ["GrammarlyGO for replies and summaries", 12],
          ["Authorship: show honestly what you wrote vs AI", 12]
        ]
      },
      {
        "title": "Day 19: Wordtune — Sentence-Level Rewriting",
        "lectures": [
          ["Rewrite awkward sentences", 10],
          ["Change tone and length", 10],
          ["Add sourced facts and examples", 10],
          ["Summarise documents up to 500 pages with citations", 10],
          ["Smart Paste: reformat text for a new context", 10]
        ]
      },
      {
        "title": "Day 20: Writesonic — SEO Content",
        "lectures": [
          ["Web-connected research with Chatsonic", 14],
          ["SEO-optimised articles with Article Writer", 14],
          ["See what people ask AI assistants, not just Google", 14],
          ["Brand Voice for consistent articles", 13]
        ]
      },
      {
        "title": "Day 21: Chatfuel — Chatbots for WhatsApp & Instagram",
        "lectures": [
          ["Build a booking chatbot without code", 11],
          ["Handle off-script questions with AI", 11],
          ["One inbox for WhatsApp, Instagram, Messenger and website chat", 11],
          ["Train the bot on your products and FAQs", 11],
          ["Shopify abandoned cart recovery", 11]
        ]
      },
      {
        "title": "Day 22: Google AI — Search & Gmail",
        "lectures": [
          ["AI Overviews in Google Search", 11],
          ["Summarise long email threads in Gmail (free)", 11],
          ["Find old emails by asking a question", 11],
          ["Help Me Write for email drafts", 11],
          ["Privacy settings to control Gmail AI", 11]
        ]
      },
      {
        "title": "Day 23: ClickUp Brain — AI Project Management",
        "lectures": [
          ["Ask questions about your tasks and projects", 11],
          ["Autopilot Agents for routine handoffs", 11],
          ["Super Agents for multi-step work", 11],
          ["AI Notetaker for meetings", 11],
          ["Pricing to check before you subscribe", 11]
        ]
      },
      {
        "title": "Day 24: Synthesia — Training Videos",
        "lectures": [
          ["Screen recordings narrated by an AI presenter", 15],
          ["Turn PowerPoint speaker notes into video", 15],
          ["Full-body avatars with natural gestures", 15],
          ["Export as SCORM for any LMS, including Moodle", 15]
        ]
      },
      {
        "title": "Day 25: Sembly AI — Meeting Notes",
        "lectures": [
          ["Auto-join and transcribe Zoom, Meet and Teams", 10],
          ["Risks, decisions and action items extracted automatically", 10],
          ["Organise meetings by project", 10],
          ["Send tasks to Notion, Trello, HubSpot or Slack", 10],
          ["Ask questions about past meetings", 10]
        ]
      },
      {
        "title": "Day 26: Krisp — Clear Call Audio",
        "lectures": [
          ["Remove background noise from calls", 13],
          ["Accent Conversion and how it works", 13],
          ["Meeting notes without a bot joining the call", 12],
          ["On-device privacy", 12]
        ]
      },
      {
        "title": "Day 27: Vrew — Edit Video Like a Document",
        "lectures": [
          ["Cut video by deleting text from the transcript", 11],
          ["Auto-subtitles in your brand style", 11],
          ["Remove pauses and \"um\"s in one click", 11],
          ["Fix a spoken mistake without re-recording", 11],
          ["Translate subtitles into many languages", 11]
        ]
      },
      {
        "title": "Day 28: Conversica — AI Sales Assistants",
        "lectures": [
          ["Automatic lead follow-up and qualification", 10],
          ["Re-engage cold leads", 10],
          ["Email, SMS and chat outreach", 10],
          ["Use in marketing, sales and customer success", 10],
          ["Judging whether an enterprise tool fits your business size", 10]
        ]
      },
      {
        "title": "Day 29: Capstone — Launch a New Service Line",
        "lectures": [
          ["Research the idea with DeepSeek", 8],
          ["Set up a lead pipeline in HubSpot", 8],
          ["Create branding in Canva", 8],
          ["Write website copy with Writesonic", 8],
          ["Build a pitch deck in Gamma", 8],
          ["Plan the launch in ClickUp", 7],
          ["Set up a customer chatbot in Chatfuel", 7],
          ["8 practice checkpoints, including your own 3-stage mini project", 11]
        ]
      },
      {
        "title": "Challenge Complete: Your Recap",
        "lectures": [
          ["The 28-word summary, one word per day", 15],
          ["Quick guide: which tool to use for which task", 15],
          ["Final quiz", 15]
        ]
      }
    ],
    "requirements": [
      "No AI or coding experience needed",
      "A laptop or desktop computer with internet",
      "A Google account (most tools let you sign in with it)",
      "Most tools have a free plan or free trial that covers the core practice",
      "Some features need paid plans: Midjourney (no free plan), Writesonic, Canva Pro, HubSpot Professional agents, Synthesia, and advanced GitHub, ClickUp and Copy.ai features",
      "Conversica is an enterprise tool (from about US$2,999/month), so that day is taught through examples rather than hands-on use",
      "Where a tool needs a paid plan, the course gives you an alternative task, so you can complete every day without buying any tool"
    ],
    "audience": [
      "Small business owners who want AI for marketing, sales, customer support and operations",
      "Marketing, sales and HR professionals who want practical, job-ready AI skills",
      "Trainers, educators and content creators who want to produce videos, presentations and courses faster",
      "Students who want better writing, research and study tools, used honestly",
      "Anyone who wants a broad, structured tour of AI tools instead of random tutorials"
    ],
    "description": [
      "Stop watching random AI tutorials. Start building a structured AI skillset.",
      "Every week brings another AI tool, another feature and another promise to transform the way we work. You don't need to chase everything. You need a structured place to start.",
      "You learn alongside three people throughout the challenge: Ritika, a university student; Karan, who runs a small home-repair business; and Takshika, who designs training programs.",
      "The 28-Day AI Mastery Challenge gives you a focused, hands-on learning journey across:",
      "• AI ASSISTANTS — ChatGPT · DeepSeek · Google AI (Search & Gmail)",
      "• MARKETING & SALES — HubSpot Breeze · Crystal Knows · Copy.ai · Writesonic · Rytr · Chatfuel · Conversica",
      "• DESIGN & VISUALS — Midjourney · Canva AI · Pixlr",
      "• VIDEO & PRESENTATIONS — Gamma · Synthesia · D-ID · Pictory · Lumen5 · Vrew",
      "• WRITING & VOICE — Grammarly · QuillBot · Wordtune · Speechify · Krisp",
      "• PRODUCTIVITY — ClickUp Brain · Sembly AI",
      "• CODING — GitHub · GitHub Copilot",
      "For every feature, you see the exact steps, see a real example, then practise it yourself straight away.",
      "\"I know AI\" is becoming the starting point. The question is: what can you actually do with it?",
      "• Can you use AI to research?",
      "• Can you create professional content?",
      "• Can you improve presentations?",
      "• Can you work with images and video?",
      "• Can you support marketing and sales?",
      "• Can you automate repetitive tasks?",
      "• Can you choose the right AI tool for the work in front of you?",
      "This challenge also tells you honestly what each tool can't do, where the hidden costs are, and when a cheaper tool fits better, so you spend your time and money wisely.",
      "Don't just know the names of AI tools. Learn where they fit into real work.",
      "From \"I should learn AI\" to \"I know where to start.\"",
      "28 days · Practical AI · Real use cases"
    ],
    "includes": [
      "28 tool days + 1 capstone project day + 1 recap module (about 1 hour a day)",
      "28 AI tools covered in depth, with 140+ features explained step by step",
      "120+ hands-on practice tasks in the real tools",
      "Click-by-click instructions and ready-to-use example prompts for every feature",
      "Quizzes and interactive exercises every day",
      "A capstone project: launch a new service line using 7 connected tools",
      "Honest notes on free vs paid plans, pricing traps, privacy and responsible use",
      "Certificate of completion",
      "Watch lessons on mobile or desktop (practice works best on a computer)"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "junior": {
    "subtitle": "A 28-day creative journey for children aged 8–12. They learn to use AI to ask better questions, create quizzes, explore science and space, improve school projects, write stories, and build their own working game in Scratch.",
    "learn": [
      "Ask AI clear questions and give clear instructions, which is a skill they'll use for life",
      "Create their own quizzes, riddles, brain teasers and logic puzzles",
      "Explore countries, science, space, animals and history through curiosity-led missions",
      "Get help with school projects: find ideas, understand topics simply and plan presentations",
      "Turn their imagination into characters, scenes and creative descriptions",
      "Make invitations, greetings and activities for festivals and celebrations",
      "Prepare for competitions with brainstorming, speech practice and confidence-building activities",
      "Write stories, plan storyboards and come up with animation ideas",
      "Design and build their own working game in Scratch, from idea to testing and improving it"
    ],
    "sections": [
      {
        "title": "Meet Your AI Creative Buddy",
        "lectures": [
          ["What Claude is and how to talk to it", 24],
          ["Asking better questions", 24],
          ["Giving clear instructions", 24],
          ["Exploring ideas through conversation", 24]
        ]
      },
      {
        "title": "Create Quizzes & Puzzles",
        "lectures": [
          ["Fun quizzes on any topic", 24],
          ["Riddles and brain teasers", 24],
          ["Logic challenges", 24],
          ["Creating your own puzzles for friends and family", 24]
        ]
      },
      {
        "title": "Go on Knowledge Adventures",
        "lectures": [
          ["Countries and cultures", 24],
          ["Science and space", 24],
          ["Animals and nature", 24],
          ["History and fascinating facts", 24]
        ]
      },
      {
        "title": "Make School Projects More Creative",
        "lectures": [
          ["Finding project ideas", 24],
          ["Understanding topics in simple words", 24],
          ["Research support", 24],
          ["Planning presentations", 24]
        ]
      },
      {
        "title": "Turn Imagination into Creative Art",
        "lectures": [
          ["Creating characters and scenes", 24],
          ["Choosing themes", 24],
          ["Writing creative descriptions", 24],
          ["Visual thinking", 24]
        ]
      },
      {
        "title": "Create for Festivals & Celebrations",
        "lectures": [
          ["Invitations and greetings", 24],
          ["Celebration ideas and activities", 24],
          ["Festival projects", 24]
        ]
      },
      {
        "title": "Prepare for Competitions",
        "lectures": [
          ["Brainstorming ideas", 24],
          ["Practising speeches", 24],
          ["Creative challenges", 24],
          ["Building confidence", 24]
        ]
      },
      {
        "title": "Become a Young Story Creator",
        "lectures": [
          ["Writing stories and building characters", 24],
          ["Planning scenes and storyboards", 24],
          ["Video and animation ideas", 24]
        ]
      },
      {
        "title": "Build a Real Game in Scratch",
        "lectures": [
          ["Coming up with a game idea", 24],
          ["Designing characters, rules and actions", 24],
          ["Adding challenges", 24],
          ["Building the game in Scratch", 24],
          ["Testing and improving it", 24]
        ]
      }
    ],
    "requirements": [
      "No coding or AI experience needed",
      "A laptop or desktop computer with internet (recommended for Scratch)",
      "A Claude account, which a parent sets up and supervises",
      "Scratch, which is free at scratch.mit.edu",
      "A parent or guardian available for supervision, especially during the first few missions"
    ],
    "audience": [
      "Children aged 8–12 who are curious about AI, games and creating things",
      "Parents who want their child's screen time to be creative and productive",
      "Children who enjoy quizzes, stories, art or games and want to make their own",
      "Students who want help making school projects and competition entries more creative",
      "Families who prefer learning in English, Hindi or Marathi"
    ],
    "description": [
      "What if your child could create with AI, not just watch it?",
      "Your child will grow up with AI. Let's teach them to create with it.",
      "The TAKXILA Junior AI Challenge turns screen time into creative time. Over 28 days, children aged 8–12 complete one hands-on mission every day. Each mission asks them to try, create and improve something of their own instead of passively watching.",
      "The journey:",
      "• Day 1: Meet your AI creative buddy",
      "• Next: Create quizzes, solve puzzles, explore the world",
      "• Then: Build school projects, imagine characters, write stories",
      "• Finally: Design and build your own game in Scratch",
      "Ask → Think → Explore → Create → Design → Build → Play",
      "Less passive screen time. More creative screen time.",
      "This isn't just \"learning AI.\" It's learning to create with AI, and to think, question and imagine along the way.",
      "Their ideas. Their creativity. Their game."
    ],
    "includes": [
      "28 daily missions, one new creative activity every day",
      "310 interactive screens with activities and challenges, not passive videos",
      "Hands-on practice with Claude AI",
      "A complete Scratch game-building project",
      "Lessons in English, Hindi and Marathi",
      "Certificate of completion"
    ],
    "level": "Ages 8–12",
    "language": "English, Hindi and Marathi"
  },
  "ready": {
    "subtitle": "Learn 27 practical AI tools in 28 days, one tool a day, for research, writing, visuals, video, voice, meetings, marketing, sales and automation. Each lesson tells you clearly what's free and what's paid.",
    "learn": [
      "Write prompts that get useful answers using Role, Context and Instructions",
      "Follow one simple 4-step method that works on any AI tool: Clarify, Specify, Generate, Verify & Refine",
      "Research faster with cited sources using Perplexity, Grok, DeepSeek and Gemini",
      "Analyse long documents, contracts and mixed files, and get one clear summary",
      "Create images, social posts, flyers, product mockups and presentations without design skills",
      "Produce AI avatar videos, script-to-video content and short clips for social media",
      "Turn articles into audio, write by voice, get clear call audio and automatic meeting notes",
      "Use AI inside Outlook, Excel, Word, PowerPoint, Teams, Notion and ClickUp",
      "Write marketing copy, set up AI chatbots for Instagram and WhatsApp, and use AI in your CRM",
      "Automate repeated tasks with Zapier by simply describing them",
      "Know which tools are free, which are paid, and which one fits each job"
    ],
    "sections": [
      {
        "title": "Day 1: ChatGPT — Endless Possibilities",
        "lectures": [
          ["Why vague prompts give vague answers", 11],
          ["Role, Context and Instructions: the 3 parts of a strong prompt", 11],
          ["Follow-ups that reuse the whole conversation", 11],
          ["Custom GPTs, Memory, Projects, Voice Mode, Deep Research and Connectors", 11],
          ["5 practice tasks", 16]
        ]
      },
      {
        "title": "Day 2: Gemini — Make Sense of Mixed Documents",
        "lectures": [
          ["Upload notes, emails, PDFs and spreadsheets together", 13],
          ["Get one connected summary, with contradictions flagged", 13],
          ["The 3-part formula for good Gemini requests", 12],
          ["Gemini's limits and when to double-check", 12]
        ]
      },
      {
        "title": "Day 3: Claude — Careful Thinking & Long Documents",
        "lectures": [
          ["When to choose Claude over ChatGPT or Gemini", 13],
          ["Review a contract section by section and flag risks", 13],
          ["Prepare for a meeting or difficult conversation", 12],
          ["Projects and Artifacts (free) vs Pro features", 12]
        ]
      },
      {
        "title": "Day 4: Midjourney — AI Images",
        "lectures": [
          ["Create your first image from a prompt", 12],
          ["Refine with Vary Subtle, Vary Strong and Upscale", 11],
          ["How lighting words change the whole image", 11],
          ["Keep a consistent look with reference images", 11]
        ]
      },
      {
        "title": "Day 5: Synthesia — AI Avatar Videos",
        "lectures": [
          ["Create a presenter video from a script, no camera", 12],
          ["Write scripts that sound natural", 11],
          ["Translate videos into 160+ languages", 11],
          ["Branding, scenes and export settings", 11]
        ]
      },
      {
        "title": "Day 6: Perplexity — Research with Sources",
        "lectures": [
          ["One researched answer instead of 10 open tabs", 12],
          ["Compare tools or vendors and get a recommendation", 11],
          ["Check citations before you act", 11],
          ["Pro Search, Deep Research and Spaces", 11]
        ]
      },
      {
        "title": "Day 7: Canva AI — Design from a Sentence",
        "lectures": [
          ["Design, Image, Doc, Code and Video modes", 15],
          ["Create posts and flyers by typing, uploading or speaking", 15],
          ["Refine designs with the in-editor chatbot", 15]
        ]
      },
      {
        "title": "Day 8: ChatGPT Images — Visuals for Work",
        "lectures": [
          ["Posters with exact, readable text", 11],
          ["Realistic people and specific art styles", 11],
          ["Labelled diagrams and product mockups", 17],
          ["Edit one thing at a time", 11]
        ]
      },
      {
        "title": "Day 9: Jasper — Marketing Copy in Your Brand Voice",
        "lectures": [
          ["Why general AI tools sound generic for marketing", 12],
          ["The What + Who + Goal brief", 11],
          ["Agent Library templates and Jasper IQ brand memory", 11],
          ["Emails, social posts, ads and website copy", 11]
        ]
      },
      {
        "title": "Day 10: Notion AI — Your AI Project Hub",
        "lectures": [
          ["Build a reusable project management workspace", 19],
          ["Planning, risk, reporting and team update templates", 18],
          ["Ask questions across your whole workspace", 18]
        ]
      },
      {
        "title": "Day 11: Grok — Real-Time Information",
        "lectures": [
          ["What people are saying about a topic today", 12],
          ["DeepSearch for cited, cross-checked research", 11],
          ["Imagine for images and short videos", 11],
          ["Turn rough notes into formatted documents", 11]
        ]
      },
      {
        "title": "Day 12: Microsoft Copilot — AI Inside Office",
        "lectures": [
          ["Summarise long email threads in Outlook", 13],
          ["Meeting recaps in Teams", 13],
          ["Charts and formulas in Excel from plain words", 12],
          ["Turn a Word document into a PowerPoint deck", 12]
        ]
      },
      {
        "title": "Day 13: Fathom — AI Meeting Notes",
        "lectures": [
          ["Auto-join and record Zoom, Meet and Teams calls", 12],
          ["Instant summaries and action items", 11],
          ["Share a short clip instead of the full recording", 11],
          ["Draft follow-up emails from the call", 11]
        ]
      },
      {
        "title": "Day 14: Zapier — Automate Repeated Work",
        "lectures": [
          ["Triggers and actions explained simply", 13],
          ["Build an automation by describing it", 13],
          ["Add AI steps to summarise, sort or draft", 12],
          ["When to use an AI Agent instead", 12]
        ]
      },
      {
        "title": "Day 15: Beautiful.ai — Presentations in Minutes",
        "lectures": [
          ["Turn scattered notes into a designed deck", 12],
          ["Smart Slides that keep layouts clean", 11],
          ["Flowcharts and diagrams from a description", 11],
          ["Where your own judgment must take over", 11]
        ]
      },
      {
        "title": "Day 16: DeepSeek — Reasoning & Search",
        "lectures": [
          ["Instant, Expert and Vision modes", 14],
          ["DeepThink: see the step-by-step reasoning", 13],
          ["Meaning-based search for \"why\" questions", 13]
        ]
      },
      {
        "title": "Day 17: Grammarly — Writing Partner Everywhere",
        "lectures": [
          ["Real-time corrections in Gmail, Docs, Slack and LinkedIn", 14],
          ["Proofreader, Paraphraser, Reader Reactions and Humanizer", 13],
          ["Grammarly Go assistant", 13]
        ]
      },
      {
        "title": "Day 18: QuillBot — Paraphrasing & Grammar",
        "lectures": [
          ["Standard, Fluency and Formal modes", 14],
          ["Grammar Checker, Sentence Rewriter and vocabulary", 13],
          ["Plagiarism Checker, citations and AI Detector", 13]
        ]
      },
      {
        "title": "Day 19: Pixlr — AI Photo Editing",
        "lectures": [
          ["Auto-enhance and AI image generation", 14],
          ["Remove backgrounds and add text in minutes", 13],
          ["Layers, filters and the right export format", 13]
        ]
      },
      {
        "title": "Day 20: Pictory — Script to Video",
        "lectures": [
          ["Turn a script, URL or PowerPoint into a video", 12],
          ["Auto-highlights for social media clips", 11],
          ["Edit video by editing text", 11],
          ["AI voiceovers and brand kit", 11]
        ]
      },
      {
        "title": "Day 21: D-ID — Talking Avatars",
        "lectures": [
          ["Turn a photo into a talking presenter", 12],
          ["Voice cloning in 120+ languages", 11],
          ["Interactive AI agents for your website", 11],
          ["Video Translate", 11]
        ]
      },
      {
        "title": "Day 22: Speechify — Listen, Dictate, Learn",
        "lectures": [
          ["Turn articles and PDFs into audio", 12],
          ["Write by voice up to 5x faster", 11],
          ["Ask questions about the document you're reading", 11],
          ["Turn documents into podcasts", 11]
        ]
      },
      {
        "title": "Day 23: Krisp — Clear Calls & Meeting Notes",
        "lectures": [
          ["Remove background noise during calls", 12],
          ["Accent Conversion and live voice translation", 11],
          ["Meeting notes without a bot in the call", 11],
          ["Ask Krisp to find any moment in a meeting", 11]
        ]
      },
      {
        "title": "Day 24: ClickUp Brain 2.0 — AI Project Management",
        "lectures": [
          ["Create tasks with one plain sentence", 13],
          ["Switch between ChatGPT, Claude and Gemini in one chat", 13],
          ["Super Agents for always-on workflows", 12],
          ["Build automations in plain English", 12]
        ]
      },
      {
        "title": "Day 25: HubSpot Breeze — AI in Your CRM",
        "lectures": [
          ["Ask questions about your deals and contacts", 12],
          ["Customer, Prospecting and Data Agents", 11],
          ["Content Remix: one post into many formats", 11],
          ["Track your brand in AI search results", 11]
        ]
      },
      {
        "title": "Day 26: Crystal — Personality Insights",
        "lectures": [
          ["Look up a colleague's or prospect's communication style", 12],
          ["DISC personality types explained", 11],
          ["Write emails that match the reader's style", 11],
          ["Prepare for meetings with Meeting Insights", 11]
        ]
      },
      {
        "title": "Day 27: Chatfuel — AI for Instagram & WhatsApp",
        "lectures": [
          ["Set up an AI assistant for sales, bookings and marketing", 15],
          ["Add your services, prices and FAQs", 15],
          ["Test replies before going live", 15]
        ]
      },
      {
        "title": "Day 28: Conversica — AI Sales Conversations",
        "lectures": [
          ["Two-way AI follow-up with sales leads", 12],
          ["Industry-trained agents for hospitality, education, automotive and more", 11],
          ["Answers grounded in your own FAQs", 11],
          ["How to evaluate an enterprise AI tool", 11]
        ]
      }
    ],
    "requirements": [
      "No AI or coding experience needed",
      "A laptop or desktop computer with internet",
      "A Google account (most tools let you sign in with it)",
      "Most tools have a free plan that covers the practice tasks",
      "Some tools are paid or trial-only: Midjourney, Jasper, Beautiful.ai, Pictory, D-ID, Chatfuel, ClickUp Brain and Microsoft 365 Copilot (for your own files)",
      "Conversica is an enterprise tool with no free trial, so that day is taught through examples",
      "Wherever a tool is paid, the lesson shows you a free alternative, so you can practise without buying anything"
    ],
    "audience": [
      "Corporate professionals and managers who want to stay relevant as AI changes their role",
      "Consultants and small business owners who want practical, billable results from AI",
      "Fresh graduates and job seekers who want job-ready AI skills on their CV",
      "Marketing, sales and HR professionals who want AI for content, CRM and communication",
      "Anyone who wants to know which AI tool to use for which job, and what it costs"
    ],
    "description": [
      "AI is moving fast. Are your skills keeping up?",
      "AI is already changing how professionals research, communicate, analyse, create, market and automate their work. The question is no longer whether AI will matter. It already does. The question is how prepared you will be to work with it.",
      "You learn alongside three people throughout the challenge: Aditya, a mid-level corporate manager; Meera, who runs her own consultancy; and Yash, a recent graduate building job-ready skills.",
      "28 days. Practical skills. Real-world application.",
      "• RESEARCH WITH GREATER SPEED — discover information, compare sources, summarise findings",
      "• WRITE & COMMUNICATE BETTER — emails, reports, documents, rewriting, professional communication",
      "• ANALYSE INFORMATION — understand data, compare options, support decisions",
      "• CREATE PROFESSIONAL VISUALS — images, designs, social creatives, presentations",
      "• CREATE VIDEO CONTENT — scripts, AI avatars, AI video, social clips",
      "• WORK WITH VOICE & AUDIO — narration, text to speech, voice typing, clear calls",
      "• IMPROVE EVERYDAY PRODUCTIVITY — planning, meeting notes, organisation, faster execution",
      "• BUILD MARKETING & SALES CONTENT — campaigns, brand copy, CRM, chatbots, lead follow-up",
      "• AUTOMATE REPEATABLE WORK — AI automation and workflows",
      "Learn → Practise → Apply → Improve → Become AI-ready",
      "Every lesson shows you exactly where to click, gives you a real example, and asks you to try it on your own work. You'll also know what each tool costs before you sign up, so there are no surprises.",
      "Knowing about AI isn't the same as knowing how to use it. This challenge gives you time to explore, experiment and build skills you can apply to real work.",
      "28 days to start building the skills that matter in an AI-enabled workplace."
    ],
    "includes": [
      "28 daily lessons (40–60 minutes each)",
      "27 AI tools covered, with what's free vs paid explained for each",
      "25+ click-by-click walkthroughs with real examples",
      "30+ hands-on practice tasks on your own real work",
      "Ready-to-use prompt formulas you can reuse every day",
      "Quizzes after every topic",
      "Free alternatives suggested wherever a tool is paid",
      "Certificate of completion",
      "Watch lessons on mobile or desktop (practice works best on a computer)"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "n8n-agents": {
    "subtitle": "Go from complete beginner to building a working AI operations system for a real business: automations, AI agents, a knowledge-powered assistant, a phone voice agent and a multi-agent team. No coding background needed.",
    "learn": [
      "Build, test and publish n8n workflows on your own, from a booking form to scheduled daily reports",
      "Connect apps safely with credentials, APIs, webhooks and the HTTP Request node",
      "Use AI inside automations to classify messages, extract details and draft replies",
      "Build AI agents with chat models, memory, tools and clear instructions",
      "Give an agent your business knowledge (prices, policies, FAQs) using RAG and vector stores",
      "Connect a voice agent (Vapi or ElevenLabs) to n8n so it can answer calls, check availability and book jobs",
      "Build multi-agent teams with a supervisor and specialist agents",
      "Add human approval before an agent takes risky actions like refunds or discounts",
      "Share your tools with other AI apps using MCP (Model Context Protocol)",
      "Run automations in production with error alerts, evaluations, security and cost control",
      "Self-host n8n for free with Docker",
      "Scope, price and deliver automation projects for clients"
    ],
    "sections": [
      {
        "title": "Module 0: Welcome & Course Overview",
        "lectures": [
          ["What you'll build and how the course works", 10],
          ["The SparkFix project", 10]
        ]
      },
      {
        "title": "Module 1: Automation, AI Agents & n8n Foundations",
        "lectures": [
          ["Why automate, and when to use AI", 26],
          ["Workflows, nodes, triggers and executions", 26],
          ["Automation vs AI automation vs AI agent vs voice agent", 25],
          ["n8n Cloud vs self-hosted, plans and costs", 25],
          ["Lab: create your n8n account and tour the editor", 38],
          ["Map a business process before you build", 25]
        ]
      },
      {
        "title": "Module 2: Your First Workflow — Form → Table → Email",
        "lectures": [
          ["The n8n editor in depth", 31],
          ["Lab: build a booking form", 46],
          ["Lab: save every booking to a data table or Google Sheets", 46],
          ["Lab: send personalised confirmation emails with Gmail", 46],
          ["Testing, executions and publishing", 31],
          ["Using AI to write better messages", 30]
        ]
      },
      {
        "title": "Module 3: Logic, Routing & Scheduled Workflows",
        "lectures": [
          ["If and Switch routing", 35],
          ["Filter, Sort, Aggregate, Merge and more", 35],
          ["Lab: alert the owner about urgent jobs", 53],
          ["Lab: a 7:30 am daily job digest", 52],
          ["Loops and waiting", 35]
        ]
      },
      {
        "title": "Module 4: Data Mastery — JSON, Expressions & the Code Node",
        "lectures": [
          ["Items and JSON explained simply", 35],
          ["Expressions to reach any data", 35],
          ["Lab: clean messy names, phone numbers and dates", 52],
          ["The Code node for pricing rules", 34],
          ["Getting AI help with expressions", 34]
        ]
      },
      {
        "title": "Module 5: Credentials, APIs, Webhooks & HTTP Requests",
        "lectures": [
          ["How APIs work, and what status codes mean", 32],
          ["Keeping API keys and secrets safe", 32],
          ["Lab: weather-based demand alert using a free API", 49],
          ["Webhooks: letting other systems call n8n", 32],
          ["Lab: build a secured \"free slots\" API", 48],
          ["Import cURL, retries and pagination", 32]
        ]
      },
      {
        "title": "Module 6: AI Automations — LLMs, Prompts & Structured Output",
        "lectures": [
          ["How LLMs work (tokens, context, temperature)", 33],
          ["Lab: connect a chat model (free options included)", 49],
          ["The RCTRO prompt pattern for automations", 33],
          ["Lab: classify messages and extract booking details", 49],
          ["Guardrails, privacy and AI cost control", 33],
          ["Ready-made prompt pack", 33]
        ]
      },
      {
        "title": "Module 7: Building AI Agents in n8n",
        "lectures": [
          ["Inside the AI Agent node and the agent loop", 40],
          ["Lab: a chat agent with memory", 59],
          ["Tools and $fromAI(): giving your agent hands", 39],
          ["Lab: an agent that checks real slots and books jobs", 59],
          ["Memory, sessions and writing great instructions", 39],
          ["Testing and debugging agents", 39]
        ]
      },
      {
        "title": "Module 8: RAG — Giving Agents Your Business Knowledge",
        "lectures": [
          ["How RAG and embeddings work", 35],
          ["Chunking, overlap and metadata", 35],
          ["Choosing a vector store (Pinecone, Supabase, Qdrant and more)", 35],
          ["Lab: build a knowledge base from business documents", 53],
          ["Lab: an agent that answers prices and warranty questions accurately", 52],
          ["Keeping knowledge fresh and measuring answer quality", 35]
        ]
      },
      {
        "title": "Module 9: AI Voice Agents Connected to n8n",
        "lectures": [
          ["How voice agents work, and why speed matters", 34],
          ["Choosing a platform: Vapi, ElevenLabs Agents, Retell AI", 34],
          ["Lab: make your n8n tools voice-ready", 50],
          ["Lab: a Vapi phone receptionist that books real jobs", 50],
          ["Lab: the same agent on ElevenLabs", 50],
          ["Writing voice prompts", 34],
          ["Phone numbers, call logs and compliance", 33]
        ]
      },
      {
        "title": "Module 10: Multi-Agent Systems, MCP & Human-in-the-Loop",
        "lectures": [
          ["When one agent isn't enough", 37],
          ["Lab: a supervisor with booking, knowledge and complaints specialists", 55],
          ["Human approval for risky actions", 37],
          ["Lab: discounts that need the owner's approval", 55],
          ["MCP explained simply", 36],
          ["Lab: share your tools with Claude Desktop and other AI apps", 55]
        ]
      },
      {
        "title": "Module 11: Production — Errors, Evaluations, Security & Self-Hosting",
        "lectures": [
          ["Error handling so no booking disappears", 32],
          ["Lab: error alerts and safe fallbacks", 48],
          ["Evaluations to measure AI quality", 32],
          ["Monitoring and proving time saved", 32],
          ["Security checklist and prompt-injection defence", 32],
          ["Lab: self-host n8n free with Docker", 47],
          ["Backups, updates, costs and scaling", 32]
        ]
      },
      {
        "title": "Module 12: Capstone — The Complete AI Operations System",
        "lectures": [
          ["Lab: integrate and test everything end to end (10 test cases)", 70],
          ["Validation and handover pack", 47],
          ["Applying the blueprint to salons, gyms, coaching, retail, restaurants and real estate", 47],
          ["Delivering, pricing and maintaining client projects", 47],
          ["Prompt library and glossary", 47],
          ["Final mock exam", 47]
        ]
      }
    ],
    "requirements": [
      "No coding or AI experience needed",
      "A laptop or desktop with Chrome or Edge",
      "An email address and a Google account (for the Gmail and Sheets labs)",
      "n8n: free Cloud trial (no credit card), or the free self-hosted Community Edition (setup taught in Module 11)",
      "AI model: n8n Cloud's included credits, or a free Google Gemini API key",
      "Voice labs: Vapi or ElevenLabs browser test calls",
      "Optional paid costs: an n8n Cloud plan after the trial (from about €20/month), AI usage beyond free limits, and phone numbers and call minutes for a live voice agent"
    ],
    "audience": [
      "Complete beginners who want a guided path into automation and AI agents",
      "Small business owners who want fewer repetitive tasks and faster customer replies",
      "Freelancers and consultants who want to build and sell AI automations to clients",
      "Operations, support, sales and marketing staff who want to automate their own work",
      "Developers who want to prototype AI agents quickly without writing everything in code"
    ],
    "description": [
      "Stop just using AI. Start building AI systems that automate real business work.",
      "Most AI courses teach you to chat with AI. This one teaches you to build with it. You'll create a complete AI operations system for a real-style business, step by step, in n8n, the visual automation platform used by businesses and automation agencies worldwide.",
      "The whole course builds one system for one business. SparkFix Home Services is an appliance-repair company in Nashik owned by Meera, with nine technicians. Today they miss calls after 7 pm and retype every booking by hand. By the end, you'll have automated all of it.",
      "What you'll build:",
      "• 🤖 AI Agents that chat with customers, check availability and book jobs",
      "• 🎙️ AI Voice Agents that answer the phone after hours",
      "• 🧠 RAG Systems that answer from your own price lists and policies",
      "• ⚡ n8n Automations for forms, emails, routing and daily reports",
      "• 🔗 APIs & Webhooks so other systems can talk to your workflows",
      "• 🤝 Multi-Agent Systems with a supervisor and specialist agents",
      "• 🔐 Human approvals and MCP for safe, connected AI",
      "• 🏢 Business Automation that's production-ready, monitored and secure",
      "Every page follows the same rhythm: understand it, see it, do it in the real tool, check your knowledge, fix common mistakes, and apply it to the project. Each lab tells you exactly where to click, what to type and what you should see.",
      "Want to offer this as a service? The final module shows how to apply the same blueprint to six other industries, and how to scope, price, deliver and maintain automation projects for clients.",
      "✅ Beginner friendly",
      "✅ No advanced coding required",
      "✅ Practical, project-based learning",
      "✅ Free options first, wherever possible",
      "✅ Freelancing and agency guidance included",
      "From beginner to AI automation professional."
    ],
    "includes": [
      "13 modules, about 48 hours including hands-on work",
      "25 guided hands-on labs in real tools, with exact steps and troubleshooting tables",
      "12 practical assignments, one per module",
      "A capstone project: a complete AI operations system for a real-style business",
      "190+ quiz questions and a final mock exam",
      "A searchable prompt library with ready-to-copy AI prompts",
      "Copy-ready code and expressions for every lab",
      "A glossary of every technical term in plain language",
      "Narrated lessons with captions and a language switcher",
      "A guide to delivering and pricing automation projects for clients",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "wa-agent": {
    "subtitle": "Build your own WhatsApp bulk messaging workflow in 4 easy steps, using n8n, Google Sheets and the WhatsApp Business Platform from Meta. No coding needed, and you can finish the build in under 15 minutes.",
    "learn": [
      "Set up a trigger that starts your messaging automation",
      "Manage your message content and recipient list in Google Sheets",
      "Set a sending limit to control how many messages go out at a time",
      "Connect your workflow to WhatsApp through the Meta WhatsApp Business Platform",
      "Send messages using Meta-approved message templates",
      "See how the full automation works, from trigger to message delivery",
      "Apply the same workflow to customer updates, reminders and outreach"
    ],
    "sections": [
      {
        "title": "Step 1: Set Up the Trigger",
        "lectures": [
          ["How a trigger starts the whole automation", 4],
          ["Choosing when your messages should be sent", 4]
        ]
      },
      {
        "title": "Step 2: Connect Google Sheets",
        "lectures": [
          ["Organise recipients and message content in a sheet", 4],
          ["Connect the sheet to your workflow", 3]
        ]
      },
      {
        "title": "Step 3: Set a Sending Limit",
        "lectures": [
          ["Control how many messages are sent per run", 3],
          ["Why limits keep your sending safe and controlled", 3]
        ]
      },
      {
        "title": "Step 4: Connect WhatsApp Through Meta",
        "lectures": [
          ["Connect your WhatsApp Business account", 3],
          ["Use approved message templates", 3],
          ["Run the complete workflow and check delivery", 3]
        ]
      }
    ],
    "requirements": [
      "No coding experience needed",
      "A laptop or desktop computer",
      "An n8n account (free Cloud trial or free self-hosted version)",
      "A Google account for Google Sheets",
      "A Meta Business account with the WhatsApp Business Platform set up",
      "A phone number to register on the WhatsApp Business Platform",
      "At least one approved WhatsApp message template",
      "Recipients who have agreed to receive WhatsApp messages from your business",
      "Note: Meta may charge for template messages. Check current rates on Meta's WhatsApp Business pricing page."
    ],
    "audience": [
      "Small business owners who send regular updates to customers on WhatsApp",
      "Marketers and sales teams who want to save time on repeated messages",
      "Beginners who want a quick, practical first automation project",
      "Freelancers who want to offer WhatsApp automation to clients"
    ],
    "description": [
      "Create your own WhatsApp bulk messaging agent, from scratch.",
      "Sending the same WhatsApp message to dozens of customers one by one takes hours. In this free course, you'll build a working automation that does it for you, using a simple no-code workflow.",
      "Every step is explained clearly, so beginners can follow along easily:",
      "• A trigger starts the automation",
      "• Your message content and recipient list live in Google Sheets",
      "• A built-in limit keeps sending controlled",
      "• Messages go out through WhatsApp via Meta, using approved templates",
      "By the end, you'll have a ready-to-use WhatsApp messaging workflow, and a practical automation skill you can use for business updates, reminders and customer outreach.",
      "4 steps. 30 minutes. Free."
    ],
    "includes": [
      "A complete, working workflow built step by step",
      "4 easy steps, each explained for beginners",
      "Tools used: n8n, Google Sheets, Meta WhatsApp Business Platform",
      "Certificate of completion"
    ],
    "level": "Beginner",
    "language": "English"
  },
  "agentic": {
    "subtitle": "Go from \"what is an AI agent?\" to designing, building, testing, securing and deploying real AI agents. Build them with code (Python, LangGraph, MCP) or without code (n8n), using free tools first.",
    "learn": [
      "Understand what turns a chatbot into an agent, and decide when an agent is the right solution and when it isn't",
      "Choose the right AI model for each task and estimate what an agent will cost to run",
      "Write system prompts, examples and structured JSON output that make agents reliable",
      "Give agents \"hands\" by building tools they can call safely to check slots, create bookings and draft quotes",
      "Build a knowledge base with RAG, embeddings and vector stores, so agents answer from your own documents with citations",
      "Apply proven agent patterns: ReAct, planning, reflection, routing and orchestrator-workers",
      "Build stateful agents in LangGraph with memory and human approval before risky actions",
      "Build an MCP server and connect it to Claude Desktop and your own agents",
      "Compare Google ADK, the OpenAI Agents SDK and the Claude Agent SDK, and pick the right framework",
      "Design multi-agent teams with supervisors and handoffs, and build one in CrewAI",
      "Build a complete agent without code in n8n",
      "Test agents with golden datasets and traces, protect them against the OWASP Agentic Top 10, and run them in production with monitoring and cost controls"
    ],
    "sections": [
      {
        "title": "Module 1: The Agentic Shift — What AI Agents Are",
        "lectures": [
          ["Chatbot, workflow or agent: knowing the difference", 10],
          ["The agent loop and the five building blocks of an agent", 10],
          ["How much autonomy to give an agent: a practical scale", 10],
          ["Measuring whether an agent is good", 10],
          ["When NOT to build an agent", 10],
          ["Lab: feel the difference between chat and tool-using AI", 15],
          ["Assignment: build an agent opportunity map", 10]
        ]
      },
      {
        "title": "Module 2: Inside the Agent's Brain — Models, Tokens & Costs",
        "lectures": [
          ["How language models turn text into decisions", 10],
          ["Today's model families and reasoning (\"thinking\") models", 10],
          ["Settings that control behaviour, such as temperature", 9],
          ["Lab: test models in Google AI Studio and get your free API key", 14],
          ["Estimating and cutting agent costs", 9],
          ["Model limitations every agent designer must plan for", 9],
          ["Optional lab: run a model on your own computer with Ollama", 14]
        ]
      },
      {
        "title": "Module 3: Instructing Agents — System Prompts & Structured Output",
        "lectures": [
          ["The messages an agent sees", 11],
          ["Anatomy of a strong agent system prompt", 11],
          ["Few-shot examples and step-by-step reasoning", 11],
          ["Roles, personas and boundaries", 11],
          ["Structured JSON output your code can trust", 10],
          ["Lab: build and test an intake classifier", 16],
          ["Common prompt failures, and treating prompts like code", 10]
        ]
      },
      {
        "title": "Module 4: Your Developer Workbench",
        "lectures": [
          ["Install Python and VS Code", 10],
          ["Virtual environments and packages", 10],
          ["Keep API keys secret with .env and .gitignore", 10],
          ["Lab: run your first coded model call", 15],
          ["Structured output with Pydantic", 10],
          ["Rate limits, errors and retries", 10],
          ["Using AI coding assistants responsibly", 10]
        ]
      },
      {
        "title": "Module 5: Tools & Function Calling — Giving Agents Hands",
        "lectures": [
          ["Why agents need tools, and how function calling works", 13],
          ["Defining tools: name, description, arguments", 13],
          ["Lab: build and test a booking agent", 20],
          ["The explicit tool loop that frameworks use", 13],
          ["Handling tool failures", 13],
          ["Tool safety rules that prevent disasters", 13]
        ]
      },
      {
        "title": "Module 6: Memory & Knowledge — RAG, Embeddings & Vector Stores",
        "lectures": [
          ["Short-term, working, long-term and knowledge memory", 12],
          ["Managing conversation context", 12],
          ["Embeddings and the RAG pipeline explained simply", 11],
          ["Chunking well, and choosing a vector store", 11],
          ["Build a knowledge base with Chroma", 11],
          ["Lab: build RAG with citations and test grounding", 17],
          ["Measuring retrieval quality, and long-term memory with privacy", 11]
        ]
      },
      {
        "title": "Module 7: Thinking Patterns — ReAct, Planning, Reflection & Routing",
        "lectures": [
          ["Start with the simplest design that works", 12],
          ["Workflow patterns: chaining, routing, parallel work", 12],
          ["ReAct, plan-and-execute and orchestrator-workers", 12],
          ["Reflection and evaluator-optimizer loops", 11],
          ["Lab: build a router and a reflection check before quotes go out", 17],
          ["Tree-of-thoughts and other advanced reasoning", 11]
        ]
      },
      {
        "title": "Module 8: Building with LangGraph",
        "lectures": [
          ["LangChain vs LangGraph: who does what", 14],
          ["Lab: a quick agent with create_agent", 20],
          ["Graph basics: state, nodes and edges", 14],
          ["Memory per customer, pausing and resuming", 14],
          ["Lab: build a graph with human approval", 20],
          ["Streaming progress, errors, limits and project structure", 13]
        ]
      },
      {
        "title": "Module 9: MCP — Connecting Agents to Any Tool or Data",
        "lectures": [
          ["The problem MCP solves: hosts, clients and servers", 13],
          ["Tools, resources and prompts; local vs remote servers", 13],
          ["Lab: build and test an MCP server with the MCP Inspector", 20],
          ["Connect your server to Claude Desktop and your LangGraph agent", 13],
          ["MCP security rules, registries and remote servers", 13],
          ["Agent-to-agent communication with A2A", 13]
        ]
      },
      {
        "title": "Module 10: Vendor Agent SDKs — OpenAI, Claude & Google ADK",
        "lectures": [
          ["One set of ideas across every SDK", 13],
          ["What to avoid in 2026: deprecated tools", 12],
          ["Lab: rebuild the agent in Google ADK on the free Gemini key", 19],
          ["OpenAI Agents SDK and Claude Agent SDK (optional, paid API)", 12],
          ["Microsoft Agent Framework overview", 12],
          ["A decision matrix for choosing a framework", 12]
        ]
      },
      {
        "title": "Module 11: Multi-Agent Systems — Teams, Handoffs & CrewAI",
        "lectures": [
          ["When you need more than one agent, and when you don't", 13],
          ["Supervisor, pipeline, handoff and critic architectures", 13],
          ["Designing roles and communication", 13],
          ["Lab: build and stress-test a CrewAI team", 20],
          ["How multi-agent systems fail", 13],
          ["Supervisors in LangGraph and handoffs in SDKs", 13]
        ]
      },
      {
        "title": "Module 12: No-Code Agents — n8n, Zapier & Make",
        "lectures": [
          ["Why and when to choose no-code", 13],
          ["Start n8n and learn the building blocks", 12],
          ["Lab: build an intake agent with memory and Google Sheets tools", 19],
          ["Add a human approval step", 12],
          ["Activate, monitor and stay safe", 12],
          ["Zapier and Make for agent workflows", 12]
        ]
      },
      {
        "title": "Module 13: Testing & Evaluating Agents",
        "lectures": [
          ["Why agent testing is different from normal software", 12],
          ["What to measure: outcomes, steps, content and cost", 12],
          ["Build a golden test dataset", 12],
          ["Code checks and LLM-as-judge", 11],
          ["Tracing every step in LangSmith", 11],
          ["Lab: build an evaluation suite with automated regression tests", 17]
        ]
      },
      {
        "title": "Module 14: Agent Security & Guardrails",
        "lectures": [
          ["Why agents are a new security problem", 11],
          ["Direct and indirect prompt injection", 11],
          ["The OWASP Top 10 for Agentic Applications", 11],
          ["Layered guardrails, permissions and sandboxes", 11],
          ["Human oversight that actually works", 10],
          ["Lab: guard and red-team your agent", 16],
          ["Responsible AI duties", 10]
        ]
      },
      {
        "title": "Module 15: Shipping to Production",
        "lectures": [
          ["Production readiness checklist", 12],
          ["Wrap the agent in an API and package it in a container", 12],
          ["Durable state, secrets and deployment options", 12],
          ["Monitoring, alerts, cost controls and fallbacks", 11],
          ["Model updates and incident response", 11],
          ["Lab: ship the agent as a service", 17]
        ]
      },
      {
        "title": "Module 16: Capstone — The Complete Agent Platform & Your Career",
        "lectures": [
          ["Assemble the complete platform", 13],
          ["Lab: end-to-end platform test", 20],
          ["Write a 30-day pilot plan", 13],
          ["Adapt the design to another industry or your own business", 13],
          ["Careers in agentic AI, and presenting your capstone as a portfolio project", 13],
          ["Final assessment", 13]
        ]
      }
    ],
    "requirements": [
      "No AI experience needed",
      "No coding needed for the non-technical path. Basic Python helps on the technical path, and Module 4 sets everything up from zero",
      "A laptop or desktop (Windows, macOS or Linux) with a modern browser",
      "A Google account for a free Gemini API key (no card needed)",
      "A free ChatGPT or Claude account",
      "Python and VS Code (free, installed step by step in Module 4)",
      "n8n: free self-hosted version or a Cloud trial (Module 12)",
      "You never need to spend money to finish this course. OpenAI and Anthropic API comparisons are optional and every paid lab has a free alternative"
    ],
    "audience": [
      "Complete beginners who want a guided path into agentic AI, with a no-code option",
      "Developers who want to build agents with Python, LangGraph, MCP and vendor SDKs, including testing and deployment",
      "Business owners and managers who want to know where agents add value, what they cost and how to manage the risks",
      "Automation and no-code builders who want to add AI agents to n8n, Zapier or Make workflows",
      "Students and career changers who want a portfolio project and a clear path into agent-engineering roles"
    ],
    "description": [
      "AI is evolving from tools that answer prompts into systems that plan, use tools, remember, check their own work and take actions under human supervision.",
      "AI Agents & Agentic AI Mastery gives you a practical, structured path to understanding and building these systems. You don't just learn the ideas. You build one real agent platform, piece by piece, from a first tool call to a deployed, monitored and secured multi-agent system.",
      "The whole course builds one project for one business. FixWell Home Services is a repair company in Bengaluru with 26 technicians. Its operations head, Kavya Menon, handles 140+ requests a day across WhatsApp, the website and phone. Customers wait hours for quotes, technicians get double-booked, and staff search 200-page manuals for answers. Module by module, you build the FixWell Agent Platform that fixes this.",
      "What you'll build:",
      "• An intake and FAQ agent that answers from verified policies and manuals (RAG)",
      "• A booking agent that checks slots, creates jobs and drafts quotes using tools",
      "• An MCP server that any MCP-compatible AI app can use",
      "• A multi-agent dispatch team that triages, schedules and escalates",
      "• A no-code intake flow in n8n",
      "• An evaluation suite, guardrails and monitoring, so the platform is safe to trust",
      "Every module follows the same rhythm: explain, why it matters, see it, do it, practise, check, fix common mistakes, and apply it to the project.",
      "Tools you'll work with: LangChain • LangGraph • MCP • CrewAI • Google ADK • OpenAI Agents SDK • Claude Agent SDK • n8n • LangSmith • Chroma • Gemini • Ollama",
      "Most agent courses stop at demos. This one is built around reliability from the first module: testing, security, human approval and cost control. You'll also learn when not to use an agent.",
      "By the end, you'll have a working, documented agent platform, a security review, a deployment runbook and a portfolio capstone you can show employers or clients.",
      "Enrol now and start building intelligent AI agents."
    ],
    "includes": [
      "16 modules, about 21.5 hours of learning",
      "128 lessons across 400+ interactive screens",
      "18 hands-on labs in real tools",
      "15 practical assignments, one per module, plus a capstone project",
      "150 knowledge-check activities (multiple choice, drag-and-drop, matching, ordering and more)",
      "A final assessment of 50 scenario-based questions (75 minutes)",
      "A prompt library with 236 copy-ready prompts across 17 use cases and 19 industries",
      "Copy-ready code for every coded lab",
      "A glossary of 88 technical terms in plain language",
      "Troubleshooting guides for common errors in every module",
      "Narrated lessons with captions and a language switcher for 78 languages",
      "Two paths: technical (with code) and non-technical (no code)",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "wa-mastery": {
    "subtitle": "Build a complete WhatsApp business system from zero on Meta's official WhatsApp Business Platform: consent-based contact lists, approved templates, bulk campaigns, a reply inbox, an AI assistant, payments, automated customer journeys and analytics. Choose a no-code path or a technical path.",
    "learn": [
      "Set up and verify a Meta Business Portfolio, WhatsApp Business Account and business number the right way",
      "Send your first WhatsApp message through the official Cloud API, from n8n or from code",
      "Build a consent-first contact list with clean numbers, customer segments and automatic opt-out",
      "Write marketing and utility templates that get approved, with variables, images and buttons",
      "Run bulk campaigns from Google Sheets through n8n, paced to Meta's limits and fully logged",
      "Schedule campaigns with approval checks, safe retries, frequency caps and error alerts",
      "Capture every customer reply and delivery status through webhooks into a working inbox",
      "Create tap-to-reply menus and buttons so customers don't have to type",
      "Build an AI assistant that answers only from your business information and hands over to a person when needed, following Meta's 2026 AI policy",
      "Use AI to plan, write and design campaigns, and run fair A/B tests",
      "Take orders and payments on WhatsApp with Razorpay payment links",
      "Automate reminders, follow-ups, abandoned-cart messages and win-back campaigns",
      "Measure results with a dashboard, then secure and scale the system for real business use"
    ],
    "sections": [
      {
        "title": "Module 1: The WhatsApp Business Landscape",
        "lectures": [
          ["WhatsApp vs WhatsApp Business App vs WhatsApp Business Platform", 13],
          ["Why unofficial \"bulk sender\" tools put your number at risk", 13],
          ["The four Meta places you'll work in", 13],
          ["How messages go out and replies come back", 13],
          ["2026 pricing, messaging limits and the AI policy in plain language", 13],
          ["Hands-on: create your project blueprint", 20]
        ]
      },
      {
        "title": "Module 2: Business Portfolio, Verification & WhatsApp Business Account",
        "lectures": [
          ["What a Meta Business Portfolio is and why it comes first", 15],
          ["The name-matching rule for your documents (GST, Udyam and more)", 14],
          ["Business verification, including missing buttons and rejections", 14],
          ["Adding your team safely with two-factor security", 14],
          ["Display names and your business profile", 14],
          ["Planning your business phone number", 14]
        ]
      },
      {
        "title": "Module 3: Developer App, Test Number & Your First Message",
        "lectures": [
          ["Create a developer app with the WhatsApp use case", 16],
          ["Send your first message using Meta's free test number", 16],
          ["Every ID and token, and where to keep each one safely", 16],
          ["Create a permanent access token", 16],
          ["Send a message from n8n (no-code) or cURL (technical)", 16],
          ["Fix the most common errors", 15]
        ]
      },
      {
        "title": "Module 4: Consent-First Contact Lists",
        "lectures": [
          ["Meta's opt-in rules and India's data-protection context", 13],
          ["Collect opt-ins at the counter, by Google Form, click-to-chat link and QR code", 13],
          ["Clean and validate Indian mobile numbers", 13],
          ["Segments and tags that make campaigns relevant", 13],
          ["An easy, permanent STOP / opt-out process", 13],
          ["Hands-on: build a campaign-ready contact list", 20]
        ]
      },
      {
        "title": "Module 5: Message Templates That Get Approved",
        "lectures": [
          ["When you need a template", 14],
          ["Marketing, utility and authentication categories", 14],
          ["Header, body, footer and buttons within Meta's limits", 14],
          ["Variables and sample values", 14],
          ["Why templates get rejected and how to avoid it", 14],
          ["Hands-on: create utility and marketing templates, and send them from n8n", 20]
        ]
      },
      {
        "title": "Module 6: Bulk Campaign Pipeline I — From Sheet to WhatsApp",
        "lectures": [
          ["Messaging limits and sending speed explained", 17],
          ["Move from the test number to your real business number", 17],
          ["Plan campaigns and log every send in Google Sheets", 17],
          ["Build an n8n campaign sender with daily caps, batches and a dry-run switch", 17],
          ["The five-person rule: test before going live", 16],
          ["Read bulk errors: when to retry and when to fix", 16]
        ]
      },
      {
        "title": "Module 7: Bulk Campaign Pipeline II — Scheduling, Retries & Safety",
        "lectures": [
          ["Scheduled campaigns that run only when approved", 13],
          ["Frequency caps so no customer gets too many messages", 13],
          ["Safe retries for temporary errors", 13],
          ["Error alerts that notify a person", 13],
          ["Monitor quality ratings and limits, and know when to stop", 13],
          ["Hands-on: build a campaign budget calculator", 20]
        ]
      },
      {
        "title": "Module 8: Inbox & Webhooks — Hearing Every Reply",
        "lectures": [
          ["How webhooks work, explained simply", 18],
          ["Read message and delivery-status data", 18],
          ["Hands-on: log every reply to an inbox sheet", 28],
          ["Track delivered, read and failed messages", 18],
          ["Automate STOP handling and route questions to the right person", 18]
        ]
      },
      {
        "title": "Module 9: Interactive Messages & Menus",
        "lectures": [
          ["Reply buttons, list menus and location messages", 18],
          ["Writing within Meta's limits", 18],
          ["Hands-on: build a main menu and workshop-booking buttons", 26],
          ["Route each tap to the right response", 18]
        ]
      },
      {
        "title": "Module 10: The Business-Scoped AI Assistant",
        "lectures": [
          ["What Meta's 2026 policy allows for AI on WhatsApp", 18],
          ["Answer from your own FAQ and product sheets, not the AI's general knowledge", 18],
          ["Get a free Groq AI key and choose a model", 18],
          ["Hands-on: build the assistant in n8n with a hand-over to a person", 28],
          ["Test it with tricky questions before customers see it", 18]
        ]
      },
      {
        "title": "Module 11: AI Campaign Studio — Plan, Write, Design, Test",
        "lectures": [
          ["Where AI helps and where a person must decide", 18],
          ["Write campaign briefs and template versions for each segment with AI", 18],
          ["Create header images you have the right to use", 18],
          ["Run a fair A/B test and read the results", 18],
          ["What Meta's Marketing Messages API adds", 18]
        ]
      },
      {
        "title": "Module 12: WhatsApp Commerce & Payments",
        "lectures": [
          ["Design an order tracker with order IDs", 20],
          ["Build a tap-first order flow: product → quantity → area → confirm", 20],
          ["Create Razorpay payment links (test mode)", 20],
          ["Confirm payments safely", 20],
          ["Send receipts, and handle failed, expired and refunded payments", 20]
        ]
      },
      {
        "title": "Module 13: Automated Customer Journeys",
        "lectures": [
          ["Welcome, reminder, feedback, abandoned-cart and win-back journeys", 22],
          ["Exit rules that stop journeys when things change", 21],
          ["One daily n8n workflow that runs every journey", 21],
          ["A journey log so no one gets the same message twice", 21]
        ]
      },
      {
        "title": "Module 14: Analytics & Optimisation",
        "lectures": [
          ["The metrics that matter: delivered, read, reply, opt-out, orders, revenue, cost per order", 15],
          ["Build a campaign dashboard in Google Sheets", 15],
          ["Which orders came from which campaign", 15],
          ["WhatsApp Manager insights", 15],
          ["A 20-minute weekly review that ends in one tested change", 15]
        ]
      },
      {
        "title": "Module 15: Production, Security & Scaling",
        "lectures": [
          ["n8n Cloud or self-hosted?", 17],
          ["Keep secrets safe and rotate them", 17],
          ["Backups and an incident playbook", 17],
          ["Protect customer data and keep it only as long as needed", 17],
          ["When to move from Google Sheets to a database", 17]
        ]
      },
      {
        "title": "Module 16: Capstone, Industry Playbooks & Resources",
        "lectures": [
          ["Capstone: one customer through every part of the system, from contact list to payment and follow-up", 32],
          ["Adapt the blueprint to other industries", 22],
          ["Offer WhatsApp automation as a paid service", 22],
          ["Final assessment", 22],
          ["Prompt library, glossary and official resources", 22]
        ]
      }
    ],
    "requirements": [
      "No coding knowledge needed for the No-Code track",
      "A computer with a modern browser, and a smartphone with WhatsApp",
      "A Facebook account and a Google account",
      "You can learn on Meta's free test number. Business documents (such as GST or Udyam registration) are needed only when you verify a real business",
      "n8n: free Cloud trial or the free self-hosted version",
      "Groq free API key for the AI assistant",
      "Razorpay test mode for payments (no real money)",
      "Meta charges for template messages sent to real customers. The course explains 2026 pricing so you can plan your budget"
    ],
    "audience": [
      "Small business owners who want to send offers, reminders and order updates without risking their number",
      "Marketers and social media managers who want to run compliant WhatsApp campaigns and measure results",
      "Freelancers and agency owners who want a sellable WhatsApp automation service for local businesses",
      "Students and career changers who want a portfolio project in APIs, automation and AI",
      "Developers who want to work directly with the Cloud API, webhooks and production deployment"
    ],
    "description": [
      "WhatsApp isn't just a messaging app. It can become your business automation channel.",
      "Most businesses still forward offers by hand, answer the same questions all day and track orders in notebooks. Others try unofficial \"bulk sender\" tools and lose their number. This course shows you the safe, professional way to do it, using Meta's official WhatsApp Business Platform.",
      "The whole course builds one system for one business. GreenNest Plant Studio is a plant nursery in Baner, Pune, run by Anaya Deshpande with her cousin Rohit. They answer 120–180 WhatsApp chats a day by hand, forward festival offers one by one, forget plant-care reminders and track orders in a notebook. Module by module, you automate all of it.",
      "You'll build the system behind:",
      "Customer Lists → Campaigns → Templates → Messages → Replies → AI → Journeys → Analytics",
      "What you'll build:",
      "• A consent-first contact list with automatic opt-out",
      "• Approved message templates for offers, reminders and order updates",
      "• A bulk campaign pipeline that respects Meta's limits and logs every message",
      "• An inbox that captures every reply and delivery status",
      "• Tap-to-reply menus and booking buttons",
      "• An AI assistant that only talks about your business, and hands over to a person when needed",
      "• Order and payment flows with Razorpay",
      "• Automated reminders, follow-ups and win-back journeys",
      "• A dashboard that shows what's working",
      "Every lesson tells you exactly where to click, what to enter and what you should see, with a checklist and troubleshooting steps. Two tracks build the same system: No-Code with n8n and Google Sheets, or Technical with the API and code.",
      "Free-first tools: WhatsApp Cloud API • n8n • Google Sheets • Groq • ChatGPT, Claude or Gemini • Razorpay",
      "By the end, you'll have a complete, working WhatsApp business system that you can use for your own business or offer as a service to clients."
    ],
    "includes": [
      "16 modules, about 24 hours of learning",
      "120+ lessons with step-by-step setup screens",
      "58 hands-on tasks and practical assignments in real tools",
      "170+ knowledge-check activities (drag-and-drop, matching, ordering, calculations and more)",
      "A final assessment",
      "A 3-part capstone project covering the full system end to end",
      "22 AI prompt exercises plus a prompt library with 100+ ready-to-use prompts",
      "Ready-made workflows for campaigns, the inbox, the AI assistant and customer journeys",
      "Two tracks: No-Code (n8n + Google Sheets) and Technical (API, JSON, cURL, Node.js)",
      "Troubleshooting guides for common errors and template rejections",
      "A glossary and a list of official resources",
      "Narrated lessons with captions, in English and many Indian and global languages",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "omni-master": {
    "subtitle": "Go from your first prompt to a finished 40–60 second brand film using Google's AI video tools: Veo 3.1, Gemini Omni Flash, Google Flow and Nano Banana Pro. No video or AI experience needed.",
    "learn": [
      "Find your way around Google's AI video tools and know which one to use for each shot",
      "Work confidently in Google Flow: projects, models, aspect ratios, credits and downloads",
      "Create a \"look book\" of characters, products and locations with Nano Banana Pro",
      "Write video prompts like a director, covering subject, action, scene, camera, style and sound",
      "Generate cinematic scenes with Veo 3.1, including native sound and spoken dialogue",
      "Turn still images into controlled video, and design transitions using first and last frames",
      "Keep characters and products looking the same across scenes with Ingredients to Video",
      "Lengthen shots with Extend, and add or remove objects",
      "Create video from text, images, audio and video with Gemini Omni Flash, then edit it just by describing the changes",
      "Assemble a full film in Scenebuilder, add captions and titles, and export for every platform",
      "Label AI content honestly, check rights, and price video work for clients"
    ],
    "sections": [
      {
        "title": "Module 1: Google's AI Video Ecosystem",
        "lectures": [
          ["Google's AI video tools at a glance", 7],
          ["Veo 3.1 Lite, Fast and Quality: when to use each", 7],
          ["Gemini Omni Flash and how it differs from Veo", 7],
          ["Credits and plans explained", 7],
          ["SynthID, AI labels and responsible use", 7],
          ["Lab: explore Google Flow and Flow TV", 7],
          ["Assignment: write the film brief", 8]
        ]
      },
      {
        "title": "Module 2: Getting Started in Google Flow",
        "lectures": [
          ["Open Flow and create your first project", 8],
          ["Every control in the creation panel explained", 8],
          ["The right aspect ratio for each platform", 8],
          ["Lab: generate your first image and first video clip", 8],
          ["Review, keep, download and upscale results", 9],
          ["Quick video in the Gemini app", 9]
        ]
      },
      {
        "title": "Module 3: Visual Foundations with Nano Banana Pro",
        "lectures": [
          ["Why images come first", 7],
          ["The image prompt formula", 7],
          ["Light and lens language", 7],
          ["Design characters that stay consistent", 7],
          ["Create product scenes from a real product photo", 7],
          ["Lab: build the full look book", 7],
          ["Fix common image problems", 8]
        ]
      },
      {
        "title": "Module 4: Directing with Veo 3.1",
        "lectures": [
          ["From still image to motion", 10],
          ["The video prompt formula: subject, action, scene, camera, style", 10],
          ["Camera vocabulary and pacing short clips", 10],
          ["Native audio: sound effects, ambience and dialogue", 10],
          ["Lab: generate three directed scenes, including a spoken welcome line", 10],
          ["Review clips with a critical eye", 10]
        ]
      },
      {
        "title": "Module 5: Control & Consistency",
        "lectures": [
          ["Frames to Video: start from an approved image", 9],
          ["First and last frames for designed transitions (clay to bowl)", 9],
          ["Ingredients to Video for a consistent character and product", 9],
          ["Lab: create consistent shots with Frames and Ingredients", 9],
          ["Extend: continue a shot", 9],
          ["Insert and remove objects", 10]
        ]
      },
      {
        "title": "Module 6: Gemini Omni Flash — Multimodal Creation & Conversational Editing",
        "lectures": [
          ["What Gemini Omni Flash is", 9],
          ["Omni Flash or Veo 3.1: choosing the right one", 9],
          ["Create video from a mix of text, images, audio and video", 9],
          ["Conversational editing: change a clip just by describing it", 9],
          ["Short-form video for YouTube Shorts", 9],
          ["Lab: create and refine clips with Omni Flash", 10]
        ]
      },
      {
        "title": "Module 7: Capstone — Assemble, Finish & Deliver the Film",
        "lectures": [
          ["Assemble the brand film in Scenebuilder", 6],
          ["Finish with sound, captions, titles and AI labels", 5],
          ["Export for each platform (landscape and vertical reels)", 4],
          ["Lab: assemble and finish the complete film", 7],
          ["Rights and compliance checklist", 4],
          ["Client workflow and pricing", 5],
          ["Adapt the method to restaurants, electronics and other industries", 4],
          ["Final assessment", 25]
        ]
      }
    ],
    "requirements": [
      "No video or AI experience needed",
      "A Google account (you must be 18 or older)",
      "A computer with Chrome or Edge",
      "Google Flow: free daily credits cover a few practice drafts",
      "A paid Google AI plan (Plus, Pro or Ultra) gives more credits, higher resolution and extra features. It's optional, but helpful for completing every lab at full quality",
      "Video generation in the Gemini app needs an eligible Google AI plan",
      "Optional: Canva or DaVinci Resolve (free versions) for extra editing",
      "Credit costs and plan prices vary by country and change often. Always check the cost shown in Flow before generating"
    ],
    "audience": [
      "Small business owners who want product films, workshop promos and social reels without a film crew",
      "Content creators making cinematic shorts for YouTube and Instagram",
      "Marketers and agencies who want a repeatable Google-based video workflow",
      "Filmmakers and editors who want AI for pre-visualisation, B-roll and stylised shots",
      "Students and career changers who want a portfolio film and a video service they can sell"
    ],
    "description": [
      "From first prompt to professional AI film production.",
      "Creating an impressive AI video clip is one thing. Building a complete video with intentional scenes, consistent characters, controlled transitions, dialogue, sound, editing and a clear visual style needs a much deeper workflow. That's what this course teaches.",
      "You'll start by understanding Google's AI video tools and setting up Google Flow. Then you'll build the visual foundation of your film with Nano Banana Pro, write director-style prompts for Veo 3.1, design transitions with first and last frames, keep characters consistent with Ingredients to Video, add native sound and dialogue, and refine clips by simply describing changes to Gemini Omni Flash.",
      "In the final capstone, you bring it all together: assemble the film in Scenebuilder, add captions, titles and AI labels, and export it for every platform.",
      "The whole course builds one project for one business. Kaveri Clay Studio is a small pottery studio in Pune run by potter Anika Desai. She sells handmade mugs and planters and runs weekend wheel-throwing workshops, but has no video content. Module by module, you create her complete film kit.",
      "What you'll create:",
      "• A look book of characters, products and locations",
      "• A scene library of cinematic shots with native sound",
      "• Consistent character and product sequences",
      "• Short-form clips for YouTube Shorts and Reels",
      "• A finished 40–60 second brand film, plus vertical reels",
      "Tools: Veo 3.1 • Gemini Omni Flash • Google Flow • Nano Banana Pro • Gemini app",
      "Every lesson shows you exactly where to click and what you should see, gives you a ready-to-use prompt, and asks you to try it yourself in Flow.",
      "Don't just generate AI video. Learn to direct the complete workflow.",
      "Edition: 2026 (tools checked October 2026)."
    ],
    "includes": [
      "7 modules, about 6 hours 20 minutes of learning",
      "40+ lessons with click-by-click instructions",
      "7 hands-on labs in Google Flow and the Gemini app",
      "14 practice prompts written for Flow, with expected results and follow-ups",
      "6 practical assignments plus a capstone brand film",
      "65+ knowledge-check activities (drag-and-drop, matching, ordering and more)",
      "A final assessment: 30 scenario-based questions (45 minutes)",
      "A prompt library with 191 copy-ready prompts for 19 industries",
      "A glossary of 54 AI video terms in plain language",
      "Troubleshooting guides for common image and video problems",
      "Narrated lessons with captions and a language switcher for 78 languages",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "kling-master": {
    "subtitle": "Learn Kling AI 3.0 step by step: cinematic images, consistent characters, directed camera work, native sound, multi-shot storytelling, talking avatars and professional editing.",
    "learn": [
      "Understand the Kling 3.0 model family and choose the right model, mode and settings for each shot",
      "Plan credits like a producer so you don't waste generations",
      "Write cinematic image prompts covering subject, setting, light, lens and composition",
      "Edit images with plain-language instructions and combine multiple reference images",
      "Keep characters and objects consistent across every shot using Kling's Elements",
      "Write video prompts like a director: action, camera movement, pacing and native sound",
      "Bring still images to life, design transitions with start and end frames, and move only what you choose with Motion Brush",
      "Build connected multi-shot sequences with VIDEO 3.0 Omni and Custom Multi-Shot",
      "Direct exact character movement with Motion Control",
      "Create a talking presenter with Avatar 2.0 and lip-sync speech to faces",
      "Edit your film in Canva or DaVinci Resolve with sound, captions, titles and colour matching",
      "Label AI content, check rights, and price AI video work for clients"
    ],
    "sections": [
      {
        "title": "Module 1: Kling AI Foundations",
        "lectures": [
          ["What Kling AI is, and the Kling 3.0 model family", 8],
          ["Generation modes: the director's toolbox", 8],
          ["How credits work, and budgeting them", 8],
          ["Responsible and legal AI video", 8],
          ["Where Kling fits among other AI video tools", 8],
          ["Lab: explore Kling and map the model selector", 8],
          ["Assignment: write the film brief and shot list", 7]
        ]
      },
      {
        "title": "Module 2: Account, Plans & Interface Mastery",
        "lectures": [
          ["Create and secure your Kling account", 10],
          ["Choose the right plan", 9],
          ["Tour the creation workspace", 9],
          ["The right aspect ratio for every channel", 9],
          ["Lab: generate and save your first image", 9],
          ["Organise assets and history; use Kling on mobile", 9]
        ]
      },
      {
        "title": "Module 3: Cinematic Images with IMAGE 3.0: The Look Book",
        "lectures": [
          ["Why stills come first", 10],
          ["The cinematic image prompt formula", 10],
          ["Lighting, camera and composition language", 9],
          ["Design characters and create a character turnaround sheet", 9],
          ["Lab: create the character set", 9],
          ["Location and mood stills", 9],
          ["Fix common image problems", 9]
        ]
      },
      {
        "title": "Module 4: Editing, References & Elements: Consistent Characters",
        "lectures": [
          ["Why characters change between shots, and how to stop it", 10],
          ["Edit images with plain-language instructions", 10],
          ["Combine multiple reference images", 9],
          ["Elements: Kling's consistency system", 9],
          ["Lab: build and test character Elements", 9],
          ["Give characters a voice (VIDEO 3.0 Omni)", 9],
          ["Elements for objects and places", 9]
        ]
      },
      {
        "title": "Module 5: Text-to-Video: Directing with Words, Camera & Sound",
        "lectures": [
          ["From still to motion: what changes", 10],
          ["The video prompt formula", 10],
          ["Camera movement vocabulary", 10],
          ["Duration and pacing", 10],
          ["Native audio: sound and dialogue in the same generation", 10],
          ["Lab: generate your first three scenes, including a line of dialogue", 10],
          ["Review a clip with a critical eye", 10]
        ]
      },
      {
        "title": "Module 6: Image-to-Video, Start & End Frames, Motion Brush & Extend",
        "lectures": [
          ["Why image-to-video gives you more control", 10],
          ["Prepare a great starting image", 10],
          ["Motion prompts: describe what changes", 9],
          ["Start and end frames for designed transitions (dawn to dusk)", 9],
          ["Motion Brush: move only what you choose", 9],
          ["Extend: continue a shot", 9],
          ["Lab: animate the look book", 9]
        ]
      },
      {
        "title": "Module 7: Multi-Shot Storytelling with VIDEO 3.0 & Omni",
        "lectures": [
          ["What multi-shot generation is", 11],
          ["Film grammar for believable sequences", 11],
          ["Write a Custom Multi-Shot prompt shot by shot", 11],
          ["Use Omni references to keep characters and voices consistent", 11],
          ["Lab: build a rooftop sunset sequence", 11],
          ["Optional: plan sequences with an AI assistant such as ChatGPT, Claude or Gemini", 10]
        ]
      },
      {
        "title": "Module 8: Performance: Motion Control, Talking Avatars & Lip Sync",
        "lectures": [
          ["Three ways to control a performance", 8],
          ["Motion Control, using your own recorded movement", 8],
          ["Lab: a signature character gesture with Motion Control", 8],
          ["Avatar 2.0: talking presenters", 8],
          ["Write avatar scripts that sound natural, and choose voices and languages", 7],
          ["Lab: a 30-second talking welcome video", 7],
          ["Lip sync for existing clips", 7],
          ["Consent and disclosure for avatars", 7]
        ]
      },
      {
        "title": "Module 9: Post-Production: Editing, Sound, Captions & Export",
        "lectures": [
          ["Why AI clips still need editing", 7],
          ["Choose an editor: Canva or DaVinci Resolve", 7],
          ["The story edit", 7],
          ["Sound mixing: dialogue, ambience and licensed music", 7],
          ["Captions, titles and the AI label", 7],
          ["Colour consistency", 7],
          ["Lab: edit the hero film", 7],
          ["Export formats, thumbnails and quality checks", 6]
        ]
      },
      {
        "title": "Module 10: Capstone: Film Kit, Client Workflow & Industry Playbooks",
        "lectures": [
          ["What you deliver: the complete film kit", 9],
          ["Lab: final review of the film kit", 9],
          ["A professional client workflow and rights checklist", 9],
          ["Pricing AI video work", 9],
          ["Adapt the method to electronics stores, restaurants and other industries", 8],
          ["Your portfolio and next steps", 8],
          ["Final assessment", 8]
        ]
      }
    ],
    "requirements": [
      "No video, filming or editing experience needed",
      "A computer (recommended for editing) or a smartphone, with a modern browser",
      "A Kling AI account: the free plan gives daily credits and covers every lab",
      "Free plan videos have a watermark and can't be used commercially. A paid Kling plan is needed for watermark-free, commercial or client work",
      "Canva (free plan) for editing; DaVinci Resolve (free) is optional",
      "Optional: ChatGPT, Claude or Gemini (free plans) for planning scripts and shot lists"
    ],
    "audience": [
      "Complete beginners who have never made a video",
      "Business owners who want ads, product films and social reels without a film crew",
      "Content creators who want consistent characters and cinematic shots for YouTube and Instagram",
      "Marketers and agencies who want a repeatable AI video workflow for client work",
      "Filmmakers, editors and students who want a portfolio film and a video service they can sell"
    ],
    "description": [
      "Anyone can generate an AI video. Can you direct one?",
      "AI video has moved beyond simple text-to-video experiments. The real skill now is knowing how to create the right visual, control movement, keep characters consistent, connect multiple shots, and turn separate clips into a complete cinematic story.",
      "Kling AI: In-Depth Mastery takes you from your first Kling image to a finished, publish-ready film. You'll work with the Kling AI 3.0 tools, including IMAGE 3.0, VIDEO 3.0, VIDEO 3.0 Omni, Elements, Motion Brush, Motion Control, Avatar 2.0 and Lip Sync.",
      "What you'll create:",
      "• A look book of cinematic character and location stills",
      "• Reusable character Elements that stay consistent in every shot",
      "• A scene library of directed shots with camera moves and native sound",
      "• A 45–60 second multi-shot promo film with dialogue and transitions",
      "• A talking presenter avatar video",
      "• A social media kit of vertical reels, with captions and an AI-content label",
      "The core workflow:",
      "Idea → Frame → Prompt → Create → Direct → Control → Consistency → Edit → Produce",
      "Every lesson shows you exactly where to click and what you should see, gives you a ready-to-use Kling prompt, and asks you to try it yourself.",
      "This isn't about randomly generating AI clips and hoping something works. It's about learning to think like a director while working with AI."
    ],
    "includes": [
      "10 modules, about 10 hours of learning",
      "79 lessons with click-by-click instructions",
      "11 hands-on labs in Kling",
      "17 practice prompts written for Kling, with settings, expected results and follow-ups",
      "9 practical assignments plus a capstone film project",
      "99 knowledge-check activities (drag-and-drop, matching, ordering and more)",
      "A final assessment: 40 scenario-based questions (60 minutes)",
      "A prompt library with 202 copy-ready prompts for 19 industries",
      "A glossary of 71 AI video and Kling terms in plain language",
      "Troubleshooting guides for common image and video problems",
      "Narrated lessons with captions and a language switcher for 78 languages",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "genai-complete": {
    "subtitle": "Go from your first AI chat to running a complete AI toolkit for real work: writing, images, voice, video, research, data, automation and strategy, used responsibly. No prior AI experience needed.",
    "learn": [
      "Understand how generative AI works, why it sometimes gets things wrong, and where it should and shouldn't make decisions",
      "Set up ChatGPT and Claude as real workspaces, using Projects, memory, files, custom instructions, GPTs and Artifacts",
      "Try agentic AI with Claude Cowork and Claude Code, with free alternatives provided",
      "Choose the right assistant for each task: ChatGPT, Claude, Gemini, Copilot or Perplexity",
      "Write prompts that work every time with the CRAFTED framework, then advance to examples, prompt chains, JSON output, self-critique and meta-prompting",
      "Build a content engine: brand voice guide, product descriptions at scale, social posts, emails and WhatsApp messages",
      "Create and edit campaign images with ChatGPT, Nano Banana, Canva, Adobe Firefly and Midjourney",
      "Produce voice-overs in English and Hindi with ElevenLabs, and background music with Suno",
      "Plan and generate short videos with Veo and Runway, and assemble a finished Reel in Canva",
      "Research with cited sources, ask questions of your own documents in NotebookLM, and analyse sales data",
      "Build no-code automations in Zapier and Make, including an AI step with human approval",
      "Use AI for strategy: SWOT, 90-day plans, customer journeys and SOPs",
      "Protect privacy, reduce bias, respect copyright, and label AI content under Indian and EU rules"
    ],
    "sections": [
      {
        "title": "Module 1: How Generative AI Really Works",
        "lectures": [
          ["What generative AI actually is", 9],
          ["How a language model turns your prompt into an answer", 8],
          ["Tokens and context windows, explained simply", 8],
          ["Why AI makes things up (hallucinations)", 8],
          ["Where AI helps, and where it shouldn't decide", 8],
          ["The AI tool landscape, and free vs paid plans", 8],
          ["Lab: your first side-by-side test of ChatGPT and Claude", 13],
          ["Assignment: your AI starting plan", 13]
        ]
      },
      {
        "title": "Module 2: ChatGPT — From First Chat to Power User",
        "lectures": [
          ["Tour of the ChatGPT interface", 10],
          ["Choosing a model or mode", 10],
          ["Custom instructions and memory", 10],
          ["Lab: build a ChatGPT Project with a brand facts file", 14],
          ["Working with documents, spreadsheets and images", 9],
          ["Search, image generation, deep research and agent mode", 9],
          ["GPTs: custom versions of ChatGPT for one job", 9],
          ["Desktop, mobile, sharing and data controls", 9]
        ]
      },
      {
        "title": "Module 3: Claude — Projects, Artifacts, Cowork & Claude Code",
        "lectures": [
          ["Why learn a second assistant", 8],
          ["Tour of Claude, choosing models, and setting preferences and styles", 8],
          ["Memory and privacy in Claude", 8],
          ["Lab: build and test a Claude Project", 12],
          ["Artifacts: build an interactive size-guide tool", 8],
          ["Research, web search and connectors", 8],
          ["Cowork: agentic AI for knowledge work (lab with a free-plan alternative)", 12],
          ["Claude Code for non-coders: build a small web page", 8],
          ["Claude or ChatGPT? A practical guide", 8]
        ]
      },
      {
        "title": "Module 4: Gemini, Copilot, Perplexity & Choosing the Right Assistant",
        "lectures": [
          ["Tour of the Gemini app, and its plans in India", 9],
          ["Lab: create a custom Gem for captions", 13],
          ["Microsoft Copilot inside Microsoft 365", 9],
          ["Lab: research with Perplexity, then check the citations", 13],
          ["Other assistants, and a word of caution", 8],
          ["Build your assistant selection matrix", 8]
        ]
      },
      {
        "title": "Module 5: Prompt Engineering — Beginner to Advanced",
        "lectures": [
          ["The CRAFTED framework, and rebuilding a weak prompt step by step", 11],
          ["Let the AI ask you questions first", 11],
          ["Examples (few-shot) to get your style", 11],
          ["Step-by-step reasoning and prompt chains", 11],
          ["Structured output: tables, CSV and JSON", 10],
          ["Self-critique loops and meta-prompting", 10],
          ["Lab: build and test your prompt library in Google Sheets", 16],
          ["Prompt injection: when content gives the AI orders", 10]
        ]
      },
      {
        "title": "Module 6: AI Writing & Content Creation",
        "lectures": [
          ["Build a brand voice guide from your best writing", 9],
          ["Lab: generate 10 product descriptions in Google Sheets", 13],
          ["Social media posts that don't sound generic, and a two-week content calendar", 9],
          ["Emails and WhatsApp messages, including a four-email launch sequence", 9],
          ["Long-form articles and search", 9],
          ["Repurposing one idea into many formats", 9],
          ["Editing with AI while keeping your own voice", 9],
          ["Originality, AI detectors and disclosure", 8]
        ]
      },
      {
        "title": "Module 7: AI Image Generation & Editing",
        "lectures": [
          ["What AI images are for, and what they're not for", 9],
          ["Anatomy of an image prompt", 9],
          ["Lab: create a campaign mood board in ChatGPT", 13],
          ["Edit real product photos with Nano Banana in Gemini", 9],
          ["Midjourney for premium artistic images (paid)", 9],
          ["Canva AI and Adobe Firefly for design-ready work", 9],
          ["Keep a consistent look across a campaign", 9],
          ["Rights, truthfulness and labelling", 8]
        ]
      },
      {
        "title": "Module 8: AI Voice, Audio & Music",
        "lectures": [
          ["Writing scripts for the ear", 8],
          ["Lab: produce English and Hindi voice-overs in ElevenLabs", 12],
          ["Voice cloning and consent", 8],
          ["Lab: generate a background track with Suno", 11],
          ["Clean-up and mixing basics", 8],
          ["Podcast-style audio from your own documents", 8]
        ]
      },
      {
        "title": "Module 9: AI Video Creation",
        "lectures": [
          ["What AI video can realistically do in 2026", 8],
          ["Plan first: shot list, storyboard and video prompts", 8],
          ["Lab: generate a clip with Veo in Gemini or Flow", 13],
          ["Runway and budgeting your credits", 8],
          ["AI avatars and presenters", 8],
          ["Lab: assemble a finished Reel in Canva with voice, music and captions", 13],
          ["Labelling AI video responsibly", 12]
        ]
      },
      {
        "title": "Module 10: AI for Research, Documents & Data Analysis",
        "lectures": [
          ["A research workflow you can trust", 10],
          ["Which research tool for which job", 10],
          ["Lab: run deep research and verify five claims", 14],
          ["Lab: build a knowledge notebook in NotebookLM", 14],
          ["Analyse sales data with ChatGPT and Claude", 9],
          ["Let AI write your spreadsheet formulas", 9],
          ["Turn findings into decisions", 9]
        ]
      },
      {
        "title": "Module 11: Automation & AI Agents",
        "lectures": [
          ["What an automation is, with technical words explained simply", 8],
          ["Zapier, Make or n8n?", 8],
          ["Design before you build", 8],
          ["Lab: an enquiry-alert automation in Zapier (free plan)", 12],
          ["Lab: AI-drafted replies with human approval in Make", 12],
          ["Keeping keys, permissions and data safe", 8],
          ["n8n for technical learners", 8],
          ["AI agents: when a fixed workflow isn't enough", 8],
          ["Monitoring and error handling", 8]
        ]
      },
      {
        "title": "Module 12: AI for Business Strategy & Operations",
        "lectures": [
          ["AI as a strategy partner, not the strategist", 10],
          ["Competitor positioning and an evidence-based SWOT", 10],
          ["A 90-day plan with measurable goals", 10],
          ["Customer journey mapping with Claude Artifacts", 10],
          ["Turn rough notes into SOPs, training and meeting notes", 10],
          ["What-if scenarios and pre-mortems", 10]
        ]
      },
      {
        "title": "Module 13: Responsible AI — Privacy, Bias, Copyright & the Law",
        "lectures": [
          ["Personal data and India's DPDP Act", 8],
          ["Privacy-safe AI habits", 8],
          ["Spotting and reducing bias", 8],
          ["Copyright and ownership of AI content", 8],
          ["Labelling synthetic media under Indian and EU rules", 12],
          ["AI-powered scams and account safety", 8],
          ["Write a one-page AI-use policy", 8]
        ]
      },
      {
        "title": "Module 14: Capstone — Your AI Operating Kit, Career & Staying Current",
        "lectures": [
          ["Assemble the complete AI Operating Kit", 8],
          ["Lab: an end-to-end test, from product idea to customer", 12],
          ["Write a 30-day adoption plan", 8],
          ["Adapt the kit to any industry or to your own work", 8],
          ["Keep up with AI without drowning", 8],
          ["Evaluate any new AI tool in 15 minutes", 8],
          ["Your portfolio, career next steps and personal learning plan", 8],
          ["Final assessment", 15]
        ]
      }
    ],
    "requirements": [
      "No prior AI or coding experience needed",
      "A laptop or desktop with a modern browser, and a smartphone for sign-in codes",
      "A Google account (most tools sign in with it)",
      "Free plans of ChatGPT, Claude, Gemini, NotebookLM and Perplexity cover most labs",
      "Canva and Google Sheets (free)",
      "Optional: ElevenLabs, Suno and Runway free tiers (practice only, with limits on commercial use)",
      "Optional: Zapier and Make free plans",
      "Some features need paid plans: Claude Cowork and Claude Code, Midjourney (no free plan), and video generation in Gemini. Every lesson that uses a paid feature also gives you a free alternative, so you never need to buy anything to finish the course"
    ],
    "audience": [
      "Complete beginners who want a structured, practical start with AI",
      "Business owners and freelancers who want to save hours every week on writing, replies, research and planning",
      "Marketers and content creators who want on-brand copy, images, audio and video, faster",
      "Technical learners who want APIs, JSON output, automation and Claude Code",
      "Students and job seekers who want a portfolio project and the AI skills employers expect"
    ],
    "description": [
      "From AI user to professional AI power user.",
      "Using AI is easy. Using it well is a skill. Most people use AI like a search box and get average results. The gap between average and excellent isn't secret tricks. It's knowing how these systems work, giving them the right context, checking what they produce, and connecting tools into a workflow. That's what this course teaches, step by step.",
      "The whole course builds one project for one business. Kalaa Threads is a handloom clothing boutique in Aundh, Pune, owned by Meera Joshi. She and her two team members spend more than 15 hours a week on captions, product descriptions, customer replies and admin. Module by module, you build her complete AI Operating Kit to launch the Monsoon Weaves collection and cut routine work in half.",
      "What you'll explore:",
      "• ChatGPT & Claude, set up as power-user workspaces",
      "• Gemini, Copilot and Perplexity, and when to use each",
      "• Prompt engineering, from beginner to advanced",
      "• AI writing and content creation",
      "• AI image generation and editing",
      "• AI voice, audio and music",
      "• AI video creation",
      "• Research, documents and data analysis",
      "• No-code automation and AI agents",
      "• Business strategy and operations",
      "• Responsible AI: privacy, bias, copyright and the law",
      "What you'll walk away with:",
      "• Working ChatGPT and Claude workspaces",
      "• A tested prompt library",
      "• A brand voice guide and content engine",
      "• An image, audio and video kit",
      "• A research and data pack",
      "• Two working automations",
      "• A strategy pack and an AI-use policy",
      "• A 30-day plan to put AI to work in your own role or business",
      "Tools you'll use: ChatGPT • Claude • Gemini • Copilot • Perplexity • NotebookLM • Midjourney • Nano Banana • Canva • Adobe Firefly • ElevenLabs • Suno • Runway • Veo • Zapier • Make • n8n • and more",
      "Every lesson shows you exactly where to click, gives you a real example, and asks you to try it yourself straight away.",
      "Move beyond experimenting with AI. Learn to select, prompt, combine and apply AI tools in real work."
    ],
    "includes": [
      "14 modules, about 17 hours of learning",
      "119 lessons with click-by-click instructions",
      "25+ AI tools covered hands-on",
      "18 hands-on labs in real tools",
      "32 ready-to-use AI prompt exercises",
      "13 practical assignments plus a capstone project",
      "140+ knowledge-check activities (drag-and-drop, matching, ordering and more)",
      "A final assessment: 40 scenario-based questions (60 minutes)",
      "A prompt library with 294 copy-ready prompts across 18 use cases and 19 industries",
      "A glossary of 78 AI terms in plain language",
      "Troubleshooting guides in every module",
      "Two tracks: Non-technical (no code) and Technical (APIs, JSON, Claude Code)",
      "Narrated lessons with captions and a language switcher for 78 languages",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "mj-advanced": {
    "subtitle": "Go from your first prompt to a complete professional brand image library using Midjourney V8.2 and its latest 2026 features: Style References, Personalization, Moodboards, the Edit Model, the Editor and Video.",
    "learn": [
      "Write clear, descriptive prompts with the Five-Layer method",
      "Control the shape, style strength, variety and randomness of your images with parameters (aspect ratio, Stylize, Raw, Chaos, Weird, seed, tile)",
      "Lock in a consistent brand look with Style References, Style codes, Personalization and Moodboards",
      "Use your own product photos with Image Prompts and the V8.2 Edit Model, including placing real products and keeping characters consistent",
      "Fix and extend images in the Editor (inpainting and outpainting), and choose the right upscaler",
      "Work faster with Draft Mode, Variations, Remix and Conversational Mode",
      "Turn still images into short videos with motion, seamless loops and start-to-end frames",
      "Organise your image library, and export at the right size for social media, websites and print",
      "Finish images in Canva or Photoshop with real text and logos",
      "Use Midjourney responsibly and professionally for commercial and client work"
    ],
    "sections": [
      {
        "title": "Module 1: How Midjourney Thinks: Foundations",
        "lectures": [
          ["What's new in 2026: V8.2, HD and the Edit Model", 11],
          ["How text becomes an image", 11],
          ["What Midjourney does brilliantly, and where it struggles", 11],
          ["The model line-up and when to use each", 11],
          ["Rights, respect, the public gallery and commercial use", 11],
          ["Hands-on: write a visual brief and shot list", 10],
          ["Labs: short vs described prompts, comparing model versions", 10]
        ]
      },
      {
        "title": "Module 2: Getting In: Plans, GPU Time & a Tour of the Website",
        "lectures": [
          ["Basic, Standard, Pro and Mega plans compared", 11],
          ["GPU time explained: Fast, Relax and Turbo; SD vs HD costs", 11],
          ["Stealth mode and the public gallery", 11],
          ["Tour of Explore, Create, Edit, Personalize, Organize and Tasks", 11],
          ["Hands-on: subscribe, set safe defaults and make a test image", 11],
          ["Optional: create on Discord", 10],
          ["Labs: SD vs HD, Fast vs Relax, settings vs parameters", 10]
        ]
      },
      {
        "title": "Module 3: The Language of Prompts",
        "lectures": [
          ["Describe, don't instruct", 13],
          ["The Five-Layer Prompt", 12],
          ["Vocabulary for medium, light, colour, mood and composition", 12],
          ["Diagnose and fix weak prompts", 12],
          ["Text inside images", 12],
          ["Hands-on: create the first four project shots, starting with the hero mug", 12],
          ["Labs: Five-Layer Prompt, lighting vocabulary, text in images", 12]
        ]
      },
      {
        "title": "Module 4: Control Dials: Essential Parameters",
        "lectures": [
          ["Aspect ratio for every placement", 12],
          ["Stylize and Raw", 12],
          ["Variety (Chaos) and Weird", 12],
          ["--no, seed and tile", 11],
          ["HD vs SD, and --exp", 11],
          ["Hands-on: the Stylize ladder and a seamless packaging pattern", 11],
          ["Labs: product recipe, Chaos, Weird, Exp, tile and seed", 11]
        ]
      },
      {
        "title": "Module 5: Lock the Look: Style References, Personalization & Moodboards",
        "lectures": [
          ["Style References and style weight (--sw)", 14],
          ["Style codes and the Style Explorer", 14],
          ["Personalization profiles", 13],
          ["Moodboards", 13],
          ["Hands-on: find style codes and build the brand moodboard", 13],
          ["Assignment: write a brand style card", 13]
        ]
      },
      {
        "title": "Module 6: Your Own Images: Image Prompts, the Edit Model & Describe",
        "lectures": [
          ["Image prompts and image weight", 12],
          ["The V8.2 Edit Model: edit with words and combine up to 4 references", 12],
          ["Place real products and keep characters consistent", 12],
          ["Change perspective and restyle images", 11],
          ["Describe: get prompt ideas from an image", 11],
          ["Rights to the images you upload", 11],
          ["Hands-on: place a real mug in a café scene", 11]
        ]
      },
      {
        "title": "Module 7: Fix the Frame: The Editor, Pan, Zoom & Upscalers",
        "lectures": [
          ["The Editor: erase and repaint areas (inpainting)", 13],
          ["Expand the canvas (outpainting)", 13],
          ["Pan and Zoom Out", 13],
          ["Vary Region", 12],
          ["Upscalers and HD", 12],
          ["Hands-on: fix a detail, and turn a feed post into a website banner", 12]
        ]
      },
      {
        "title": "Module 8: Iterate Like a Pro: Variations, Remix, Conversational & Draft Modes",
        "lectures": [
          ["Choose images with clear criteria", 10],
          ["Subtle and strong variations", 10],
          ["Remix", 10],
          ["Conversational Mode", 10],
          ["Seeds for controlled comparisons", 10],
          ["Draft Mode: 24 quick concepts", 10],
          ["Hands-on: run a Diwali concept funnel", 10]
        ]
      },
      {
        "title": "Module 9: Still to Story: Midjourney Video",
        "lectures": [
          ["Animate: Auto, Manual and Loop", 10],
          ["Low and high motion", 10],
          ["Start and end frames", 10],
          ["Extend clips up to 21 seconds", 10],
          ["Batch size, SD/HD and costs", 10],
          ["Hands-on: animate the hero mug and make a Diwali start-to-end clip", 10],
          ["Download clips for social media", 10]
        ]
      },
      {
        "title": "Module 10: Organize & Deliver: Library, Sizes & Export",
        "lectures": [
          ["The Organize page: search, filters and folders", 11],
          ["Likes and ratings", 11],
          ["Image size and resolution", 11],
          ["The right sizes for social media, websites and print", 11],
          ["Download images and videos", 11],
          ["Hands-on: organise the full project library", 10]
        ]
      },
      {
        "title": "Module 11: Professional Use: Rights, Ethics & Client Workflow",
        "lectures": [
          ["Commercial use and plan conditions", 10],
          ["Ethics: real people, brands and artists' styles", 10],
          ["Honest disclosure in marketing", 10],
          ["Finish images in Canva or Photoshop with real text and logos", 10],
          ["Print and merchandise considerations", 10],
          ["A step-by-step client workflow", 10],
          ["Hands-on: finish the workshop poster", 10]
        ]
      },
      {
        "title": "Module 12: Capstone, Industry Playbooks & Mock Exam",
        "lectures": [
          ["Capstone: assemble and quality-check the complete brand image kit", 18],
          ["Industry applications", 18],
          ["Write your portfolio case study", 18],
          ["Prompt library and glossary", 17],
          ["Mock exam", 17],
          ["Labs: capstone hero image, campaign series, teaser clip", 17]
        ]
      }
    ],
    "requirements": [
      "No art or design background needed",
      "A computer (recommended) or phone with a modern browser",
      "A paid Midjourney subscription for the hands-on image tasks. Midjourney has no free plan; planning tasks work without one",
      "A Google account for the free planning documents",
      "A few photos of your own real products for the reference-image modules",
      "Optional: a Discord account, and Canva or Photoshop for adding final text"
    ],
    "audience": [
      "Complete beginners who want a calm, step-by-step path to images they're proud of",
      "Small business owners who want product scenes, social posts and campaign visuals without a monthly photoshoot",
      "Marketers and content creators who want consistent, on-brand images and short animated clips",
      "Designers and illustrators who want a fast concepting partner and a professional workflow",
      "Freelancers and students who want a portfolio project and a responsible way to offer AI imagery to clients"
    ],
    "description": [
      "Anyone can generate an AI image. But can you control the result?",
      "This course takes you from your very first prompt to a complete, professional image library made with Midjourney. It teaches only the features that exist today in V8.2, so you won't waste time on outdated tutorials.",
      "What you'll master:",
      "• Core prompting with the Five-Layer method",
      "• Aspect ratio, Stylize, Chaos and Weird",
      "• Style References and style control",
      "• Personalization and Moodboards",
      "• Character and product consistency with the V8.2 Edit Model",
      "• Inpainting and outpainting in the Editor",
      "• Draft Mode and Conversational Mode",
      "• Image-to-video creation",
      "• Finishing in Canva and Photoshop",
      "• Organising and exporting your library",
      "• A complete brand identity capstone",
      "Prompt → Control → Create → Refine → Consistency → Animate",
      "Every module includes Midjourney Labs: ready-to-copy prompts you run in Midjourney itself, with a next prompt and a pro variation to push further. You also get hands-on tasks with exact steps, what you should see, and troubleshooting.",
      "By the end, you'll have a complete, portfolio-ready brand image kit, and the skills to create consistent, professional imagery for your own business or for clients.",
      "From your first Midjourney image to professional creative workflows. Don't just generate. Create with control."
    ],
    "includes": [
      "12 modules, about 15.5 hours of learning",
      "74 lessons with click-by-click instructions",
      "36 Midjourney Labs: copy-ready prompts with an Open Midjourney button, a next prompt and a pro variation",
      "32 hands-on tasks and practical assignments",
      "12 AI planning prompts (briefs, style cards, export specs, client checklists)",
      "115+ knowledge-check activities (drag-and-drop, matching, ordering and more)",
      "A complete brand image kit capstone project",
      "A mock exam",
      "A prompt library with 108 Midjourney prompts by industry and use case",
      "A glossary of Midjourney terms",
      "Narrated lessons with captions in many Indian and global languages",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "claude-code": {
    "subtitle": "From your first build to websites, apps, automation and agentic development: learn to plan, build, edit, debug, connect and ship real projects with Claude Code, without needing to know how to code.",
    "learn": [
      "Understand what Claude Code is, how it differs from a regular Claude chat, and when to use it",
      "Install Claude Code and build your first real web page from a plain-English description",
      "Make targeted edits, point Claude at specific files, and undo changes that don't work",
      "Control how Claude works with the three dials: model, effort and permission mode",
      "Plan bigger projects with Plan Mode before any code is written",
      "Recover from any mistake with checkpoints and rewind",
      "Publish your site live on the internet, and push updates to it",
      "Turn a website into a working app that saves data",
      "Add bigger features without breaking what already works",
      "Debug real problems by finding the root cause, not guessing",
      "Connect real data and tools, such as Google Drive, with MCP connectors",
      "Teach Claude your project rules with CLAUDE.md",
      "Build reusable Skills, automate recurring work with Routines, delegate tasks to Subagents, and install Plugins",
      "Use Claude Code responsibly, and know when a project needs a professional developer's review"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Claude Code & When to Use It",
        "lectures": [
          ["What Claude Code is, in plain words", 6],
          ["How it differs from a regular Claude chat", 6],
          ["Where Claude Code excels, and where another tool fits better", 6],
          ["What you need before you start", 7]
        ]
      },
      {
        "title": "Module 2: Getting Started — Install, Interface & First Build",
        "lectures": [
          ["Install the Claude desktop app (Mac and Windows)", 7],
          ["A tour of the working view", 7],
          ["Open your first project folder", 7],
          ["Hands-on: build your first real page", 9]
        ]
      },
      {
        "title": "Module 3: From Idea to a Real Page — Your First Website",
        "lectures": [
          ["Build a website for a small business", 6],
          ["Describe the page clearly to get a usable first version", 6],
          ["Understand what Claude built and why", 6],
          ["Add to the page without rebuilding it", 6],
          ["Save your work", 6]
        ]
      },
      {
        "title": "Module 4: Targeted Edits — Refining Without Starting Over",
        "lectures": [
          ["Edits that touch multiple related files", 6],
          ["Point Claude at a specific file", 6],
          ["Revert an edit that didn't work", 6],
          ["Iterate until it's exactly right", 7]
        ]
      },
      {
        "title": "Module 5: The Three Dials — Model, Effort & Permission Mode",
        "lectures": [
          ["Choose the right model for each task", 8],
          ["Choose the right effort level for cost and quality", 8],
          ["Choose a permission mode for the oversight you want", 8],
          ["Work within your usage limits", 6]
        ]
      },
      {
        "title": "Module 6: Plan Mode for Bigger Projects",
        "lectures": [
          ["When a project needs a plan first", 8],
          ["What a good plan covers", 8],
          ["Review and refine a plan before approving it", 9]
        ]
      },
      {
        "title": "Module 7: Checkpoints & Recovering from Mistakes",
        "lectures": [
          ["How automatic checkpoints work", 6],
          ["Rewind to an earlier state when something breaks", 6],
          ["Reverting one edit vs rewinding a whole session", 6],
          ["Experiment with confidence", 7]
        ]
      },
      {
        "title": "Module 8: Publishing — From Local Project to Live Site",
        "lectures": [
          ["What a web host does", 6],
          ["Publish your project live (for example, on Netlify)", 6],
          ["Push updates to a live site", 6],
          ["Check your site on your phone", 7]
        ]
      },
      {
        "title": "Module 9: Building Interactive Apps",
        "lectures": [
          ["Static sites vs apps that save data", 9],
          ["Hands-on: build a working study tracker app", 13],
          ["Test features by actually using them", 8]
        ]
      },
      {
        "title": "Module 10: Adding Features Without Breaking What Works",
        "lectures": [
          ["Safe changes vs risky ones", 8],
          ["Ask Claude what's in your project before changing it", 8],
          ["Check that existing features still work", 9]
        ]
      },
      {
        "title": "Module 11: Debugging Real Issues",
        "lectures": [
          ["Describe a bug's symptoms clearly", 6],
          ["Let Claude find the real root cause", 6],
          ["Push the fix live and confirm it worked", 6],
          ["A debugging routine you can repeat", 7]
        ]
      },
      {
        "title": "Module 12: MCP Connectors — Bringing in Your Real Data",
        "lectures": [
          ["What MCP does for your project", 8],
          ["Connect Google Drive step by step", 8],
          ["Use a real document directly in a build request", 8],
          ["Example: migrating data into your app", 6]
        ]
      },
      {
        "title": "Module 13: CLAUDE.md — Teaching Claude Your Project Rules",
        "lectures": [
          ["Stop repeating yourself every session", 8],
          ["Write project rules Claude actually follows", 8],
          ["Test a rule in a fresh session", 8],
          ["CLAUDE.md vs Claude's automatic memory", 6]
        ]
      },
      {
        "title": "Module 14: Skills — Reusable Expertise on Demand",
        "lectures": [
          ["What a Skill is and how it differs from CLAUDE.md", 7],
          ["Write a description so the Skill loads at the right moment", 7],
          ["Example: a design review Skill", 7],
          ["Hands-on: build and test your own Skill", 9]
        ]
      },
      {
        "title": "Module 15: Routines — Automating Repeatable Work",
        "lectures": [
          ["What a Routine does and where it lives", 7],
          ["Write a routine prompt that runs on a schedule", 7],
          ["Start as a draft before letting it run fully automatically", 7],
          ["Hands-on: set up your own routine", 9]
        ]
      },
      {
        "title": "Module 16: Subagents — Delegating Parallel Work",
        "lectures": [
          ["What a subagent is", 6],
          ["When a subagent helps", 6],
          ["An important limitation around permissions", 6],
          ["Read the subagent's summary report", 7]
        ]
      },
      {
        "title": "Module 17: Plugins — Installing Capability Bundles",
        "lectures": [
          ["What a plugin bundles together", 7],
          ["Why installing beats asking Claude to do it manually", 7],
          ["Hands-on: install a design-review plugin and act on its feedback", 10],
          ["What else plugins can do", 6]
        ]
      },
      {
        "title": "Module 18: Professional Use Cases",
        "lectures": [
          ["Complete workflow: Student", 4],
          ["Complete workflow: Job seeker", 4],
          ["Complete workflow: Working professional", 4],
          ["Complete workflow: Business owner", 4],
          ["Complete workflow: Content creator", 4],
          ["Complete workflow: Freelancer or consultant", 4],
          ["Hands-on: build a workflow for your own role", 6]
        ]
      },
      {
        "title": "Module 19: Responsible Use, Safety & Limits",
        "lectures": [
          ["Claude Code's honest limitations", 6],
          ["Choosing permission modes based on what's at stake", 6],
          ["Handling sensitive data, especially with connectors", 6],
          ["When to bring in a professional developer", 7]
        ]
      },
      {
        "title": "Module 20: Capstone — Build and Ship a Real Project",
        "lectures": [
          ["Phase 1: choose and frame your project", 6],
          ["Phase 2: plan before building", 6],
          ["Phase 3: build the first version", 6],
          ["Phase 4: refine with targeted edits", 6],
          ["Phase 5: test and debug", 6],
          ["Phase 6: add a reusable Skill or Routine", 6],
          ["Phase 7: publish and do a final check", 9]
        ]
      },
      {
        "title": "Bonus: Claude Code Prompt Library",
        "lectures": [
          ["83 ready-to-use prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No coding experience needed: every request is written in plain English",
      "A Mac or Windows computer",
      "A paid Claude plan (Pro or higher). Claude Code isn't available on the free plan",
      "The Claude desktop app (free download), installed step by step in Module 2",
      "Windows only: a one-time Git for Windows install (the app prompts you)",
      "A free Netlify account for publishing (Module 8)",
      "Optional: a Google account to practise MCP connectors with Google Drive"
    ],
    "audience": [
      "Complete beginners who want to build websites, apps and tools without learning to code first",
      "Students and job seekers who want portfolio projects and practical AI development skills",
      "Working professionals who want to build internal tools and automate repetitive work",
      "Business owners who want their own website, booking tool or business app",
      "Content creators and freelancers who want to build and ship projects for themselves or for clients"
    ],
    "description": [
      "Stop just asking AI for code. Start building with AI.",
      "Anyone can ask AI to generate code. But can you turn it into a working product? This course teaches you to stop copying code from a chat window, and to plan, build, modify, debug, connect and ship real projects with Claude Code instead.",
      "What you'll learn to do:",
      "• Go from idea to working build: installation, interface and your first page",
      "• Build real websites with targeted edits and step-by-step refinement",
      "• Control how Claude works: model, effort, permission mode and Plan Mode",
      "• Work directly with your project's files and structure",
      "• Turn websites into real apps that save data",
      "• Add features without breaking what works",
      "• Debug real problems and fix the root cause",
      "• Take your project live and push updates",
      "• Connect Claude to real data with MCP connectors",
      "• Teach Claude your project rules with CLAUDE.md",
      "• Give Claude reusable expertise with Skills",
      "• Automate repeatable work with Routines",
      "• Delegate parallel work to Subagents",
      "• Extend Claude Code with Plugins",
      "• Apply it all to real work, responsibly",
      "Idea → Plan → Build → Edit → Debug → Connect → Automate → Deploy",
      "Every module includes practice prompts you run in Claude Code straight away, plus a \"Your turn\" task on your own project. The course ends with a capstone where you build and publish a real project using everything you've learned.",
      "From AI coding assistant to AI development workflow. Don't just generate code. Build something that works."
    ],
    "includes": [
      "20 modules, about 9.5 hours of learning (25–45 minutes per module)",
      "92 lessons explained in plain language",
      "36 guided Claude Code practice prompts you run as you learn",
      "25 hands-on \"Your turn\" tasks on your own project",
      "Ready-made workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone project: build and publish a real project from idea to live site",
      "Knowledge checks in every module",
      "A prompt library with 83 ready-to-use Claude Code prompts",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "claude-master": {
    "subtitle": "Using Claude like ChatGPT? You're missing most of the point. Learn to use Claude as a real reasoning partner for serious work, mostly on Claude's free plan.",
    "learn": [
      "Understand what makes Claude different: a reasoning partner, not just a faster chatbot",
      "Turn vague requests into well-framed prompts that get thoughtful answers",
      "Set up Projects so Claude remembers your files and instructions for recurring work",
      "Build interactive tools, documents and code with Artifacts, and edit them without starting over",
      "Use creative techniques (constraints, metaphors and multiple perspectives) to get fresh ideas",
      "Apply business frameworks with Claude: SWOT, VRIO, Porter's Five Forces, BCG Matrix and scenario planning",
      "Think in systems: trace second- and third-order effects before you decide",
      "Revise writing for clarity and tone, and handle sensitive messages with care",
      "Turn long documents and multiple sources into real insight, not just summaries",
      "Ask Claude to challenge your reasoning, and explore options beyond yes-or-no decisions",
      "Use Memory, Connectors (MCP), file and image analysis, Extended Thinking and Skills",
      "Combine features into complete workflows for your own role",
      "Know Claude's limits, handle confidential information safely, and cite AI-assisted work properly"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Claude & When to Use It",
        "lectures": [
          ["What Claude is, in plain words", 5],
          ["A different design philosophy: a reasoning partner", 5],
          ["Where Claude excels, and where it struggles", 5],
          ["Claude vs other AI tools", 5],
          ["What's free and what's paid", 5]
        ]
      },
      {
        "title": "Module 2: Getting Started — Signup, Interface & Plans",
        "lectures": [
          ["Create your account step by step", 6],
          ["A tour of the screen", 6],
          ["Upload a file and ask a question about it", 6],
          ["Free vs Pro: what you actually get", 6],
          ["The four building blocks of the course", 6]
        ]
      },
      {
        "title": "Module 3: Structured Prompting — Giving Claude a Frame",
        "lectures": [
          ["What a good prompt frame contains", 8],
          ["Turn a vague request into a framed one", 8],
          ["When a task needs the full frame, and when it doesn't", 8],
          ["Why Claude asking you a question is a good sign", 6]
        ]
      },
      {
        "title": "Module 4: Projects — Your Persistent Workspace",
        "lectures": [
          ["Set up a Project for recurring work", 8],
          ["Add files and custom instructions", 8],
          ["Revise a Project without losing context", 8],
          ["When a Project beats a plain chat", 6]
        ]
      },
      {
        "title": "Module 5: Artifacts — Interactive Tools, Documents & Code",
        "lectures": [
          ["Build an interactive tool from a plain description", 8],
          ["What Artifacts can produce", 8],
          ["Make targeted edits without starting over", 8],
          ["When to choose Artifacts over plain chat", 6]
        ]
      },
      {
        "title": "Module 6: Creative Prompting",
        "lectures": [
          ["Use constraints to sharpen creative output", 8],
          ["Think through metaphors for a fresh angle", 8],
          ["Ask for multiple perspectives on the same problem", 8],
          ["When creative techniques help, and when they add noise", 6]
        ]
      },
      {
        "title": "Module 7: Analytical Frameworks",
        "lectures": [
          ["SWOT: strengths, weaknesses, opportunities, threats", 6],
          ["VRIO: is your advantage real?", 6],
          ["Porter's Five Forces: the competitive landscape", 6],
          ["BCG Matrix: where each product sits", 6],
          ["Scenario planning for uncertainty", 6],
          ["Combine two frameworks for richer analysis", 5]
        ]
      },
      {
        "title": "Module 8: Systems Thinking",
        "lectures": [
          ["Trace cause-and-effect chains", 8],
          ["Connect one idea across different areas", 8],
          ["Reason through second- and third-order effects", 8],
          ["Spot when an analysis has stopped too early", 6]
        ]
      },
      {
        "title": "Module 9: Writing & Revision",
        "lectures": [
          ["Revise for clarity without losing structure", 8],
          ["Adjust tone for a different audience", 8],
          ["Keep long documents consistent", 8],
          ["Write sensitive messages with care", 6]
        ]
      },
      {
        "title": "Module 10: Information Synthesis",
        "lectures": [
          ["Summary vs interpretation: the real difference", 8],
          ["Get insight from long documents faster", 8],
          ["Find unexpected connections between sources", 8],
          ["When a summary is enough", 6]
        ]
      },
      {
        "title": "Module 11: Strategic Thinking & Testing Your Reasoning",
        "lectures": [
          ["Use Claude as a sounding board that pushes back", 6],
          ["Tell real pushback from empty disagreement", 6],
          ["Explore options beyond yes-or-no choices", 6],
          ["Question constraints you've treated as fixed", 6],
          ["Clarify what matters most", 6]
        ]
      },
      {
        "title": "Module 12: Memory & Personalization",
        "lectures": [
          ["Turn on Memory and know what it remembers", 6],
          ["Memory vs Projects", 6],
          ["View, edit or clear what Claude remembers", 6],
          ["When to turn Memory off", 7]
        ]
      },
      {
        "title": "Module 13: Connectors & MCP",
        "lectures": [
          ["What MCP does, in plain language", 8],
          ["Connect a tool such as Google Drive, Gmail or GitHub", 8],
          ["Local vs remote connectors", 8],
          ["Which plans support which connectors", 6]
        ]
      },
      {
        "title": "Module 14: Files, Images & Vision",
        "lectures": [
          ["Upload and analyse documents with the right context", 8],
          ["Read charts, diagrams and photos accurately", 8],
          ["Work with multiple files at once", 8],
          ["What the context window means in practice", 6]
        ]
      },
      {
        "title": "Module 15: Extended Thinking",
        "lectures": [
          ["What happens when Claude reasons step by step", 6],
          ["Turn on Extended Thinking for hard problems", 6],
          ["Choose the right effort level", 6],
          ["When it's unnecessary", 7]
        ]
      },
      {
        "title": "Module 16: Skills — Reusable Instructions for Recurring Work",
        "lectures": [
          ["What a Skill is and how it differs from a Project", 8],
          ["Build a Skill with your own instructions and reference material", 8],
          ["How Skills activate automatically", 8],
          ["When a Skill is worth building", 6]
        ]
      },
      {
        "title": "Module 17: Combining Features into Workflows",
        "lectures": [
          ["Decision guide: Project, Skill or plain chat?", 8],
          ["Decision guide: standard response or Extended Thinking?", 8],
          ["Decision guide: Claude alone, or with other AI tools?", 8],
          ["Chain features into one connected workflow", 6]
        ]
      },
      {
        "title": "Module 18: Professional Use Cases",
        "lectures": [
          ["Complete workflow: Student", 4],
          ["Complete workflow: Job seeker", 4],
          ["Complete workflow: Working professional", 4],
          ["Complete workflow: Business owner", 4],
          ["Complete workflow: Content creator", 4],
          ["Complete workflow: Freelancer or consultant", 4],
          ["Hands-on: build a workflow for your own role", 6]
        ]
      },
      {
        "title": "Module 19: Responsible AI & Limitations",
        "lectures": [
          ["Claude's honest limitations", 6],
          ["When you need a qualified human, not a better prompt", 6],
          ["Handling confidential information", 6],
          ["Citing AI-assisted work in academic and professional settings", 7]
        ]
      },
      {
        "title": "Module 20: Capstone — Build a Strategic Deliverable",
        "lectures": [
          ["Phase 1: frame your problem", 6],
          ["Phase 2: gather and synthesise information", 6],
          ["Phase 3: apply an analytical framework", 6],
          ["Phase 4: trace systemic effects", 6],
          ["Phase 5: stress-test your thinking", 6],
          ["Phase 6: draft the deliverable", 6],
          ["Phase 7: final verification check", 9]
        ]
      },
      {
        "title": "Bonus: Claude Prompt Library",
        "lectures": [
          ["106 ready-to-use prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No AI or technical experience needed",
      "A laptop, desktop or phone with a browser",
      "A free Claude account (sign up with email or Google, no card needed)",
      "The free plan covers almost the whole course: web search, file analysis, Projects, Artifacts, Memory and file creation",
      "Optional: a paid Claude plan (Pro) for the most capable model (Opus), Deep Research and remote connectors",
      "Optional: the Claude desktop app for local connectors"
    ],
    "audience": [
      "Beginners who want to get far more out of Claude than basic questions",
      "Students who want better research, writing and critical thinking",
      "Working professionals who need clear analysis, reports and communication",
      "Business owners and consultants who want a strategic thinking partner",
      "Content creators and freelancers who want better writing and repeatable workflows"
    ],
    "description": [
      "Using Claude like ChatGPT? You're missing most of the point.",
      "Claude can do much more than answer questions. It's built to reason with you: to frame problems, test your thinking, analyse situations with proven frameworks, synthesise information into insight, and help you write with clarity and care.",
      "This course teaches you to use Claude as a real reasoning partner for serious work.",
      "What you'll learn:",
      "• Structured prompting",
      "• Projects",
      "• Artifacts",
      "• Creative prompting",
      "• Analytical frameworks (SWOT, VRIO, Porter's Five Forces, BCG and more)",
      "• Systems thinking",
      "• Writing and revision",
      "• Information synthesis",
      "• Strategic thinking",
      "• Memory and personalization",
      "• Connectors and MCP",
      "• Files, images and vision",
      "• Extended Thinking",
      "• Skills",
      "Prompt → Think → Analyse → Create → Build → Connect",
      "Every module includes practice prompts you run in Claude straight away, plus a \"Your turn\" task on your own real work. The course ends with a capstone where you build a complete strategic deliverable, from framing the problem to a verified final draft.",
      "Don't use a powerful AI platform only for basic questions. Master Claude. Put it to work."
    ],
    "includes": [
      "20 modules, about 10 hours of learning (25–45 minutes per module)",
      "96 lessons explained in plain language",
      "43 guided practice prompts you run in Claude as you learn",
      "25 hands-on \"Your turn\" tasks on your own real work",
      "Ready-made workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone: build a complete strategic deliverable with Claude",
      "Knowledge checks in every module",
      "A prompt library with 106 ready-to-use Claude prompts",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "claude-excel": {
    "subtitle": "Learn to use Claude for Excel, Anthropic's official Excel add-in, to explain and fix formulas, clean messy data, analyse numbers, build pivot tables and dashboards, and automate recurring reports, all inside your own workbook.",
    "learn": [
      "Install Claude for Excel and start safely with any important workbook using the Trust Test",
      "Get any formula explained in plain language before you change it",
      "Trace an error to its real root cause, not just the cell where it shows up",
      "Build new formulas by describing what you need, without writing the syntax yourself",
      "Test formulas against edge cases before trusting them",
      "Clean messy data exports, and approve each change before Claude makes it",
      "Answer business questions properly: define the terms, break down averages, run what-if scenarios and compare options",
      "Build and reshape pivot tables just by describing your question",
      "Create charts and one-screen dashboards that tell a clear story",
      "Audit every number back to its source before presenting it",
      "Turn your weekly or monthly reports into reusable Skills that run on request or on a schedule"
    ],
    "sections": [
      {
        "title": "Module 1: Meet Claude for Excel",
        "lectures": [
          ["Install the add-in step by step (Windows and Mac)", 6],
          ["Which plans and Excel versions it works with", 6],
          ["The Trust Test: start safely with any important workbook", 6],
          ["Run your first skill and see Claude show its work", 6],
          ["Where the add-in's limits are", 6],
          ["Hands-on: run your own Trust Test", 10]
        ]
      },
      {
        "title": "Module 2: Formulas You Can Trust",
        "lectures": [
          ["The Formula Loop: Explain, Trace, Build, Test", 8],
          ["Get any formula explained in plain language", 8],
          ["Trace an error to its real root cause", 8],
          ["Build a new formula by describing what you need", 8],
          ["Test it against edge cases before trusting it", 8],
          ["Hands-on: run the full Formula Loop on your own sheet", 15]
        ]
      },
      {
        "title": "Module 3: Tame the Messy Export — Data Cleaning",
        "lectures": [
          ["Audit, Ask, Approve, Verify", 8],
          ["Audit a messy export before touching anything", 8],
          ["Treat unclear blanks as questions, not gaps to guess", 8],
          ["Claude's permission system: approve or deny each change before it happens", 8],
          ["Verify the cleanup worked", 8],
          ["Hands-on: clean a real messy dataset", 15]
        ]
      },
      {
        "title": "Module 4: Answers Your Manager Will Trust — Analysis & What-If",
        "lectures": [
          ["Define, Break Down, Flex, Compare", 8],
          ["Define what a term means before asking the question", 8],
          ["Break an average apart to find the real story", 8],
          ["What-if scenarios: change one assumption and see the impact", 8],
          ["Compare options side by side before recommending one", 8],
          ["Hands-on: run the full analysis chain", 15]
        ]
      },
      {
        "title": "Module 5: Pivot Tables Made Simple",
        "lectures": [
          ["A pivot table is a question, not just a report format", 8],
          ["When to use a pivot table vs a formula", 8],
          ["Build a pivot summary by describing your question", 8],
          ["Reshape it: add dimensions, change measures, regroup", 8],
          ["Reconcile the totals before presenting", 8],
          ["Hands-on: build and reshape a real pivot", 15]
        ]
      },
      {
        "title": "Module 6: The Story in One Screen — Charts & Dashboards",
        "lectures": [
          ["The Chart Brief: describe the insight, not just the chart type", 11],
          ["Build a trend chart, then add a breakdown that explains why", 11],
          ["Combine several charts into one clear dashboard", 11],
          ["Audit the dashboard by tracing every number to its source", 11],
          ["Hands-on: build your own one-screen dashboard", 16]
        ]
      },
      {
        "title": "Module 7: Automate with Skills — Recurring Reports",
        "lectures": [
          ["Save your weekly report routine as a reusable Skill", 8],
          ["Create a Skill with Claude's guided setup", 8],
          ["Run it on demand, and spot when it hits an unusual case", 8],
          ["On request or on a schedule: how to decide", 8],
          ["Combine everything from Modules 2–6 into one automated process", 8],
          ["Hands-on: turn your own recurring process into a Skill", 15]
        ]
      },
      {
        "title": "Module 8: Your Claude for Excel Recap",
        "lectures": [
          ["The 7-word summary of the whole workflow", 6],
          ["A quick-reference map of every framework", 6],
          ["Your complete Claude for Excel toolkit", 6],
          ["The one habit worth keeping: check before you trust", 6],
          ["Final knowledge check", 11]
        ]
      }
    ],
    "requirements": [
      "Basic familiarity with Excel; no formula expertise needed",
      "A Microsoft 365 subscription with desktop Excel (Windows or Mac). Excel 2016/2019 perpetual versions and Excel on Android aren't supported",
      "A paid Claude plan (Pro or higher). Claude for Excel isn't available on the free plan",
      "\"Code execution and file creation\" switched on in Claude settings (for Skills, Module 7)",
      "Your own spreadsheet data to practise on, or the course examples"
    ],
    "audience": [
      "Analysts who want to speed up formulas, cleaning and reporting without losing accuracy",
      "Managers who need trustworthy numbers and clear dashboards",
      "Small business owners who track sales, stock or expenses in Excel",
      "Accountants and finance staff who build recurring reports",
      "Students and job seekers who want practical Excel + AI skills on their CV"
    ],
    "description": [
      "What if your manager asks tomorrow, \"Can we automate this report with AI?\" Would you know where to start?",
      "AI is moving beyond chat and into the tools people use every day, including spreadsheets. Claude for Excel puts an AI assistant directly inside your workbook. It can read your formulas, clean your data, build pivot tables and charts, and automate the reports you rebuild every week.",
      "But an AI answer is only useful if you can trust it. This course teaches you to use Claude for Excel and to check its work, so the numbers you present are numbers you can stand behind.",
      "Learn to work with Claude for:",
      "• Formula explanation and investigation",
      "• Root-cause analysis of errors",
      "• Data cleaning",
      "• What-if scenarios",
      "• Pivot tables",
      "• Charts and dashboards",
      "• Auditing every number back to its source",
      "• Recurring report Skills",
      "Every module gives you a simple framework, real worked examples showing the exact prompt and what Claude does in the sheet, and a hands-on task on your own data.",
      "Formulas you can trust. Answers you can check.",
      "Don't wait until AI becomes part of your responsibilities to start learning it. Excel + AI is a skillset worth building now."
    ],
    "includes": [
      "8 modules, about 7 hours of learning",
      "36 lessons with click-by-click instructions",
      "27 worked prompt examples showing the exact prompt and the real result in Excel",
      "7 hands-on \"Your turn\" tasks on your own data",
      "50+ knowledge-check activities (multiple choice, ordering, fill-in-the-blanks and more)",
      "A simple, memorable framework for every skill",
      "Real examples for analysts, business owners, students and managers in every module",
      "A final recap with a quick-reference map",
      "Certificate of completion"
    ],
    "level": "Beginner to Intermediate",
    "language": "English"
  },
  "claude-deep": {
    "subtitle": "Still using Claude mainly for questions, emails and summaries? Learn to use Claude as a complete work system: files, research, Office documents, interactive tools, code, delegation, design and business workflows.",
    "learn": [
      "Choose the right part of Claude for every task (Chat, Connectors, Projects, Skills, Artifacts, Claude Code, Cowork or Claude Design) using a simple 4-question Surface Selector",
      "Connect Google Drive and other tools so Claude can work with your real files",
      "Tell Web Search, Extended Thinking and Research apart, and run a full citation-backed Research report",
      "Check and verify AI answers before you rely on them",
      "Create real Word documents, Excel sheets with working formulas, and PowerPoint decks straight from Claude",
      "Stop re-explaining yourself by setting up Memory, Projects and Skills",
      "Build working interactive tools with Artifacts, and improve them without starting over",
      "Install Claude Code and build, test and document a working script on your own computer",
      "Delegate multi-step tasks to Claude Cowork safely, and schedule them once tested",
      "Build clickable prototypes in Claude Design and hand them off to Canva, Figma or Claude Code",
      "Combine everything into one weekly workflow, then save it as a reusable Skill (your SOP)",
      "Use the Claude for Small Business plugin with a safe approval step before anything is sent"
    ],
    "sections": [
      {
        "title": "Module 1: Choosing Your Claude Surface",
        "lectures": [
          ["A tour of Claude's interface", 8],
          ["The Surface Selector: 4 questions that point every task to the right tool", 8],
          ["Three people, three different tasks, worked through step by step", 8],
          ["Build your own surface-selection prompt", 8],
          ["The two mistakes almost everyone makes", 8]
        ]
      },
      {
        "title": "Module 2: Bringing Real Work In — Connectors",
        "lectures": [
          ["What Connectors are and how they work", 10],
          ["Hands-on: create a practice tracker in Google Sheets, connect Google Drive, and ask questions about it", 15],
          ["Combine more than one source in one request", 10],
          ["The Connector Audit: catch wrong or outdated data", 10],
          ["When a manual upload works better than a Connector", 10]
        ]
      },
      {
        "title": "Module 3: Thinking, Researching, Verifying",
        "lectures": [
          ["Fact, Think or Investigate? Web Search vs Extended Thinking vs Research", 14],
          ["Use Extended Thinking on a hard, multi-condition problem", 14],
          ["Run a full Research task and get a citation-backed report", 14],
          ["Verify what comes back", 13]
        ]
      },
      {
        "title": "Module 4: Turning Work into Deliverables — Word, Excel & PowerPoint",
        "lectures": [
          ["Shape, Fill, Finish: get a usable file on the first try", 11],
          ["Create a real Word document", 11],
          ["Create an Excel spreadsheet with working formulas", 11],
          ["Create a PowerPoint deck", 11],
          ["What to check before sending any AI-generated file", 11]
        ]
      },
      {
        "title": "Module 5: Personalizing Claude — Projects, Memory & Skills",
        "lectures": [
          ["The blank-slate problem", 13],
          ["The Personalization Stack: Memory, Projects and Skills", 13],
          ["Hands-on: set up a Project, add a Memory fact, and build a Skill", 20],
          ["Which layer to use for which kind of context", 14]
        ]
      },
      {
        "title": "Module 6: Building Interactive Tools — Artifacts",
        "lectures": [
          ["From a document to something you can click", 12],
          ["The Build Loop: Spec, Build, Test, Iterate, Publish", 12],
          ["Write a clear spec for a tool", 12],
          ["Improve an existing Artifact without starting over", 12],
          ["Publish and share your tool", 12]
        ]
      },
      {
        "title": "Module 7: Claude as a Coding Partner — Claude Code",
        "lectures": [
          ["How Claude Code differs from everything else in Claude", 12],
          ["Install Claude Code step by step", 12],
          ["Spec, Build, Test, Document, Handoff", 12],
          ["How the approval system keeps you in control of your files", 12],
          ["Hands-on: build, test and document a working script", 17]
        ]
      },
      {
        "title": "Module 8: Delegating Work — Cowork",
        "lectures": [
          ["From approving each step to describing the outcome", 9],
          ["The Trust Ladder: Cowork's three permission modes, and why you start with Manual", 9],
          ["Hands-on: delegate a real multi-step task", 14],
          ["Global Instructions so you stop repeating context", 9],
          ["Using Connectors inside Cowork", 9],
          ["Scheduling tasks only after real testing", 10]
        ]
      },
      {
        "title": "Module 9: Claude as a Design Partner — Claude Design",
        "lectures": [
          ["Brief, Build, Draw, Test, Handoff", 10],
          ["Write a clear design brief", 10],
          ["Build a clickable prototype", 10],
          ["Use the Draw tool for precise changes", 10],
          ["Generate alternative designs before committing", 10],
          ["Hand off to Canva, Figma, HTML, PowerPoint or Claude Code", 10]
        ]
      },
      {
        "title": "Module 10: Designing Workflows & SOPs",
        "lectures": [
          ["Combine Connectors, Research and file creation into one weekly workflow", 15],
          ["Clarify, Design, Stress-Test, Document", 15],
          ["Find where a workflow could break before it does", 15],
          ["Turn a working workflow into a reusable Skill", 15]
        ]
      },
      {
        "title": "Module 11: Claude for Small Business",
        "lectures": [
          ["Install the Claude for Small Business plugin", 10],
          ["What's inside: ready-made business skills and tool connections (e.g. QuickBooks, PayPal)", 10],
          ["Run a skill with an approval step before anything is sent", 10],
          ["The Approval Tiers: Read, Prepare or Never Automate", 10],
          ["Hands-on: sort your own business tasks into tiers", 15]
        ]
      },
      {
        "title": "Module 12: Your Claude Mastery Recap",
        "lectures": [
          ["The 8-word summary of the whole course", 7],
          ["A quick-reference map of every framework", 7],
          ["Your complete Claude Work System: everything you built", 7],
          ["The one habit worth keeping", 7],
          ["Final knowledge check", 12]
        ]
      }
    ],
    "requirements": [
      "No coding experience needed",
      "A laptop or desktop computer (Windows or Mac)",
      "A Claude account. The free plan covers Chat, Projects, Artifacts and file creation",
      "A paid Claude plan (Pro or higher) is needed for Claude Code (Module 7), Cowork (Module 8) and Claude Design (Module 9)",
      "A Google account for the Google Drive Connector practice",
      "For Claude Code: Node.js 18 or higher (free; installation is covered), plus Git on Windows",
      "Claude desktop app (free download) for Cowork"
    ],
    "audience": [
      "People who already use Claude occasionally and want to use it properly",
      "Professionals who want to automate recurring reports, documents and research",
      "Small business owners who want Claude to handle routine business tasks safely",
      "Students who want a reliable system for research and coursework",
      "Freelancers and IT professionals who want to build tools, scripts and prototypes faster"
    ],
    "description": [
      "Still using Claude mainly for questions, emails and summaries? That's only the beginning.",
      "AI at work is moving beyond basic prompting. Claude can work with your real files, research with citations, create documents you can send, build tools you can click, write and test code, carry out multi-step tasks, and design prototypes. Most people never get past the chat box.",
      "This course teaches you to use Claude as a complete work system. In every module, you build something real and usable, not just practice exercises.",
      "Learn how to use Claude across:",
      "• Connectors",
      "• Research & Verification",
      "• Word, Excel & PowerPoint",
      "• Projects & Memory",
      "• Skills",
      "• Interactive Artifacts",
      "• Claude Code",
      "• Cowork & Delegation",
      "• Claude Design",
      "• Workflows & SOPs",
      "• Small-Business Workflows",
      "Each skill comes with a simple framework you can remember, real worked examples showing the exact prompt and result, and a hands-on task on your own work.",
      "The AI skill gap is changing. Knowing how to prompt is useful. Knowing how to put AI to work is the bigger skill.",
      "Don't wait until your workplace expects more from AI than basic chat. Go beyond prompting. Become AI-ready."
    ],
    "includes": [
      "12 modules, about 11 hours of learning",
      "80 lessons with click-by-click instructions",
      "26 worked prompt examples showing the exact prompt and the real result",
      "24 step-by-step setup guides",
      "11 hands-on \"Your turn\" tasks on your own real work",
      "55+ knowledge-check activities (multiple choice, ordering, fill-in-the-blanks and more)",
      "Easy-to-remember frameworks for every skill: Shape, Fill, Finish; the Build Loop; the Trust Ladder; and more",
      "Real examples for students, business owners, IT professionals and freelancers in every module",
      "A final recap with a quick-reference map of everything you learned",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "perplexity": {
    "subtitle": "Learn to research with Perplexity AI: ask sharper questions, check every source, go deeper with Pro Search and Deep Research, organise your work in Spaces, and turn your findings into shareable reports.",
    "learn": [
      "Understand how Perplexity differs from a search engine and from a regular AI chatbot",
      "Use the 4-step research loop on every question: Ask, Read, Verify, Refine",
      "Turn vague questions into strong research prompts with the 4-part structure: context, question, constraints, format",
      "Judge any source in seconds with the CARR check: Credibility, Authority, Recency, Relevance",
      "Confirm important facts by cross-checking several sources (triangulation)",
      "Choose the right search mode: Web, Academic, Pro Search or Deep Research",
      "Run multi-step Deep Research reports, and turn research directly into a presentation",
      "Upload your own documents, combine them with live web research, and compare two files side by side",
      "Organise recurring research in Spaces with custom instructions and files",
      "Publish your research as a formatted, shareable Page with citations",
      "Pick the right AI model (GPT, Claude, Gemini, Grok or Sonar) and use Model Council",
      "Use Comet, Perplexity's free AI browser, to work with any web page",
      "Research on the go with voice, camera and Memory",
      "Know Perplexity's limits, protect confidential information, and cite AI-assisted research properly"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Perplexity & When to Use It",
        "lectures": [
          ["Not a search engine, not just a chatbot", 7],
          ["Why citations matter more than they seem to", 6],
          ["When Perplexity is the right tool, and when something else fits better", 6],
          ["What's free before you pay for anything", 6]
        ]
      },
      {
        "title": "Module 2: Getting Started — Signup, Interface & Plans",
        "lectures": [
          ["Sign up step by step", 6],
          ["A tour of the screen: search bar, mode selector, sidebar, source panel", 6],
          ["Write and run your first research question", 6],
          ["Read the source panel properly", 6],
          ["Free vs Pro vs Max, with prices", 6]
        ]
      },
      {
        "title": "Module 3: The Core Research Loop",
        "lectures": [
          ["Ask, Read, Verify, Refine", 8],
          ["Tell a strong citation from a weak one", 8],
          ["Use follow-up questions to go deeper without starting over", 7],
          ["Know when a research thread is finished", 7]
        ]
      },
      {
        "title": "Module 4: Writing Powerful Research Prompts",
        "lectures": [
          ["Weak → Better → Strong: one real example", 7],
          ["The 4-part structure: context, question, constraints, format", 7],
          ["Three common mistakes and how to avoid them", 6],
          ["Hands-on: rewrite your own questions", 10]
        ]
      },
      {
        "title": "Module 5: Source Literacy — The Takxila Verification Framework",
        "lectures": [
          ["Seven kinds of sources: primary, secondary, official, academic, news, commercial, community", 8],
          ["The CARR check: your four-second source test", 8],
          ["Triangulation: when one citation isn't enough", 7],
          ["When this level of checking is really needed", 7]
        ]
      },
      {
        "title": "Module 6: Focus Modes — Web, Academic & Targeted Search",
        "lectures": [
          ["What Focus modes change", 7],
          ["Web mode as your default", 6],
          ["Academic mode for peer-reviewed sources", 6],
          ["Why you set Focus before asking", 6]
        ]
      },
      {
        "title": "Module 7: Pro Search — Deeper Multi-Source Investigation",
        "lectures": [
          ["What changes when Pro Search is on", 7],
          ["How many free Pro Searches you get each day", 6],
          ["When the extra depth is worth it", 6],
          ["The mistake of using Pro Search for everything", 6]
        ]
      },
      {
        "title": "Module 8: Deep Research & Deliverables",
        "lectures": [
          ["How Deep Research differs from Pro Search", 8],
          ["Run a full Deep Research report", 8],
          ["Turn research directly into a presentation with Deliverables", 7],
          ["Which plan Deep Research needs", 7]
        ]
      },
      {
        "title": "Module 9: Working with Files & Documents",
        "lectures": [
          ["Upload documents, images and PDFs", 8],
          ["What you can ask about an uploaded file", 8],
          ["Combine a file with live web research", 7],
          ["Compare two documents directly", 7]
        ]
      },
      {
        "title": "Module 10: Spaces — Organising Recurring Research",
        "lectures": [
          ["Set up a Space for a recurring need", 10],
          ["Custom instructions: set the rules once", 10],
          ["Add files every question can use", 10]
        ]
      },
      {
        "title": "Module 11: Pages — Publishing Research as a Shareable Document",
        "lectures": [
          ["Turn a research thread into a formatted Page", 7],
          ["When a Page is the right format", 6],
          ["Edit before you share", 6],
          ["Share with a public link, citations included", 6]
        ]
      },
      {
        "title": "Module 12: Choosing Your AI Model",
        "lectures": [
          ["What changes when you switch models", 7],
          ["Available models: Sonar, GPT, Claude, Gemini and Grok", 6],
          ["Model Council: compare several models at once", 6],
          ["When model choice really matters", 6]
        ]
      },
      {
        "title": "Module 13: Comet — Perplexity's Free AI Browser",
        "lectures": [
          ["What Comet is and how it differs from perplexity.ai", 6],
          ["The sidebar Assistant for any page you're viewing", 6],
          ["Multi-step tasks, not just questions", 6],
          ["What Comet Plus adds", 6],
          ["When a regular browser is still fine", 6]
        ]
      },
      {
        "title": "Module 14: Voice, Mobile & Memory",
        "lectures": [
          ["Turn on Memory and control what it remembers", 9],
          ["Ask questions by voice and camera on mobile", 8],
          ["Continue research between phone and computer", 8]
        ]
      },
      {
        "title": "Module 15: Combining Features into Workflows",
        "lectures": [
          ["A complete Deep Research + Spaces + Pages workflow", 8],
          ["Decision guide: which search depth?", 8],
          ["Decision guide: thread or Space?", 7],
          ["Decision guide: keep as a thread or turn into a Page?", 7]
        ]
      },
      {
        "title": "Module 16: Professional Use Cases",
        "lectures": [
          ["Research workflow: Student", 4],
          ["Research workflow: Job seeker", 4],
          ["Research workflow: Working professional", 4],
          ["Research workflow: Business owner", 4],
          ["Research workflow: Content creator", 4],
          ["Research workflow: Freelancer or consultant", 4],
          ["Hands-on: build a workflow for your own role", 6]
        ]
      },
      {
        "title": "Module 17: Responsible AI Research & Limitations",
        "lectures": [
          ["Perplexity's honest limitations", 7],
          ["When you need a qualified human", 6],
          ["Handling confidential information", 6],
          ["Citing AI-assisted research properly", 6]
        ]
      },
      {
        "title": "Module 18: Capstone — Build a Verified Research Brief",
        "lectures": [
          ["Phase 1: choose and frame your topic", 7],
          ["Phase 2: initial research and mode selection", 7],
          ["Phase 3: verify sources with CARR", 7],
          ["Phase 4: follow up and check for conflicting information", 6],
          ["Phase 5: bring in your own files", 6],
          ["Phase 6: organise and finalise", 6],
          ["Phase 7: final verification check", 6]
        ]
      },
      {
        "title": "Bonus: Perplexity Prompt Library",
        "lectures": [
          ["141 ready-to-use research prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No AI or research experience needed",
      "A computer or phone with a browser",
      "A free Perplexity account (Google, Apple, Microsoft or email sign-in)",
      "The free plan includes unlimited standard search with citations, about 5 Pro Searches a day, limited file uploads, Pages and the Comet browser",
      "Some modules use paid features: Deep Research (Module 8), full Spaces (Module 10) and model selection (Module 12) need Perplexity Pro. You can still follow those lessons without paying",
      "Optional: Comet browser (free download) for Module 13"
    ],
    "audience": [
      "Students who want faster, better-sourced research for assignments and projects",
      "Job seekers researching companies, roles and interviews",
      "Working professionals who need reliable information for reports and decisions",
      "Business owners researching markets, competitors and suppliers",
      "Content creators and freelancers who need accurate, citable facts"
    ],
    "description": [
      "Still doing research with 20 browser tabs open? There's a smarter way.",
      "Perplexity gives you researched answers with citations you can click and check. But getting reliable results takes more than typing a question. You need to ask well, read the sources, verify what matters, and know when to go deeper.",
      "This course teaches you to research with AI, not just ask it for answers.",
      "Learn how to:",
      "• Search smarter with strong research prompts",
      "• Work with sources and judge them quickly",
      "• Verify answers with the CARR check and triangulation",
      "• Ask better follow-up questions",
      "• Go deeper with Pro Search and Deep Research",
      "• Compare information and documents",
      "• Organise research in Spaces",
      "• Turn findings into shareable Pages and presentations",
      "• Work with any web page using the free Comet browser",
      "Ask → Read → Verify → Refine",
      "Every module includes practice prompts you run in Perplexity straight away, plus a \"Your turn\" task on your own research. The course ends with a capstone where you build a complete, verified research brief you can share.",
      "Don't just ask AI for an answer. Learn how to research with AI."
    ],
    "includes": [
      "18 modules, about 8 hours 40 minutes of learning (25–45 minutes per module)",
      "87 lessons explained in plain language",
      "28 guided practice prompts you run in Perplexity as you learn",
      "22 hands-on \"Your turn\" tasks on your own research questions",
      "Ready-made research workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone: build a verified, shareable research brief",
      "Knowledge checks in every module",
      "A prompt library with 141 ready-to-use research prompts",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "deepseek": {
    "subtitle": "Learn to use DeepSeek, a free and capable AI tool, the right way: choose the right mode for each task, research current information, solve hard problems with step-by-step reasoning, and apply it to learning, business, marketing and coding.",
    "learn": [
      "Understand what DeepSeek is and how it differs from \"just another ChatGPT\"",
      "Use the Three Switches (Speed, Depth and Currency) to set up any question correctly",
      "Research current information with Search, and check answers with the Search Checklist",
      "Solve hard problems with Expert Mode and DeepThink, and read its reasoning to catch mistakes",
      "Break complex requests into steps with the Layer Stack, and get structured comparisons with the Comparison Grid",
      "Study hard topics properly, and create teaching material, with the Learning Loop",
      "Run business operations with the Business Loop: Listen, Create, Analyse, Improve",
      "Research markets and competitors with the Market Lens: Landscape, Audience, Position, Calendar",
      "Debug code in chat, and set up DeepSeek inside VS Code",
      "Analyse documents, spreadsheets and code files, and use Vision Mode for photos and handwriting",
      "Understand where your data is stored, and what you should never upload",
      "Check any AI use with the Four Guards: transparency, equity, responsibility and privacy",
      "Combine everything into your own weekly DeepSeek workflow"
    ],
    "sections": [
      {
        "title": "Module 1: Understanding DeepSeek",
        "lectures": [
          ["What DeepSeek is and how it's different", 9],
          ["The Three Switches: Speed (Instant/Expert), Depth (DeepThink) and Currency (Search)", 9],
          ["A tour of the current interface", 9],
          ["Hands-on: test all three switches on one question", 13]
        ]
      },
      {
        "title": "Module 2: Search & Research",
        "lectures": [
          ["Use the Search toggle for current information", 8],
          ["Where DeepSeek Search is strong, and where a dedicated research tool does better", 8],
          ["The Search Checklist: verify before you trust", 8],
          ["Combine Search with Speed and Depth", 8],
          ["Hands-on: run a search-grounded question", 13]
        ]
      },
      {
        "title": "Module 3: DeepThink & Expert Mode for Hard Problems",
        "lectures": [
          ["DeepSeek's biggest strength: deep reasoning at low cost", 13],
          ["The Reasoning Read: check the thinking, not just the final answer", 13],
          ["Solve a hard problem and spot where DeepSeek corrects itself", 12],
          ["When Expert Mode + DeepThink is overkill", 12]
        ]
      },
      {
        "title": "Module 4: Advanced Prompting — Layering & Comparison",
        "lectures": [
          ["The Layer Stack: break a big request into steps that build on each other", 11],
          ["The Comparison Grid: structured comparisons instead of vague summaries", 11],
          ["Combine both for complex decisions", 11],
          ["Hands-on: run a layered comparison", 17]
        ]
      },
      {
        "title": "Module 5: DeepSeek for Learning & Teaching",
        "lectures": [
          ["The Learning Loop: understand a topic instead of copying an answer", 11],
          ["A full worked example for teachers and coaches", 11],
          ["Use DeepThink for concepts that need deeper reasoning", 11],
          ["Hands-on: run a full Learning Loop", 17]
        ]
      },
      {
        "title": "Module 6: DeepSeek for Business Operations",
        "lectures": [
          ["The Business Loop: Listen, Create, Analyse, Improve", 12],
          ["One business taken through all four stages", 12],
          ["Use DeepThink and layered prompting for operational decisions", 12],
          ["Hands-on: run a Business Loop for your own work", 19]
        ]
      },
      {
        "title": "Module 7: DeepSeek for Marketing & Market Research",
        "lectures": [
          ["The Market Lens: Landscape, Audience, Position, Calendar", 12],
          ["Competitor research with the Comparison Grid and Search Checklist", 12],
          ["Use DeepThink for positioning and differentiation", 12],
          ["Hands-on: run the full Market Lens", 19]
        ]
      },
      {
        "title": "Module 8: DeepSeek for IT & Developers",
        "lectures": [
          ["Debug code in chat using the Reasoning Read", 11],
          ["Get a DeepSeek API key", 11],
          ["Set up DeepSeek in VS Code with the Continue extension", 11],
          ["When not to send code to DeepSeek (data residency)", 11],
          ["Hands-on: debug something real", 16]
        ]
      },
      {
        "title": "Module 9: Files, Documents & Vision Mode",
        "lectures": [
          ["Upload PDFs, Word files, spreadsheets and code", 11],
          ["Vision Mode for photos, screenshots and handwriting", 11],
          ["What to check before uploading sensitive files", 11],
          ["Hands-on: try both document and image analysis", 17]
        ]
      },
      {
        "title": "Module 10: Ethics & Responsible AI Use",
        "lectures": [
          ["The full data-residency picture", 13],
          ["The Four Guards: transparency, equity, responsibility and privacy", 13],
          ["What not to upload or ask, and why", 12],
          ["Verify before you act", 12]
        ]
      },
      {
        "title": "Module 11: Designing Your Own DeepSeek Workflow",
        "lectures": [
          ["The Workflow Build: Define, Assemble, Verify, Repeat", 11],
          ["Combine techniques from earlier modules into one routine", 11],
          ["Run the Four Guards on a whole workflow", 11],
          ["Hands-on: design your own weekly workflow", 17]
        ]
      },
      {
        "title": "Module 12: Your DeepSeek Mastery Recap",
        "lectures": [
          ["The 11-word summary, one word per module", 8],
          ["A quick-reference map of every framework", 8],
          ["Your complete DeepSeek toolkit", 8],
          ["The one habit worth keeping", 8],
          ["Final knowledge check", 8]
        ]
      }
    ],
    "requirements": [
      "No AI or coding experience needed",
      "A computer or phone with a browser",
      "DeepSeek is free to use at chat.deepseek.com, with sign-in by email, Google or Apple ID",
      "Optional, for developers (Module 8): VS Code (free) and a DeepSeek API key, which needs a small top-up of a few dollars",
      "Important: DeepSeek stores user data on servers in China. The course explains what this means and what you should never upload"
    ],
    "audience": [
      "Students who want help understanding hard topics, not just answers",
      "Teachers and coaches who want to prepare lessons and materials faster",
      "Business owners who want a free AI tool for operations and decisions",
      "Marketers who want faster competitor research and positioning",
      "IT professionals and developers who want a low-cost reasoning and coding assistant"
    ],
    "description": [
      "Your job may not change. But the speed and depth expected from you might.",
      "Research faster. Analyse faster. Compare options faster. Understand documents faster. Solve problems faster. AI is changing what can be done before the deadline arrives.",
      "So stop asking only, \"What answer can AI give me?\" Start asking, \"What problem can I solve with AI?\"",
      "DeepSeek is free, fast and capable, but it's also easy to use badly. This course teaches you to use it properly: the right mode for each task, the right way to check its answers, and the right situations to use it for.",
      "You follow Karan, who runs operations at a small business, as he builds his own DeepSeek workflow through the course.",
      "What you'll learn:",
      "• Search for current information",
      "• DeepThink and Expert Mode for hard problems",
      "• Research and verification",
      "• Advanced prompting: layering and comparison",
      "• Learning and teaching",
      "• Business operations",
      "• Marketing and market research",
      "• Coding and VS Code setup",
      "• Files, documents and Vision Mode",
      "• Responsible use and data privacy",
      "• Your own repeatable workflow",
      "Every module gives you a simple framework, real worked examples showing the exact prompt and result, and a hands-on task on your own work.",
      "Don't wait until deeper AI use becomes part of your job. Learn it before you're expected to know it."
    ],
    "includes": [
      "12 modules, about 10 hours of learning",
      "68 lessons with click-by-click instructions",
      "28 worked prompt examples showing the exact prompt and the real result",
      "11 hands-on \"Your turn\" tasks on your own work",
      "55+ knowledge-check activities (multiple choice, ordering, fill-in-the-blanks and more)",
      "A simple, memorable framework for every skill",
      "Real examples for students, teachers, business owners, marketers and IT professionals in every module",
      "A final recap with a quick-reference map",
      "Certificate of completion"
    ],
    "level": "Beginner to Advanced",
    "language": "English"
  },
  "lovable": {
    "subtitle": "Turn your ideas into live websites and MVPs, faster with AI: go from a first prompt to a published product, with no coding needed.",
    "learn": [
      "Understand what Lovable really is: a tool that writes real code (React, TypeScript and a Supabase database), not a drag-and-drop template builder",
      "Decide in minutes whether your idea suits Lovable, or whether a simpler website builder would be cheaper and easier",
      "Write a first prompt that names your exact sections, so the first version comes out close to what you want",
      "Check every build against what you asked for, and fix problems in small, safe steps",
      "Make four kinds of edits precisely (Style, Section, Layout and Content) without breaking the rest of your site",
      "Turn a Figma design or a screenshot into a working website, and add features the design didn't have",
      "Know the difference between Chat Connectors (help while you build) and App Connectors (features in your live site)",
      "Add real payments with Stripe, and connect services that aren't in Lovable's catalogue, such as an Indian UPI payment gateway, using their API documentation",
      "Write website copy that gets visitors to take one clear action, and add it without disturbing your design",
      "Publish your site live, connect your own domain, and update it safely after launch",
      "Save money with the free GitHub + Vercel/Netlify route instead of a paid custom-domain plan",
      "Recognise when a project has outgrown Lovable, and hand the real code to a developer without starting over"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Lovable, and When to Use It",
        "lectures": [
          ["Not a template picker: how Lovable writes real code, a database and user logins", 6],
          ["When Lovable fits best: startup MVPs, business tools with real logic, fast changes", 6],
          ["When it isn't the best choice: simple blogs, static pages, very complex logic", 7],
          ["How credits work, what the free plan includes and what paid plans add", 7],
          ["Framework: The Right Fit Check (Understand → Match → Flag → Start)", 7],
          ["Hands-on: run the Right Fit Check on your own idea", 7]
        ]
      },
      {
        "title": "Module 2: Your First Prompt",
        "lectures": [
          ["Sign up and start your first project", 6],
          ["Write a specific first prompt that names your sections", 6],
          ["The two-pane editor: chat on the left, live preview on the right", 6],
          ["Check the first version against what you asked for", 6],
          ["Why 2–3 changes at a time works better than one giant request", 6],
          ["Framework: The First Build (Describe → Watch → Check → Edit in Small Steps)", 6],
          ["Worked example: Ritika's portfolio, from first build to focused fix", 7],
          ["Hands-on: build and check the first version of your project", 7]
        ]
      },
      {
        "title": "Module 3: Editing Like You Mean It",
        "lectures": [
          ["Style edits: change colours and fonts across the whole site", 6],
          ["Section edits: add, remove or move a section exactly where you want", 7],
          ["Layout edits: rearrange items without changing the content", 7],
          ["Content edits: update only the words, not design or structure", 7],
          ["Say what should stay unchanged, so edits don't break other parts", 7],
          ["Framework: The Edit Menu (Style • Section • Layout • Content)", 7],
          ["Worked example: Takshika's theme, testimonials, layout and copy edits", 7],
          ["Hands-on: make one of each edit type on your project", 7]
        ]
      },
      {
        "title": "Module 4: Importing Designs",
        "lectures": [
          ["Paste a Figma link and turn it into a working website", 6],
          ["Use the Builder.io plugin for a more precise Figma conversion", 6],
          ["Upload a screenshot of a site you like as style inspiration", 6],
          ["The truth about \"cloning\" websites, and what actually works", 6],
          ["Add features a static design doesn't have, such as a contact form", 6],
          ["Compare the result with the original and fix the differences", 6],
          ["Framework: The Import Path (Capture → Choose the Method → Describe What's Different → Refine)", 6],
          ["Worked examples: Karan's Figma import and Ritika's screenshot inspiration", 6],
          ["Hands-on: import a real Figma design or screenshot", 7]
        ]
      },
      {
        "title": "Module 5: Lovable as Part of Your Toolkit — Integrations",
        "lectures": [
          ["Chat Connectors: give Lovable information while you build (Notion, design files, trackers)", 6],
          ["App Connectors: payments, email, CRM data and Slack notifications in your live site", 7],
          ["Custom API: connect services outside the catalogue using their API documentation", 7],
          ["Connecting tools doesn't use credits; only code generation does", 7],
          ["Check that each connection actually works", 7],
          ["Framework: Two Kinds of Connection (Chat Connectors • App Connectors • Custom API)", 7],
          ["Worked examples: a Notion spec, a Stripe deposit payment and a UPI payment gateway", 7],
          ["Hands-on: connect a real tool the right way for your project", 7]
        ]
      },
      {
        "title": "Module 6: Words That Convert — Website Copy",
        "lectures": [
          ["Decide the one action you want every visitor to take", 7],
          ["Draft copy in ChatGPT or Claude, then bring it into Lovable", 7],
          ["Replace generic lines with specific, concrete ones", 7],
          ["Add the finished copy as a Content edit, so your design stays untouched", 7],
          ["Framework: The Conversion Copy Check (Clarify the Goal → Draft with the Right Tool → Cut the Fluff → Integrate as Content)", 7],
          ["Worked example: Takshika's \"Reserve My Spot\" landing page copy", 7],
          ["Hands-on: write and add real conversion copy to your page", 8]
        ]
      },
      {
        "title": "Module 7: Publishing Your Site",
        "lectures": [
          ["Publish with the right audience: public, or limited to specific people", 6],
          ["Option 1: Lovable's built-in custom domain (paid plan)", 6],
          ["Option 2: free GitHub sync, then deploy on Vercel or Netlify", 6],
          ["Connect a domain step by step: A record, TXT record, automatic SSL", 6],
          ["Avoid a common mistake with domains behind Cloudflare or another CDN", 6],
          ["Update a live site safely with \"Publish changes\"", 6],
          ["Framework: The Launch Checklist (Publish First → Choose Your Domain Path → Connect → Update After Launch)", 6],
          ["Worked example: Karan compares the paid and free domain routes", 6],
          ["Hands-on: publish your project and choose your domain path", 7]
        ]
      },
      {
        "title": "Module 8: Real-World Fit — MVP Building & Growing Beyond",
        "lectures": [
          ["Where Lovable works best: MVPs, small business tools, event and programme sites", 6],
          ["Clear signs a project has outgrown Lovable", 7],
          ["Hand over the real code to developers through GitHub, with no lock-in", 7],
          ["Work with a designer: Figma import as the bridge to a working product", 7],
          ["Reassess fit as your project grows", 7],
          ["Framework: The Growth Signal (Recognise → Exit Cleanly → Collaborate → Reassess)", 7],
          ["Worked example: Karan exports his booking tool to GitHub for a development team", 7],
          ["Hands-on: reassess the fit of your own project", 7]
        ]
      },
      {
        "title": "Module 9: Your Lovable Mastery Recap",
        "lectures": [
          ["The 8-word journey: Fit → Build → Edit → Import → Connect → Convert → Publish → Grow", 7],
          ["A one-page quick-reference map of all 8 frameworks", 7],
          ["Your complete Lovable toolkit: everything you built", 7],
          ["The one habit worth keeping: check before you assume", 7],
          ["Final knowledge check", 7]
        ]
      }
    ],
    "requirements": [
      "No coding experience needed",
      "A computer with a modern browser",
      "A free Lovable account (sign up with email, Google, GitHub or Apple). The free plan includes daily credits, public projects and a free Lovable web address",
      "A paid Lovable plan is optional, needed only for a custom domain through Lovable and for private projects",
      "Optional free accounts: Figma (design import), GitHub (code sync and free hosting), Notion (build context)",
      "Optional: a Stripe account for the payments example",
      "Credit amounts and prices change often. Check Lovable's pricing page before buying a plan"
    ],
    "audience": [
      "Beginners who want to build websites with AI, without learning to code",
      "Entrepreneurs and startup founders who want to validate an idea with a working MVP",
      "Small business owners who want a website, booking tool or client portal of their own",
      "Freelancers exploring AI-powered website projects for clients",
      "Marketers creating landing pages and campaign pages quickly",
      "Coaches and trainers launching programme and workshop pages",
      "Students building portfolio websites",
      "Designers who want to turn Figma designs into working sites"
    ],
    "description": [
      "💡 Your idea deserves more than a notebook.",
      "Have a website idea, landing page concept or app idea but don't know how to build it? With Lovable, you can turn written instructions into working websites and apps without traditional coding.",
      "But generating a first draft is only the beginning.",
      "Most people stop at Lovable's first version, and it shows: placeholder text, sections in the wrong place, no payments, no domain, no visitors. Lovable Deep Dive takes you through the whole journey, from your first prompt to a published product real people can use.",
      "Inside the course:",
      "• ✍️ Prompting: turn ideas into clear instructions Lovable can build from",
      "• 🎨 Editing: change themes, sections, layouts and content without rebuilding",
      "• 🖼️ Importing: turn Figma designs and screenshots into working sites",
      "• 🔗 Integrations: connect Stripe, Notion, Slack and custom APIs",
      "• 💬 Conversion copy: write headlines and calls to action that get clicks",
      "• 🌐 Publishing: go live, connect your domain (including a free route) and update safely",
      "• 🛠️ MVP building: test your idea, and know when it's ready for the next step",
      "Your learning journey: Idea → Prompt → Build → Edit → Import → Connect → Publish → Grow",
      "What you'll build: by the end of the course, you'll have built and launched a real project of your own, such as:",
      "• A portfolio website with a projects showcase and a working contact form",
      "• A booking or client-intake tool with real logic and a Stripe deposit payment",
      "• A programme or workshop landing page with testimonials and a \"Reserve My Spot\" button",
      "• A working MVP to test your startup idea with real users",
      "You'll follow three learners throughout the course: Ritika, a business analytics student building her portfolio; Karan, a small business owner building a client booking tool; and Takshika, a trainer launching a leadership programme page.",
      "8 frameworks you'll master:",
      "• Right Fit Check: is Lovable right for this idea?",
      "• The First Build: get a strong first version",
      "• The Edit Menu: Style, Section, Layout, Content",
      "• The Import Path: from Figma or screenshot to working site",
      "• Two Kinds of Connection: Chat Connectors, App Connectors, Custom API",
      "• Conversion Copy Check: words that get clicks",
      "• Launch Checklist: publish, domain, update",
      "• Growth Signal: MVP to next stage",
      "Why this course is different:",
      "• Learn by doing. Every module ends with a hands-on task on your own project, so you finish with something real.",
      "• Real worked examples. See the exact prompt, what Lovable built, what went wrong, and how it was fixed.",
      "• Honest advice. Learn when Lovable isn't the right tool, how to save money on domains, and how to avoid common mistakes, so you don't waste credits.",
      "• No lock-in. Lovable writes real code, so you can always hand your project to a developer later.",
      "Don't stop at the first draft. A generated website is a starting point. Learn to refine it, make better decisions, test the experience and move toward a real launch.",
      "Start building. Keep improving. Launch your idea."
    ],
    "includes": [
      "9 modules, about 7.5 hours of learning",
      "47 short lessons with click-by-click instructions",
      "22 worked examples showing the exact prompt and what Lovable built",
      "8 hands-on \"Your turn\" tasks on your own website or app idea",
      "55+ knowledge-check activities (multiple choice, ordering, fill-in-the-blanks and more)",
      "8 easy-to-remember frameworks, one for each stage of building",
      "Real examples for students, small business owners, coaches and startup founders in every module",
      "Ready-to-adapt prompt templates for first builds, edits, imports, integrations and copy",
      "Honest guidance on credits, plans and costs, so you don't waste money",
      "A final recap with a one-page quick-reference map",
      "Certificate of completion"
    ],
    "level": "Beginner to Intermediate",
    "language": "English"
  },
  "chatgpt-deep": {
    "subtitle": "Learn to use ChatGPT as a complete work system: Custom GPTs and Actions, connected Apps, Skills, consistent images, live websites and apps, ChatGPT Work, Codex, Deep Research and data analysis.",
    "learn": [
      "Write Custom GPT instructions that hold up in real use, and handle the four common ways GPTs fail",
      "Connect a Custom GPT to live outside data with Actions, safely and within its job",
      "Connect your tools (Google Drive, Notion, GitHub and more) with Apps, and build a daily or weekly brief",
      "Chain several apps together so one tool's output feeds the next, checking every handoff",
      "Understand when to use a Custom GPT, a Skill or a Project, and how they work together",
      "Create a matching set of images with a consistent character, product or brand look in ChatGPT Images 2.0",
      "Build and publish a real website with a live URL using ChatGPT Sites",
      "\"Vibe code\" interactive apps and games, and play-test them properly",
      "Hand off complete tasks to ChatGPT Work with a clear deliverable, the right files and safe permissions",
      "Delegate coding tasks to Codex, review changes before they merge, and schedule recurring jobs",
      "Scope Deep Research questions precisely and check the quality of every source",
      "Analyse data properly: find the real story behind averages, trace wrong numbers, and write an actionable findings brief"
    ],
    "sections": [
      {
        "title": "Module 1: Custom GPTs for Multi-Step Workflows",
        "lectures": [
          ["What a Custom GPT is, and who can currently create new ones", 9],
          ["The Custom GPT Backbone: Purpose, Routing, Test, Refine", 9],
          ["The four failure modes: missing input, contradictory input, scope creep and underflow", 9],
          ["Edit an existing GPT step by step", 9],
          ["Hands-on: apply the Backbone to your own GPT", 9]
        ]
      },
      {
        "title": "Module 2: Custom GPTs with Actions",
        "lectures": [
          ["What Actions do, and how they differ from Apps", 13],
          ["The Live Data Guard: connect outside data safely", 14],
          ["Handle unclear data, incomplete data and off-scope requests", 14],
          ["Set an access policy so a GPT stays within its job", 14]
        ]
      },
      {
        "title": "Module 3: Apps — Connecting Your Tools",
        "lectures": [
          ["Why \"connectors\" are now called Apps", 13],
          ["The Brief Builder: connect only what the task needs", 14],
          ["Set rules for combining several sources", 14],
          ["Hands-on: build a daily or weekly brief", 14]
        ]
      },
      {
        "title": "Module 4: Chaining Apps Together",
        "lectures": [
          ["The Handoff Chain: map, sequence, check, close the loop", 13],
          ["Make one app's output become the next app's input", 14],
          ["Check every handoff before trusting the result", 14],
          ["Hands-on: build and check a real chain", 14]
        ]
      },
      {
        "title": "Module 5: Skills — Reusable Capabilities",
        "lectures": [
          ["What a Skill is, and who currently has access", 12],
          ["Persona, Method or Workspace? Custom GPT vs Skill vs Project", 12],
          ["What makes a good Skill", 13],
          ["How the three work together", 13]
        ]
      },
      {
        "title": "Module 6: Consistent Visual Identity — ChatGPT Images 2.0",
        "lectures": [
          ["Generate images with ChatGPT Images 2.0", 11],
          ["The Style Lock: keep a character, product or brand consistent", 11],
          ["Catch and fix style drift", 11],
          ["Build a reusable reference sheet", 11],
          ["Hands-on: create a matching 3-image set", 11]
        ]
      },
      {
        "title": "Module 7: Build and Publish a Live Site — ChatGPT Sites",
        "lectures": [
          ["What ChatGPT Sites is, and where it's available", 11],
          ["Define audience, purpose and main action before building", 11],
          ["Refine in a private preview, then publish with the right audience", 11],
          ["What ChatGPT doesn't handle once a site is live", 11],
          ["Hands-on: build and publish a real site", 11]
        ]
      },
      {
        "title": "Module 8: Vibe Coding — Apps and Games",
        "lectures": [
          ["Build interactive apps and games with Sites", 13],
          ["Define rules and win/lose conditions before building", 14],
          ["The Play Test: test the logic, not just the look", 14],
          ["Hands-on: build and play-test your own app", 14]
        ]
      },
      {
        "title": "Module 9: ChatGPT Work",
        "lectures": [
          ["How Work mode differs from regular Chat", 11],
          ["The Work Order: define the deliverable, link files, verify the output", 11],
          ["Review permissions before granting access to sensitive files", 11],
          ["How Work compares to similar agent tools", 11],
          ["Hands-on: run a real Work task", 11]
        ]
      },
      {
        "title": "Module 10: Codex — Repeatable Workflows",
        "lectures": [
          ["What Codex does, and what belongs in Work instead", 11],
          ["The Repo Loop: delegate coding tasks with review before anything merges", 11],
          ["Codex's four access options: CLI, IDE extension, cloud and more", 11],
          ["Set up background or scheduled coding tasks", 11],
          ["Hands-on: run a scoped Codex task", 11]
        ]
      },
      {
        "title": "Module 11: Deep Research",
        "lectures": [
          ["Scope your research question precisely", 13],
          ["Access limits and usage caps", 14],
          ["The Source Check: judge source quality, not just count citations", 14],
          ["Turn findings into a structured, actionable brief", 14]
        ]
      },
      {
        "title": "Module 12: Data Analysis",
        "lectures": [
          ["Segment, Trace, Correlate Carefully, Brief", 12],
          ["Find the real story behind a misleading average", 12],
          ["Trace a wrong number to its root cause", 12],
          ["Chart relationships carefully: correlation isn't proof", 12],
          ["Hands-on: run a full data analysis", 12]
        ]
      },
      {
        "title": "Module 13: Your ChatGPT Mastery Recap",
        "lectures": [
          ["The 12-word summary, one word per module", 8],
          ["A quick-reference map of every framework", 8],
          ["The four corrections this course made, and why they matter", 8],
          ["The one habit worth keeping: verify", 8],
          ["Final knowledge check", 8]
        ]
      }
    ],
    "requirements": [
      "Some experience using ChatGPT; no coding needed for most modules",
      "A computer with a modern browser; the ChatGPT desktop app is recommended",
      "A paid ChatGPT plan (Plus or Pro) is recommended. Several features covered aren't available on Free or Go",
      "Plan and region limits to know before you buy:",
      "Creating new Custom GPTs: Team, Business or Enterprise accounts only (personal accounts can edit existing GPTs)",
      "Skills: Business, Enterprise and Edu workspaces only",
      "Sites: Plus, Pro and workspace plans only, not yet available in the EEA, Switzerland or the UK",
      "Deep Research and Codex usage depend on your plan",
      "Where you don't have access to a feature, each module gives you an alternative task"
    ],
    "audience": [
      "Professionals who already use ChatGPT and want to do much more with it",
      "Freelancers who want to build sites, tools and client deliverables faster",
      "Business owners who want connected workflows, briefs and automated tasks",
      "Analysts and managers who need research and data analysis they can trust",
      "Students and developers who want to build apps and use Codex"
    ],
    "description": [
      "Your job may not disappear. But the way you do it can change fast.",
      "Research is changing. Analysis is changing. Website creation is changing. Coding is changing. Content creation is changing. Connected workflows are changing. AI is moving beyond simply answering questions.",
      "So stop asking only, \"Can ChatGPT help me write this?\" Start asking, \"What else can I get done with ChatGPT?\"",
      "This course teaches you to use ChatGPT as a complete work system, building real, usable output in every module.",
      "Learn to:",
      "• 🛠️ BUILD Custom GPTs, live websites, apps and games",
      "• 🔗 CONNECT your tools with Apps and Actions, and chain them together",
      "• 🎨 CREATE consistent images for your brand",
      "• 💻 CODE with Codex, with proper review",
      "• 🔎 RESEARCH with Deep Research and source checks",
      "• 📊 ANALYSE data and find the real story",
      "• ⚡ AUTOMATE complete tasks with ChatGPT Work and scheduled jobs",
      "You learn alongside Karan, who runs operations at a small business, plus Ritika, a student, and Takshika, who designs training programmes, as they build real output with ChatGPT.",
      "Every module gives you a simple framework, real worked examples showing the exact prompt and result, and a hands-on task on your own work. The course also tells you honestly which features need which plan, so you know what you can use before you start.",
      "Don't wait until your manager, client or next role expects more than basic AI skills. Learn before you're expected to know it."
    ],
    "includes": [
      "13 modules, about 11.5 hours of learning",
      "61 lessons with click-by-click instructions",
      "43 worked prompt examples showing the exact prompt and the real result",
      "12 hands-on \"Your turn\" tasks on your own work",
      "80+ knowledge-check activities (multiple choice, ordering, fill-in-the-blanks and more)",
      "A simple, memorable framework for every skill",
      "Real examples for professionals, freelancers, students and business owners in every module",
      "A final recap with a quick-reference map",
      "Certificate of completion"
    ],
    "level": "Intermediate to Advanced",
    "language": "English"
  },
  "omni-basics": {
    "subtitle": "Direct cinematic AI video with Gemini Omni: plan, prompt and direct real videos, control the camera, lighting and sound, keep characters and products consistent, and connect scenes into a complete short story.",
    "learn": [
      "Understand what Gemini Omni is, how it differs from earlier tools like Veo, and when to use it",
      "Generate your first video and refine it conversationally, without starting over",
      "Write strong video prompts with the Director's Blueprint: subject, action, setting and style",
      "Direct camera movement: pan, dolly and tracking shots, and when each one fits",
      "Set the mood with lighting: golden hour, soft window light, cinematic and neon",
      "Turn still photos into moving video, directing exactly what moves",
      "Direct sound: ambient audio, sound effects and dialogue, layered together",
      "Keep the same character or product consistent across multiple videos",
      "Create smooth transitions with start and end frames",
      "Plan multi-scene stories with storyboards and control the total length",
      "Use AI video responsibly: consent, honest labelling and copyright"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Gemini Omni & When to Use It",
        "lectures": [
          ["What Gemini Omni is, in plain words", 6],
          ["How it differs from earlier video tools like Veo", 6],
          ["What \"intelligent\" video generation really means", 6],
          ["What Omni is good for, and what you need before you start", 7]
        ]
      },
      {
        "title": "Module 2: Getting Started — Access, Interface & Your First Video",
        "lectures": [
          ["Turn on Omni in the Gemini app (\"Create Videos\")", 7],
          ["Generate your first video from a plain-English prompt", 7],
          ["Refine it conversationally in the same session", 8],
          ["Google AI Plus vs Pro vs Ultra", 8]
        ]
      },
      {
        "title": "Module 3: The Director's Blueprint — Better Video Prompts",
        "lectures": [
          ["The cost of a vague prompt", 7],
          ["The four Blueprint elements: subject, action, setting, style", 7],
          ["Why style shapes the whole feeling of a video", 8],
          ["Hands-on: build a complete Blueprint prompt", 8]
        ]
      },
      {
        "title": "Module 4: Camera Movement — Pan, Dolly & Tracking",
        "lectures": [
          ["Why camera movement changes how a video feels", 6],
          ["Direct a pan shot", 6],
          ["Direct a dolly shot", 6],
          ["Direct a tracking shot", 6],
          ["Choose the right movement for each scene", 6]
        ]
      },
      {
        "title": "Module 5: Lighting & Mood",
        "lectures": [
          ["How light shapes atmosphere", 5],
          ["Golden hour lighting", 5],
          ["Soft window light", 5],
          ["Cinematic lighting", 5],
          ["Neon and other moods", 5],
          ["Choose the right lighting for the mood you want", 5]
        ]
      },
      {
        "title": "Module 6: Bringing Photos to Life — Image-to-Video",
        "lectures": [
          ["Turn a still photo into a moving video", 6],
          ["Direct specific motion instead of leaving it to chance", 6],
          ["Animate personal photos thoughtfully", 6],
          ["Professional uses, such as product videos", 6],
          ["Hands-on: animate a photo of your own", 6]
        ]
      },
      {
        "title": "Module 7: Directing Sound — Ambient, Dialogue & Effects",
        "lectures": [
          ["Why directing audio matters", 6],
          ["Ambient sound to set the scene", 6],
          ["Sound effects for action", 6],
          ["Dialogue", 6],
          ["Layer several audio elements together", 6]
        ]
      },
      {
        "title": "Module 8: Keeping Subjects Consistent — Characters & Products",
        "lectures": [
          ["Why a character's face and look change between videos", 6],
          ["Keep a character consistent by staying in the same session", 6],
          ["Build a consistent product video series with reference images", 6],
          ["What makes a strong reference image", 6],
          ["Hands-on: build a consistent video series", 6]
        ]
      },
      {
        "title": "Module 9: Transitions — Start and End Frames",
        "lectures": [
          ["Direct a transition with a start frame", 8],
          ["Control exactly where a video ends", 8],
          ["Why this matters when connecting several clips", 9]
        ]
      },
      {
        "title": "Module 10: Planning Your Story — Storyboards & Pacing",
        "lectures": [
          ["Ask Gemini for a storyboard before generating", 6],
          ["Control total video length across scenes", 6],
          ["Combine several scenes into one sequence", 6],
          ["Audio when combining scenes", 6],
          ["Hands-on: plan and generate a multi-scene story", 6]
        ]
      },
      {
        "title": "Module 11: Combining Techniques into Workflows",
        "lectures": [
          ["Decision guide: start from text or an image?", 7],
          ["Decision guide: which camera and lighting?", 7],
          ["Decision guide: single clip or planned sequence?", 8],
          ["When a simple prompt is enough", 8]
        ]
      },
      {
        "title": "Module 12: Professional Use Cases",
        "lectures": [
          ["Video workflow: student", 5],
          ["Video workflow: job seeker", 5],
          ["Video workflow: working professional", 5],
          ["Video workflow: business owner", 5],
          ["Video workflow: content creator", 5],
          ["Video workflow: freelancer or consultant", 5]
        ]
      },
      {
        "title": "Module 13: Responsible Use & Safety",
        "lectures": [
          ["Gemini Omni's honest limitations", 6],
          ["Consent before showing a real person", 6],
          ["Avoiding misleading content, and labelling AI video", 6],
          ["Copyright before commercial use", 7]
        ]
      },
      {
        "title": "Module 14: Capstone — Direct and Produce a Short Video",
        "lectures": [
          ["Phase 1: plan your story", 7],
          ["Phase 2: direct the first scene", 6],
          ["Phase 3: add camera and lighting direction", 6],
          ["Phase 4: direct sound", 6],
          ["Phase 5: keep characters and products consistent", 7],
          ["Phase 6: connect scenes with transitions", 7],
          ["Phase 7: final check and responsible review", 6]
        ]
      },
      {
        "title": "Bonus: Gemini Omni Prompt Library",
        "lectures": [
          ["67 ready-to-use video prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No video or AI experience needed",
      "A computer or phone with the Gemini app or gemini.google.com",
      "A Google account",
      "A paid Google AI plan (Plus, Pro or Ultra). Gemini Omni video generation isn't available on the free plan",
      "A few of your own photos for the image-to-video module"
    ],
    "audience": [
      "Beginners who want to create AI videos that look intentional, not random",
      "Content creators making Reels, Shorts and social video",
      "Small business owners who want product and promotional videos without a film crew",
      "Marketers creating campaign videos quickly",
      "Students and job seekers who want creative portfolio pieces"
    ],
    "description": [
      "Great AI video. But can you direct it?",
      "Typing \"make a video of…\" gives you a random clip. Directing gives you the video you actually had in mind, with the right camera movement, the right light, the right sound, and the same character or product from one clip to the next.",
      "This course teaches you to direct AI video with Gemini Omni, step by step.",
      "What you'll learn:",
      "• 🎬 The Director's Blueprint: subject, action, setting, style",
      "• 🎥 Camera movement: pan, dolly, tracking",
      "• 💡 Lighting and mood: golden hour, window light, cinematic, neon",
      "• 🖼️ Image-to-video: bring photos and products to life",
      "• 🎙️ Sound: ambient audio, effects and dialogue",
      "• 👤 Consistency: the same character and product across clips",
      "• 🔄 Transitions: start and end frames",
      "• 📖 Storyboards: plan and pace multi-scene stories",
      "Prompt → Direct → Light → Sound → Consistency → Transition → Story",
      "Every module includes practice prompts you run in Gemini Omni straight away, plus a \"Your turn\" task. The course ends with a capstone where you direct and produce your own short video from idea to finished sequence.",
      "Don't just generate a clip. Learn to direct the video."
    ],
    "includes": [
      "14 modules, about 7 hours of learning (25–45 minutes per module)",
      "67 lessons explained in plain language",
      "33 guided video prompts you run in Gemini Omni as you learn",
      "19 hands-on \"Your turn\" tasks",
      "Ready-made video workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone: direct and produce your own short video",
      "Knowledge checks in every module",
      "A prompt library with 67 ready-to-use video prompts",
      "Certificate of completion"
    ],
    "level": "Beginner to Intermediate",
    "language": "English"
  },
  "mj-entry": {
    "subtitle": "Learn Midjourney V8.1 step by step: write precise prompts, control framing and light, adjust style, build your own visual look, keep characters consistent, refine without restarting, and turn images into short videos.",
    "learn": [
      "Understand what Midjourney is, what's new in V8.1, and when to use it",
      "Find your way around the Midjourney web app and use Vary Subtle, Vary Strong and Animate",
      "Structure prompts with subject, setting and specific detail, and avoid common mistakes",
      "Control the frame with aspect ratio and camera viewpoint",
      "Direct light: its direction, shadows and intensity",
      "Fine-tune results with Raw mode, Stylization and Weirdness",
      "Train personalization profiles and build moodboards that reflect your taste",
      "Create and reuse your own style with Style Creator and style references",
      "Explore ideas fast with Draft Mode, and get native 2K HD images",
      "Test several creative directions at once with Permutations",
      "Keep the same character across different scenes with Omni Reference",
      "Refine images with Remix instead of starting over",
      "Animate still images into short video clips, up to about 21 seconds",
      "Use AI images responsibly: consent, honest labelling and copyright"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Midjourney & When to Use It",
        "lectures": [
          ["What Midjourney is, in plain words", 7],
          ["What's new in the V8.1 model", 6],
          ["When to use Midjourney over other tools", 6],
          ["What you need before your first image", 6]
        ]
      },
      {
        "title": "Module 2: Getting Started: Interface, First Image & Plans",
        "lectures": [
          ["The three main areas of the web app", 8],
          ["Generate your first image and read the four-image grid", 8],
          ["Vary Subtle, Vary Strong and Animate", 7],
          ["The four plans compared: Basic, Standard, Pro, Mega", 7]
        ]
      },
      {
        "title": "Module 3: Prompting Fundamentals",
        "lectures": [
          ["Prompt structure: subject, setting and detail", 8],
          ["Replace vague words with specific ones", 8],
          ["Why \"no\" instructions can add the thing you don't want", 7],
          ["Fix a prompt that gave an unexpected result", 7]
        ]
      },
      {
        "title": "Module 4: Composition: Aspect Ratio & Viewpoint",
        "lectures": [
          ["Choose the right aspect ratio for where the image will be used", 8],
          ["Compare one prompt across different aspect ratios", 8],
          ["Direct the camera viewpoint", 7],
          ["How viewpoint changes the emotion of an image", 7]
        ]
      },
      {
        "title": "Module 5: Lighting: Direction, Shadows & Intensity",
        "lectures": [
          ["Direct where the light comes from", 8],
          ["Control shadow contrast and length", 8],
          ["Set light intensity for different moods", 7],
          ["Combine lighting with subject and setting", 7]
        ]
      },
      {
        "title": "Module 6: Parameters: Raw Mode, Stylization & Weirdness",
        "lectures": [
          ["Raw mode for literal, less stylised results", 8],
          ["Stylization: how much artistic interpretation to apply", 8],
          ["Weirdness: push toward unusual results", 7],
          ["How these settings work with personalization", 7]
        ]
      },
      {
        "title": "Module 7: Personalization: Profiles & Moodboards",
        "lectures": [
          ["Why personalization matters more in V8.1", 8],
          ["Train a profile by rating images", 8],
          ["Separate profiles for different projects", 7],
          ["Build a moodboard to guide a project's look", 7]
        ]
      },
      {
        "title": "Module 8: Style References",
        "lectures": [
          ["Build a custom style with Style Creator", 8],
          ["Apply a style reference to a new prompt", 8],
          ["Reuse a style across a new project", 7],
          ["Style references are now stable in V8.1", 7]
        ]
      },
      {
        "title": "Module 9: Draft Mode & HD",
        "lectures": [
          ["How Draft Mode's role has changed in V8.1", 7],
          ["Explore ideas quickly and cheaply", 6],
          ["Native 2K HD as the default", 6],
          ["Choose the right speed vs quality trade-off", 6]
        ]
      },
      {
        "title": "Module 10: Permutations: Test Several Directions at Once",
        "lectures": [
          ["What Permutations do", 7],
          ["Build a permutation prompt", 6],
          ["Read the result grid", 6],
          ["Pick variables worth testing", 6]
        ]
      },
      {
        "title": "Module 11: Character Consistency: Omni Reference",
        "lectures": [
          ["Set up a character as a reference", 8],
          ["Reuse the same character in different scenes", 8],
          ["Adjust reference weight to protect the character's identity", 7],
          ["Build a consistent character series for stories", 7]
        ]
      },
      {
        "title": "Module 12: Remix & Iterative Refinement",
        "lectures": [
          ["Edit the prompt behind an existing image with Remix", 7],
          ["When Remix beats starting over", 6],
          ["Run a deliberate second pass", 6],
          ["Build a habit of refining, not one-shot generating", 6]
        ]
      },
      {
        "title": "Module 13: Image to Video",
        "lectures": [
          ["Animate a still image into a short clip", 9],
          ["Extend a clip up to about 21 seconds", 8],
          ["What works well, and current limits", 8]
        ]
      },
      {
        "title": "Module 14: Combining Features into Workflows",
        "lectures": [
          ["Decision guide: explore fast or commit to full quality?", 8],
          ["Decision guide: one-off image or consistent series?", 8],
          ["Decision guide: still or moving?", 7],
          ["Chain several features into one project", 7]
        ]
      },
      {
        "title": "Module 15: Professional Use Cases",
        "lectures": [
          ["Student workflow", 5],
          ["Job seeker workflow", 5],
          ["Working professional workflow", 5],
          ["Business owner workflow", 5],
          ["Content creator workflow", 5],
          ["Freelancer or consultant workflow", 5]
        ]
      },
      {
        "title": "Module 16: Responsible Use & Safety",
        "lectures": [
          ["Midjourney's honest limitations", 7],
          ["Consent before showing a real person", 6],
          ["Avoiding misleading images, and labelling AI content", 6],
          ["Copyright before commercial use", 6]
        ]
      },
      {
        "title": "Module 17: Capstone: Design a Visual Campaign",
        "lectures": [
          ["Phase 1: frame your campaign", 7],
          ["Phase 2: explore with Draft Mode", 7],
          ["Phase 3: direct composition and lighting", 7],
          ["Phase 4: set a consistent style", 6],
          ["Phase 5: refine through iteration", 6],
          ["Phase 6: add motion", 6],
          ["Phase 7: final check and responsible review", 6]
        ]
      },
      {
        "title": "Bonus: Midjourney Prompt Library",
        "lectures": [
          ["65 ready-to-use prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No art, design or AI experience needed",
      "A computer or phone with a modern browser",
      "A paid Midjourney subscription. Midjourney has no free plan; plans start with Basic at about US$10/month",
      "Check Midjourney's current pricing before subscribing, as it can change"
    ],
    "audience": [
      "Complete beginners who want to create AI images with real control",
      "Content creators who want striking visuals and consistent characters for their channels",
      "Small business owners who want product and campaign images without a photoshoot",
      "Marketers who need on-brand visuals quickly",
      "Students and job seekers who want a creative portfolio project"
    ],
    "description": [
      "Not just prompts. This is what you'll actually control.",
      "Anyone can generate an AI image. Can you control the result? Stop hoping for a great generation, and learn how to direct one.",
      "What you'll control:",
      "• Prompts: structure, precision and common pitfalls",
      "• The frame: composition, aspect ratio and viewpoint",
      "• The light: direction, shadows and intensity",
      "• The output: Raw mode, Stylization and Weirdness",
      "• Your visual style: personalization, profiles, moodboards and style references",
      "• Faster exploration: Draft Mode, HD and Permutations",
      "• Consistent characters: Omni Reference for stories and visual series",
      "• Refinement: Remix and iterative improvement",
      "• Motion: image-to-video",
      "• Real work: combined workflows, professional use cases and responsible creation",
      "Prompt → Compose → Light → Style → Control → Consistency → Refine → Animate",
      "Every module includes practice prompts you run in Midjourney straight away, plus a \"Your turn\" task. The course ends with a capstone where you design and produce your own complete visual campaign.",
      "Stop hoping for a great generation. Learn how to direct one."
    ],
    "includes": [
      "17 modules, about 8 hours of learning (25–45 minutes per module)",
      "68 lessons explained in plain language",
      "41 guided Midjourney prompts you run as you learn",
      "22 hands-on \"Your turn\" tasks",
      "Ready-made creative workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone: design and produce your own visual campaign",
      "Knowledge checks in every module",
      "A prompt library with 65 ready-to-use Midjourney prompts",
      "Certificate of completion"
    ],
    "level": "Beginner",
    "language": "English"
  },
  "kling-basics": {
    "subtitle": "Learn Kling AI from the ground up: write directed prompts with the 5W1H formula, generate images and videos, control the camera and motion, build talking AI avatars, and bring it all together in Kling Canvas.",
    "learn": [
      "Understand what Kling AI is: one platform for images, video and AI avatars",
      "Find your way around Kling's sidebar and top bar, and create your first image and video",
      "Write directed prompts with Kling's 5W1H formula (who, what, where, when, why, how)",
      "Turn rough ideas into professional prompts with DeepSeek, built into Kling, and use the Inspiration Word Bank",
      "Generate images and variations for real professional uses",
      "Edit images without starting over, apply style transfer, and keep a logo or brand element consistent",
      "Create videos two ways, from text and from an image, and control duration and shot type",
      "Direct shot types and camera movement like a filmmaker",
      "Use Motion Control for precise camera paths, speed and movement copied from a reference video",
      "Build a talking AI avatar from a photo and a script, with accurate lip-sync, in videos up to 5 minutes",
      "Combine images and video clips in one project with Kling Canvas",
      "Use AI video responsibly: consent, honest labelling and commercial use"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Kling AI & When to Use It",
        "lectures": [
          ["What Kling AI is, in plain words", 7],
          ["One platform, three outputs: images, video and avatars", 6],
          ["When Kling is the right choice", 6],
          ["What you need before you start", 6]
        ]
      },
      {
        "title": "Module 2: Getting Started: Interface, First Image & Plans",
        "lectures": [
          ["The five sidebar items and five top-bar tools", 8],
          ["Generate your first image", 8],
          ["Turn that image into your first video", 7],
          ["How to check current pricing before choosing a plan", 7]
        ]
      },
      {
        "title": "Module 3: Prompting Fundamentals: The 5W1H Formula",
        "lectures": [
          ["Why a bare prompt leaves results to chance", 8],
          ["Build a prompt with 5W1H: who, what, where, when, why, how", 8],
          ["Rebuild a vague prompt into a fully directed one", 7],
          ["Use the formula flexibly, not rigidly", 7]
        ]
      },
      {
        "title": "Module 4: DeepSeek Inside Kling: AI-Assisted Prompting",
        "lectures": [
          ["What the built-in DeepSeek assistant does", 7],
          ["Turn a rough idea into a professional prompt", 6],
          ["The Inspiration Word Bank for fine creative control", 6],
          ["When writing your own prompt is still better", 6]
        ]
      },
      {
        "title": "Module 5: Image Generation",
        "lectures": [
          ["Generate an image with a complete 5W1H prompt", 8],
          ["Create several variations from one prompt", 8],
          ["Images for real professional uses", 7],
          ["When to refine vs start a new prompt", 7]
        ]
      },
      {
        "title": "Module 6: Editing & Style Transfer",
        "lectures": [
          ["Make targeted edits without regenerating", 8],
          ["Change an image's visual style with style transfer", 8],
          ["Keep a logo or brand element consistent across edits", 7],
          ["When an edit beats a fresh prompt", 7]
        ]
      },
      {
        "title": "Module 7: Video Generation: Two Ways into a Video",
        "lectures": [
          ["Text-to-video", 8],
          ["Image-to-video", 8],
          ["When to use each", 7],
          ["Control duration and shot type", 7]
        ]
      },
      {
        "title": "Module 8: Camera & Shot Control",
        "lectures": [
          ["Shot types: close-up, medium, wide and more", 7],
          ["Camera movement within a video", 6],
          ["Combine shot type and movement in one request", 6],
          ["How camera choices shape the viewer's experience", 6]
        ]
      },
      {
        "title": "Module 9: Motion Control: Precise, Directed Movement",
        "lectures": [
          ["How Motion Control differs from standard video generation", 8],
          ["Direct exact camera path and speed", 8],
          ["Copy movement from a reference video", 7],
          ["When Motion Control is worth the extra setup", 7]
        ]
      },
      {
        "title": "Module 10: Building AI Avatars: Photo, Script & Speech",
        "lectures": [
          ["What Avatar 2.0 does: videos up to 5 minutes", 6],
          ["Build an avatar from a photo and a script", 6],
          ["Add speech with accurate lip-sync", 6],
          ["What to know about multilingual delivery", 6],
          ["A consistent, reusable presenter for multiple videos", 6]
        ]
      },
      {
        "title": "Module 11: Kling Canvas: Multi-Layer Creative Workspace",
        "lectures": [
          ["What Canvas solves", 7],
          ["Combine several generated assets in one project", 6],
          ["Arrange images and video clips together", 6],
          ["When a project needs Canvas", 6]
        ]
      },
      {
        "title": "Module 12: Combining Features into Workflows",
        "lectures": [
          ["Decision guide: image first, or straight to video?", 8],
          ["Decision guide: standard direction or Motion Control?", 8],
          ["Decision guide: single asset or Canvas project?", 7],
          ["Chain several features into one project", 7]
        ]
      },
      {
        "title": "Module 13: Professional Use Cases",
        "lectures": [
          ["Student workflow", 5],
          ["Job seeker workflow", 5],
          ["Working professional workflow", 5],
          ["Business owner workflow", 5],
          ["Content creator workflow", 5],
          ["Freelancer or consultant workflow", 5]
        ]
      },
      {
        "title": "Module 14: Responsible Use & Safety",
        "lectures": [
          ["Kling's honest limitations", 7],
          ["Consent before building an avatar of a real person", 6],
          ["Avoiding misleading content, and labelling AI content", 6],
          ["Commercial-use considerations", 6]
        ]
      },
      {
        "title": "Module 15: Capstone: Produce a Campaign or Story",
        "lectures": [
          ["Phase 1: frame your project", 7],
          ["Phase 2: explore with images", 7],
          ["Phase 3: refine with editing or style transfer", 7],
          ["Phase 4: produce the video", 6],
          ["Phase 5: add Motion Control or an avatar", 6],
          ["Phase 6: organise everything in Canvas", 6],
          ["Phase 7: final check and responsible review", 6]
        ]
      },
      {
        "title": "Bonus: Kling AI Prompt Library",
        "lectures": [
          ["68 ready-to-use prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No video, design or AI experience needed",
      "A computer with a modern browser (Kling runs in the browser, no download needed)",
      "A Kling AI account",
      "Kling's pricing changes often. Check the current plans on klingai.com before choosing one"
    ],
    "audience": [
      "Beginners who want to start creating AI video",
      "Content creators making Reels, Shorts and social videos",
      "Small business owners who want product videos and ads without a film crew",
      "Marketers who need video content and AI presenters quickly",
      "Students and job seekers who want creative portfolio projects"
    ],
    "description": [
      "Still creating static AI images? Make them move.",
      "Anyone can generate an AI image. Can you bring it to life? Kling AI lets you create images, turn them into cinematic video, direct the camera, and even build an AI presenter who speaks your script, all on one platform.",
      "This course takes you from your first prompt to a finished multi-asset project.",
      "What you'll learn:",
      "• Prompt with direction: the 5W1H formula, with DeepSeek built in",
      "• Create and refine images: generation, editing, style transfer",
      "• Turn ideas into video: text-to-video and image-to-video",
      "• Think like a director: shot types and camera movement",
      "• Control motion precisely: camera paths, speed and reference movement",
      "• Build AI avatars: photo + script + lip-synced speech",
      "• Bring it together: Kling Canvas",
      "• Create content that moves: social ads, product videos, Reels, brand content",
      "Idea → Prompt → Image → Video → Camera → Motion → Avatar → Final project",
      "Every module includes practice prompts you run in Kling straight away, plus a \"Your turn\" task. The course ends with a capstone where you produce your own campaign or story.",
      "Don't stop at the frame. Bring it to life."
    ],
    "includes": [
      "15 modules, about 7 hours 20 minutes of learning (25–45 minutes per module)",
      "69 lessons explained in plain language",
      "32 guided Kling prompts you run as you learn",
      "20 hands-on \"Your turn\" tasks",
      "Ready-made video workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone: produce your own campaign or story",
      "Knowledge checks in every module",
      "A prompt library with 68 ready-to-use Kling prompts",
      "Certificate of completion"
    ],
    "level": "Beginner",
    "language": "English"
  },
  "canva-ai": {
    "subtitle": "Learn Canva AI 2.0, Canva's new conversational design assistant: describe your idea and get a finished design, keep it on-brand, create videos and copy, and launch a complete campaign from one conversation.",
    "learn": [
      "Understand what Canva AI 2.0 is, and how it differs from the older Canva AI 1.0",
      "Create designs by describing your goal, instead of searching through templates",
      "Refine designs through back-and-forth conversation",
      "Change one element precisely without affecting the rest of the design (object-based editing)",
      "Generate and refine images in the style and aspect ratio you choose",
      "Teach Canva AI your style with the Memory Library and an \"About Me\" profile",
      "Keep every design on-brand automatically with Brand Intelligence, and update old designs to a refreshed brand",
      "Create a complete multi-piece campaign from one conversation (agentic orchestration)",
      "Turn a meeting transcript or content from connected apps into a finished design",
      "Ground designs in current facts with Web Research, including scheduled background research",
      "Generate video from text, animate still images, and add AI voiceovers",
      "Write, brainstorm and rewrite copy with Magic Write",
      "Build interactive elements (quizzes, calculators and more) with Canva Code 2.0, no coding needed",
      "Turn spreadsheet data into visuals with Sheets AI, and schedule recurring tasks",
      "Use Canva AI responsibly: consent, labelling and data privacy"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Canva AI & When to Use It",
        "lectures": [
          ["Canva AI: a creative partner built into the editor", 7],
          ["Canva AI 1.0 vs 2.0: the honest difference", 6],
          ["Which plans get which features", 6],
          ["When Canva AI is the right choice", 6]
        ]
      },
      {
        "title": "Module 2: Getting Started: The Conversational Interface",
        "lectures": [
          ["A tour of the Canva AI chat interface", 8],
          ["Generate your first design from a plain description", 8],
          ["Attach files to give Canva AI more context", 7],
          ["Return to past conversations", 7]
        ]
      },
      {
        "title": "Module 3: Conversational Design: Ideas, Not Templates",
        "lectures": [
          ["Describe your goal instead of a layout", 10],
          ["Refine through back-and-forth conversation", 10],
          ["Why describing intent gets better results", 10]
        ]
      },
      {
        "title": "Module 4: Object-Based Editing",
        "lectures": [
          ["Every generated element stays individually editable", 9],
          ["Change one element without affecting the rest", 8],
          ["Collaborate on a design mid-edit", 8]
        ]
      },
      {
        "title": "Module 5: Image Generation & Refinement",
        "lectures": [
          ["Generate standalone images with a chosen style and aspect ratio", 8],
          ["Refine by adding detail in conversation", 8],
          ["Use Canva AI's own suggestions to improve results", 7],
          ["Image mode vs full design generation", 7]
        ]
      },
      {
        "title": "Module 6: The Memory Library: Teaching Canva AI Your Style",
        "lectures": [
          ["What the Memory Library does", 8],
          ["Personalise Canva AI with your existing designs", 8],
          ["Build an \"About Me\" profile", 7],
          ["Update it without starting over", 7]
        ]
      },
      {
        "title": "Module 7: Brand Intelligence: Every Design On-Brand",
        "lectures": [
          ["Apply your brand automatically to new designs", 9],
          ["Update existing work to a refreshed brand", 8],
          ["Connect brand data instead of describing it each time", 8]
        ]
      },
      {
        "title": "Module 8: Agentic Orchestration: One Conversation, a Complete Campaign",
        "lectures": [
          ["Describe a multi-part goal and let Canva AI coordinate the tools", 10],
          ["Turn a rough sketch or brief into finished designs", 10],
          ["When orchestration is worth it", 10]
        ]
      },
      {
        "title": "Module 9: Connectors: Bringing In Your Real Work",
        "lectures": [
          ["What Connectors do", 7],
          ["Turn a meeting transcript into a finished design", 6],
          ["Pull content from a connected app into a new design", 6],
          ["Which connections are supported", 6]
        ]
      },
      {
        "title": "Module 10: Web Research: Designs Grounded in Current Facts",
        "lectures": [
          ["Research on demand inside a design request", 9],
          ["Schedule background research for ongoing needs", 8],
          ["When Web Research is worth the extra step", 8]
        ]
      },
      {
        "title": "Module 11: Video & Motion Generation",
        "lectures": [
          ["Generate a short video from a text description", 8],
          ["Add setting and tone to shape the clip", 8],
          ["Animate an existing still image", 7],
          ["Add an AI voiceover", 7]
        ]
      },
      {
        "title": "Module 12: Writing Tools: Magic Write & Conversational Copy",
        "lectures": [
          ["Generate copy from a plain description", 8],
          ["Set tone and length", 8],
          ["Brainstorm ideas with Magic Write", 7],
          ["Rewrite copy into a different format", 7]
        ]
      },
      {
        "title": "Module 13: Canva Code 2.0: Interactive Elements",
        "lectures": [
          ["Build interactive elements from a description, with no coding", 8],
          ["Refine them through conversation", 8],
          ["Start from ready-made templates", 7],
          ["Share and publish", 7]
        ]
      },
      {
        "title": "Module 14: Sheets AI & Scheduling",
        "lectures": [
          ["Work with spreadsheet data inside Canva", 7],
          ["Turn data into a visual design", 6],
          ["Schedule a recurring Canva AI task", 6],
          ["When automation is worth setting up", 6]
        ]
      },
      {
        "title": "Module 15: Combining Features into Workflows",
        "lectures": [
          ["Decision guide: new idea or existing context?", 8],
          ["Decision guide: one output or a coordinated set?", 8],
          ["Decision guide: one-off or recurring?", 7],
          ["Chain several features into one project", 7]
        ]
      },
      {
        "title": "Module 16: Professional Use Cases",
        "lectures": [
          ["Student workflow", 5],
          ["Job seeker workflow", 5],
          ["Working professional workflow", 5],
          ["Business owner workflow", 5],
          ["Content creator workflow", 5],
          ["Freelancer or consultant workflow", 5]
        ]
      },
      {
        "title": "Module 17: Responsible Use & Safety",
        "lectures": [
          ["Canva AI's honest limitations", 7],
          ["Consent before showing a real person", 6],
          ["How Canva labels AI-generated content", 6],
          ["Data considerations when connecting accounts", 6]
        ]
      },
      {
        "title": "Module 18: Capstone: Launch a Campaign from One Conversation",
        "lectures": [
          ["Phase 1: frame your campaign", 7],
          ["Phase 2: ground it in real context", 7],
          ["Phase 3: build the coordinated set", 7],
          ["Phase 4: apply your brand", 6],
          ["Phase 5: refine through conversation", 6],
          ["Phase 6: add motion or automation", 6],
          ["Phase 7: final check and responsible review", 6]
        ]
      },
      {
        "title": "Bonus: Canva AI Prompt Library",
        "lectures": [
          ["60 ready-to-use prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No design experience needed",
      "A computer with a modern browser",
      "A Canva account",
      "A paid Canva plan (Pro, Teams, Business or Nonprofit) is needed for full Canva AI 2.0 features, including the Memory Library and Connectors",
      "Canva Free and Education plans get Canva AI 1.0 only, with limited monthly use of Magic Write and Background Remover. You can follow the lessons, but not every feature will be available"
    ],
    "audience": [
      "Canva users who want to move beyond templates to AI-powered design",
      "Small business owners who want on-brand social posts, flyers and campaigns fast",
      "Content creators producing visuals and short videos regularly",
      "Marketers who need coordinated campaign assets quickly",
      "Students and job seekers who want polished projects and portfolios"
    ],
    "description": [
      "You know Canva. But do you know Canva AI?",
      "Canva has changed. With Canva AI 2.0, you don't start with a template. You start with a conversation. Describe what you need, and Canva AI builds it, edits it, keeps it on-brand, and can even produce a full campaign of matching pieces at once.",
      "This course shows you how to use it properly.",
      "What you'll learn:",
      "• Turn ideas into designs: conversational, prompt-to-design creation",
      "• Edit precisely: change any single element without starting over",
      "• Create AI visuals: images in your chosen style",
      "• Teach Canva your style: Memory Library and \"About Me\" profile",
      "• Keep your brand consistent: Brand Intelligence",
      "• Build whole campaigns: one conversation, many coordinated pieces",
      "• Use your real work: Connectors and Web Research",
      "• Move beyond static: video generation, animation and AI voiceovers",
      "• Write with AI: Magic Write for copy, brainstorming and rewriting",
      "• Go interactive: Canva Code 2.0",
      "• Design with data: Sheets AI and scheduled tasks",
      "Idea → Generate → Design → Edit → Brand → Publish",
      "Every module includes practice prompts you run in Canva AI straight away, plus a \"Your turn\" task. The course ends with a capstone where you launch a complete campaign from a single conversation.",
      "Stop designing everything manually. Learn to turn ideas into polished content with Canva AI."
    ],
    "includes": [
      "18 modules, about 8 hours 40 minutes of learning (25–45 minutes per module)",
      "74 lessons explained in plain language",
      "39 guided Canva AI prompts you run as you learn",
      "23 hands-on \"Your turn\" tasks",
      "Ready-made design workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone: launch a complete campaign from one conversation",
      "Knowledge checks in every module",
      "A prompt library with 60 ready-to-use Canva AI prompts",
      "Certificate of completion"
    ],
    "level": "Beginner to Intermediate",
    "language": "English"
  },
  "gemini": {
    "subtitle": "Master Google Gemini beyond chat: combine documents into one answer, run Deep Research, build web pages in Canvas, create and edit images with Nano Banana, make music with Lyria, build custom Gems, automate Google Workspace, and talk to Gemini Live.",
    "learn": [
      "Understand what makes Gemini different: it connects information from many files and formats into one answer",
      "Attach several files at once and ask one connected question, then check the answer against your sources",
      "Write strong prompts with role, context and constraints",
      "Turn scattered notes into a polished draft, adjust tone, and get feedback on your own writing",
      "Pull exactly what you need from long documents, and compare several documents at once",
      "Run Deep Research reports, then turn them into an Audio Overview, a Canvas page or a quiz",
      "Build web pages and simple tools in Canvas, and fix code by describing the problem in plain English",
      "Create and edit images by talking to Gemini (Nano Banana), keeping a character consistent across images",
      "Make original music from a description or an image with Lyria, free on the Gemini app",
      "Use ready-made Gems, and build your own custom assistant with saved instructions",
      "Chain research, writing and visuals into one repeatable workflow",
      "Use Gemini inside Gmail, Docs, Sheets and Drive: create documents, analyse spreadsheets without formulas, and search your files",
      "Talk to Gemini Live hands-free in 45+ languages, and share your camera or screen",
      "Know Gemini's limits, protect confidential information, and verify AI content"
    ],
    "sections": [
      {
        "title": "Module 1: What Is Gemini & When to Use It",
        "lectures": [
          ["Not just a chatbot: a tool that combines information", 7],
          ["Why connecting information matters", 6],
          ["When Gemini is the right tool, and when something else fits better", 6],
          ["What's free before you pay for anything", 6]
        ]
      },
      {
        "title": "Module 2: Getting Started — Signup, Interface & Plans",
        "lectures": [
          ["Sign in and tour the screen", 8],
          ["Attach several files and ask one connected question", 8],
          ["Free vs Google AI Pro vs Google AI Ultra", 7],
          ["Check sources before trusting an important answer", 7]
        ]
      },
      {
        "title": "Module 3: The Core Synthesis Loop",
        "lectures": [
          ["Gather → Attach → Ask → Verify", 8],
          ["Prepare inputs so Gemini can connect them", 8],
          ["Ask connecting questions, not just \"summarise\"", 7],
          ["Check answers against the original sources", 7]
        ]
      },
      {
        "title": "Module 4: Writing Powerful Prompts — Role, Context, Constraints",
        "lectures": [
          ["How a role changes the answer", 8],
          ["Add context from your real situation", 8],
          ["Combine role, context and constraints", 7],
          ["When a plain question is enough", 7]
        ]
      },
      {
        "title": "Module 5: Writing & Editing with Confidence",
        "lectures": [
          ["Turn scattered notes into a structured draft", 8],
          ["Adapt tone and audience", 8],
          ["Get honest feedback on your own writing", 7],
          ["Expanding vs correcting content", 7]
        ]
      },
      {
        "title": "Module 6: Working with Large Documents",
        "lectures": [
          ["Pull out only the relevant information", 9],
          ["Structure findings in a usable format", 8],
          ["Analyse several large documents together", 8]
        ]
      },
      {
        "title": "Module 7: Deep Research",
        "lectures": [
          ["What happens during a Deep Research run", 8],
          ["Free vs paid limits (about 5 reports a month on the free plan)", 8],
          ["Turn a report into an Audio Overview, Canvas page or quiz", 7],
          ["Visual exploration (Ultra plan only)", 7]
        ]
      },
      {
        "title": "Module 8: Canvas — Code, Web Pages & Documents",
        "lectures": [
          ["Build a web page from a plain-English description", 8],
          ["Fix code problems without coding knowledge", 8],
          ["Edit code with plain-English instructions", 7],
          ["Use images and files as input for web building", 7]
        ]
      },
      {
        "title": "Module 9: Creating & Editing Images — Nano Banana",
        "lectures": [
          ["Generate images and edit them by talking", 6],
          ["Keep a character consistent across images", 6],
          ["Nano Banana vs Nano Banana Pro", 6],
          ["Text and infographics, and an honest limitation", 6],
          ["Google's guidance on verifying generated images", 6]
        ]
      },
      {
        "title": "Module 10: Creating Music — Lyria",
        "lectures": [
          ["Generate a track from a description or an image", 7],
          ["Genre, vocal/instrumental and length controls", 6],
          ["What's free right now", 6],
          ["What to know about commercial use", 6]
        ]
      },
      {
        "title": "Module 11: Gems — Your Own Custom Assistant",
        "lectures": [
          ["Use ready-made Gems for recurring tasks", 8],
          ["Create your own Gem with saved instructions", 8],
          ["Give a Gem the right tools for its job", 7],
          ["What free accounts can and can't do", 7]
        ]
      },
      {
        "title": "Module 12: Multi-Step Workflows",
        "lectures": [
          ["Chain research, writing and visuals into one workflow", 10],
          ["Build a workflow you can reuse", 10],
          ["When chaining is worth the extra steps", 10]
        ]
      },
      {
        "title": "Module 13: Google Workspace Automation — Docs, Sheets, Drive",
        "lectures": [
          ["Create a document from a plain description", 8],
          ["Analyse spreadsheet data without formulas", 8],
          ["Search and reason across your Drive files", 7],
          ["Build a reusable automation for a recurring task", 7]
        ]
      },
      {
        "title": "Module 14: Gemini Live & Voice",
        "lectures": [
          ["Start a voice conversation with Gemini Live", 7],
          ["Share your camera or screen live", 6],
          ["45+ languages supported", 6],
          ["When talking beats typing", 6]
        ]
      },
      {
        "title": "Module 15: Combining Features into Workflows",
        "lectures": [
          ["Decision guide: chat, Live or Workspace?", 10],
          ["Decision guide: Canvas, Nano Banana or Lyria?", 10],
          ["Decision guide: how much research depth?", 10]
        ]
      },
      {
        "title": "Module 16: Professional Use Cases",
        "lectures": [
          ["Workflow: Student", 5],
          ["Workflow: Job seeker", 5],
          ["Workflow: Working professional", 5],
          ["Workflow: Business owner", 5],
          ["Workflow: Content creator", 5],
          ["Workflow: Freelancer or consultant", 5]
        ]
      },
      {
        "title": "Module 17: Responsible AI & Limitations",
        "lectures": [
          ["Gemini's honest limits across text, images and audio", 7],
          ["When you need a qualified human", 6],
          ["Handling confidential information, especially in Workspace", 6],
          ["Citing AI-assisted work properly", 6]
        ]
      },
      {
        "title": "Module 18: Capstone — Build a Complete Multimedia Deliverable",
        "lectures": [
          ["Phase 1: frame your project", 7],
          ["Phase 2: gather and synthesise materials", 7],
          ["Phase 3: draft written content", 7],
          ["Phase 4: create a visual", 6],
          ["Phase 5: add audio", 6],
          ["Phase 6: build a reusable Gem", 6],
          ["Phase 7: final verification", 6]
        ]
      },
      {
        "title": "Bonus: Gemini Prompt Library",
        "lectures": [
          ["126 ready-to-use prompts, filterable by category and audience", 5]
        ]
      }
    ],
    "requirements": [
      "No AI experience needed",
      "A computer or phone with a browser or the Gemini app",
      "A free Google account",
      "The free plan covers most of the course: Gemini Live, basic image generation, Lyria music, Canvas, Workspace file access and about 5 Deep Research reports a month",
      "Some features need Google AI Pro or higher: creating your own Gems, Nano Banana Pro and higher Deep Research limits. Visual exploration needs Google AI Ultra"
    ],
    "audience": [
      "Gemini users who want to go far beyond basic questions",
      "Students who want faster research, better writing and study aids",
      "Working professionals who use Google Workspace every day",
      "Business owners who want research, content, visuals and automation in one tool",
      "Content creators who want images, music and written content from one place"
    ],
    "description": [
      "Still using Gemini just to ask questions?",
      "Ask a question. Write an email. Summarise something. Generate some ideas. That's useful, but it's only one part of what Gemini can do.",
      "What if the same AI could help you:",
      "• Combine notes, PDFs and images into one connected answer",
      "• Run deeper research, with a full report",
      "• Build web pages and prototypes in Canvas",
      "• Create and edit images by talking",
      "• Create original music",
      "• Build your own specialised assistant",
      "• Work inside Gmail, Docs, Sheets and Drive",
      "• Talk naturally and show it what you're seeing",
      "Welcome to Gemini Deep Dive. This practical course takes you beyond basic prompting and into Gemini's most useful capabilities, step by step.",
      "Research → Write → Build → Create → Automate → Talk",
      "Every module includes practice prompts you run in Gemini straight away, plus a \"Your turn\" task. The course ends with a capstone where you build a complete project with text, visuals and audio.",
      "From business idea to creative output. Master Gemini beyond chat."
    ],
    "includes": [
      "18 modules, about 8 hours 50 minutes of learning (25–45 minutes per module)",
      "80 lessons explained in plain language",
      "35 guided Gemini prompts you run as you learn",
      "22 hands-on \"Your turn\" tasks",
      "Ready-made workflows for 6 roles: student, job seeker, professional, business owner, content creator and freelancer",
      "A 7-phase capstone: build a complete multimedia project with text, images and audio",
      "Knowledge checks in every module",
      "A prompt library with 126 ready-to-use Gemini prompts",
      "Certificate of completion"
    ],
    "level": "Beginner to Intermediate",
    "language": "English"
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
