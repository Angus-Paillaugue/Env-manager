import { Auth } from '../auth';
import inquirer from 'inquirer';

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
			console.log('Logged out successfully!');
		} catch (error) {
			console.error('Failed to log out:', error.message || error);
		}
	} else {
		console.log('Logout cancelled.');
	}
}
