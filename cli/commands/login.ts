import { Auth } from '../auth';
import TOTPInput from '../components/TOTPInput';
import { password as passwordInput, input } from '@inquirer/prompts';

export async function login() {
	const askCredentials = async () => {
		const email = await input({ message: 'Enter your email' });
		const password = await passwordInput({
			message: 'Enter your password'
		});
		const res = await Auth.login(email, password);
		return { error: res, email, password };
	};

	let { error, email, password } = await askCredentials();
	while (error) {
		if (error === 'TOTP') {
			// Need TOTP code
			const totpCode = await TOTPInput({
				message: 'Enter your TOTP code'
			});
			try {
				await Auth.loginWithTOTP(email, password, totpCode);
				error = null;
			} catch (error) {
				console.error('Login failed:', error.message || error);
			}
		} else {
			// Other error (related to email or password)
			// Ask for email and password again
			console.error('Login failed:', error);
			({ error, email, password } = await askCredentials());
		}
	}
	console.log('Login successful!');
}
