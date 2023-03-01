// ----- UTILIDADES ----- //

function buzz(ms) {
    window.navigator.vibrate ? navigator.vibrate(ms) : console.log('APPLE PLS, STOP BITCHING PWA DEVELOPERS');
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pushSearch2History(formData) {

    console.log('pushSearch2History')
    const url = (new URL(window.location));
    // console.log(window.location.href);
    // console.log(formData)
    for (const [key, value] of Object.entries(formData)) {
        key === 'potencia' ?
        url.searchParams.set(key, value) :
        url.searchParams.set(key, value) 
    };

    // window.dataLayer = window.dataLayer || [];
    // // console.log(window.location);
    // function gtag() { dataLayer.push(arguments); }
    // gtag('js', new Date());
    // gtag('set', 'page_location', window.location);
    // gtag('config', 'UA-239545553-1');

    if (window.location.href.indexOf('localhost') !== -1) {
        url.searchParams.set('TEST', 'DELETE'); // to prevent sw.js from filling the memory
    };

    window.history.pushState({}, '', url);
}

function clearUrlParameters() {
    let url = document.location.href;
    window.history.pushState({}, "", url.split("?")[0]);
}

function shareProduct(e) {
    console.log(e.currentTarget);
    if (navigator.share) {
        navigator.share({
          title: 'web.dev',
          text: 'Check out web.dev.',
          url: 'https://web.dev/',
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }
}