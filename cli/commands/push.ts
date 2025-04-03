import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { API } from '../api';
import { Auth } from '../auth';
import { checkIfHasLinkedProject } from '../utils/linkedProject';
import { log } from '../utils/logger';

export async function push() {
  if (!(await Auth.isLoggedIn())) return log.error('You must log in first!');

  try {
    const currentDir = process.cwd();
    const projectInThisDir = checkIfHasLinkedProject(currentDir);

    const projects = await API.getProjects();
    if (!projects || projects.length === 0) return log.error('No projects found!');

    const environmentId = projectInThisDir.environmentId;
    const environment = projects
      .find((p) => p.id === projectInThisDir.projectId)
      ?.environments.find((env) => env.id === environmentId);
    if (!environment) return log.error('Environment not found!');
    const environmentName = environment.name;
    const projectId = projectInThisDir.projectId;

    log.info(`Preparing to push variables for environment ${chalk.bold.cyan(environmentName)}...`);

    const filename = await input({
      message: 'Enter the filename to read the variables from',
      default: '.env.' + environmentName.toLowerCase().replace(/\s/g, '-')
    });
    if (!fs.existsSync(filename)) return log.error('File not found!');
    const fileContent = fs.readFileSync(filename, 'utf-8');
    const variables = fileContent
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const [key, value] = line.split('=');
        return { name: key.trim(), value: value.trim() };
      });

    log.warning('This will overwrite all variables in the environment.');
    log.info('If you want to add or update only specific variables, use the web interface.');
    const { confirm } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to push ${chalk.yellow(
        variables.length
      )} variables to ${chalk.bold.cyan(environmentName)}?`,
      default: false
    });
    if (!confirm) return log.info('Push cancelled.');
    const response = await API.pushVariables(projectId, environmentName, variables);
    if (response) {
      log.success('Variables pushed successfully!');
    } else {
      log.error('Failed to push variables.');
    }
  } catch (error) {
    log.error(`Failed to push: ${error.response?.data?.error || error.message}`);
  }
}
