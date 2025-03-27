import chalk from 'chalk';

export const log = {
	info: (...messages: string[]) => console.log(`${chalk.blue('ℹ')} ${messages.join(' ')}`),
	success: (...messages: string[]) => console.log(`${chalk.green('✔')} ${messages.join(' ')}`),
	warning: (...messages: string[]) => console.log(`${chalk.yellow('⚠')} ${messages.join(' ')}`),
	error: (...messages: string[]) => console.error(`${chalk.red('✖')} ${messages.join(' ')}`)
};
