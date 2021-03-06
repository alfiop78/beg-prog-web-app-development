importScripts('sw-toolbox.js', 'pirate-manager.js', 'node_modules/localforage/dist/localforage.min.js');

self.addEventListener('install', (event) => {

});

/*********************
 *  Push notifications
 *********************/
self.addEventListener('push', function(event) {
  console.log(`Push received with this data: "${event.data.text()}"`);

  const title = 'Peggy says:';

  let options = {
    body: event.data.text(),
    icon: 'images/peggy_parrot.jpg',
    actions: [
      {
        action: "feed", title: "Feed Peggy"
      },
      {
        action: "wait", title: "Wait to Feed Peggy"
      }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  let promise = new Promise((resolve) => {
    event.notification.close();
    if (event.action === "feed") {
        fetch('http://localhost:8081/feed', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(() => resolve());
    } else if (event.action !== 'wait') {
      self.clients.matchAll().then((clients) => {
        if (clients.length > 0) {
          clients[0].navigate("http://localhost:8080/peggy_parrot.html?feed=true");
        } else {
          self.clients.openWindow("http://localhost:8080/peggy_parrot.html?feed=true");
        }
        resolve();
      });
    }
  });
  event.waitUntil(promise);
});

/*******************
 *  Background Sync
 *******************/
self.addEventListener('sync', (event) => {
  if (event.tag == 'post-comment') {
    event.waitUntil(pirateManager.postComment().then((data) => {
      notifyClient(data);
    }));
  }
});

/*******************
 *  Caching
 *******************/
var CACHE_NAME = 'sw-toolbox-version1';
(() => {
  toolbox.router.get('/images/*', toolbox.fastest, {
    cache: {
      name: CACHE_NAME,
      maxEntries: 20,
      maxAgeSeconds: 60 * 30
    }
  });

  toolbox.router.get('/styles/*', toolbox.cacheFirst, {
    cache: {
      name: CACHE_NAME,
      maxEntries: 20,
      maxAgeSeconds: 60 * 60 * 24 * 7
    }
  });

  toolbox.router.get('*.html', toolbox.cacheFirst, {
    cache: {
      name: CACHE_NAME,
      maxEntries: 20,
      maxAgeSeconds: 60 * 60 * 24 * 7
    }
  });

  toolbox.router.get('*.js', toolbox.cacheFirst, {
    cache: {
      name: CACHE_NAME,
      maxEntries: 20,
      maxAgeSeconds: 60 * 60 * 24 * 7
    }
  });

  toolbox.router.get('/*', toolbox.networkFirst, {
    origin: 'openlibrary.org',
    cache: {
      name: CACHE_NAME,
      maxEntries: 20,
      maxAgeSeconds: 60 * 60 * 12
    }
  });

  toolbox.router.get('/*', toolbox.networkFirst, {
    origin: 'firebaseio.com',
    cache: {
      name: CACHE_NAME,
      maxEntries: 20,
      maxAgeSeconds: 60 * 60 * 24 * 14
    }
  });
})();


function notifyClient(msg){
  self.clients.matchAll({"includeUncontrolled": true}).then((clients) => {
    clients[0].postMessage(msg);
  });
}