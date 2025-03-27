import { ErrorHandling } from '$lib/server/errorHandling';
import type { Project } from '$lib/types';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	async create({ request, fetch }) {
		const formData = Object.fromEntries(await request.formData());
		const { name } = formData as { name: string };

		// Check if username is provided
		if (!name || name.length < 3)
			return ErrorHandling.throwActionError(
				400,
				'create',
				'Project name must be at least 3 characters long!'
			);

		let project: Project | null = null;
		try {
			const res = await fetch('/api/projects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name })
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.error || 'Failed to create project');
			}
			project = data.project as Project;
		} catch (error) {
			return ErrorHandling.throwActionError(400, 'create', error, true);
		}

		if (project) {
			throw redirect(303, '/app/projects/' + project.id);
		} else {
			return ErrorHandling.throwActionError(
				400,
				'create',
				'An error occurred while creating the project!',
				true
			);
		}
	}
};
