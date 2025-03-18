interface FormReturn {
	body: unknown;
	ok: boolean;
	action: string;
}

interface FormHandlerOptions {
	onSuccess?: (body: unknown, action: string) => void;
	onError?: (body: unknown, action: string) => void;
}

/**
 * Handles form submission and updates the state accordingly.
 * @param options - Configuration for form handling.
 */
export function handleForm(form: unknown, { onSuccess, onError }: FormHandlerOptions) {
	$effect(() => {
		if (!form) return;

		const { body, ok, action } = form as FormReturn;

		if (ok && action && body) {
			onSuccess?.(body, action);
		} else if (!ok && action && body) {
			onError?.(body, action);
		}
	});
}
