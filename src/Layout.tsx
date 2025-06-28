import { AnimatePresence } from "motion/react";
import { Pages, useGlobal } from "./components/global-provider";
import Projects from "./components/pages/projects";
import Settings from "./components/pages/settings";
import Navbar from "./components/ui/navbar";
import Titlebar from "./components/ui/titlebar";

export default function Layout() {
  const { page } = useGlobal();

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Titlebar/>

      <div className="p-1 space-y-1 flex flex-col flex-1 overflow-hidden">
        <Navbar/>
        
        <div className="flex-1 overflow-auto">
          <AnimatePresence>
            { page == Pages.projects && <Projects/> };
            { page == Pages.settings && <Settings/> };
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
