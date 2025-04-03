import { json } from '@sveltejs/kit';
import { EnvironmentDAO } from '$lib/server/db/environment';
import type { Environment } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const { user } = locals;
  const environment = await EnvironmentDAO.getEnvironmentById(user.id, params.environementId);
  return json({ environment });
};

type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

export const PATCH: RequestHandler = async ({ request, locals }) => {
  const { user } = locals;
  const environment: RequireKeys<Partial<Environment>, 'id'> = await request.json();

  if (!environment.id) {
    return json({ error: 'Environment id is required' }, { status: 400 });
  }

  try {
    const environmentFromDB = await EnvironmentDAO.getEnvironmentById(user.id, environment.id);
    if (!environmentFromDB) {
      return json({ error: 'Environment not found' }, { status: 404 });
    }

    const updatedEnvironment = await EnvironmentDAO.editEnvironment(
      user.id,
      environment.id,
      environment
    );

    return json({ environment: updatedEnvironment });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  const { user } = locals;
  const { environmentId } = await request.json();

  if (!environmentId) {
    return json({ error: 'Environment id is required' }, { status: 400 });
  }

  try {
    await EnvironmentDAO.deleteEnvironment(user.id, environmentId);
    return json({ environmentId });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
};
