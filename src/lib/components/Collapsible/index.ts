import CollapsibleComponent from './Collapsible.svelte';
import CollapsibleGroup from './Group.svelte';

const Collapsible = CollapsibleComponent as typeof CollapsibleComponent & {
  Group: typeof CollapsibleGroup;
};
Collapsible.Group = CollapsibleGroup;

export default Collapsible;
