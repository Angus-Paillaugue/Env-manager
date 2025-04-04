import { error, json } from '@sveltejs/kit';
import { ProjectMembersDAO } from '$lib/server/db/projectMember';
import { translate } from '$lib/translations';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
  const { user } = locals;
  const { projectId } = params;

  try {
    const role = await ProjectMembersDAO.getUserRole(projectId, user.id);
    if (!role) {
      throw new Error(translate('errors.unauthorized'));
    }

    return json({ role });
  } catch (e) {
    return error(401, e instanceof Error ? e.message : translate('errors.unauthorized'));
  }
};
