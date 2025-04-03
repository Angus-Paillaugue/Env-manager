import path from 'path';
import envPaths from 'env-paths';
import fs from 'fs-extra';
import type { Environment, Project } from '../src/lib/types';
import { PROGRAM_NAME } from './constants';

const CONFIG_PATH = path.join(envPaths(PROGRAM_NAME).config, 'config.json');

export interface LinkedProject {
  projectId: Project['id'];
  absPath: string;
  environmentId: Environment['id'];
}

export type ValidConfig = {
  apiUrl: string;
  frontendUrl: string;
  linkedProject: LinkedProject[];
};
export type ConfigData = Partial<ValidConfig>;

const DEFAULT_CONFIG = {
  linkedProject: []
};

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

  static saveConfig(data: ConfigData) {
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

    const mergedConfig = {
      ...DEFAULT_CONFIG,
      ...config
    };

    return mergedConfig as ValidConfig;
  }

  static setConfig(data: Partial<ConfigData>) {
    this.saveConfig(data);
  }
}
