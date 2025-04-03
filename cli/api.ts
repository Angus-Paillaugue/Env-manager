import axios from 'axios';
import type { Environment, Project, Variable } from '../src/lib/types';
import { Auth } from './auth';
import { ConfigManager } from './config';

export class API {
  static async getProjects() {
    const config = ConfigManager.getConfig();
    try {
      const token = await Auth.getToken();
      const response = await axios.get(`${config.apiUrl}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.projects;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  static async getProject(projectId: Project['id']) {
    const config = ConfigManager.getConfig();
    try {
      const token = await Auth.getToken();
      const response = await axios.get(`${config.apiUrl}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.project;
    } catch (error) {
      if (error?.response?.status === 404) {
        throw new Error('API is not joinable');
      }
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  static async getEnvironments(projectId: Project['id']) {
    const config = ConfigManager.getConfig();
    try {
      const token = await Auth.getToken();
      const response = await axios.get(`${config.apiUrl}/projects/${projectId}/environments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.environments;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  static async getVariables(
    projectId: Project['id'],
    environementName: Environment['name']
  ): Promise<string> {
    const config = ConfigManager.getConfig();
    try {
      const token = await Auth.getToken();
      const response = await axios.get(
        `${config.apiUrl}/projects/${projectId}/environments/${environementName}/variables?raw`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  static async pushVariables(
    projectId: Project['id'],
    environmentName: Environment['name'],
    variables: Variable[]
  ) {
    const config = ConfigManager.getConfig();
    try {
      const token = await Auth.getToken();
      const response = await axios.put(
        `${config.apiUrl}/projects/${projectId}/environments/${environmentName}/variables`,
        { variables },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }
}
