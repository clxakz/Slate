import { motion } from "motion/react";
import { languageIconMap, ProjectType, useGlobal } from "../global-provider";
import { Button } from "../shadcn/button";
import { CodeXml, Ellipsis, FolderCode, Loader, Pencil, Pin, PinOff, Trash, TriangleAlert } from "lucide-react";
import DeleteProjectDialog from "./dialogs/delete-project";
import TooltipComponent from "./tolltip-component";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import EditProjectDialog from "./dialogs/edit-project";


export default function ProjectCard({project, index}: {project: ProjectType, index: number}) {
    const [openLoading, setOpenLoading] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const { deleteProject, pinProject, openInIde, openDirectory, settings } = useGlobal();

    const handleDelete = (delete_files: boolean) => {
        deleteProject(project.id, delete_files);
    };

    const handlePin = () => {
        pinProject(project.id);
    };

    const handleCode = async () => {
        setOpenLoading(true);

        const result = await openInIde(project.name);
        if (result) {
            setOpenLoading(false);
        }
    };

    const handleOpenDirectory = async () => {
        openDirectory(project.name);
    };


    return (
        <motion.div layout
            initial={{scale: 0.8, filter: "blur(2px)", opacity: 0, y: 30}}
            animate={{scale: 1.0, filter: "blur(0px)", opacity: 1, y: 0}}
            exit={{scale: 0.8, filter: "blur(2px)", opacity: 0, y: 30}}
            transition={{delay: index*0.1}}
            className={`border-1 rounded-md bg-background/10 backdrop-blur-md flex ${settings.vertical ? "max-h-[150px] min-h-[150px]" : "flex-col max-h-[200px] min-h-[200px]"} overflow-hidden`}>
                <div className={`pt-1 pl-1 flex flex-wrap gap-1 ${settings.vertical && "max-w-[120px]"}`}>
                   {project.languages && Array.isArray(project.languages) && project.languages.map((language, index) => {
                    const iconSrc = languageIconMap[language.toLowerCase()];
                    return (
                        <img
                        key={index}
                        src={iconSrc}
                        alt={language}
                        className="w-5 h-5"
                        onError={e => {
                            e.currentTarget.src = "none"; // fallback icon
                        }}
                        />
                    );
                    })}
                </div>
                
                <div className="relative group p-1 pt-0 flex-1">
                    <div className="z-10 h-full w-full overflow-y-scroll opacity-0 group-hover:opacity-100 duration-200 absolute top-0 p-1 pt-0 scrollbar-hide">
                        <p className="break-words">{project.description}</p>
                    </div>
                    <p className="group-hover:blur-[4px] duration-100 truncate text-wrap break-words line-clamp-6">{project.name}</p>
                </div>

                <div className={`flex ${settings.vertical ? "flex-col border-l-1" : "border-t-1"} bg-zinc-200/5 z-10`}>
                    { !project.missingfiles && 
                    <Button disabled={openLoading} onClick={handleCode} variant={"ghost"} className="flex-1 rounded-none">{ openLoading ? <Loader className="animate-spin" /> : <CodeXml />}</Button> }

                    { project.missingfiles && <TooltipComponent message="This project has missing files">
                        <Button variant={"ghost"} className="flex-1 rounded-none"><TriangleAlert stroke="red"/></Button>
                    </TooltipComponent> }

                    <Button onClick={handlePin} variant={"ghost"} className="flex-1 rounded-none">{project.pinned ? <PinOff fill="currentColor" /> : <Pin /> }</Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className="flex-1 rounded-none"><Ellipsis /></Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}><Pencil/> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOpenDirectory}><FolderCode /> Open Directory</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                                <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}><Trash /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DeleteProjectDialog onDelete={handleDelete} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}/>
                    <EditProjectDialog project={project} open={editDialogOpen} onOpenChange={setEditDialogOpen}/>
                </div>
        </motion.div>
    );
}