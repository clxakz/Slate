import { app } from 'electron';
import { access, constants, mkdir, readFile, rename, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { ProjectType } from '@/components/global-provider'
import { projectsPath } from './main';


// const projectsPath = join(app.getPath("documents"), "pm-projects");
const metadataFile = join(app.getPath("userData"), "pm-metadata.json");


export async function createFolder(name: string) {
  try {
    await mkdir(join(projectsPath, name), { recursive: true });
    return {success: true, path: join(projectsPath, name)}
  } catch (err: any) {
    return {error: err.message}
  }
};


export async function saveProjectsMetadata(projects: ProjectType[]) {
  try {
    const json = JSON.stringify(projects, null, 2);
    await writeFile(metadataFile, json, 'utf-8');
    return {success: true};
  } catch (err: any) {
    return {error: err.message};
  }
};


export async function loadProjectsMetadata() {
  try {
    try {
      await access(metadataFile, constants.F_OK);
    } catch {
      await writeFile(metadataFile, JSON.stringify([], null, 2), 'utf-8');
    }

    const data = await readFile(metadataFile, 'utf-8');

    const projects: ProjectType[] = JSON.parse(data);

    for (const project of projects) {
      const folderPath = join(projectsPath, project.name);
      try {
        await access(folderPath, constants.F_OK);
        project.missingfiles = false;
      } catch {
        project.missingfiles = true;
      }
    }

    return {success: true, projects: projects};
  } catch (err: any) {
    return { error: err.message };
  }
}


export async function deleteProjectFolder(name: string) {
  try {
    const folderPath = join(projectsPath, name);
    await rm(folderPath, { recursive: true, force: true });
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}


export async function openInIde(name: string) {
  const projectPath = join(projectsPath, name);

  return new Promise((resolve) => {
    exec(`code "${projectPath}"`, (error, stderr) => {
      if (error) {
        console.error(error.message);
        resolve({ error: error.message });
        return;
      }

      if (stderr) {
        console.warn(stderr);
      }
      resolve({ success: true });
    });
  });
}


export async function openDirectory(name: string) {
  const projectPath = join(projectsPath, name);

  try {
    await access(projectPath, constants.F_OK);
  } catch {
    return { error: `Folder "${name}" does not exist.` };
  }

  return new Promise((resolve) => {
    exec(`start "" "${projectPath}"`, (error, stderr) => {
      if (error) {
        console.error(error.message);
        resolve({ error: error.message });
        return;
      }

      if (stderr) {
        console.warn(stderr);
      }
      resolve({ success: true });
    });
  });
}


export async function renameProjectFolder(name: string, new_name: string) {
  const oldPath = join(projectsPath, name);
  const newPath = join(projectsPath, new_name);

  try {
    await rename(oldPath, newPath);
    return { success: true };
  } catch (err: any) {
    console.error(err.message);
    return { error: err.message };
  }
}