import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// this function is used on the question card o while creation and andding the dates to it
export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = Date.now();
  const past = new Date(date).getTime();
  const diffMs = now - past;

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);
  const years   = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24)   return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 365)   return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};



// devion icons --> https://devicon.dev/

// icons
const TAG_ICON_MAP: Record<string, string> = {
  // frontend
  react: "devicon-react-original",
  next: "devicon-nextjs-original-wordmark",
  angular: "devicon-angularjs-plain",
  vue: "devicon-vuejs-plain",
  javascript: "devicon-javascript-plain",
  typescript: "devicon-typescript-plain",
  html: "devicon-html5-plain",
  css: "devicon-css3-plain",
  tailwind: "devicon-tailwindcss-plain",
  bootstrap: "devicon-bootstrap-plain",

  // backend
  node: "devicon-nodejs-plain",
  express: "devicon-express-original",
  django: "devicon-django-plain",
  flask: "devicon-flask-original",
  spring: "devicon-spring-plain",
  laravel: "devicon-laravel-plain",

  // languages
  python: "devicon-python-plain",
  java: "devicon-java-plain",
  c: "devicon-c-plain",
  cpp: "devicon-cplusplus-plain",
  csharp: "devicon-csharp-plain",
  go: "devicon-go-plain",
  php: "devicon-php-plain",
  ruby: "devicon-ruby-plain",
  kotlin: "devicon-kotlin-plain",
  swift: "devicon-swift-plain",

  // database
  mongodb: "devicon-mongodb-plain",
  mysql: "devicon-mysql-plain",
  postgresql: "devicon-postgresql-plain",
  redis: "devicon-redis-plain",
  firebase: "devicon-firebase-plain",

  // tools
  git: "devicon-git-plain",
  github: "devicon-github-original",
  docker: "devicon-docker-plain",
  kubernetes: "devicon-kubernetes-plain",
  vscode: "devicon-vscode-plain",
  linux: "devicon-linux-plain",

  // cloud
  aws: "devicon-amazonwebservices-original",
  azure: "devicon-azure-plain",
  gcp: "devicon-googlecloud-plain",
};


// reusable function
export const getTagIconClass = (tagName: string): string => {
  const icon = TAG_ICON_MAP[tagName.toLowerCase()];

  if (!icon) {
    return "devicon-devicon-plain colored";
  }

  return `${icon} colored`;
};


// tech descriptions 
const TECH_DESCRIPTION_MAP: Record<string, string> = {
  // frontend
  react: "React is a powerful JavaScript library for building dynamic and interactive user interfaces using component-based architecture.",
  next: "Next.js is a React framework that enables server-side rendering, static site generation, and full-stack web applications.",
  angular: "Angular is a TypeScript-based framework for building scalable, enterprise-level web applications.",
  vue: "Vue.js is a progressive JavaScript framework used for building modern user interfaces and single-page applications.",
  javascript: "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  typescript: "TypeScript adds strong typing to JavaScript, making it ideal for scalable and maintainable applications.",
  html: "HTML is the standard markup language used to structure content on the web.",
  css: "CSS is used to style and layout web pages, including colors, layouts, and responsiveness.",
  tailwind: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
  bootstrap: "Bootstrap is a popular CSS framework for building responsive and mobile-first web applications.",

  // backend
  node: "Node.js is a runtime environment that allows JavaScript to run on the server side.",
  express: "Express.js is a minimal and flexible Node.js web application framework for building APIs and backend systems.",
  django: "Django is a high-level Python web framework that promotes rapid development and clean design.",
  flask: "Flask is a lightweight Python web framework for building simple and scalable web applications.",
  spring: "Spring is a powerful Java framework used for building enterprise-grade backend applications.",
  laravel: "Laravel is a PHP framework known for its elegant syntax and developer-friendly tools.",

  // languages
  python: "Python is a versatile programming language widely used in web development, data science, and AI.",
  java: "Java is a robust, object-oriented programming language used in enterprise applications and backend systems.",
  c: "C is a foundational programming language used for system programming and performance-critical applications.",
  cpp: "C++ is an extension of C that supports object-oriented programming and high-performance applications.",
  csharp: "C# is a modern programming language developed by Microsoft, widely used in .NET applications.",
  go: "Go is a statically typed language developed by Google, known for its simplicity and performance.",
  php: "PHP is a server-side scripting language commonly used for web development.",
  ruby: "Ruby is a dynamic programming language known for its simplicity and productivity.",
  kotlin: "Kotlin is a modern programming language used primarily for Android development.",
  swift: "Swift is Apple's programming language for building iOS and macOS applications.",

  // database
  mongodb: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.",
  mysql: "MySQL is a widely used relational database management system.",
  postgresql: "PostgreSQL is an advanced open-source relational database known for reliability and performance.",
  redis: "Redis is an in-memory data store used for caching and real-time applications.",
  firebase: "Firebase is a backend-as-a-service platform by Google for building web and mobile applications.",

  // tools
  git: "Git is a distributed version control system used to track changes in source code.",
  github: "GitHub is a platform for hosting, collaborating, and managing Git repositories.",
  docker: "Docker is a platform for developing, shipping, and running applications in containers.",
  kubernetes: "Kubernetes is a container orchestration platform for automating deployment and scaling.",
  vscode: "VS Code is a lightweight and powerful code editor developed by Microsoft.",
  linux: "Linux is an open-source operating system widely used in servers and development environments.",

  // cloud
  aws: "AWS is Amazon's cloud platform offering scalable infrastructure and services for modern applications.",
  azure: "Microsoft Azure is a cloud computing platform for building, deploying, and managing applications.",
  gcp: "Google Cloud Platform provides cloud computing services for building scalable applications.",
};



// get description function 
export const getTechDescription = (techName: string): string => {
  const lower = techName.toLowerCase().trim();

  // normalize (same strategy as icons)
  const normalized = lower
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(/\+/g, "pp")
    .replace(/#/g, "sharp");

  // 1. exact match
  if (TECH_DESCRIPTION_MAP[normalized]) {
    return TECH_DESCRIPTION_MAP[normalized];
  }

  // 2. fallback (clean and generic)
  return `${techName} is a technology or tool widely used in web development, providing valuable features for building modern and scalable applications.`;
};


// for viwesr in the question card
export const getViewsCount = (views: number): string => {
  if (views < 1000) {
    return `${views}`;
  }

  if (views < 10000) {
    return `${Math.round(views / 100) / 10}k`;
  }

  return `${Math.round(views / 1000) / 10}k`;
};

export const formatNumber = (num: number): string => {
  if(num>=1000000){
    return(num/1000000).toFixed(2)+"M"; 
  }else if(num>=1000){
    return(num/1000).toFixed(2)+"K"; 
  }else{
    return num.toString();
  }
}