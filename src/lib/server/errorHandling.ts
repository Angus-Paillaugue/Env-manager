import { error, fail } from '@sveltejs/kit';

export class ErrorHandling {
	static throwActionError(code: number, action: string, error: unknown) {
		const msg = error instanceof Error ? error.message : error;
		console.error(`Error in action ${action}:`, msg);
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
		console.error(`Server error:`, message);
		throw error(500, message);
	}

	static throwBadRequest(message: string) {
		console.error(`Bad request:`, message);
		throw error(400, message);
	}
}
