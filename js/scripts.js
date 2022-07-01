window.addEventListener('load', afterLoad);

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function afterLoad() {

    // LAS SIGUIENTES FUNCIONES TIENEN UNOS 3 SEGUNDOS PARA EJECUTARSE
    setEventListeners()


    await timeout(2500);
    const loadingBanner = Array.from(document.getElementsByClassName('loadingBanner'))[0];
    
    loadingBanner.style.top = '100%';
    loadingBanner.style.bottom = '-100%';
    loadingBanner.style.transition = '0.4s';
    await timeout(1000);
    loadingBanner.style.display = 'none';
    loadingBanner.style.transitionTimingFunction = "ease-out";

}

function setEventListeners() {
    const selectACDC = Array.from(document.getElementsByClassName('seleccionACDC'));
    for(let i = 0; i < selectACDC.length; i++) {
        // console.log(selectACDC[i]);
        selectACDC[i].addEventListener('click', loadSection)
    }

    const backButtons = Array.from(document.getElementsByClassName('back'));
    for(let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener('click', closeSection)
    }
}

function loadSection(e) {

    e.preventDefault();
    const sectionId = `seccion${e.currentTarget.classList[1]}`;
    const selectedSection = document.getElementById(sectionId);

    selectedSection.style.left = `0vw`
    selectedSection.style.right = `0vw`
    selectedSection.style.transition = '0.3s';

}

function closeSection(e) {

    e.preventDefault();
    const sectionId = e.currentTarget.classList[1];
    console.log(sectionId)
    const selectedSection = document.getElementById(sectionId);

    selectedSection.style.left = `110vw`
    selectedSection.style.right = `-100vw`
    selectedSection.style.transition = '0.3s';

}