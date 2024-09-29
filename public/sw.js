// Cache version
const CACHE_NAME = 'wordy-cache-v1';

// Files to cache initially
const urlsToCache = [
	'/',
	'/index.html',
	'/manifest.json',
	'/images/bg.png',
	// Add any other static assets that need to be cached initially
];

// Install service worker and cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			try {
				// Cache all the specified files
				await cache.addAll(urlsToCache);
				console.log('Initial assets cached successfully');
			} catch (error) {
				console.error('Failed to cache initial assets during install', error);
			}
		})()
	);
	self.skipWaiting(); // Activate worker immediately
});

// Activate service worker and remove old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const cacheNames = await caches.keys();
			// Remove caches not present in whitelist
			await Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log(`Deleting old cache: ${cacheName}`);
						return caches.delete(cacheName);
					}
				})
			);
			self.clients.claim(); // Take control of all open clients immediately
		})()
	);
});

// Fetch cached assets or network fallback and cache /assets dynamically
self.addEventListener('fetch', (event) => {
	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			const cachedResponse = await caches.match(event.request);

			if (cachedResponse) {
				// Return cached response if found
				return cachedResponse;
			}

			try {
				// Fetch from the network
				const networkResponse = await fetch(event.request);

				// Check if the request is for an asset (dynamically cache it)
				if (event.request.url.includes('/assets/')) {
					// Cache the new asset
					cache.put(event.request, networkResponse.clone());
					console.log(`Caching new asset: ${event.request.url}`);
				}

				return networkResponse;
			} catch (error) {
				console.error('Fetch failed; returning fallback if available', error);
				// Return a fallback page or asset if needed
				return caches.match('/offline.html');
			}
		})()
	);
});
