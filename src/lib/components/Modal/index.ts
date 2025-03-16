import ModalComponent from './Modal.svelte';
import Backdrop from './Backdrop.svelte';
import Title from './Tile.svelte';
import Heading from './Heading.svelte';
import Description from './Description.svelte';
import Actions from './Actions.svelte';

export const TRANSITION_DURATION = 400;

const Modal = ModalComponent as typeof ModalComponent & {
	Backdrop: typeof Backdrop;
	Title: typeof Title;
	Heading: typeof Heading;
	Description: typeof Description;
	Actions: typeof Actions;
};
Modal.Backdrop = Backdrop;
Modal.Title = Title;
Modal.Heading = Heading;
Modal.Description = Description;
Modal.Actions = Actions;

export default Modal;
