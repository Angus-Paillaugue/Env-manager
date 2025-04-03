import chalk from 'chalk';
import inquirer from 'inquirer';
import { API } from '../api';
import { Auth } from '../auth';
import { ConfigManager } from '../config';
import { checkIfHasLinkedProject } from '../utils/linkedProject';
import { log } from '../utils/logger';
import { pull } from './pull';

export async function changeEnv() {
  if (!(await Auth.isLoggedIn())) return log.error('You must log in first!');

  const currentDir = process.cwd();
  const projectInThisDir = checkIfHasLinkedProject(currentDir);
  const config = ConfigManager.getConfig();
  const project = await API.getProject(projectInThisDir.projectId);
  if (!project) return log.error('Project not found!');
  const environments = project.environments;
  const currentEnv = environments.find((env) => env.id === projectInThisDir.environmentId);
  log.info('Current environment:', chalk.bold.cyan(currentEnv.name));
  if (!environments || environments.length === 0) return log.error('No environments found!');
  const envNames = environments.map((env) => env.name);
  const { envName } = await inquirer.prompt({
    type: 'list',
    name: 'envName',
    message: 'Select an environment',
    choices: envNames
  });

  config.linkedProject = config.linkedProject.map((linkedProject) => {
    if (linkedProject.absPath === currentDir) {
      const foundEnv = environments.find((env) => env.name === envName);
      linkedProject.environmentId = foundEnv.id;
      projectInThisDir.environmentId = foundEnv.id;
      currentEnv.name = foundEnv.name;
    }
    return linkedProject;
  });
  ConfigManager.saveConfig(config);

  const { pullVariables } = await inquirer.prompt({
    type: 'confirm',
    name: 'pullVariables',
    message: `Do you want to pull variables for the new ${chalk.bold.cyan(currentEnv.name)} environment?`,
    default: true
  });

  if (!pullVariables) return;
  await pull(projectInThisDir.projectId, projectInThisDir.environmentId);
}
