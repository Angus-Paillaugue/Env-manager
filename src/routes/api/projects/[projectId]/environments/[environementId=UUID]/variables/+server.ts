import { json, text } from '@sveltejs/kit';
import { EnvironmentDAO } from '$lib/server/db/environment';
import { VariableDAO } from '$lib/server/db/variable';
import type { Variable } from 'lucide-svelte';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals, url }) => {
  const { user } = locals;
  const variables = await VariableDAO.getVariablesByEnvironment(user.id, params.environementId);

  if (url.searchParams.has('raw')) {
    return text(variables.map((variable) => `${variable.name}=${variable.value}`).join('\n'));
  }
  return json({ variables });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
  const { user } = locals;
  const { id } = await request.json();

  try {
    await VariableDAO.deleteVariable(user.id, id);
    return json({ message: 'Variable deleted' });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
  }
};

export const POST: RequestHandler = async ({ params, locals, request }) => {
  const { user } = locals;
  const environment = await EnvironmentDAO.getEnvironmentById(user.id, params.environementId);

  if (!environment) return json({ message: 'Environment not found' }, { status: 404 });

  const data = await request.json();

  try {
    if (data?.variables) {
      // Is passing an array of variables
      await Promise.all(
        (data.variables as Variable[]).map((variable) =>
          VariableDAO.createVariable(user.id, environment.id, variable.name, variable.value)
        )
      );
    } else {
      // Is passing a single variable
      const variable = data as Variable;
      await VariableDAO.createVariable(user.id, environment.id, variable.name, variable.value);
    }

    return json({ message: 'Variables created' });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
  }
};
