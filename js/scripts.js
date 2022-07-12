window.addEventListener('load', afterLoad); 

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let jsonDB = {};

async function afterLoad() {

    // LAS SIGUIENTES FUNCIONES TIENEN UNOS 3 SEGUNDOS PARA EJECUTARSE
    setEventListeners()

    // LOAD HARDCODED ECO-DC DB
    fetch('hcdb.json')
        .then(response => response.json())
        .then(data => { jsonDB = { ...data } })
        .catch(error => console.log(error));

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
    for (let i = 0; i < selectACDC.length; i++) {
        selectACDC[i].addEventListener('click', loadSection)
    }

    const backButtons = Array.from(document.getElementsByClassName('back'));
    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener('click', closeSection)
    }

    const arrows = Array.from(document.getElementsByClassName('arrow'));
    arrows.forEach(x => x.addEventListener('click', changeInputValue));

    const seccionadores = document.getElementById('seccionadores');
    seccionadores.addEventListener('change', function () {
        buzz(20)
    });

    document.querySelector('form').addEventListener('submit', buscarProducto);

    document.getElementById('formResultsDivBack')
    .addEventListener('click', function(event) {
        let results = document.getElementById('formResultsDiv');
        results.style.top = "110%"
        results.style.bottom = "-110%"
    })

}

function loadSection(e) {

    e.preventDefault();
    const sectionId = `seccion${e.currentTarget.classList[1]}`;
    const selectedSection = document.getElementById(sectionId);

    buzz(20)

    selectedSection.style.left = `0vw`
    selectedSection.style.right = `0vw`
    selectedSection.style.transition = '0.3s';

}

function closeSection(e) {

    e.preventDefault();
    const sectionId = e.currentTarget.classList[1];
    console.log(sectionId)
    const selectedSection = document.getElementById(sectionId);

    buzz(20)

    selectedSection.style.left = `110vw`
    selectedSection.style.right = `-100vw`
    selectedSection.style.transition = '0.3s';

}

function changeInputValue(e) {

    e.preventDefault();

    const arrow = e.currentTarget;
    const listaClases = Array.from(arrow.classList);
    const input = document.getElementById(listaClases[0]);

    if (listaClases[0] === 'DCNStrings') {
        let numStrIndx = processStrings(arrow, listaClases, input);
        setMPPT(numStrIndx);
        return
    }
}

function processStrings(arrow, listaClases, input) {

    DCstringsRange = ['1', '2', '3', '4', '5', '6', '8'];

    // console.log(`this is ${listaClases[0]}`);

    if (listaClases.indexOf('up') !== -1) {

        let arrowUp = arrow;
        let arrowDown = Array.from(document.getElementsByClassName(`${listaClases[0]} arrow down`))[0];

        if (input.value === DCstringsRange[DCstringsRange.length - 1]) {

            buzz([10, 90, 10])
            return DCstringsRange.indexOf(input.value)

        }

        if (input.value === DCstringsRange[DCstringsRange.length - 2]) {

            input.value = DCstringsRange[DCstringsRange.indexOf(input.value) + 1];
            arrowUp.style.backgroundColor = 'lightgrey';
            buzz(20)
            return DCstringsRange.indexOf(input.value)

        }

        if (input.value === DCstringsRange[0]) {

            input.value = DCstringsRange[DCstringsRange.indexOf(input.value) + 1];
            arrowDown.style.backgroundColor = 'var(--headerBG)';
            buzz(20)
            return DCstringsRange.indexOf(input.value)

        }

        input.value = DCstringsRange[DCstringsRange.indexOf(input.value) + 1];
        buzz(20)
        return DCstringsRange.indexOf(input.value)

    }

    let arrowDown = arrow;
    let arrowUp = Array.from(document.getElementsByClassName(`${listaClases[0]} arrow up`))[0];


    if (input.value === DCstringsRange[DCstringsRange.length - 1]) {

        input.value = DCstringsRange[DCstringsRange.indexOf(input.value) - 1];
        arrowUp.style.backgroundColor = 'var(--headerBG)';
        buzz(20)
        return DCstringsRange.indexOf(input.value)

    }

    if (input.value === DCstringsRange[1]) {

        arrowDown.style.backgroundColor = 'lightgrey';
        input.value = DCstringsRange[DCstringsRange.indexOf(input.value) - 1];
        buzz([10, 90, 10])
        return DCstringsRange.indexOf(input.value)

    }

    if (input.value === DCstringsRange[0]) {

        arrowDown.style.backgroundColor = 'lightgrey';
        input.value = DCstringsRange[DCstringsRange.indexOf(input.value)];
        buzz([10, 90, 10])
        return DCstringsRange.indexOf(input.value)

    }

    input.value = DCstringsRange[DCstringsRange.indexOf(input.value) - 1];
    buzz(20)
    return DCstringsRange.indexOf(input.value)

}

function setMPPT(numStrIndx) {
    // const DCstrings
    const DCstrMPPTmatrix = [
        [1, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 0],
        [1, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 1]
    ]

    const DCstrMPPT = DCstrMPPTmatrix[numStrIndx];
    // console.log(DCstrMPPT);

    let MPPTinversor = Array.from(document.getElementsByClassName('MPPTinversor Option'));
    // console.log(MPPTinversor);
    MPPTinversor.forEach(x => DCstrMPPT[MPPTinversor.indexOf(x)] ? x.disabled = false : x.disabled = true);
    MPPTinversor.forEach(x => x.checked = false);
    MPPTinversor.filter(x => x.disabled === false)[0].checked = true;

}

function buscarProducto(formAnswers) {

    formAnswers.preventDefault();

    let data = Object.fromEntries(new FormData(formAnswers.target).entries());
    let formData = { ...data };
    formData.proteccion = formAnswers.srcElement.id.split('n')[1];
    if ('seccionadores' in data) {
        formData.seccionadores = true;
    } else {
        formData.seccionadores = false;
    }

    console.log(formData);

    let resultado = jsonDB.productos.filter(
        x => x.strings == formData.strings &&
             x.MPPT == formData.MPPT &&
             x.proteccion === formData.proteccion
    );
    resultado = resultado[0];

    console.log(resultado);

    let resultDiv = document.getElementById('formResultsDiv'); //JSON.stringify(resultado[0], null, 4);
    resultDiv.style.top = 0;
    resultDiv.style.bottom = 0;
    
    const firstBlockImg = document.getElementById('firstBlockImg');
    let imageSrc = jsonDB.familias.filter(x => x.familia === resultado.familia)[0].imagen;
    if(firstBlockImg) {
        firstBlockImg.src = imageSrc;
    }
    document.getElementById('secondBlockh1').textContent = resultado.Referencia;
    document.getElementById('spanCodigo').textContent = resultado.Código;
    document.getElementById('spanEntraSali').textContent = resultado['Entrada-Salida'];
    resultado["Amperaje seccionador"] ? 
        document.getElementById('spanAmpSec').textContent = resultado["Amperaje seccionador"] :
        document.getElementById('spanAmpSec').parentElement.style.display = 'none';
    document.getElementById('spanPVP').textContent = resultado.PVP;
}

function buzz(ms) {
    window.navigator.vibrate ? navigator.vibrate(ms) : console.log('APPLE PLS, STOP BITCHING PWA DEVELOPERS');
}