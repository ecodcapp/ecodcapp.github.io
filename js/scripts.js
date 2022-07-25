window.addEventListener('load', afterLoad);

// window.onbeforeunload = function () {
//     return '¿Quieres salir de la aplicación?';
// };

let jsonDB = {};

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    const inversorMonoTriAC = Array.from(document.getElementsByClassName('inversorMonoTri Option'));
    inversorMonoTriAC.forEach(x => x.addEventListener('change', setMaxPower))

    const saberMasOpen = document.getElementById('saberMasOpen');
    saberMasOpen.addEventListener('click', openSaberMas);
    const saberMasClose = document.getElementById('saberMasClose');
    saberMasClose.addEventListener('click', closeSaberMas);

    const forms = Array.from(document.getElementsByClassName('formProduct'));
    forms.forEach(x => x.addEventListener('submit', buscarProducto));

    const customFormOpen = document.getElementById('formWrap');
    customFormOpen.addEventListener('click', openCustomForm);

    const customFormSectionBack = document.getElementById('customFormSectionBack');
    customFormSectionBack.addEventListener('click', closeCustomForm)

    document.getElementById('formResultsDivBack')
        .addEventListener('click', function (event) {
            let results = document.getElementById('formResultsDiv');
            buzz(20);
            results.style.top = "110%";
            results.style.bottom = "-110%";
        })
}

async function openSaberMas(e) {

    const saberMasBtn = document.getElementById('saberMasBtn');
    const saberMasOpen = e.currentTarget;
    const saberMasClose = document.getElementById('saberMasClose')
    const main = document.getElementsByTagName('main')[0];

    const saberMasContenido = document.getElementById('saberMasContenido');
    saberMasContenido.style.top = 0;
    // saberMasContenido.scrollBy()

    saberMasBtn.style.backgroundColor = 'lightcoral';
    saberMasBtn.style.borderColor = 'white';

    saberMasOpen.style.transform = 'translateY(-1.8rem)';
    saberMasClose.style.transform = 'translateY(-1.8rem)';

    buzz(20);

    main.style.filter = 'blur(.1rem)';

    saberMasContenido.scrollBy({
        top: saberMasContenido.scrollHeight,
        behavior: 'instant'
    });
    await timeout(300);
    saberMasContenido.scrollBy({
        top: -saberMasContenido.scrollHeight,
        behavior: 'smooth'
    });

}

function closeSaberMas(e) {
    const saberMasBtn = document.getElementById('saberMasBtn');
    const saberMasOpen = document.getElementById('saberMasOpen')
    const saberMasClose = e.currentTarget;
    const main = document.getElementsByTagName('main')[0];

    const saberMasContenido = document.getElementById('saberMasContenido');
    saberMasContenido.style.top = '-110vh';

    saberMasBtn.style.backgroundColor = 'var(--headerBG)';
    saberMasBtn.style.borderColor = 'lightcoral';

    saberMasOpen.style.transform = 'translateY(0)';
    saberMasClose.style.transform = 'translateY(0)';

    buzz(20);

    main.style.filter = 'blur(0)';

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
    // console.log(sectionId)
    const selectedSection = document.getElementById(sectionId);

    buzz(20)

    selectedSection.style.left = `110vw`
    selectedSection.style.right = `-100vw`
    selectedSection.style.transition = '0.3s';

}

function openCustomForm(e) {
    const customFormSection = document.getElementById('customFormSection');
    customFormSection.style.bottom = 0;
}

function closeCustomForm(e) {
    const customFormSection = document.getElementById('customFormSection');
    customFormSection.style.bottom = '-110%';
}

