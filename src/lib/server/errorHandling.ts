import { error, fail } from '@sveltejs/kit';

export class ErrorHandling {
	static throwActionError(code: number, action: string, error: unknown) {
		console.error(`Error in action ${action}:`, error);
		return fail(code, {
			ok: false,
			action: action,
			error: error instanceof Error ? error.message : error
		});
	}

	static throwServerError(message: string) {
		console.error(`Server error:`, message);
		throw error(500, message);
	}

	static throwBadRequest(message: string) {
		console.error(`Bad request:`, message);
		throw error(400, message);
	}
}
