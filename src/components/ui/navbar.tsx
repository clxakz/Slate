import { AnimatePresence } from "motion/react";
import { Pages, useGlobal } from "../global-provider";
import { motion } from "motion/react";
import { BadgePlus, ChevronLeft, Cog, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import NewProjectDialog from "./dialogs/new-project";


export default function Navbar() {
    const { page } = useGlobal();

    return (
        <div className="p-1 border-1 rounded-md">
            <AnimatePresence>
                { page == Pages.projects && <ProjectsControls/> }
                { page == Pages.settings && <SettingsControls/> }
            </AnimatePresence>
        </div>
    );
}


const Transition = {
    initial: { opacity: 0, filter: "blur(2px)", y: -5 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(2px)", y: -5 },
}

function ProjectsControls() {
    const { setPage, setSearch, search, settings, setSetting } = useGlobal();

    const handleSettings = () => {
        setSearch("");
        setPage(Pages.settings);
    };

    const handleInputChange = (value: string) => {
        setSearch(value);
    };

    const handleListType = () => {
        setSetting("vertical", settings.vertical ? false : true);
    };

    return (
        <motion.div
            variants={Transition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-2">

                <NewProjectDialog>
                    <Button variant={"ghost"}>
                        <BadgePlus/> New Project
                    </Button>
                </NewProjectDialog>

                <Button size={"icon"} variant={"ghost"} onClick={handleListType}>
                    { settings.vertical ? <LayoutGrid /> : <List />}
                </Button>

                <div className="flex items-center justify-center rounded-md px-2">
                    <Search size={18} />
                    <Input value={search} onChange={(e) => handleInputChange(e.target.value)} type="text" placeholder="Search projects..." 
                            className="shadow-none px-1 max-w-[130px] border-none focus-visible:ring-0 dark:bg-transparent"/>
                </div>


                <Button onClick={handleSettings} size={"icon"} variant={"ghost"} className="ml-auto">
                    <Cog/>
                </Button>

        </motion.div>
    );
}


function SettingsControls() {
    const { setPage } = useGlobal();

    const handleBackToProjects = () => {
        setPage(Pages.projects);
    };

    return (
        <motion.div
            variants={Transition}
            initial="initial"
            animate="animate"
            exit="exit">

                <Button onClick={handleBackToProjects} variant={"ghost"} className="ml-auto">
                    <ChevronLeft/> Back To Projects
                </Button>

        </motion.div>
    );
}