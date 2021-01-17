var version = 'v1::';

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
		}).catch(function (err) {
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

	event.respondWith(
		caches
		.match(request)
		.then(function (cached) {
			var expired = true;
			
			if (cached) {
				var fetchDate = null;

				if (cached.headers.has('Date')) {
					fetchDate = new Date(cached.headers.get('Date'));
					fetchDate = fetchDate.getTime() - fetchDate.getTimezoneOffset() * 60000;
				}

				if (fetchDate) {
					var expireDate = new Date(new Date().toISOString()).getTime();

					if (cached.headers.has('Expires')) {
						expireDate = new Date(cached.headers.get('Expires'));
						expireDate = expireDate.getTime() - expireDate.getTimezoneOffset() * 60000;
					} else {
						expireDate -= (5*60000); // 5 mins
					}
					
					if (fetchDate < expireDate) {
						console.log('WORKER: fetch cache hit, not-expired', fetchDate, expireDate, request.url);
						expired = false;
					} else {
						console.log('WORKER: fetch cache hit, expired', fetchDate, expireDate, request.url);
					}
				} else {
					console.log('WORKER: fetch cache hit, no date', request.url);
				}
			} else {
				console.log('WORKER: fetch cache miss', request.url);
			}

			if (expired) {
				return fetch(event.request)
					.then(fetchedFromNetwork, unableToResolve)
					.catch(unableToResolve);
			} else {
				return cached;
			}

			function fetchedFromNetwork(response) {
				var cacheCopy = response.clone();

				caches
					.open(version + 'pages')
					.then(function add(cache) {
						cache.put(request, cacheCopy);
					}).then(function () {
						console.log('WORKER: fetch response stored in cache.', request.url);
					}).catch(function (err) {
						console.log('WORKER: fetch response store cache error', err)
					})

				return response;
			}

			function unableToResolve(err) {
				console.log('WORKER: fetch request failed', err);

				return cached || new Response('<h1>Service Unavailable</h1>', {
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