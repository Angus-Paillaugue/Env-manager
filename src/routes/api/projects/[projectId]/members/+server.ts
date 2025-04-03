import { json } from '@sveltejs/kit';
import { ProjectMembersDAO } from '$lib/server/db/projectMember';
import { UserDAO } from '$lib/server/db/user';
import type { ProjectMember } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const members = await ProjectMembersDAO.getMembers(params.projectId as string);
    return json({ members });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : err }, { status: 400 });
  }
};

export const POST: RequestHandler = async ({ locals, params, request }) => {
  const { user } = locals;
  const { memberUsername } = await request.json();

  const role: ProjectMember['role'] = 'guest';

  if (!memberUsername) throw new Error('Member username is required');

  const addedUser = await UserDAO.getUserByUsername(memberUsername);
  if (!addedUser) throw new Error('User not found');
  try {
    await ProjectMembersDAO.addMember(user.id, params.projectId as string, addedUser.id, role);
    return json({
      projectId: params.projectId,
      user: addedUser,
      role,
      userId: addedUser.id
    });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : err }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ locals, params, request }) => {
  const { user } = locals;
  const { memberId } = await request.json();

  if (!memberId) throw new Error('Member id is required');

  const removedUser = await UserDAO.getUserById(memberId);
  if (!removedUser) throw new Error('User not found');
  try {
    await ProjectMembersDAO.removeMember(user.id, params.projectId as string, removedUser.id);
    return json({
      projectId: params.projectId,
      user: removedUser,
      userId: removedUser.id
    });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : err }, { status: 400 });
  }
};
