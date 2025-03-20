import { ConfigManager } from '../../../config';
import { PROGRAM_NAME } from '../../../constants';

export async function configGetFrontendURL() {
	const frontendUrl = ConfigManager.getConfig()?.frontendUrl;

	if (!frontendUrl) {
		console.log(
			`No Frontend URL found in config file, please set it using the command: ${PROGRAM_NAME} config set frontendUrl`
		);
		return;
	}

	console.log('Frontend URL:', frontendUrl);
}
