import DropdownComponent from './Dropdown.svelte';
import Item from './Item.svelte';
import Trigger from './Trigger.svelte';

const Dropdown = DropdownComponent as typeof DropdownComponent & {
  Item: typeof Item;
  Trigger: typeof Trigger;
};
Dropdown.Item = Item;
Dropdown.Trigger = Trigger;

export default Dropdown;
