import { configGetFrontendURL } from './get/frontendUrl';
import { configSetFrontendUrl } from './set/frontendUrl';

export async function config(program) {
	const config = program.command('config').description('Manage configuration');
	const getConfig = config.command('get').description('Get a configuration value');
	const setConfig = config.command('set').description('Set a configuration value');
	setConfig.command('frontendUrl').description('Set the frontend URL').action(configSetFrontendUrl);
	getConfig.command('frontendUrl').description('Get the frontend URL').action(configGetFrontendURL);
}
