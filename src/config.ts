// Contact form endpoint. Create a free form at formspree.io and copy its endpoint
// (https://formspree.io/f/xxxxxxx) into VITE_FORM_ENDPOINT: in a local .env file,
// and as a GitHub repository variable for the live site.
// When it is empty, the form opens the visitor's email app instead, so it always works.
export const FORM_ENDPOINT: string = import.meta.env.VITE_FORM_ENDPOINT ?? ''
