import axios from 'axios';
import { API_URL } from './contants';
import { Auth } from './auth';
import type { Environment, Project } from '../src/lib/types';

export class API {
	static async getProjects() {
		try {
			const response = await axios.get(`${API_URL}/projects`, {
				headers: { Authorization: `Bearer ${Auth.getToken()}` }
			});
			return response.data.projects;
		} catch (error) {
			throw new Error(error.response?.data?.error || error.message);
		}
	}

	static async getEnvironments(projectId: Project['id']) {
		try {
			const response = await axios.get(`${API_URL}/projects/${projectId}/environments`, {
				headers: { Authorization: `Bearer ${Auth.getToken()}` }
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
		try {
			const response = await axios.get(
				`${API_URL}/projects/${projectId}/environments/${environementName}/variables?raw`,
				{
					headers: { Authorization: `Bearer ${Auth.getToken()}` }
				}
			);

			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.error || error.message);
		}
	}
}
