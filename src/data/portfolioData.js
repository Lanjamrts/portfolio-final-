// ============================================================
// PORTFOLIO DATA — Modifier ce fichier pour mettre à jour
// le contenu sans toucher aux composants.
// ============================================================

export const OWNER = {
  firstName: "Lanja",
  lastName: "ANDRIANJATOVO",
  fullName: "Lanja ANDRIANJATOVO",
  fullNameFormal: "ANDRIANJATOVO Lanja Mirantsoa",
  title: "Développeur Full-Stack",
  titleEn: "Full-Stack Developer",
  bio: "Étudiant en Génie Logiciel à l'INSI Ambanidia, passionné par le développement web et mobile moderne et la création d'expériences utilisateur innovantes.",
  bioEn: "Software Engineering student at INSI Ambanidia, passionate about modern web and mobile development and creating innovative user experiences.",
  about:
    "Développeur d'applications web et mobiles modernes, alliant qualité d'interface, performance et robustesse fonctionnelle. Attention particulière portée à la scalabilité, aux bonnes pratiques d'architecture et à l'optimisation du code. Apprentissage continu des technologies modernes du développement.",
  aboutEn:
    "Modern web and mobile applications developer, combining interface quality, performance, and functional robustness. Particular attention to scalability, architectural best practices, and code optimization. Continuous learning of modern development technologies.",
  email: "lanjaandrianjatovo@gmail.com",
  phone: "+261 38 95 983 72",
  whatsapp: "+261 32 09 968 72",
  location: "Mandroseza, Antananarivo, Madagascar",
  avatar: "/lanja.png",
  logo: "/logo.png",
  socials: {
    github: "https://github.com/Lanjamrts",
    linkedin: "https://www.linkedin.com/in/lanja-mirantsoa-90273a374/",
    facebook: "https://www.facebook.com/lanja.mirantsoa.37",
  },
};

export const STATS = [
  { icon: "🏆", label: "Projets réalisés", labelEn: "Projects Completed", value: "15", suffix: "+" },
  { icon: "🔨", label: "Développement fullstack", labelEn: "Full-stack Development", value: "8", suffix: "" },
  { icon: "🕒", label: "Années de pratique", labelEn: "Years of Practice", value: "3", suffix: "+" },
  { icon: "💡", label: "Idées à créer", labelEn: "Ideas to Create", value: "∞", suffix: "" },
];

