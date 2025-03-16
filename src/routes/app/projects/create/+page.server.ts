import { ProjectDAO } from '$lib/server/db/project';
import { ProjectMembersDAO } from '$lib/server/db/projectMember';
import type { Project } from '$lib/types';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	async create({ locals, request }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { name } = formData as { name: string };

		// Check if username is provided
		if (!name || name.length < 3)
			return fail(400, { error: 'Please enter a name (at least 3 characters)!' });

		let project: Project | null = null;
		try {
			project = await ProjectDAO.createProject(name);
			ProjectMembersDAO.addMember(project.id, user.id, 'owner');
		} catch (error) {
			console.error(error);
			return fail(400, { error: 'An error occurred!' });
		}

		if (project) throw redirect(303, '/app/projects/' + project.id);
		else {
			return fail(400, { error: 'An error occurred!' });
		}
	}
};
