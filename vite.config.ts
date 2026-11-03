import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					firebase: [
						'firebase/app',
						'firebase/auth',
						'firebase/firestore',
					],
					react: ['react', 'react-dom'],
				},
			},
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://192.168.0.185:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
