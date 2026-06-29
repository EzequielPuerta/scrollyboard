import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter(),
		csrf: {
			// Behind ngrok the Host header differs from the dev origin; trust the
			// forwarded headers so form actions / POSTs are not rejected.
			trustedOrigins: ['https://*.ngrok-free.app', 'https://*.ngrok.app']
		}
	}
};
