// Portfolio content. works.js renders the Works section and the case studies from this list.
//
// Order matters: featured projects appear as large rows (in this order), the rest as cards.
// Every field below `tagline` is optional. Leave a field out and its part of the case study
// is simply not shown, so add details whenever you have them:
//   role, company, timeline, platform  -> the details strip under the title
//   links: [{ label, href }]           -> buttons (live site, store, source code)
//   overview, challenge, approach      -> paragraphs
//   contributions: [..]                -> "What I built" bullet list (also shown on featured rows)
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
    image: "./img/mosque.jpg",
    tagline: "A cross-platform app that helps Muslims build an Islamic lifestyle and connect with the global community.",
    platform: "Android · iOS",
    links: [{ label: "App Store", href: "https://apps.apple.com/us/app/daily-islam-quran-hadith-dua/id6759240900" }],
    overview:
      "Daily Islam is an online educational platform that helps users build a smart Islamic lifestyle and gain true knowledge of Islam. It is a cross-platform application built with React Native, designed to give the Muslim ummah comprehensive information about Islam and to connect them with the global Muslim community.",
    contributions: ["Books module", "Prayer module", "Dua module", "Quran module"],
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
    image: "./img/iNwe.jpg",
    tagline: "A real-time messaging platform for one-to-one and group conversations.",
    platform: "Web",
    links: [{ label: "Live site", href: "http://chat.inweapp.com/" }],
    overview:
      "iNwe is a messaging platform built with Angular that lets people connect with friends and family, share their thoughts and communicate either peer-to-peer or in groups.",
    contributions: [
      "Real-time client-server connection over WebSocket with Stomp.js",
      "Message reactions, reply and forward",
      "Chat room features",
    ],
    stack: {
      Frontend: ["Angular", "TypeScript"],
      Realtime: ["WebSocket", "Stomp.js"],
      State: ["RxJS"],
    },
  },
  {
    id: "oz-bangla",
    title: "OZ BANGLA",
    category: "Full-stack",
    type: "Agency platform",
    image: "./img/img-3.jpg",
    tagline: "Web platform for a leading data-driven digital marketing agency in Bangladesh.",
    role: "Full-stack developer",
    company: "Syftet Ltd.",
    platform: "Web",
    links: [{ label: "Live site", href: "http://portal.ozbangla.com/" }],
    overview:
      "OZ BANGLA is a leading data-driven digital marketing agency based in Bangladesh. I worked on the project at Syftet Ltd., designing an intuitive UI and building both the client and the API.",
    contributions: [
      "Designed the user interface",
      "Angular client with REST API integration and state management",
      "REST APIs with Node.js and Express.js",
    ],
    stack: {
      Frontend: ["Angular"],
      Backend: ["Node.js", "Express.js"],
    },
  },
  {
    id: "silvrback",
    title: "Silvrback",
    category: "Web",
    type: "Blogging platform",
    image: "./img/img-4.jpg",
    tagline: "A personal blogging platform for a small community of writers.",
    role: "Front-end developer",
    platform: "Web",
    links: [{ label: "Live site", href: "https://www.silvrback.com/" }],
    overview:
      "Silvrback is a well-supported platform hosting a small community of writers, with a more personal feel than mainstream blogging sites. I designed the website in SCSS and implemented key functionality in JavaScript.",
    contributions: [
      "Responsive, consistent and scalable design system in SCSS",
      "Scroll-based interactions with the Intersection Observer API",
    ],
    stack: {
      Styling: ["SCSS", "Bootstrap"],
      Frontend: ["JavaScript"],
      Backend: ["Ruby on Rails"],
    },
  },
  {
    id: "admission-funnel",
    title: "Admission Funnel",
    category: "Web",
    type: "Marketing funnel",
    image: "./img/Admission.gif",
    tagline: "An admission funnel with email automation that guides students from first visit to enrollment.",
    platform: "Web",
    links: [{ label: "Live site", href: "https://admission-funnel.web.app/" }],
    overview:
      "A funnel system designed to attract students and take them through admission and enrollment. Email automation brings back visitors and reduces drop-off on the online application form.",
    contributions: ["Admission and enrollment flow", "Email automation", "Online application form"],
    stack: {
      Frontend: ["React", "React Router"],
      Backend: ["Node.js"],
      Data: ["Firebase"],
    },
  },
  {
    id: "doctors-portal",
    title: "Doctors Portal",
    category: "Full-stack",
    type: "Booking system",
    image: "./img/img-6.jpg",
    tagline: "Hospital appointment booking with separate dashboards for patients and admins.",
    platform: "Web",
    links: [{ label: "Live site", href: "https://doctors-portal-91849.firebaseapp.com/" }],
    overview:
      "A hospital project for booking patient appointments online. Patients sign in, choose the date and category of their appointment and book it. The site has separate dashboards for users and for the admin panel.",
    contributions: ["Patient accounts and appointment booking", "User dashboard", "Admin dashboard"],
    stack: {
      Frontend: ["React", "React Router"],
      Backend: ["Node.js"],
      Data: ["Firebase"],
    },
  },
];
