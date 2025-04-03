import inquirer from 'inquirer';
import { ConfigManager } from '../config';
import { checkIfHasLinkedProject } from '../utils/linkedProject';
import { log } from '../utils/logger';

export async function unlink() {
  const config = await ConfigManager.getConfig();
  const linkedProjects = config.linkedProject;
  const currentDir = process.cwd();
  checkIfHasLinkedProject(currentDir);

  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    message: 'Are you sure you want to unlink the project from this directory?',
    default: false,
    name: 'confirm'
  });

  if (!confirm) {
    log.error('Unlinking canceled.');
    return;
  }

  config.linkedProject = linkedProjects.filter((project) => project.absPath !== currentDir);
  await ConfigManager.saveConfig(config);
  log.info('Project has been unlinked from this directory.');
}
