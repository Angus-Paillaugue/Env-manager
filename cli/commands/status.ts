import chalk from 'chalk';
import { API } from '../api';
import { Auth } from '../auth';
import { ConfigManager } from '../config';
import { PROGRAM_NAME } from '../constants';
import { log } from '../utils/logger';

export async function status() {
  try {
    const config = await ConfigManager.getConfig();
    if (!config.frontendUrl) {
      log.error(
        `No API URL found in config file, please set it using the command: ${PROGRAM_NAME} config set frontendUrl`
      );
      return;
    } else {
      log.info(`API URL: ${config.apiUrl}`);
    }
    if (!(await Auth.isLoggedIn())) {
      log.error(`You are not logged in. Please login using the command: "${PROGRAM_NAME} login"`);
      return;
    } else {
      log.success('You are logged in.');
    }
    const linkedProjects = config.linkedProject;
    const currentDir = process.cwd();
    const linkedProject = linkedProjects.find((project) => project.absPath === currentDir);
    if (linkedProject) {
      const project = await API.getProject(linkedProject.projectId);
      log.success(`Project ${chalk.bold.cyan(project.name)} is linked to this directory.`);
    } else {
      log.error('No project is linked to this directory.');
    }
  } catch (error) {
    log.error(error.message);
  }
}
