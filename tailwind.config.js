/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter Variable', 'sans-serif'],
				cursive: ['Leckerli One', 'cursive']
			}
		}
	},
	plugins: []
};
