import { isMobile } from '$lib/utils';

// 18px for the page's padding bottom on desktop and 8px on mobile
// 72px for the navbar's height
export const HEIGHT_OFFSET = (isMobile.current ? 8 : 18) + 72;

export const SECTION_HEIGHT = `calc(100svh - ${HEIGHT_OFFSET}px)`;
