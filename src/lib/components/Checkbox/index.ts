import CheckboxComponent from './Checkbox.svelte';
import ToggleComponent from './Toggle.svelte';

const Checkbox = CheckboxComponent as typeof CheckboxComponent & {
	Toggle: typeof ToggleComponent;
};
Checkbox.Toggle = ToggleComponent;

export default Checkbox;
