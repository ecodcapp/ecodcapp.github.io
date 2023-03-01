window.addEventListener('load', afterLoad);

let jsonDB = {};

async function afterLoad() {

    // clearUrlParameters();
    let url = document.location.href;
    console.log(url);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params);
    // if (JSON.stringify(params) != '{}') {
    //     formatResultado(params);
    // }
    // formatResultado(resultado);
    window.history.pushState({}, "", url.split("?")[0]);

    // LAS SIGUIENTES FUNCIONES TIENEN UNOS 3 SEGUNDOS PARA EJECUTARSE
    setEventListeners();


    // LOAD HARDCODED ECO-DC DB

    // const fetchedURL = 'https://script.google.com/macros/s/AKfycbxkh_dWYR_09WIYlhu8aYWc_kBx_10U2mW7mJJZszi6nS3NeNH9uZhKUtBoT2k2vdai3Q/exec';
    const fetchedURL = 'https://script.google.com/macros/s/AKfycbyYaGzDFmCoKOu2xIly1851IRe7oW2Cp2PMhliPaDELM-sV0IQOb2SR4Id1XgMjVBP9/exec';
    fetch(fetchedURL)
        .then(response => response.json())
        .then(data => {
            jsonDB = { ...data };
            if (JSON.stringify(params) != '{}') {
                buscarProducto1(params);
            }
        })
        .catch(error => console.log(error));


    const ecoDcTitle = Array.from(document.getElementsByClassName('ecoDcTitle'))[0];
    ecoDcTitle.style.fontSize = '1.9rem';
    const loadingBanner = Array.from(document.getElementsByClassName('loadingBanner'))[0];
    // loadingBanner.style.background = 'linear-gradient(45deg, #e52a2aff, rgb(255, 161, 106))';
    await timeout(2000);

    loadingBanner.style.top = '100%';
    loadingBanner.style.bottom = '-100%';
    loadingBanner.style.transition = '0.4s';
    await timeout(1000);
    loadingBanner.style.display = 'none';
    loadingBanner.style.transitionTimingFunction = "ease-out";

    // let checkboxCol = [...document.querySelectorAll("[data-inputtype='checkboxCol']")];
    // checkboxCol = checkboxCol.map(x => x.children[0].children[1]);
    // checkboxCol.forEach(x => x.style.height = x.offsetHeight + 'px');

}

function setEventListeners() {

    const selectACDC = Array.from(document.getElementsByClassName('seleccionACDC'));
    selectACDC.forEach(x => x.addEventListener('click', loadSection));

    const backButtons = Array.from(document.getElementsByClassName('back'));
    backButtons.forEach(x => x.addEventListener('click', closeSection))

    document.getElementById('formResultsDivBack')
        .addEventListener('click', function (event) {

            clearUrlParameters()

            let results = document.getElementById('formResultsDiv');
            buzz(20);
            results.style.top = "110%";
            results.style.bottom = "-110%";
        })

    const siguienteDC = document.querySelector('.siguienteDC');
    siguienteDC.addEventListener('click', goForward);

    const atrasDC = document.querySelector('.atrasDC');
    atrasDC.addEventListener('click', goBackward);

    const siguienteAC = document.querySelector('.siguienteAC');
    siguienteAC.addEventListener('click', goForward);

    const atrasAC = document.querySelector('.atrasAC');
    atrasAC.addEventListener('click', goBackward);

    const siguienteACDC = document.querySelector('.siguienteACDC');
    siguienteACDC.addEventListener('click', goForward);

    const atrasACDC = document.querySelector('.atrasACDC');
    atrasACDC.addEventListener('click', goBackward);

    const compartir = document.getElementById('compartir');
    compartir.addEventListener('click', shareProduct)
}

function loadSection(e) {

    e.preventDefault();

    const section = e.currentTarget.classList[1];

    unactivateAtras(section);

    switch (section) {
        case 'DC':
            const secInput = document.querySelectorAll('.seccionadorInput')
            secInput.forEach(x => {
                if (x.checked) { !x.checked };
                x.addEventListener('click', preActivateSiguiente);
            });
            break;

        case 'AC':
            const fasesInput = document.querySelectorAll('.inversorMonoTri.Option.AC');
            fasesInput.forEach(x => {
                if (x.checked) { x.checked = false };
                x.addEventListener('click', preActivateSiguiente);
            });
            break;

        case 'ACDC':
            const firstInput = document.getElementById('proteccionACDC').children[0];

            const productos = jsonDB.productos.filter(x => x.proteccion == section);
            // console.log(productos);
            let initialData = productos.map(x => x[firstInput.dataset.input]);
            initialData = [...new Set(initialData)].sort((a, b) => a - b).join(',');
            // console.log(initialData);
            firstInput
                .children[0]
                .children[1]
                .children[0]
                .dataset
                .initialData = initialData;
            let initialValue = initialData.split(',');
            initialValue = Math.floor((Math.max(...initialValue) - Math.min(...initialValue)) / 2);
            firstInput.children[0].children[1].children[0].value = initialValue > 1 ? initialValue : 2;
            // console.log(initialData);

            ableInput(firstInput);
            activateSiguiente(section)
            break;
    }

    const selectedSection = document.getElementById(`seccion${section}`);

    const back = $(`.back.seccion${section}`)[0];
    const back2 = $(`.back2.seccion${section}`)[0];
    const back3 = $(`.back3.seccion${section}`)[0];
    back.style.transform = 'translateX(0)';
    back2.style.transform = 'translateX(0)';
    back3.style.transform = 'translateX(0)';

    buzz(20);


    selectedSection.style.left = `0vw`;
    selectedSection.style.right = `0vw`;
    selectedSection.style.transition = '0.4s';

}

function closeSection(e) {

    e.preventDefault();
    const sectionId = e.currentTarget.classList[1];

    const proteccion = sectionId.split('n')[1];

    resetSection(proteccion);

    const selectedSection = document.getElementById(sectionId);

    const back = $(`.back.${sectionId}`)[0];
    const back2 = $(`.back2.${sectionId}`)[0];
    const back3 = $(`.back3.${sectionId}`)[0];
    back.style.transform = 'translateX(5rem)';
    back2.style.transform = 'translateX(5rem)';
    back3.style.transform = 'translateX(5rem)';

    buzz(20)

    selectedSection.style.left = `110vw`;
    selectedSection.style.right = `-100vw`;
    selectedSection.style.transition = '0.3s';

}


