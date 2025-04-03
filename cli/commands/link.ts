import inquirer from 'inquirer';
import { API } from '../api';
import { Auth } from '../auth';
import { ConfigManager, LinkedProject } from '../config';
import { PROGRAM_NAME } from '../constants';
import { log } from '../utils/logger';

export async function link() {
  if (!(await Auth.isLoggedIn())) return log.error('You must log in first!');

  const config = await ConfigManager.getConfig();
  const linkedProjects = config.linkedProject;
  const currentDir = process.cwd();
  const projectInThisDir = linkedProjects.find((project) => project.absPath === currentDir);
  try {
    if (projectInThisDir) {
      const project = await API.getProject(projectInThisDir.projectId);
      log.info('A project named ' + project.name + ' is already linked to this directory');
      log.info(`If you want to remove it, use ${PROGRAM_NAME} unlink`);
      return;
    }

    const projects = await API.getProjects();
    if (!projects || projects.length === 0) {
      log.error('No projects found');
      return;
    }

    const { projectId } = await inquirer.prompt({
      type: 'list',
      name: 'projectId',
      choices: projects.map((project) => ({
        name: project.name,
        value: project.id
      })),
      message: 'Select the project to link:'
    });
    if (!projectId) {
      log.error('Project not found');
      return;
    }
    const project = await API.getProject(projectId);
    if (!project) {
      log.error('Project not found');
      return;
    }
    const environments = await API.getEnvironments(projectId);
    if (!environments || environments.length === 0) {
      log.error('No environments found for the selected project');
      return;
    }
    const { environment: selectedEnvironmentName } = await inquirer.prompt({
      message: 'Select an environment',
      type: 'list',
      name: 'environment',
      choices: environments.map((env) => env.name)
    });
    if (!selectedEnvironmentName) {
      log.error('Environment not found');
      return;
    }
    const environment = environments.find((env) => env.name === selectedEnvironmentName);
    if (!environment) {
      log.error('Environment not found');
      return;
    }

    const newProject: LinkedProject = {
      projectId: projectId,
      absPath: currentDir,
      environmentId: environment.id
    };
    config.linkedProject.push(newProject);
    await ConfigManager.saveConfig(config);
    log.success('Project has been linked to this directory.');
  } catch (error) {
    log.error(
      'An error occurred while linking the project:',
      error instanceof Error ? error.message : error
    );
  }
}
