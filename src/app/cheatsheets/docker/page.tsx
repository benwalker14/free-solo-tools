import type { Metadata } from "next";
import DockerCheatSheet from "./DockerCheatSheet";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "Docker Cheat Sheet — Interactive Container Command Reference",
  description:
    "Complete Docker cheat sheet covering images, containers, networks, volumes, Docker Compose, Dockerfile instructions, and debugging commands. Search, filter, copy, and click to validate configs instantly. Free interactive Docker CLI reference.",
  keywords: [
    "docker cheat sheet",
    "docker commands",
    "dockerfile reference",
    "docker compose commands",
    "docker CLI reference",
    "docker container commands",
    "docker image commands",
    "docker network commands",
    "docker volume commands",
    "docker quick reference",
    "docker run command",
    "docker build command",
    "docker tutorial",
    "container commands",
  ],
  openGraph: {
    title:
      "Docker Cheat Sheet — Interactive Container Command Reference | DevBolt",
    description:
      "Complete interactive Docker reference with search, filtering, copy-to-clipboard, and click-to-validate integration. Covers images, containers, networks, volumes, Compose, Dockerfile instructions, and debugging.",
    url: `${BASE_URL}/cheatsheets/docker`,
    type: "article",
  },
  alternates: {
    canonical: `${BASE_URL}/cheatsheets/docker`,
  },
};

const faqs = [
  {
    question: "What are the most common Docker commands?",
    answer:
      "The most commonly used Docker commands are: docker run (create and start a container), docker build (build an image from a Dockerfile), docker ps (list running containers), docker images (list local images), docker pull (download an image from a registry), docker stop (stop a running container), docker rm (remove a container), docker exec -it (run a command inside a running container), docker logs (view container logs), and docker compose up (start services defined in a Compose file). These commands cover the majority of daily Docker workflows.",
  },
  {
    question: "How do I remove all unused Docker images?",
    answer:
      "To remove all unused (dangling) Docker images, run 'docker image prune' which removes images not tagged and not referenced by any container. To remove ALL images not used by at least one container, run 'docker image prune -a'. For a broader cleanup that also removes stopped containers, unused networks, and build cache, use 'docker system prune'. Add the -f flag to skip the confirmation prompt. Be cautious with 'prune -a' in production environments as it will remove images you may need to quickly restart containers.",
  },
  {
    question:
      "What's the difference between CMD and ENTRYPOINT in a Dockerfile?",
    answer:
      "CMD and ENTRYPOINT both specify what runs when a container starts, but they serve different purposes. ENTRYPOINT defines the main executable that always runs — it cannot be easily overridden by command-line arguments (you need --entrypoint flag). CMD provides default arguments that can be overridden when running the container. The best practice is to use them together: ENTRYPOINT for the fixed command and CMD for default arguments. For example, ENTRYPOINT [\"python\"] with CMD [\"app.py\"] means running 'docker run myimage' executes 'python app.py', but 'docker run myimage test.py' executes 'python test.py'. Always use the exec form (JSON array) over the shell form for both.",
  },
  {
    question: "How do I troubleshoot a running Docker container?",
    answer:
      "To troubleshoot a running Docker container, use these commands: 'docker logs <container>' to view stdout/stderr output (add -f to follow in real-time and --tail 100 to limit lines). 'docker exec -it <container> /bin/sh' to open an interactive shell inside the container. 'docker inspect <container>' to view detailed configuration, networking, mounts, and environment variables. 'docker stats <container>' to monitor real-time CPU, memory, network, and disk I/O usage. 'docker top <container>' to list processes running inside the container. 'docker diff <container>' to see filesystem changes made since the container started. For networking issues, 'docker network inspect <network>' shows connected containers and their IP addresses.",
  },
];

export default function DockerCheatSheetPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Docker Cheat Sheet — Interactive Container Command Reference",
    description:
      "Complete interactive Docker reference covering images, containers, networks, volumes, Docker Compose, Dockerfile instructions, and debugging commands.",
    datePublished: "2026-03-19",
    publisher: {
      "@type": "Organization",
      name: "DevBolt",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/cheatsheets/docker`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DockerCheatSheet faqs={faqs} />
    </>
  );
}
