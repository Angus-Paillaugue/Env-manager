import type { ParamMatcher } from '@sveltejs/kit';

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const match = ((param: string): boolean => {
  return uuidRegex.test(param);
}) satisfies ParamMatcher;
