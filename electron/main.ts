import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createFolder, deleteProjectFolder, loadProjectsMetadata, openDirectory, openInIde, renameProjectFolder, saveProjectsMetadata } from './project';
import { ProjectType, SettingsSchema } from '@/components/global-provider';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';

// autoUpdater.logger = log;
autoUpdater.autoDownload = false;

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    // show: false,
    width: 850,
    height: 600,
    minWidth: 850,
    minHeight: 600,
    title: "Slate",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      height: 27,
      symbolColor: "#535353",
    },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  
  // Hide menu-bar
  win.setMenu(null);

  win.once("ready-to-show", () => {
    win?.show();
  })

  win.on("closed", () => {
    win = null;
  })
}

app.on('window-all-closed', () => {
  if (win) {
    win.removeAllListeners();
    win.close();
    win = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  };
})

app.disableHardwareAcceleration();
export let store: any = null;
export let projectsPath = "";
app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', (info) => {
    win?.webContents.send('update-available', info);
  });

  const documentsPath = app.getPath("documents");
  store = new Store<SettingsSchema>({
    defaults: {
      theme: "light",
      projectspath: path.join(documentsPath, "pm-projects"),
      whitespacereplace: "-",
      vertical: false,
    },
  });

  projectsPath = store.get("projectspath");

  // Update projects path
  store.onDidChange("projectspath", (newValue: string) => {
    projectsPath = newValue;
    console.log("Updated projectspath:", projectsPath);
  });
});


ipcMain.handle("install-update", async (_event) => {
  try {
    autoUpdater.downloadUpdate();
    return {success: true};
  } catch (err: any) {
    return {error: err.message};
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  win?.webContents.send('update-download-progress', progressObj);
});


ipcMain.handle("config-set", async (_event, args: {settings: SettingsSchema}) => {
  try {
      store.store = args.settings;
      return {success: true};
  } catch (err: any) {
    return {error: err.message};
  }
});

ipcMain.handle("config-get", async (_event) => {
  try {
    const data = await store.store;
    return {success: true, settings: data};
  } catch (err: any) {
    return {error: err.message};
  }
});


ipcMain.handle("new-project-folder", async (_event, args: {name: string}) => {
  return await createFolder(args.name);
});

ipcMain.handle("save-projects-metadata", async (_event, args: {projects: ProjectType[]}) => {
  return await saveProjectsMetadata(args.projects);
});

ipcMain.handle("load-projects-metadata", async () => {
  return await loadProjectsMetadata();
});

ipcMain.handle("delete-project-folder", async (_event, args: {name: string}) => {
  return await deleteProjectFolder(args.name);
})

ipcMain.handle("open-in-ide", async (_event, args: {name: string}) => {
  return await openInIde(args.name);
})

ipcMain.handle("open-directory", async (_event, args: {name: string}) => {
  return await openDirectory(args.name);
})

ipcMain.handle("rename-project-folder", async (_event, args: {name: string, new_name: string}) => {
  return await renameProjectFolder(args.name, args.new_name);
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (result.canceled) {
    return {error: "No directory was selected"};
  }
  else if (result.filePaths.length > 0) {
    return { success: true, path: result.filePaths[0] };
  } else {
    return { success: false };
  };
});

ipcMain.handle("get-app-version", (_event) => {
  return app.getVersion();
})