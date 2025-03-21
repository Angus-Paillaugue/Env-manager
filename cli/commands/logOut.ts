import { Auth } from '../auth';
import inquirer from 'inquirer';
import { log } from '../utils/logger';

export async function logOut() {
	const { confirm } = await inquirer.prompt({
		message: 'Are you sure you want to log out?',
		type: 'confirm',
		name: 'confirm',
		default: false
	});

	if (confirm) {
		try {
			await Auth.logOut();
			log.success('Logged out successfully!');
		} catch (error) {
			log.error('Failed to log out:', error.message || error);
		}
	} else {
		log.info('Logout cancelled.');
	}
}
