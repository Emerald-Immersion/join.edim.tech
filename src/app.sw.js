var version = 'v4::';

self.addEventListener("install", function (event) {
	console.log('WORKER: install event in progress.');
	event.waitUntil(
		caches
		.open(version + 'fundamentals')
		.then(function (cache) {
			return cache.addAll([
				'/',
				'/config.js',
				'/app.js',
				'/style.css',
				'/favicon.ico',
				'/modules/particles.js',
				'/media/discord.svg',
				'/media/EDIM_512.png',
				'/media/planetside.png',
				'/media/teamspeak.png'
			]);
		}).then(function () {
			console.log('WORKER: install completed');
		}).catch(function () {
			console.log(err);
		})
	);
});

self.addEventListener("fetch", function (event) {
	console.log('WORKER: fetch event in progress.');

	// TODO: Auto cache cleanup?

	if (event.request.method !== 'GET') {
		console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
		return;
	}

	var request = event.request;

	var apiCache = request.url.match(/&callback=callback_([0-9]+)$/);

	if (apiCache) {
		console.log('WORKER: fetch api callback detected, url callback cropped.');
		request = new Request(request, {
			url: request.url.substr(0, apiCache.index)
		});
	}

	event.respondWith(
		caches
		.match(request)
		.then(function (cached) {
			var expired = false;

			if (cached && cached.headers.has('Date')) {
				var fetchDate = new Date(cached.headers.get('Date')).getDate();
				var expireDate = Date.now();

				if (apiCache) {
					expireDate -= (1*60000);
				} else if (cached.headers.has('Expires')) {
					expireDate = new Date(cached.headers.get('Expires')).getDate();
				} else {
					expireDate -= (5*60000);
				}

				if (fetchDate < expireDate) {
					console.log('WORKER: fetch cache hit', fetchDate, expireDate, request.url);
				} else {
					console.log('WORKER: fetch cache expired', fetchDate, expireDate, request.url);
					expired = true;
				}
			} else {
				console.log('WORKER: fetch cache miss', request.url);
			}

			// Always use original event.request for network
			var networked = fetch(event.request)
				.then(fetchedFromNetwork, unableToResolve)
				.catch(unableToResolve);

			return expired ? networked || cached : cached || networked;

			function fetchedFromNetwork(response) {
				var cacheCopy = response.clone();

				caches
					.open(version + 'pages')
					.then(function add(cache) {
						cache.put(request, cacheCopy);
					}).then(function () {
						console.log('WORKER: fetch response stored in cache.', request.url);
					}).catch(function () {
						console.log(err);
					});

				return response;
			}

			function unableToResolve() {
				console.log('WORKER: fetch request failed in both cache and network.');

				return new Response('<h1>Service Unavailable</h1>', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: new Headers({
						'Content-Type': 'text/html'
					})
				});
			}
		})
	);
});

self.addEventListener("activate", function (event) {
	console.log('WORKER: activate event in progress.');

	event.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(
				keys
				.filter(function (key) {
					return !key.startsWith(version);
				})
				.map(function (key) {
					return caches.delete(key);
				})
			);
		}).then(function () {
			console.log('WORKER: activate completed.');
		}).catch(function () {
			console.log(err);
		})
	);
});