(() => {

  console.log(navigator);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Il metodo register passa il path dello script service-worker.js e restituisce una promise, su questa si può quindi
      // chiamare 'then'
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      console.log(registration);
    }, function(err) {
        console.log(err);
      });
    });
  } else {
    alert('No service worker support in this browser');
  }
})();
