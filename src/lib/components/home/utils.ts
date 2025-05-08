import { isMobile } from '$lib/utils';

export const NAV_HEIGHT = isMobile.current ? 74 : 84;

export const SECTION_HEIGHT = `calc(100svh - ${NAV_HEIGHT}px)`;
