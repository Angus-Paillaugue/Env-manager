import { error, fail } from '@sveltejs/kit';
import { Logger } from '$lib/utils/logger';

export class ErrorHandling {
  static throwActionError(code: number, action: string, error: unknown, logToFile?: boolean) {
    const msg = error instanceof Error ? error.message : error;
    if (logToFile) Logger.error(`Error in action ${action}:`, msg);
    return fail(code, {
      ok: false,
      action: action,
      error: msg
    });
  }

  static returnSuccess(action: string, body?: unknown) {
    return {
      ok: true,
      action,
      body
    };
  }

  static throwServerError(message: string) {
    Logger.error(`Server error:`, message);
    throw error(500, message);
  }

  static throwBadRequest(message: string) {
    Logger.error(`Bad request:`, message);
    throw error(400, message);
  }
}
