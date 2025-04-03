import AlertDangerComponent from './Alert.danger.svelte';
import InfoAlertComponent from './Alert.info.svelte';
import SuccessAlertComponent from './Alert.success.svelte';
import AlertComponent from './Alert.svelte';
import WarningAlertComponent from './Alert.warning.svelte';

const Alert = AlertComponent as typeof AlertComponent & {
  Success: typeof SuccessAlertComponent;
  Danger: typeof AlertDangerComponent;
  Info: typeof InfoAlertComponent;
  Warning: typeof WarningAlertComponent;
};
Alert.Success = SuccessAlertComponent;
Alert.Danger = AlertDangerComponent;
Alert.Info = InfoAlertComponent;
Alert.Warning = WarningAlertComponent;

export default Alert;
