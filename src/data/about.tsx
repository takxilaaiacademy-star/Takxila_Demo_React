import type { ReactNode } from 'react';

/**
 * The "About TAKXILA" story on the About Us page. Edit the words here.
 * Wrap words in <b>…</b> to make them bold. A `quote` is shown as a highlighted callout.
 */
export interface AboutBlock {
  heading: string;
  paras: ReactNode[];
  quote?: string;
}

export const ABOUT_TAGLINE = 'Learn AI. Practice AI. Think in Frameworks. Become AI-Ready.';

export const ABOUT_STORY: AboutBlock[] = [
  {
    heading: 'Learn AI. Practice AI. Think in Frameworks. Become AI-Ready.',
    paras: [
      <>
        TAKXILA is a next-generation AI learning platform built with one clear purpose: <b>to make you truly AI-ready—not just familiar with a few AI tools.</b>
      </>,
      <>
        The world of AI is changing every day. New tools are launched, existing tools evolve, and today's popular platform may be replaced by something better tomorrow. That
        is why TAKXILA takes a different approach to AI education. Instead of teaching you only <b>which buttons to click in a particular tool</b>, many of our courses focus on{' '}
        <b>framework-based learning</b>—helping you understand how to think, prompt, structure, analyze, automate and solve real-world problems with AI.
      </>,
    ],
    quote: 'Tools may change. Frameworks stay.',
  },
  {
    heading: '',
    paras: [
      <>
        Once you understand the right frameworks, you are not dependent on one AI platform. You can confidently adapt your knowledge across ChatGPT, Claude, Gemini, Perplexity,
        DeepSeek and the next generation of AI tools that have not even arrived yet.
      </>,
    ],
  },
  {
    heading: 'Learning by Doing, Not Just Watching',
    paras: [
      <>
        Watching videos does not make someone skilled at AI. <b>Using AI does.</b>
      </>,
      <>
        That is why hands-on practice is built into the TAKXILA learning experience. Throughout our courses, learners are encouraged to apply concepts through practical prompts,
        exercises, challenges, real-world use cases and projects. You don't simply learn what an AI feature does—you learn <b>when to use it, why to use it and how to apply it effectively.</b>
      </>,
      <>
        Our courses are designed for students, job seekers, working professionals, entrepreneurs, business owners and anyone who wants to use AI confidently in real life.
      </>,
    ],
  },
  {
    heading: 'Become AI-Ready for the Future of Work',
    paras: [
      <>
        AI is transforming almost every profession. The question is no longer whether AI will affect your work—the question is <b>how prepared you are to work alongside it.</b>
      </>,
      <>
        TAKXILA helps you develop practical AI capabilities that can make you more productive, adaptable and valuable in a rapidly changing workplace. While no course can guarantee
        protection from layoffs or job disruption, continuously upgrading your AI skills can help you stay competitive and prepared for emerging opportunities.
      </>,
      <>
        Our goal is to help you move from simply knowing about AI to <b>actually using AI as part of the way you work, create, research, communicate, analyze and solve problems.</b>
      </>,
      <>
        Whether you are beginning your AI journey or upgrading your existing skills, TAKXILA gives you a structured path to <b>learn, practice, apply and evolve.</b>
      </>,
    ],
    quote: "Don't just learn today's AI tools. Learn how to adapt to tomorrow's AI world.",
  },
];

export const ABOUT_SIGNOFF = { brand: 'TAKXILA™', line: 'Master the AI frameworks. Own the AI future.' };
