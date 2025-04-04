import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import { API } from '../api';
import { Auth } from '../auth';
import { checkIfHasLinkedProject } from '../utils/linkedProject';
import { log } from '../utils/logger';

export async function pull() {
  if (!(await Auth.isLoggedIn())) return log.error('You must log in first!');
  const project = checkIfHasLinkedProject(process.cwd());
  const projectId = project.projectId;
  const environmentId = project.environmentId;

  if (projectId && environmentId) {
    const projects = await API.getProjects();
    if (!projects || projects.length === 0) return log.error('No projects found!');
    const currentProject = projects.find((p) => p.id === projectId);
    if (!currentProject) return log.error('Project not found!');
    const environment = currentProject.environments.find((env) => env.id === environmentId);
    if (!environment) return log.error('Environment not found!');
    log.info(
      `Pulling variables for project ${chalk.bold.cyan(currentProject.name)} and environment ${chalk.bold.cyan(
        environment.name
      )}...`
    );
    const variables = await API.getVariables(projectId, environment.name);
    const filenameAnswer = await input({
      message: 'Enter the filename to save the variables',
      default: '.env.' + environment.name.toLowerCase().replace(/\s/g, '-')
    });
    fs.writeFileSync(filenameAnswer, variables);
    log.success(`Variables saved to ${chalk.bold.cyan(filenameAnswer)}`);
    return;
  }
  const currentDir = process.cwd();
  const projectInThisDir = checkIfHasLinkedProject(currentDir);

  const projects = await API.getProjects();
  if (!projects || projects.length === 0) return log.error('No projects found!');
  const currentProject = projects.find((p) => p.id === projectInThisDir.projectId);
  if (!currentProject) return log.error('Project not found!');

  try {
    const environmentId = projectInThisDir.environmentId;
    const environment = currentProject.environments.find((env) => env.id === environmentId);
    if (!environment) return log.error('Environment not found!');
    log.info(
      `Pulling variables for project ${chalk.bold.cyan(currentProject.name)} and environment ${chalk.bold.cyan(
        environment.name
      )}...`
    );
    const variables = await API.getVariables(projectInThisDir.projectId, environment.name);

    const filenameAnswer = await input({
      message: 'Enter the filename to save the variables',
      default: '.env.' + environment.name.toLowerCase().replace(/\s/g, '-')
    });
    fs.writeFileSync(filenameAnswer, variables);
    log.success(`Variables saved to ${chalk.bold.cyan(filenameAnswer)}`);
  } catch (error) {
    log.error(`Failed to fetch: ${error.response?.data?.error || error.message}`);
  }
}
