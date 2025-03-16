import CardComponent from './Card.svelte';
import HeadingComponent from './Heading.svelte';

const Card = CardComponent as typeof CardComponent & { Heading: typeof HeadingComponent };
Card.Heading = HeadingComponent;

export default Card;