function customProduct(e) {
    const formCustom = e.target;
    let correo = 'eco%20dc%20a%C3%91pp%20@%20tos%20%C3%91ca%20no%20.Xes';
    correo = decodeURI(correo).split(' ');
    correo = correo.join('').split('Ñ');
    correo = correo.join('').split('X').join('');
    let subject = 'Pedido especial gama ECO-DC';
    let body = 'Buenos días:\n\nNo he podido encontrar en vuestra aplicación de asistente de selección de la game ECO-DC la configuración que estaba buscando. ¿Podrían ayudarme?\n\nMuchas gracias';
    body = encodeURI(body);
    formCustom.action=`mailto:${correo}?subject=${subject}&body=${body}`;
    // location.href = `mailto:${correo}?subject=${subject}&body=${body}`;
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
        // console.log('seteando ACDC');
        processStrings(arrow, listaClases, input);
        setMaxPowerString(listaClases[0], input)
        return
    }
}

function processStrings(arrow, listaClases, input) {

    let stringsRange = ['1', '2', '3', '4', '5', '6', '8'];
    if (listaClases[0] === "ACDCNStrings") {
        stringsRange = stringsRange.splice(0, 3);
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
        [1, 0, 0, 0, 0, 0, 0]
    ]

    const DCstrMPPT = DCstrMPPTmatrix[numStrIndx];
    // console.log(DCstrMPPT);

    let MPPTinversor = Array.from(document.getElementsByClassName('MPPTinversor Option'));
    // console.log(MPPTinversor);
    MPPTinversor.forEach(x => DCstrMPPT[MPPTinversor.indexOf(x)] ? x.disabled = false : x.disabled = true);
    MPPTinversor.forEach(x => x.checked = false);
    MPPTinversor.filter(x => x.disabled === false)[0].checked = true;

}

function setMaxPowerString(proteccion, input) {
    // console.log("let's set this")
    const stringsMPPT = input.value;
    const inversorMonoTriACDC = Array.from(document.getElementsByClassName('inversorMonoTri Option ACDC'));
    // inversorMonoTriACDC.forEach(x => console.log(x.checked))
    const fases = inversorMonoTriACDC.filter(x => x.checked)[0].value;
    const potenciaACDC = document.getElementById('potenciaACDC');
    // console.log(stringsMPPT, fases, potenciaACDC)
    if (stringsMPPT === '1') {
        if (fases === '1') {
            potenciaACDC.max = 4;
            potenciaACDC.value = 2;
            document.getElementById('potenciaDisplayACDC').value = 2;
        } else {
            // console.log(`fases: ${fases}`)
            potenciaACDC.max = 13;
            potenciaACDC.value = 7;
            document.getElementById('potenciaDisplayACDC').value = 7;
        }
    } else if (stringsMPPT === '2') {
        if (fases === '1') {
            potenciaACDC.max = 5;
            potenciaACDC.value = 3;
            document.getElementById('potenciaDisplayACDC').value = 3;
        } else {
            potenciaACDC.max = 17;
            potenciaACDC.value = 9;
            document.getElementById('potenciaDisplayACDC').value = 9;
        }

    }
}

function setMaxPower(e) {
    e.preventDefault();

    const fase = e.currentTarget.value;
    const protecType = `potencia${e.currentTarget.classList[2]}`;
    const display = `potenciaDisplay${e.currentTarget.classList[2]}`;
    // console.log(fase)
    const potencia = document.getElementById(protecType);
    const potenciaDisplay = document.getElementById(display);
    // console.log(potencia)
    if (protecType === 'AC') {
        if (fase === "1") {
            potencia.max = 7;
            potencia.value = 3;
            potenciaDisplay.textContent = 3;
        } else {
            potencia.max = 34;
            potencia.value = 3;
            potenciaDisplay.textContent = 3;
        }
    } else {
        // console.log('setting power');
        const ACDCNStrings = document.getElementById('ACDCNStrings');
        if (fase === "1") {
            if (ACDCNStrings.value === "1") {
                potencia.max = 4;
                potencia.value = 2;
                potenciaDisplay.textContent = 2;
            } else {
                potencia.max = 5;
                potencia.value = 3;
                potenciaDisplay.textContent = 3;
            }
        } else {
            if (ACDCNStrings.value === "1") {
                potencia.max = 13;
                potencia.value = 7;
                potenciaDisplay.textContent = 7;
            } else {
                potencia.max = 17;
                potencia.value = 9;
                potenciaDisplay.textContent = 9;
            }
        }
    }

}

