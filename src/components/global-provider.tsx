import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import NewUpdateDialog from './ui/dialogs/new-update';
import { Option } from '@/components/shadcn/multiselect';

export enum Pages {
    projects = "projects",
    settings = "settings"
}

type GlobalState = {
    page: Pages,
    setPage: (page: Pages) => void;
    projects: ProjectType[];
    setProjects: (projects: ProjectType[]) => void;
    addProject: (name: string, description: string, languages: string[]) => void;
    deleteProject: (id: number, include_files: boolean) => void;
    pinProject: (id: number) => void;
    editProject: (id: number, new_name: string, new_description: string, languages: string[]) => void;
    openInIde: (name: string) => Promise<boolean>;
    openDirectory: (name: string) => void;
    search: string;
    setSearch: (value: string) => void;
    settings: SettingsSchema;
    setSettingsStore: (store: SettingsSchema) => void;
    setSetting: (key: keyof SettingsSchema, value: any) => void;
    getSetting: (key: keyof SettingsSchema) => any;
}

export type ProjectType = {
  id: number,
  name: string,
  description: string,
  pinned: boolean,
  missingfiles: boolean,
  languages: string[],
}


export type SettingsSchema = {
  theme: 'light' | 'dark';
  projectspath: string;
  whitespacereplace: string;
  vertical: boolean;
  closeoncode: boolean;
};

export const LanguageOptions: Option[] = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Dart', value: 'dart' },
  { label: 'Perl', value: 'perl' },
  { label: 'Lua', value: 'lua' },
  { label: 'Haskell', value: 'haskell' }
];

import pythonIcon from '../../resources/languageicons/python.svg?asset';
import javascriptIcon from '../../resources/languageicons/javascript.svg?asset';
import typescriptIcon from '../../resources/languageicons/typescript.svg?asset';
import javaIcon from '../../resources/languageicons/java.svg?asset';
import cIcon from '../../resources/languageicons/c.svg?asset';
import cppIcon from '../../resources/languageicons/cpp.svg?asset';
import csharpIcon from '../../resources/languageicons/csharp.svg?asset';
import goIcon from '../../resources/languageicons/go.svg?asset';
import rustIcon from '../../resources/languageicons/rust.svg?asset';
import phpIcon from '../../resources/languageicons/php.svg?asset';
import rubyIcon from '../../resources/languageicons/ruby.svg?asset';
import swiftIcon from '../../resources/languageicons/swift.svg?asset';
import kotlinIcon from '../../resources/languageicons/kotlin.svg?asset';
import dartIcon from '../../resources/languageicons/dart.svg?asset';
import perlIcon from '../../resources/languageicons/perl.svg?asset';
import luaIcon from '../../resources/languageicons/lua.svg?asset';
import haskellIcon from '../../resources/languageicons/haskell.svg?asset';

export const languageIconMap: Record<string, string> = {
  python: pythonIcon,
  javascript: javascriptIcon,
  typescript: typescriptIcon,
  java: javaIcon,
  c: cIcon,
  cpp: cppIcon,
  csharp: csharpIcon,
  go: goIcon,
  rust: rustIcon,
  php: phpIcon,
  ruby: rubyIcon,
  swift: swiftIcon,
  kotlin: kotlinIcon,
  dart: dartIcon,
  perl: perlIcon,
  lua: luaIcon,
  haskell: haskellIcon,
};


