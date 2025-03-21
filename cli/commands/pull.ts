import { Auth } from '../auth';
import { input } from '@inquirer/prompts';
import { API } from '../api';
import fs from 'fs-extra';
import chalk from 'chalk';
import { log } from '../utils/logger';
import { checkIfHasLinkedProject } from '../utils/linkedProject';

export async function pull(projectId?: string, environmentId?: string) {
	if (!(await Auth.isLoggedIn())) return log.error('You must log in first!');

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
