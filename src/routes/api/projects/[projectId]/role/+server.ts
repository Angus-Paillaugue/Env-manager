import { error, json } from '@sveltejs/kit';
import { ProjectMembersDAO } from '$lib/server/db/projectMember';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
  const { user } = locals;
  const { projectId } = params;

  try {
    // TODO: Use API call instead of direct DAO call
    const role = await ProjectMembersDAO.getUserRole(projectId, user.id);
    if (!role) {
      throw new Error('Unauthorized');
    }

    return json({ role });
  } catch (e) {
    return error(401, e instanceof Error ? e.message : 'Unauthorized');
  }
};
