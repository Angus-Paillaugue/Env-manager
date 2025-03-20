import path from 'path';
import fs from 'fs-extra';
import envPaths from 'env-paths';
import { PROGRAM_NAME } from './constants';

const CONFIG_PATH = path.join(envPaths(PROGRAM_NAME).config, 'config.json');

export type ValidConfig = {
	apiUrl: string;
	frontendUrl: string;
};
export type ConfigData = Partial<ValidConfig>;

export class ConfigManager {
	private static loadConfig(): ConfigData {
		if (!fs.existsSync(CONFIG_PATH)) {
			return {};
		}

		try {
			return fs.readJsonSync(CONFIG_PATH) as ConfigData;
		} catch (error) {
			console.error('Failed to read config file:', error);
			return {};
		}
	}

	private static saveConfig(data: ConfigData) {
		const oldConfig = this.loadConfig() ?? {};
		const newConfig = { ...oldConfig, ...data };
		if (newConfig.frontendUrl) {
			const frontendUrl = new URL(newConfig.frontendUrl);
			newConfig.frontendUrl = frontendUrl.origin;
			frontendUrl.pathname = '/api';
			newConfig.apiUrl = frontendUrl.href;
		}
		fs.ensureFileSync(CONFIG_PATH);
		fs.writeJsonSync(CONFIG_PATH, newConfig, { spaces: 2 });
	}

	static getConfig(throwError: boolean = true): ValidConfig {
		const config = this.loadConfig();

		if (!config.frontendUrl && throwError) {
			console.error(
				`No API URL found in config file, please set it using the command: ${PROGRAM_NAME} config set frontendUrl`
			);
			process.exit(1);
		}

		return config as ValidConfig;
	}

	static setConfig(data: Partial<ConfigData>) {
		this.saveConfig(data);
	}
}
