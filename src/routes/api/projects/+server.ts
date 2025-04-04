import { json } from '@sveltejs/kit';
import { ProjectDAO } from '$lib/server/db/project';
import { translate } from '$lib/translations';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  const { user } = locals;

  try {
    const projects = (await ProjectDAO.getProjectsByUser(user.id)) || [];
    return json({ projects });
  } catch (error) {
    console.log(error);
    return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
  }
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const { user } = locals;
  const { name } = await request.json();

  if (!name || name.length < 3) {
    return json({ error: translate('errors.projectNameTooShort') }, { status: 400 });
  }

  try {
    const project = await ProjectDAO.createProject(user.id, name);
    return json({ project });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
  }
};
