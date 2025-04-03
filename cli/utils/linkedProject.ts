import chalk from 'chalk';
import { ConfigManager } from '../config';
import { log } from './logger';

export function checkIfHasLinkedProject(absPath: string) {
  const config = ConfigManager.getConfig();
  const linkedProjects = config.linkedProject;

  const linkedProject = linkedProjects.find((project) => project.absPath === absPath);

  if (!linkedProject) {
    log.info(
      `No project is linked to this directory. Use ${chalk.cyan('env-manager link')} to link a project.`
    );
    process.exit(1);
  }

  return linkedProject;
}
