import {
	createPrompt,
	useState,
	useKeypress,
	usePrefix,
	isEnterKey,
	isBackspaceKey,
	makeTheme,
	type Theme,
	type Status
} from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';

type InputTheme = {
	validationFailureMode: 'keep' | 'clear';
};

const inputTheme: InputTheme = {
	validationFailureMode: 'keep'
};

type InputConfig = {
	message: string;
	default?: string;
	transformer?: (value: string, { isFinal }: { isFinal: boolean }) => string;
	theme?: PartialDeep<Theme<InputTheme>>;
};

function validateInput(value: string): boolean | string {
	return /^\d{6}$/.test(value) ? true : 'Please provide a valid 6-digit code';
}

export default createPrompt<string, InputConfig>((config, done) => {
	const theme = makeTheme<InputTheme>(inputTheme, config.theme);
	const [status, setStatus] = useState<Status>('idle');
	const [defaultValue = '', setDefaultValue] = useState<string>(config.default);
	const [errorMsg, setError] = useState<string>();
	const [value, setValue] = useState<string>('');

	const prefix = usePrefix({ status, theme });

	useKeypress((key, rl) => {
		if (status !== 'idle') {
			return;
		}

		if (isEnterKey(key)) {
			const answer = value || defaultValue;
			setStatus('loading');

			const isValid = validateInput(answer);
			if (isValid === true) {
				setValue(answer);
				setStatus('done');
				done(answer);
			} else {
				if (theme.validationFailureMode === 'clear') {
					setValue('');
				} else {
					rl.write(value);
				}
				setError(isValid || 'You must provide a valid value');
				setStatus('idle');
			}
		} else if (isBackspaceKey(key) && !value) {
			setDefaultValue(undefined);
		} else if (key.name === 'tab' && !value) {
			setDefaultValue(undefined);
			rl.clearLine(0);
			rl.write(defaultValue);
			setValue(defaultValue);
		} else {
			setValue(rl.line);
			setError(undefined);
		}
	});

	const message = theme.style.message(config.message, status);
	let formattedValue = value;
	if (typeof config.transformer === 'function') {
		formattedValue = config.transformer(value, { isFinal: status === 'done' });
	} else if (status === 'done') {
		formattedValue = theme.style.answer(value);
	}

	let defaultStr;
	if (defaultValue && status !== 'done' && !value) {
		defaultStr = theme.style.defaultAnswer(defaultValue);
	}

	let error = '';
	if (errorMsg) {
		error = theme.style.error(errorMsg);
	}

	return [
		[prefix, message, defaultStr, formattedValue].filter((v) => v !== undefined).join(' '),
		error
	];
});
