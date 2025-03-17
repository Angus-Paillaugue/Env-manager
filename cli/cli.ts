#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { API } from './api';
import { Auth } from './auth';

const program = new Command();

// Login command
program
	.command('login')
	.description('Log in to Env Manager')
	.action(async () => {
		const { email, password } = await inquirer.prompt([
			{ type: 'input', name: 'email', message: 'Enter your email' },
			{ type: 'password', name: 'password', message: 'Enter your password' }
		]);
		try {
			Auth.login(email, password);
			console.log('Login successful!');
		} catch (error) {
			console.error('Login failed:', error.message || error);
		}
	});

// Pull variables
program
	.command('pull')
	.description('Fetch environment variables for a project')
	.action(async () => {
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

			const filenameAnswer = await inquirer.prompt({
				type: 'input',
				name: 'filename',
				message: 'Enter the filename to save the variables',
				default: '.env.' + environmentName.toLowerCase().replace(/\s/g, '-')
			});
			fs.writeFileSync(filenameAnswer.filename, variables);
		} catch (error) {
			console.error('Failed to fetch:', error.response?.data?.error || error.message);
		}
	});

program.parse();
