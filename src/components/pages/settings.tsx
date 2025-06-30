import { Button } from "@/components/shadcn/button";
import { Folders, Palette } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Switch } from "@/components/shadcn/switch";
import { Label } from "@/components/shadcn/label";
import { useGlobal } from "../global-provider";
import { useTheme } from "../shadcn/theme-provider";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/shadcn/select";


const SidebarOptions = {
    appearance: {
        name: "appearance",
        icon: <Palette />
    },
    projects: {
        name: "projects",
        icon: <Folders />
    }
}


export default function Settings() {
    const [activeTab, setActiveTab] = useState<string>("appearance");

    return (
        <div className="flex gap-1 w-full h-full">
            <div className="border-1 rounded-md p-1 min-w-[200px] flex flex-col gap-1">
                {Object.values(SidebarOptions).map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{scale: 0.8, filter: "blur(2px)", opacity: 0, y: 10}}
                        animate={{scale: 1.0, filter: "blur(0px)", opacity: 1, y: 0}}
                        exit={{scale: 0.8, filter: "blur(2px)", opacity: 0, y: 10}}
                        transition={{delay: index*0.1}}>
                            <Button variant={"ghost"} onClick={() => setActiveTab(option.name)}
                            className={`flex items-center justify-start w-full ${activeTab === option.name && "bg-secondary"}`}>{option.icon} {option.name}</Button>
                    </motion.div>
                ))}
            </div>

            <div className="w-full h-full border-1 rounded-md p-3">
                <AnimatePresence>
                    { activeTab == SidebarOptions.appearance.name && <Appearance/> }
                    { activeTab == SidebarOptions.projects.name && <Projects/> }
                </AnimatePresence>
            </div>
        </div>
    );
}

const Transition = {
    initial: { opacity: 0, filter: "blur(2px)", y: 5 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(2px)", y: 5 },
}

function Appearance() {
    const { theme, setTheme } = useTheme();

    const handleSwitchTheme = (v: boolean) => {
        setTheme(v ? "dark" : "light")
    };

    return (
        <motion.div
            variants={Transition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-3">
                <div className="flex gap-1 justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={handleSwitchTheme}/>
                </div>
        </motion.div>
    );
}


function Projects() {
    const { setSetting, getSetting } = useGlobal();

    const handleSelectFolder = async () => {
        const result = await window.api.send("select-folder", {});
        if (result.success === true) { toast.info(`Projects are now being saved to ${result.path}`); setSetting("projectspath", result.path); }
        else { console.log(result.error); toast.error(result.error) };
    };

    const handleWhitespaceReplace = (v: string) => {
        setSetting("whitespacereplace", v);
    };

    const handleCloseOnCode = (v: boolean) => {
        setSetting("closeoncode", v);
    };

    return (
        <motion.div
            variants={Transition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-3">
                <div className="flex gap-1 justify-between">
                    <Label htmlFor="close-on-code">Close Slate when opening a project</Label>
                    <Switch id="close-on-code" checked={getSetting("closeoncode")} onCheckedChange={handleCloseOnCode}/>
                </div>

                <div className="flex gap-1 justify-between items-center">
                    <div>
                        <Label htmlFor="projects-directory">Projects folder</Label>
                        <p className="font-thin text-muted-foreground">{getSetting("projectspath")}</p>
                    </div>
                    <Button id="projects-directory" onClick={handleSelectFolder} variant={"outline"}>Change Directory</Button>
                </div>
                
                <div className="flex gap-1 justify-between items-center">
                    <Label htmlFor="replace-whitespace">Replace white-space with</Label>
                    <Select onValueChange={handleWhitespaceReplace}>
                        <SelectTrigger id="replace-whitespace" className="min-w-[145px]">{getSetting("whitespacereplace")}</SelectTrigger>
                        <SelectContent>
                            <SelectItem value="-">-</SelectItem>
                            <SelectItem value="_">_</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

        </motion.div>
    );
}