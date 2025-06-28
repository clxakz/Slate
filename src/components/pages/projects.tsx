import { AnimatePresence } from "motion/react";
import { useGlobal } from "../global-provider";
import ProjectCard from "../ui/project-card";


export default function Projects() {
  const { projects, search, settings } = useGlobal();

  return (
    <div className={`max-h-full overflow-y-auto overflow-x-hidden grid ${settings.vertical ? "grid-cols-1" : "grid-cols-4"} gap-1 custom-scrollbar`}>
      <AnimatePresence mode="popLayout">
        {projects
          .slice()
          .sort((a, b) => Number(b.pinned) - Number(a.pinned))
          .filter(project => project.name.toLowerCase().includes(search.toLowerCase()))
          .map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
