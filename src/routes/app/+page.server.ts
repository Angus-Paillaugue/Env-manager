import { ProjectDAO } from '$lib/server/db/project';
import type { Project } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { user } }) => {
	const projects: Project[] = await ProjectDAO.getProjectsByUser(user.id);

	return { projects };
}) satisfies PageServerLoad;