// ——— COMPÉTENCES TECHNIQUES ———
// icon = slug Simple Icons · iconUrl = fallback (devicon, etc.)
export const SKILL_CATEGORIES = [
  {
    id: "frontend",
    title: "Front-end",
    skills: [
      { name: "React", icon: "react", color: "61DAFB" },
      { name: "Next.js", icon: "nextdotjs", color: "FFFFFF" },
      { name: "Vue", icon: "vuedotjs", color: "4FC08D" },
      { name: "Vite", icon: "vite", color: "646CFF" },
      { name: "Web Components", icon: "mdnwebdocs", color: "FFFFFF" },
      { name: "Tailwind", icon: "tailwindcss", color: "06B6D4" },
      { name: "Bootstrap", icon: "bootstrap", color: "7952B3" },
    ],
  },
  {
    id: "backend",
    title: "Back-end",
    skills: [
      { name: "Node.js / Express", icon: "nodedotjs", color: "339933" },
      { name: "NestJS", icon: "nestjs", color: "E0234E" },
      { name: "Symfony", icon: "symfony", color: "FFFFFF" },
      { name: "GraphQL", icon: "graphql", color: "E10098" },
      { name: "REST", icon: "openapiinitiative", color: "6BA539" },
      { name: "WebSocket", icon: "socketdotio", color: "FFFFFF" },
      { name: "Microservices", icon: "kubernetes", color: "326CE5" },
      {
        name: "JWT",
        iconUrl: "https://jwt.io/img/pic_logo.svg",
      },
    ],
  },
  {
    id: "database",
    title: "BDD",
    skills: [
      { name: "PostgreSQL", icon: "postgresql", color: "4169E1" },
      { name: "MySQL", icon: "mysql", color: "4479A1" },
      { name: "MongoDB", icon: "mongodb", color: "47A248" },
      { name: "SQLite", icon: "sqlite", color: "003B57" },
      { name: "Redis", icon: "redis", color: "FF4438" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    skills: [
      { name: "Flutter", icon: "flutter", color: "02569B" },
      {
        name: "React Native",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/reactnative/reactnative-original.svg",
      },
    ],
  },
  {
    id: "devops",
    title: "Outils & DevOps",
    skills: [
      { name: "Docker", icon: "docker", color: "2496ED" },
      { name: "Docker Compose", icon: "docker", color: "2496ED" },
      { name: "Git", icon: "git", color: "F05032" },
      { name: "Swagger / OpenAPI", icon: "swagger", color: "85EA2D" },
      { name: "GitHub Actions", icon: "githubactions", color: "2088FF" },
    ],
  },
  {
    id: "design",
    title: "UI/UX & Design",
    skills: [
      { name: "Figma", icon: "figma", color: "F24E1E" },
      { name: "Canva", icon: "canva", color: "00C4CC" },
      {
        name: "Gamma",
        iconUrl:
          "https://static.gamma.app/images/gamma-logo-circle-light.svg",
      },
    ],
  },
];

// ——— PROJETS ———
// image : fichiers dans public/ (reservation.png, ecommerce.png, etc.)
export const PROJECTS = [
  {
    id: 1,
    title: "Reservation App",
    category: "Full-Stack",
    description:
      "Plateforme de réservation en temps réel avec synchronisation instantanée, interface moderne et API sécurisée.",
      descriptionEn:
        "Real-time booking platform with instant synchronization, modern interface, and secure API.",
    techs: ["MongoDB", "Express", "Angular", "Node.js", "TypeScript"],
    image: "/reservation.png",
    github: "https://github.com/Lanjamrts/reservation-app",
    demo: "https://reservation-app-iota.vercel.app",
    featured: true,
  },
  {
    id: 2,
    title: "Mini E-commerce Java",
    category: "Java",
    description:
      "Projet académique INSI : mini boutique en ligne avec logique métier Java, catalogue produits et parcours d'achat.",
      descriptionEn:
        "INSI academic project: mini online store with Java business logic, product catalog, and shopping flow.",
    techs: ["Java", "HTML", "CSS", "Maven"],
    image: "/ecommerce.png",
    github: "https://github.com/Lanjamrts/projet-java-",
    demo: null,
    featured: true,
  },
  {
    id: 3,
    title: "Gestion Étudiants",
    category: "Mobile",
    description:
      "Application mobile de gestion d'étudiants : CRUD, interface fluide et architecture Flutter multiplateforme.",
      descriptionEn:
        "Mobile student management application: CRUD, smooth interface, and cross-platform Flutter architecture.",
    techs: ["Flutter", "Dart"],
    image: "/gestion.png",
    github: "https://github.com/Lanjamrts/gestion-etudiant-flutter-",
    demo: null,
    featured: true,
  },
  {
    id: 4,
    title: "Fanorona",
    category: "Jeu",
    description:
      "Jeu traditionnel malgache recodé sous Godot : règles du Fanorona, plateau interactif et logique en GDScript.",
      descriptionEn:
        "Traditional Malagasy game recreated in Godot: Fanorona rules, interactive board, and GDScript logic.",
    techs: ["Godot", "GDScript"],
    image: "/godot.png",
    github: "https://github.com/Lanjamrts/fanorona-godot-",
    demo: null,
    featured: true,
  },
  {
    id: 5,
    title: "TaskFlow Mini",
    category: "Productivité",
    description:
      "Une application de gestion de tâches inspirée de Trello. Elle utilise une architecture réactive pour permettre l'organisation de flux de travail via un système intuitif de drag-and-drop.",
      descriptionEn:
        "A task management app inspired by Trello. Uses reactive architecture to organize workflows through an intuitive drag-and-drop system.",
    techs: ["React", "Drag & Drop API", "CSS Modules"],
    image: "/drag-drop.jpg",
    github: "https://github.com/Lanjamrts/drag-drop-avec-react",
    demo: null,
    featured: true,
  },
  {
    id: 6,
    title: "Survival Adventure",
    category: "Jeu Web",
    description:
      "Un jeu d'aventure et de survie interactif développé avec React. Gérez vos ressources et explorez un monde hostile où chaque décision influe sur votre survie.",
      descriptionEn:
        "An interactive survival adventure game built with React. Manage resources and explore a hostile world where every decision impacts your survival.",
    techs: ["React", "Game Logic", "CSS Animations"],
    image: "/pexels-cottonbro-4888472.jpg",
    github: "https://github.com/Lanjamrts/survival-game-avec-react",
    demo: null,
    featured: true,
  },
  {
    id: 7,
    title: "Budget Insight",
    category: "Finance",
    description:
      "Solution moderne de gestion de budget personnel. Elle permet de suivre vos dépenses, de catégoriser vos revenus et de visualiser votre santé financière en temps réel.",
      descriptionEn:
        "Modern personal budget management solution. Track expenses, categorize income, and visualize financial health in real time.",
    techs: ["React", "State Management", "Data Viz"],
    image: "/gestion-budget.jpg",
    github: "https://github.com/Lanjamrts/Bugdet-app-avec-react",
    demo: null,
    featured: true,
  },
  {
    id: 8,
    title: "MadaBus",
    category: "Full-Stack",
    description:
      "MadaBus est une application en ligne qui facilite la réservation de trajets entre les clients et les coopératives de transport. Elle permet aux clients d'envoyer une demande de réservation, et aux coopératives de confirmer ou gérer les demandes de manière simple et rapide.",
      descriptionEn:
        "MadaBus is an online application that facilitates trip booking between clients and transport cooperatives. It allows clients to send booking requests and cooperatives to confirm or manage requests simply and quickly.",
    techs: ["MongoDB", "Express", "React", "Node.js"],
    image: "/morabus.png",
    github: "https://github.com/Lanjamrts/madabus-MERN-",
    demo: null,
    featured: true,
  },
  {
    id: 9,
    title: "MadaPrix",
    category: "Full-Stack",
    description:
      "MadaPrix est une plateforme en ligne de comparaison de prix à Madagascar qui permet aux utilisateurs de trouver rapidement les produits les moins chers selon les boutiques disponibles. Elle aide les clients à comparer les offres, économiser de l'argent et choisir le meilleur prix facilement.",
      descriptionEn:
        "MadaPrix is an online price comparison platform in Madagascar that lets users quickly find the cheapest products across available stores. It helps customers compare offers, save money, and choose the best price easily.",
    techs: ["MongoDB", "Express", "React", "Node.js"],
    image: "/madaprix.png",
    github: "https://github.com/Lanjamrts/Tsena_mora-MERN-",
    demo: null,
    featured: true,
  },
  {
    id: 10,
    title: "Bloc Note",
    category: "Mobile",
    description:
      "Application de bloc-notes moderne développée avec Flutter et Dart. Interface intuitive offrant une expérience de prise de notes fluide et réactive avec une architecture propre. Projet en constante évolution avec ajout régulier de nouvelles fonctionnalités.",
    descriptionEn:
      "Modern note-taking application built with Flutter and Dart. Intuitive interface offering a smooth and responsive note-taking experience with clean architecture. Project under continuous evolution with regular addition of new features.",
    techs: ["Flutter", "Dart"],
    image: "/bloc-note.png",
    github: "https://github.com/Lanjamrts/bloc-note-flutter-dart-",
    demo: null,
    featured: true,
  },
];

export const PROJECTS_FOOTER = {
  more:
    "D'autres réalisations sont disponibles sur mon profil GitHub.",
  moreEn:
    "More projects are available on my GitHub profile.",
  inProgress:
    "De nouveaux projets sont actuellement en cours de développement.",
  inProgressEn:
    "New projects are currently in development.",
};

// ——— FILTRES PROJETS ———
export const PROJECT_FILTERS = [
  "Tous",
  "Full-Stack",
  "Java",
  "Mobile",
  "Jeu",
  "Productivité",
  "Jeu Web",
  "Finance",
];