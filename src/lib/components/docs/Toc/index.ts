import { tocItems } from './toc';
import TocComponent from './Toc.svelte';

const Toc = TocComponent as typeof TocComponent & {
  tocItems: typeof tocItems;
};
Toc.tocItems = tocItems;

export default Toc;
