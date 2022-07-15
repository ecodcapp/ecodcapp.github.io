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

    await timeout(2000);
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

    const forms = Array.from(document.getElementsByTagName('form'));
    forms.forEach(x => x.addEventListener('submit', buscarProducto));
    // .addEventListener('submit', buscarProducto);

    document.getElementById('formResultsDivBack')
        .addEventListener('click', function (event) {
            let results = document.getElementById('formResultsDiv');
            buzz(20);
            results.style.top = "110%";
            results.style.bottom = "-110%";
    })
}

function loadSection(e) {

    e.preventDefault();
    
    window.history.pushState(e.view.history.state, null, '');
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

    if (listaClases[0] === 'ACDCNStrings') {
        console.log('seteando ACDC');
        processStrings(arrow, listaClases, input);
        return
    }
}

function processStrings(arrow, listaClases, input) {

    let stringsRange = ['1', '2', '3', '4', '5', '6', '8'];
    if(listaClases[0] === "ACDCNStrings") {
        stringsRange = stringsRange.splice(0,3);
    }

    // console.log(`this is ${listaClases[0]}`);

    if (listaClases.indexOf('up') !== -1) {

        let arrowUp = arrow;
        let arrowDown = Array.from(document.getElementsByClassName(`${listaClases[0]} arrow down`))[0];

        if (input.value === stringsRange[stringsRange.length - 1]) {

            buzz([10, 90, 10])
            return stringsRange.indexOf(input.value)

        }

        if (input.value === stringsRange[stringsRange.length - 2]) {

            input.value = stringsRange[stringsRange.indexOf(input.value) + 1];
            arrowUp.style.backgroundColor = 'lightgrey';
            buzz(20)
            return stringsRange.indexOf(input.value)

        }

        if (input.value === stringsRange[0]) {

            input.value = stringsRange[stringsRange.indexOf(input.value) + 1];
            arrowDown.style.backgroundColor = 'var(--headerBG)';
            buzz(20)
            return stringsRange.indexOf(input.value)

        }

        input.value = stringsRange[stringsRange.indexOf(input.value) + 1];
        buzz(20)
        return stringsRange.indexOf(input.value)

    }

    let arrowDown = arrow;
    let arrowUp = Array.from(document.getElementsByClassName(`${listaClases[0]} arrow up`))[0];


    if (input.value === stringsRange[stringsRange.length - 1]) {

        input.value = stringsRange[stringsRange.indexOf(input.value) - 1];
        arrowUp.style.backgroundColor = 'var(--headerBG)';
        buzz(20)
        return stringsRange.indexOf(input.value)

    }

    if (input.value === stringsRange[1]) {

        arrowDown.style.backgroundColor = 'lightgrey';
        input.value = stringsRange[stringsRange.indexOf(input.value) - 1];
        buzz([10, 90, 10])
        return stringsRange.indexOf(input.value)

    }

    if (input.value === stringsRange[0]) {

        arrowDown.style.backgroundColor = 'lightgrey';
        input.value = stringsRange[stringsRange.indexOf(input.value)];
        buzz([10, 90, 10])
        return stringsRange.indexOf(input.value)

    }

    input.value = stringsRange[stringsRange.indexOf(input.value) - 1];
    buzz(20)
    return stringsRange.indexOf(input.value)

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

async function buscarProducto(formAnswers) {

    console.log(formAnswers)

    formAnswers.preventDefault();

    let data = Object.fromEntries(new FormData(formAnswers.target).entries());
    let formData = { ...data };
    formData.proteccion = formAnswers.srcElement.id.split('n')[1];

    // if(formData.proteccion === 'DC') {};

    if (formData.proteccion === 'DC' && 'seccionadores' in data) {
        formData.seccionadores = true;
    } else {
        formData.seccionadores = false;
    }

    console.log(formData);

    // FILTRADO DE LA BASE DE DATOS
    // let resultado = jsonDB.productos.filter(
    //     x => x.strings == formData.strings &&
    //         x.mppt == formData.MPPT &&
    //         x.proteccion === formData.proteccion &&
    //         x.seccionadores === formData.seccionadores
    // );
    let resultado = jsonDB.productos.filter(x => x.proteccion === formData.proteccion);
    
    if(formData.proteccion === 'DC') {
        resultado = resultado.filter(x =>
            x.strings == formData.strings &&
            x.mppt == formData.MPPT &&
            x.seccionadores === formData.seccionadores
        )
    }

    if(formData.proteccion === 'AC') {
        
        const minP = 5;
        const maxP = 70;
        
        resultado = resultado.filter(x =>
            x.fases === formData.fases
        )
        
        resultado.forEach(x =>
            x.Potencia = Math.round(x.Amperaje.slice(-3,-1) * (x.fases === '1' ? 230 : 400 * Math.sqrt(3)) / 1000 / 1.25 *100) / 100 + ' kW'
        )

        const powerThresholds = resultado.map(x => parseFloat(x.Potencia.slice(0,-3)))
        console.log(powerThresholds);
        
        console.log(formData.potencia)
        // console.log(powerThresholds.indexOf(Math.min(...powerThresholds.filter(x => x > formData.potencia))));
        let indexPower = powerThresholds.indexOf(Math.min(...powerThresholds.filter(x => x > formData.potencia)));
        console.log(indexPower)
        resultado = resultado[indexPower];
        console.log(resultado)
    }

    if (resultado.length === 0) {
        let resultDiv = document.getElementById('formResultsDiv'); //JSON.stringify(resultado[0], null, 4);
        resultDiv.style.top = 0;
        resultDiv.style.bottom = 0;

        const firstBlockImg = document.getElementById('firstBlockImg');
        // console.log(jsonDB.familias.filter(x => x.familia === resultado.familia));
        let imageSrc = 'resources/productos/salta-el-diferencial.webp';
        if (firstBlockImg) {
            firstBlockImg.src = imageSrc;
        }
        document.getElementById('secondBlockh1').textContent = 'Sigue buscando';
        const specList = document.getElementById('secondBlockListItems');
        specList.innerHTML = '';
        
        return
    } //RETURN

    if(Array.isArray(resultado) && resultado.length === 1) {resultado = resultado[0]}
    
    formatResultado(resultado)

    await timeout(100);

}

function formatResultado(resultado) {
    const firstBlockImg = document.getElementById('firstBlockImg');
    // console.log(jsonDB.familias.filter(x => x.familia === resultado.familia));
    let imageSrc = jsonDB.familias.filter(x => x.familia === resultado.familia)[0].imagen;
    if (firstBlockImg) {
        firstBlockImg.src = imageSrc;
    }

    document.getElementById('secondBlockh1').textContent = resultado.Referencia;

    // let fields = Object.entries(resultado).filter(x => x[0] === x[0].toUpperCase());
    
    const specsEntries = Object.entries(resultado).filter(x => x[0][0] === x[0][0].toUpperCase());
    // console.log(specsEntries)
    let specs = specsEntries.filter(x => x[0] !== 'Referencia');
    specs = Object.fromEntries(specs);
    specsKeys = Object.keys(specs);
    specsValues = Object.values(specs);

    const specList = document.getElementById('secondBlockListItems');
    specList.innerHTML = '';
    // console.log(specList)
    for(i = 0; i < specsKeys.length; i++) {
        let listItem = document.createElement('li');
        listItem.textContent = `${specsKeys[i]}: `;
        let listItemValue = document.createElement('span');
        listItemValue.textContent = `${specsValues[i]}`;
        listItem.appendChild(listItemValue);
        specList.appendChild(listItem);
    }

    let resultDiv = document.getElementById('formResultsDiv'); //JSON.stringify(resultado[0], null, 4);
    resultDiv.style.top = 0;
    resultDiv.style.bottom = 0;
}

function buzz(ms) {
    window.navigator.vibrate ? navigator.vibrate(ms) : console.log('APPLE PLS, STOP BITCHING PWA DEVELOPERS');
}

function updatePotencia(value, proteccion) {
    buzz(20);
    proteccion = 'potenciaDisplay' + proteccion;
    document.getElementById(proteccion).textContent = value;
}
