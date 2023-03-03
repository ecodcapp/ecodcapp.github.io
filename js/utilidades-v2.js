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

    window.history.pushState({}, '', url);
}

function clearUrlParameters() {
    let url = document.location.href;
    window.history.pushState({}, "", url.split("?")[0]);
}

function shareProduct(e) {
    const info = JSON.parse(e.currentTarget.dataset.info);
    
    const hash = RANDALPHA(6, 0);

    const url = window.location.href + '&share=' + hash;
    window.history.pushState({}, '', url);

    if (navigator.share) {
        // console.log(window.location.href);
        navigator.share({
          title: '¡Mira este producto de Toscano!',
          text: `Mira el producto de la gama ECO-DC de Toscano con referencia ${info['Referencia']} (código ${info['Código']}):
          `,
          url: url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }
}

function RANDALPHA(len, num) {
    var text = "";
  
    //Check if numbers
    if(typeof len !== 'number' ||  typeof num !== 'number'){return text = "NaN"};
    
    var charString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()<>-=_+:;";
    var charStringRange
    switch (num){
       case 0:
         //Alphabet with upper and lower case
         charStringRange = charString.substring(0,52);
         break;
       case 1:
         //Alphanumeric
         charStringRange = charString.substring(0,62);
         break;
       case 2:
         //Alphanumeric + characters
         charStringRange = charString;
         break;
       default:
         //error reporting
         return text = "Error: Type choice > 2"    
       
    }
    //
    for (var i = 0; i < len; i++)
      text += charStringRange.charAt(Math.floor(Math.random() * charStringRange.length));
      
    return text;
  }