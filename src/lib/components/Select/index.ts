import SelectComponent from './Select.svelte';
import OptionComponent from './Option.svelte';

const Select = SelectComponent as typeof SelectComponent & { Option: typeof OptionComponent };
Select.Option = OptionComponent;

export default Select;
