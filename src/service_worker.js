self.addEventListener("install",(event)=>{
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache)=>{
			cache.addAll(["https://codepen.io/SuperStormer/pen/zdqXGo.css","https://codepen.io/SuperStormer/pen/zdqXGo.js"]);
			return cache.addAll([
				"/",
				"scripts/bundle.js",
				"styles/index.css"
			])
		})
	)
});
self.addEventListener("activate",(event)=>
	event.waitUntil(caches.keys().then((keys)=>
		keys
		.filter((cacheName)=>cacheName!==CACHE_NAME)
		.map((cacheName)=>caches.delete(cacheName))
	))
)
self.addEventListener("fetch", (event)=>
	event.respondWith(
		caches.match(event.request).then((response)=>
			response || fetch(event.request)
		)
	)
);
self.addEventListener("push",(event)=>{
	const json = event.data.json();
	const promiseChain = self.registration.showNotification(`Chore ${json.title}`,{
			body:`for ${json.person}`,
			data:{
				title:json.title
			}
		});
	event.waitUntil(promiseChain);
})
self.addEventListener("notificationclick",(event)=>{
	const urlToOpen = new URL(`?chore=${event.data.title}`,self.location.origin).href;
	const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    let matchingClient = windowClients.find(windowClient=>windowClient.url === urlToOpen);
 		if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(urlToOpen);
    }
  });
	event.waitUntil(promiseChain);
})