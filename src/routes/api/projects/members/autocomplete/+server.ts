import { error, json } from '@sveltejs/kit';
import { ProjectMembersDAO } from '$lib/server/db/projectMember';
import { translate } from '$lib/translations';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  const { user } = locals;
  const query = url.searchParams.get('query') || '';
  const limit = parseInt(url.searchParams.get('limit') || '5');

  try {
    const users = await ProjectMembersDAO.autocomplete(user.id, query, limit);
    return json({ users });
  } catch (e) {
    return error(500, {
      message: e instanceof Error ? e.message : translate('errors.unknownError')
    });
  }
};
