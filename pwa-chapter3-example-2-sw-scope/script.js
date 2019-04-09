(() => {

  // Lo scope del service-worker influenzerà su tutta l'applicazione se definito nella root oppure in specifiche cartelle
  // influenzerà solo le sottocartelle, in base a dove è posizionato lo script

  // qui viene specificato lo scope in 'trivia' e come secondo parametro si può specificare solo una sottocartella di trivia
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('scripts/trivia/service-worker.js', {scope: 'scripts'}).then((registration) => {
      console.log('registered');
      console.log(registration);
    }, (err) => {
        console.log(err);
      });
    });
  } else {
    alert('No service worker support in this browser');
  }
})();