export const useGlobal = create<GlobalState>((set, get) => ({
  page: Pages.projects,
  setPage: (page: Pages) => set({ page }),

  projects: [],
  setProjects: (projects: ProjectType[]) => set({ projects }),

  addProject: async (name: string, description: string, languages: string[]) => {
    const formattedName = name.replace(/\s+/g, get().settings.whitespacereplace).toLowerCase();;

    const exists = get().projects.some(
      project => project.name.toLowerCase() === formattedName
    );

    if (exists === true) {
      toast.error(`Project ${formattedName} already exists`)
    } else {
      const result = await window.api.send("new-project-folder", {name: formattedName});
      
      if (result.success === true) {
        const projects = get().projects;
        const newProject: ProjectType = {
          id: projects.length > 0 ? projects[projects.length - 1].id + 1 : 1,
          name: formattedName,
          description,
          languages,
          pinned: false,
          missingfiles: false,
        };
        set({ projects: [...projects, newProject] });
  
        toast.info(`Project ${formattedName} successfully created`, {description: result.path});
      } else {
        console.log(result.error);
        toast.error(result.error);
      };
    };
  },

  deleteProject: async (id: number, include_files: boolean) => {
    const name = get().projects.find(p => p.id === id)?.name;

    if (include_files === true) {
      const result = await window.api.send("delete-project-folder", {name: name});

      if (result.success === true) {
        toast.info(`Project ${name} successfully deleted`);
      } else {
        console.log(result.error);
        toast.error(result.error);
      }
    } else {
      toast.info(`Project ${name} successfully removed from the list`)
    }

    const updatedProjects = get().projects.filter(project => project.id !== id);
    set({ projects: updatedProjects });
  },

  pinProject: (id: number) => {
    const updatedProjects = get().projects.map(project =>
      project.id === id ? { ...project, pinned: !project.pinned } : project
    );
    set({ projects: updatedProjects });
  },

  openInIde: async (name: string) => {
    const result = await window.api.send("open-in-ide", {name: name});

    if (result.success === true) { toast.info(`Project ${name} opened`) }
    else { toast.error(result.error) };

    return true;
  },

  openDirectory: async (name: string) => {
    const result = await window.api.send("open-directory", {name: name});

    if (result.success === true) { toast.info(`Directory ${name} successfully opened`) }
    else { toast.error(result.error) };
  },

  editProject: async (id: number, new_name: string, new_description: string, languages: string[]) => {
    const name = get().projects.find(p => p.id === id)?.name;
    const formattedName = new_name.replace(/\s+/g, get().settings.whitespacereplace).toLowerCase();;
    const result = await window.api.send("rename-project-folder", {name: name, new_name: formattedName});

    if (result.success == true) {
      toast.info(`Project ${name} successfully renamed to ${new_name}`);

      set((state) => {
        const updatedProjects = state.projects.map(project =>
          project.id === id
            ? { ...project, name: formattedName, description: new_description, languages }
            : project
        );
      
        return { projects: updatedProjects };
      });
    } else {
      console.log(result.error);
      toast.error(result.error);
    };
  },

  search: "",
  setSearch: (value: string) => set({ search: value }),

  settings: {theme: "light", projectspath: "", whitespacereplace: "", vertical: false, closeoncode: false},
  setSettingsStore: (store: SettingsSchema) => set({ settings: store }),

  setSetting: (key: keyof SettingsSchema, value: any) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      }}));
  },

  getSetting: (key: keyof SettingsSchema) => {
    return get().settings[key];
  },
}));




export default function GlobalProvider({children}: {children: ReactNode}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [updateVersion, setUpdateVersion] = useState<string>("");
  const { projects, setProjects, settings, setSettingsStore } = useGlobal();

  useEffect(() => {
    const saveProjects = async () => {
      const result = await window.api.send("save-projects-metadata", {projects: projects});
      if (result.success === true) { console.log("Projects metadata saved successfully"); }
      else { console.log(result.error); toast.error(result.error); }
    };

    if (projects.length > 0 && loaded && settingsLoaded) { saveProjects(); };
  }, [projects]);

  useEffect(() => {
      const saveSettings = async () => {
          const result = await window.api.send("config-set", {settings: settings});
          if (result.success === true) { console.log("Setting saved") }
          else { console.log(result.error) };
      };

      if (settingsLoaded) { saveSettings(); };
  }, [settings])

  useEffect(() => {
    const loadProjects = async () => {
      const result = await window.api.send("load-projects-metadata", {});
      if (result.success === true) { setProjects(result.projects); setLoaded(true); }
      else { console.log(result.error); toast.error(result.error); }
    };

    const loadSettings = async () => {
        const result = await window.api.send("config-get", {});
        if (result.success === true) { setSettingsStore(result.settings); setSettingsLoaded(true); }
        else { console.log(result.error); toast.error(result.error); };
    };

    loadSettings();
    loadProjects();
  }, []);


  useEffect(() => {
    const unsubscribe = window.api.onUpdateAvailable((info: any) => {
      setUpdateVersion(info.version);
      setUpdateDialogOpen(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <NewUpdateDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen} version={updateVersion}/>
      {children}
    </>
  );
};