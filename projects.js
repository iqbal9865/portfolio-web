// Portfolio content. works.js renders the Works section and the case studies from this list.
//
// Order matters: featured projects appear as large rows (in this order), the rest as cards.
// Every field below `tagline` is optional. Leave a field out and its part of the case study
// is simply not shown, so add details whenever you have them:
//   role, company, timeline, platform  -> the details strip under the title
//   links: [{ label, href }]           -> buttons (live site, store, source code)
//   overview, challenge, approach      -> paragraphs
//   contributions: [..]                -> "What I built" bullet list (also shown on featured rows)
//   highlights: [..]                   -> short bullets for the featured row instead of contributions
//   gallery: [{ src, alt }]            -> extra screenshots under "Screens"
//   stack: { Group: [..] }             -> grouped tech chips
//   results: [{ value, label }]        -> big numbers, e.g. { value: "10k+", label: "Downloads" }
//   learned                            -> closing paragraph
// `category` drives the filter buttons; `id` is the case study's link (#work/<id>).

window.PROJECTS = [
  {
    id: "daily-islam",
    featured: true,
    title: "Daily Islam",
    category: "Mobile",
    type: "Mobile app",
    image: "./img/daily-islam.svg",
    tagline:
      "A cross-platform Islamic lifestyle app that brings the Quran, prayer times, duas and books together, and keeps working without a connection.",
    role: "Front-end engineer",
    company: "Syftet Ltd.",
    platform: "Android · iOS",
    links: [{ label: "App Store", href: "https://apps.apple.com/us/app/daily-islam-quran-hadith-dua/id6759240900" }],
    overview:
      "Daily Islam is a cross-platform mobile app built with React Native that helps Muslims build an Islamic lifestyle and connect with the global Muslim community. It brings the Quran, duas, Islamic books and prayer times together in one place. As part of the engineering team at Syftet Ltd., I developed and maintained a significant portion of the app's front end, from its core modules to the data layer that keeps it usable offline.",
    challenge:
      "An app like this is opened many times a day: to check the next prayer, read a surah or find a dua. It has to be dependable wherever the user is, including with a weak connection or none at all. Prayer information has to match the user's actual location, and a growing set of feature-rich modules has to feel like one consistent app rather than five separate ones.",
    contributions: [
      "Built core modules (Quran, Dua, Books, Prayers and Profiles) with React Native and Redux.",
      "Implemented offline-first functionality with SQLite, so users can access app data without an internet connection.",
      "Synchronised data between local and remote sources when connectivity returned, keeping the app reliable across different network conditions.",
      "Used device location to provide location-specific prayer information.",
      "Developed reusable components and features shared across modules, keeping architecture and interactions consistent throughout the app.",
      "Managed application state and state transitions with Redux across feature-rich modules.",
    ],
    approach:
      "App data is stored locally in SQLite, so every module stays usable offline, and changes are synchronised with the remote source once the device is back online. Redux sits on top of that layer and gives each module a predictable flow of data and state transitions. New features were built from a shared set of reusable components, so the Quran, Dua, Books, Prayers and Profiles modules look and behave the same way and stay maintainable as the app grows.",
    highlights: [
      "Quran, Dua, Books, Prayers and Profiles modules",
      "Offline-first with SQLite and local-remote sync",
      "Location-based prayer information",
      "Redux state and reusable components across modules",
    ],
    stack: {
      Mobile: ["React Native", "Expo"],
      State: ["Redux"],
      Language: ["TypeScript"],
      Storage: ["SQLite"],
    },
  },
  {
    id: "inwe",
    featured: true,
    title: "iNwe",
    category: "Web",
    type: "Web app",
    image: "./img/inwe.svg",
    tagline: "A real-time messaging platform for one-to-one and group conversations, built with Angular and live in production.",
    role: "Front-end engineer",
    company: "Syftet Ltd.",
    platform: "Web",
    links: [{ label: "Live site", href: "http://chat.inweapp.com/" }],
    overview:
      "iNwe is a real-time messaging and social platform that lets people connect with friends and family through one-to-one and group conversations. It is built with Angular and live in production at Syftet Ltd. I developed the Angular front-end features, from the real-time messaging layer to the conversation features, and integrated them with backend services built by the Ruby on Rails team.",
    challenge:
      "Messaging only feels right when it's instant. New messages, replies and reactions have to appear for everyone in a conversation as they happen, without a page refresh, whether it's a private chat or a busy group. And because the backend was built by a separate Ruby on Rails team, every feature also depended on the front end and server side fitting together cleanly.",
    contributions: [
      "Developed Angular front-end features for a real-time messaging and social platform.",
      "Implemented real-time communication over WebSocket with Stomp.js, so messages and updates reach users as they happen.",
      "Built conversation features: message reactions, replies and forwarding, plus chat rooms for group conversations.",
      "Integrated RESTful APIs with the Angular front end to connect app features with backend services.",
      "Collaborated with the Ruby on Rails backend team to integrate front-end features with server-side functionality.",
    ],
    approach:
      "The app works over two channels side by side. A WebSocket connection, using Stomp.js, carries live events such as new messages, replies and reactions, so conversations update for everyone in real time. RESTful APIs connect the rest of the app's features to backend services. In Angular, RxJS handles these streams of events and data. I worked closely with the Ruby on Rails team to integrate each feature with its server-side functionality.",
    highlights: [
      "Real-time messaging over WebSocket with Stomp.js",
      "Reactions, replies, forwarding and group chat rooms",
      "REST API integration with backend services",
      "Built alongside the Ruby on Rails backend team",
    ],
    stack: {
      Frontend: ["Angular", "TypeScript"],
      Realtime: ["WebSocket", "Stomp.js"],
      State: ["RxJS"],
      Integration: ["REST APIs"],
    },
  },
  {
    id: "careerflow",
    title: "CareerFlow",
    category: "Back-end",
    type: "REST API",
    image: "./img/careerflow.svg",
    tagline:
      "The backend for a career and job application management platform, built with Express.js, TypeScript, Prisma and PostgreSQL.",
    role: "Back-end developer",
    timeline: "2026 – Present",
    platform: "API",
    links: [{ label: "Source code", href: "https://github.com/iqbal9865/careerflow-backend" }],
    overview:
      "CareerFlow is a career and job application management platform, and I'm currently building its backend: RESTful services written in Express.js and TypeScript, with Prisma and PostgreSQL for data. The project is ongoing, and the source is public on GitHub.",
    challenge:
      "A job application platform holds personal data and changes constantly as applications move forward, so its backend has to be secure, reliable and easy to extend. That meant solid authentication from the start, a clear data model, and a structure where new modules can be added without tangling the existing code.",
    contributions: [
      "Designed and developed RESTful backend services in Express.js and TypeScript with a modular architecture.",
      "Implemented authentication and authorisation with JWT-based access and refresh tokens.",
      "Designed the database models and implemented data access with Prisma and PostgreSQL.",
      "Developed API modules for user authentication, profiles and job application management.",
      "Structured the backend with separation of concerns across routes, controllers, services and data-access layers, with middleware and validation in between.",
    ],
    approach:
      "The code is organised by feature: authentication, profiles and job applications each have their own module, split into routes, controllers, services and data access. Routes and controllers deal with HTTP, middleware and validation check each request, services hold the business logic, and Prisma handles all database access, so each layer has one job and can change on its own. Authentication and authorisation use JWT access tokens together with refresh tokens, and the data model is defined in Prisma on PostgreSQL.",
    stack: {
      Backend: ["Express.js", "TypeScript"],
      Data: ["Prisma", "PostgreSQL"],
      Auth: ["JWT"],
    },
  },
  {
    id: "silvrback",
    title: "Silvrback",
    category: "Web",
    type: "Blogging platform",
    image: "./img/silvrback.svg",
    tagline: "A live blogging and writing platform with a personal feel, built on Ruby on Rails.",
    role: "Front-end developer",
    platform: "Web",
    links: [{ label: "Live site", href: "https://www.silvrback.com/" }],
    overview:
      "Silvrback is a live blogging and writing platform built with Ruby on Rails, home to a small community of writers and designed to feel more personal than mainstream blogging sites. I worked on the platform's front end and was responsible for the UI implementation, front-end data handling and integration with the backend APIs.",
    challenge:
      "A writing platform depends on its reading and writing experience. The interface had to put the words first, stay consistent and responsive on every screen and still feel lively, all inside a Ruby on Rails codebase where pages are rendered on the server.",
    contributions: [
      "Designed and implemented the front-end UI with SASS, CSS and JavaScript, covering the main user-facing interfaces and interactions.",
      "Built a responsive, consistent and scalable design system in SCSS.",
      "Implemented front-end data handling and integrated RESTful APIs to connect UI components with backend services.",
      "Developed interactive functionality and UI enhancements in JavaScript, including scroll-based interactions with the Intersection Observer API.",
      "Worked within the Ruby on Rails codebase, integrating front-end components with server-rendered views and backend functionality.",
    ],
    approach:
      "The styling is built as an SCSS design system, so pages share the same styles and components and new screens stay consistent. On top of the server-rendered Rails views, JavaScript adds the interactive layer: UI enhancements, scroll-based interactions with the Intersection Observer API, and calls to RESTful APIs that connect UI components with backend services.",
    stack: {
      Styling: ["SCSS", "CSS", "Bootstrap"],
      Frontend: ["JavaScript"],
      Integration: ["REST APIs"],
      Backend: ["Ruby on Rails"],
    },
  },
];
