import MobileItem from './MobileItem.svelte';
import SidebarComponent from './Sidebar.svelte';

const Sidebar = SidebarComponent as typeof SidebarComponent & {
  MobileItem: typeof MobileItem;
};
Sidebar.MobileItem = MobileItem;

export default Sidebar;
