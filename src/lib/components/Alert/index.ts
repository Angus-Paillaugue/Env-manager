import AlertComponent from './Alert.danger.svelte';
import SuccessAlertComponent from './Alert.success.svelte';
import WarningAlertComponent from './Alert.warning.svelte';
import InfoAlertComponent from './Alert.info.svelte';

const Alert = AlertComponent as typeof AlertComponent & {
	Success: typeof SuccessAlertComponent;
	Danger: typeof AlertComponent;
	Info: typeof InfoAlertComponent;
	Warning: typeof WarningAlertComponent;
};
Alert.Success = SuccessAlertComponent;
Alert.Danger = AlertComponent;
Alert.Info = InfoAlertComponent;
Alert.Warning = WarningAlertComponent;

export default Alert;
