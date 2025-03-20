import inquirer from 'inquirer';
import { ConfigManager } from '../../../config';
import { input } from '@inquirer/prompts';

export async function configSetFrontendUrl() {
	const frontendUrlExists = !!ConfigManager.getConfig(false)?.frontendUrl;

	if (frontendUrlExists) {
		console.log('Current frontend URL:', ConfigManager.getConfig().frontendUrl);
		const { confirm } = await inquirer.prompt({
			message: 'Are you sure you want to set a new frontend URL?',
			type: 'confirm',
			name: 'confirm',
			default: false
		});
		if (!confirm) {
			console.log('Cancelled setting the Frontend URL');
			return;
		}
	}

	let isURLValid = false;
	let frontendUrl = '';
	while (!isURLValid) {
		frontendUrl = await input({
			message: 'Enter the Frontend URL:'
		});

		frontendUrl = new URL(frontendUrl).href;

		try {
			isURLValid = await fetch(frontendUrl).then((res) => res.ok);
			if (!isURLValid) {
				console.log('Invalid URL. Please try again.');
			}
		} catch (_e) {
			console.log('Invalid URL. Please try again.');
			isURLValid = false;
		}
	}

	ConfigManager.setConfig({
		frontendUrl
	});

	console.log('API URL set successfully');
}
