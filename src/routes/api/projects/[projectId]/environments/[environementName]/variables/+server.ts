import { json, text } from '@sveltejs/kit';
import { EnvironmentDAO } from '$lib/server/db/environment';
import { VariableDAO } from '$lib/server/db/variable';
import type { Variable } from '$lib/types';
import type { RequestHandler } from './$types';

// Get all variables of an environment
export const GET: RequestHandler = async ({ params, locals, url, fetch }) => {
  const { user } = locals;
  const environment = await EnvironmentDAO.getEnvironmentByName(
    user.id,
    params.projectId,
    params.environementName
  );
  if (!environment) return json({ message: 'Environment not found' }, { status: 404 });

  const res = await fetch(
    `/api/projects/${params.projectId}/environments/${environment.id}/variables`
  );
  const { variables }: { variables: Variable[] } = await res.json();

  if (url.searchParams.has('raw'))
    return text(variables.map((variable) => `${variable.name}=${variable.value}`).join('\n'));

  return json({ variables });
};

// Delete a variable
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

// Create variables that does not exist and overwrite the ones that already exist
export const POST: RequestHandler = async ({ params, locals, request }) => {
  const { user } = locals;
  const environment = await EnvironmentDAO.getEnvironmentByName(
    user.id,
    params.projectId,
    params.environementName
  );
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

// Update a variable
export const PATCH: RequestHandler = async ({ locals, request }) => {
  const { user } = locals;
  const { id, name, value } = await request.json();

  try {
    const newVar = await VariableDAO.editVariable(user.id, id, name, value);
    return json({ message: 'Variable updated', variable: newVar });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
  }
};

// Replace all of a project's variables with the given ones
export const PUT: RequestHandler = async ({ locals, request, params }) => {
  const { user } = locals;
  const { variables } = await request.json();

  try {
    const environment = await EnvironmentDAO.getEnvironmentByName(
      user.id,
      params.projectId,
      params.environementName
    );
    if (!environment) return json({ message: 'Environment not found' }, { status: 404 });

    await VariableDAO.replaceVariables(user.id, environment.id, variables);

    return json({ message: 'Variables updated' });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : error }, { status: 400 });
  }
};