async function buscarProducto(formAnswers) {

    // console.log(formAnswers)

    formAnswers.preventDefault();

    let data = Object.fromEntries(new FormData(formAnswers.target).entries());
    let formData = { ...data };
    formData.proteccion = formAnswers.srcElement.id.split('n')[1];

    // console.log(data)

    if (formData.proteccion === 'DC') {
        if (formData.seccionadores === 'on') {
            formData.seccionadores = true;
        } else {
            formData.seccionadores = false;
        }
    }

    // console.log(formData);

    // FILTRADO DE LA BASE DE DATOS
    // let resultado = jsonDB.productos.filter(
    //     x => x.strings == formData.strings &&
    //         x.mppt == formData.MPPT &&
    //         x.proteccion === formData.proteccion &&
    //         x.seccionadores === formData.seccionadores
    // );
    let resultado = jsonDB.productos.filter(x => x.proteccion === formData.proteccion);

    if (formData.proteccion === 'DC') {
        resultado = resultado.filter(x =>
            x.strings == formData.strings &&
            x.mppt == formData.MPPT &&
            x.seccionadores === formData.seccionadores
        )
    }

    if (formData.proteccion === 'AC') {

        resultado = resultado.filter(x =>
            x.fases === formData.fases
        )

        resultado.forEach(x =>
            x.Potencia = Math.round(x.Amperaje.slice(-3, -1) * (x.fases === '1' ? 230 : 400 * Math.sqrt(3)) / 1000 / 1.25 * 100) / 100 + ' kW'
        )

        const powerThresholds = resultado.map(x => parseFloat(x.Potencia.slice(0, -3)))
        // console.log(powerThresholds);

        // console.log(formData.potencia)
        // console.log(powerThresholds.indexOf(Math.min(...powerThresholds.filter(x => x > formData.potencia))));
        let indexPower = powerThresholds.indexOf(Math.min(...powerThresholds.filter(x => x > formData.potencia)));
        // console.log(indexPower)
        resultado = resultado[indexPower];
        // console.log(resultado)
    }

    if (formData.proteccion === 'ACDC') {

        // console.log(resultado)

        resultado = resultado.filter(x =>
            x.fases === formData.fases &&
            x.stringsMPPT == formData.stringsMPPT
        )

        // console.log(resultado)

        resultado.forEach(x =>
            x.Potencia = Math.round(x.Amperaje.slice(-3, -1) * (x.fases === '1' ? 230 : 400 * Math.sqrt(3)) / 1000 / 1.25 * 100) / 100 + ' kW'
        )

        const powerThresholds = resultado.map(x => parseFloat(x.Potencia.slice(0, -3)))
        // console.log(powerThresholds);
        console.log(resultado.map(x => x.Potencia))

        // console.log(formData.potencia)
        // console.log(powerThresholds.indexOf(Math.min(...powerThresholds.filter(x => x > formData.potencia))));
        let indexPower = powerThresholds.indexOf(Math.min(...powerThresholds.filter(x => x > formData.potencia)));
        // console.log(indexPower)
        resultado = resultado[indexPower];
        // console.log(resultado)
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
        let li = document.createElement('li');
        li.textContent = "Prueba a añadir/quitar seccionadores";
        const specList = document.getElementById('secondBlockListItems');
        specList.innerHTML = '';
        specList.appendChild(li);


        return
    } //RETURN

    if (Array.isArray(resultado) && resultado.length === 1) { resultado = resultado[0] }

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
    for (i = 0; i < specsKeys.length; i++) {
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
