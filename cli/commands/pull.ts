import inquirer from 'inquirer';
import { Auth } from '../auth';
import { input } from '@inquirer/prompts';
import { API } from '../api';
import { writeFileSync } from 'fs-extra';

export async function pull() {
	if (!Auth.isLoggedIn()) return console.error('You must log in first!');

	try {
		const projects = await API.getProjects();
		if (!projects || projects.length === 0) return console.error('No projects found!');
		const { project: projectName } = await inquirer.prompt({
			type: 'list',
			name: 'project',
			message: 'Select a project',
			choices: projects.map((project) => project.name)
		});
		if (!projectName) return console.error('Project not found!');

		const projectId = projects.find((p) => p.name === projectName)?.id;
		if (!projectId) return console.error('Project not found!');

		const environments = await API.getEnvironments(projectId);
		if (!environments || environments.length === 0)
			return console.error('No environments found for the selected project!');
		const { environment: environmentName } = await inquirer.prompt({
			type: 'list',
			name: 'environment',
			message: 'Select an environment',
			choices: environments.map((environment) => environment.name)
		});
		if (!environmentName) return console.error('Environment not found!');
		const variables = await API.getVariables(projectId, environmentName);

		const filenameAnswer = await input({
			message: 'Enter the filename to save the variables',
			default: '.env.' + environmentName.toLowerCase().replace(/\s/g, '-')
		});
		writeFileSync(filenameAnswer, variables);
	} catch (error) {
		console.error('Failed to fetch:', error.response?.data?.error || error.message);
	}
}
