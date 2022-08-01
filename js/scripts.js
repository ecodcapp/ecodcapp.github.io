// import PinchZoom from "./js/PinchZoom";
// console.log(document.getElementsByClassName('formProduct'))
window.addEventListener('load', afterLoad);

// window.onbeforeunload = function () {
//     return '¿Quieres salir de la aplicación?';
// };

// window.addEventListener('resize', function(){
//     let fixedWidth = 600;
//     let fixedHeight = window.screen.height;

//     window.resizeTo(fixedWidth, fixedHeight);
// });

let jsonDB = {};

async function afterLoad() {

    // LAS SIGUIENTES FUNCIONES TIENEN UNOS 3 SEGUNDOS PARA EJECUTARSE
    setEventListeners()


    // LOAD HARDCODED ECO-DC DB
    fetch('hcdb.json')
        .then(response => response.json())
        .then(data => {
            jsonDB = { ...data };
            setSelect();
        })
        .catch(error => console.log(error));

    // setSelect()
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
    selectACDC.forEach(x => x.addEventListener('click', loadSection));

    const backButtons = Array.from(document.getElementsByClassName('back'));
    backButtons.forEach(x => x.addEventListener('click', closeSection))

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

    const esquema = document.getElementById('esquema');
    esquema.addEventListener('click', showEsquema);

    const enlaceWeb = document.getElementById('enlaceWeb');
    enlaceWeb.addEventListener('click', takeMe2Toscano);

    const selectorMarca = document.getElementById('selectorMarca');
    selectorMarca.addEventListener('change', setModeloInversor);

    const selectorModelo = document.getElementById('selectorModelo');
    selectorModelo.addEventListener('change', afterSetModeloInversor);

    const formInversor = document.getElementById('formInversor');
    formInversor.addEventListener('submit', buscarProductoPorInversor);

    document.getElementById('formResultsDivBack')
        .addEventListener('click', function (event) {
            let results = document.getElementById('formResultsDiv');
            buzz(20);
            results.style.top = "110%";
            results.style.bottom = "-110%";
        })
}

function setSelect() {
    const marcas = jsonDB.inversores.map(x => x.marca);
    const selectorMarca = document.getElementById('selectorMarca');
    for (let i = 0; i < marcas.length; i++) {
        const option = document.createElement('option');
        option.value = marcas[i];
        option.textContent = marcas[i];
        selectorMarca.appendChild(option);
    }

}

$(".subsubsectionHeader").click(function () {

    $header = $(this);
    $header[0].dataset.open = $header[0].dataset.open === "0" ? "1" : "0";
    $icon = $header.children(".closeIcon")[0];
    $content = $header.next();
    $header[0].dataset.open === "1" ?
        $icon.style.transform = 'rotate(180deg)' :
        $icon.style.transform = 'rotate(0)'



    $otherSection = $header.parent().siblings().children();
    $headerS = $header.parent().siblings().children(".subsubsectionHeader");


    if ($header[0].dataset.open === "1" && $headerS[0].dataset.open === "1") {
        $iconS = $headerS.children(".closeIcon")[0];
        $contentS = $header.parent().siblings().children(".subsubsectionContent");

        $headerS[0].dataset.open = $headerS[0].dataset.open === "0" ? "1" : "0";
        $contentS.slideToggle(400);
        $iconS.style.transform += 'rotate(180deg)';
    }

    $content.slideToggle(400);
});

$(".saberMasHeader").click(function () {

    $header = $(this);
    $header[0].dataset.open = $header[0].dataset.open === "0" ? "1" : "0";
    $icon = $header.children(".closeIcon")[0];
    $content = $header.next();
    $header[0].dataset.open === "1" ?
        $icon.style.transform = 'rotate(180deg)' :
        $icon.style.transform = 'rotate(0)'

    // $otherSection = $header.parent().siblings().children();
    // $headerS = $header.parent().siblings().children(".subsubsectionHeader");


    // if($header[0].dataset.open === "1" && $headerS[0].dataset.open === "1") {
    //     $iconS = $headerS.children(".closeIcon")[0];
    //     $contentS = $header.parent().siblings().children(".subsubsectionContent");

    //     $headerS[0].dataset.open = $headerS[0].dataset.open === "0" ? "1" : "0";
    //     $contentS.slideToggle(400);
    //     $iconS.style.transform += 'rotate(180deg)';
    // }

    $content.slideToggle(400);
});

function setModeloInversor(e) {

    const marca = e.target.value;

    const inversotBtn = document.getElementById('inversotBtn');

    if (marca !== '') {
        // inversorBtn.disabled = false;
        const selectorModelo = document.getElementById('selectorModelo');
        selectorModelo.innerHTML = '';

        let modelos = jsonDB.inversores.filter(x => x.marca === marca)[0];
        let referenciasT = modelos.modelos.map(x => x[1]);
        modelos = modelos.modelos.map(x => x[0]);


        const option = document.createElement('option');
        option.value = '';
        option.textContent = '--Selecciona el modelo--';
        selectorModelo.appendChild(option);

        for (let i = 0; i < modelos.length; i++) {
            const option = document.createElement('option');
            option.value = referenciasT[i];
            option.textContent = modelos[i];
            selectorModelo.appendChild(option);
        }

        selectorModelo.disabled = false;

        return
    }

    const selectorModelo = document.getElementById('selectorModelo');
    selectorModelo.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '--Selecciona el modelo--';
    selectorModelo.appendChild(option);
    selectorModelo.disabled = true;
    inversorBtn.disabled = true;

}

function afterSetModeloInversor(e) {

    const inversotBtn = document.getElementById('inversotBtn');
    if (e.target.value !== '') {
        inversorBtn.disabled = false;
        return
    }

    inversorBtn.disabled = true;


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

    // COLLAPSE ALL OPENED SUBSECTIONS WITHIN SABERMAS
    $header = $(".saberMasHeader[data-open='1']");
    $icon = $header.children(".closeIcon");
    $content = $header.next();
    $content.slideToggle(400);

    $header.each(function (i) {
        $header[i].dataset.open = "0";
        $icon[i].style.transform = 'rotate(0)';
    });

}

function loadSection(e) {

    e.preventDefault();

    window.history.pushState(e.view.history.state, null, '');
    const sectionId = `seccion${e.currentTarget.classList[1]}`;
    const selectedSection = document.getElementById(sectionId);

    const back = $(`.back.${sectionId}`)[0];
    const back2 = $(`.back2.${sectionId}`)[0];
    const back3 = $(`.back3.${sectionId}`)[0];
    back.style.transform = 'translateX(0)'
    back2.style.transform = 'translateX(0)'
    back3.style.transform = 'translateX(0)'

    buzz(20)

    selectedSection.style.left = `0vw`
    selectedSection.style.right = `0vw`
    selectedSection.style.transition = '0.4s';

}

function closeSection(e) {

    e.preventDefault();
    const sectionId = e.currentTarget.classList[1];
    // console.log(sectionId)
    const selectedSection = document.getElementById(sectionId);

    const back = $(`.back.${sectionId}`)[0];
    const back2 = $(`.back2.${sectionId}`)[0];
    const back3 = $(`.back3.${sectionId}`)[0];
    back.style.transform = 'translateX(5rem)';
    back2.style.transform = 'translateX(5rem)';
    back3.style.transform = 'translateX(5rem)';

    buzz(20)

    selectedSection.style.left = `110vw`
    selectedSection.style.right = `-100vw`
    selectedSection.style.transition = '0.3s';

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
    formCustom.action = `mailto:${correo}?subject=${subject}&body=${body}`;
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

function updatePotencia(value, proteccion) {
    buzz(20);
    proteccion = 'potenciaDisplay' + proteccion;
    if (value.indexOf('.') === -1) { value += '.0' }
    document.getElementById(proteccion).textContent = value;
}

// ----- BÚSQUEDA DE PRODUCTOS ----- //

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
        // console.log(resultado.map(x => x.Potencia))

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
        document.getElementById('secondBlockh1').textContent = 'Producto bajo demanda';
        let li = document.createElement('li');
        li.textContent = "Este producto se sirve sólo bajo demanda. Escríbenos a ventas@toscano.es para más información.";
        const specList = document.getElementById('secondBlockListItems');
        specList.innerHTML = '';
        specList.appendChild(li);
        document.getElementById('enlaceWeb').style.display = 'none';

        return
    } //RETURN

    if (Array.isArray(resultado) && resultado.length === 1) { resultado = resultado[0] }
    // console.log(resultado)
    formatResultado(resultado)

    await timeout(100);

}

async function buscarProductoPorInversor(e) {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target).entries());
    const Código = data.modelo;
    // console.log(Código)

    let resultado = jsonDB.productos.filter(x => x.Código == Código);

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
        document.getElementById('secondBlockh1').textContent = 'Producto bajo demanda';
        let li = document.createElement('li');
        li.textContent = "Este producto se sirve bajo demanda \n Escríbenos a ventas@toscano.es para más información.";
        const specList = document.getElementById('secondBlockListItems');
        specList.innerHTML = '';
        specList.appendChild(li);
        document.getElementById('enlaceWeb').style.display = 'none';


        return
    } //RETURN

    resultado = resultado[0];

    // console.log(resultado);
    formatResultado(resultado);
    await timeout(100);
}

function formatResultado(resultado) {

    const familia = jsonDB.familias.filter(x => x.familia === resultado.familia)[0];

    const firstBlockImg = document.getElementById('firstBlockImg');
    const imageSrc = familia.imagen;
    if (firstBlockImg) { firstBlockImg.src = imageSrc }

    const esquema = document.getElementById('esquema');
    esquema.dataset.esquema = familia.esquema;

    const enlaceWeb = document.getElementById('enlaceWeb');
    enlaceWeb.dataset.enlace = familia.enlaceWeb;

    document.getElementById('secondBlockh1').textContent = resultado.Referencia;

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

    document.getElementById('enlaceWeb').style.display = 'block';
    let resultDiv = document.getElementById('formResultsDiv'); //JSON.stringify(resultado[0], null, 4);
    resultDiv.style.top = 0;
    resultDiv.style.bottom = 0;
}

function showEsquema(e) {

    const dialog = document.createElement('dialog');
    dialog.id = 'esquemaDialog';
    const esquema = document.createElement('img');
    esquema.id = 'esquemaImg';
    esquema.src = e.target.dataset.esquema;
    const esquemaDiv = document.createElement('div');
    esquemaDiv.appendChild(esquema);
    
    dialog.appendChild(esquemaDiv);

    const zooms = document.createElement('div');
    zooms.id = 'zooms';

    const divZoomIn = document.createElement('div');
    divZoomIn.id = 'zoomIn';
    divZoomIn.addEventListener('click', zoomin);
    const spanZoomIn = document.createElement('span');
    spanZoomIn.classList.add('material-symbols-outlined');
    spanZoomIn.textContent = 'zoom_in';
    divZoomIn.appendChild(spanZoomIn);
    zooms.appendChild(divZoomIn);

    const divZoomOut = document.createElement('div');
    divZoomOut.id = 'zoomOut';
    divZoomOut.addEventListener('click', zoomout)
    const spanZoomOut = document.createElement('span');
    spanZoomOut.classList.add('material-symbols-outlined');
    spanZoomOut.textContent = 'zoom_out';
    divZoomOut.appendChild(spanZoomOut);
    zooms.appendChild(divZoomOut);

    dialog.appendChild(zooms);

    const backWrapper = document.createElement('div');
    backWrapper.id = 'esquemaDivBack';
    backWrapper.addEventListener('click', function (event) {
        const esquemaDialog = document.getElementById('esquemaDialog');
        document.getElementsByTagName('main')[0].style.filter = 'blur(0) grayscale(0)';
        buzz(20);
        esquemaDialog.remove();
    })
    const cancelSpan = document.createElement('span');
    cancelSpan.classList.add('material-symbols-outlined');
    cancelSpan.textContent = 'cancel';
    backWrapper.appendChild(cancelSpan);

    dialog.appendChild(backWrapper);

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(dialog);
    dialog.showModal()
    document.getElementsByTagName('main')[0].style.filter = 'blur(3px) grayscale(70%)';

}

function takeMe2Toscano(e) {
    window.open(e.target.dataset.enlace, '_blanck');
}

// ----- UTILIDADES ----- //

function buzz(ms) {
    window.navigator.vibrate ? navigator.vibrate(ms) : console.log('APPLE PLS, STOP BITCHING PWA DEVELOPERS');
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function zoomin(){
    buzz(20);
    var myImg = document.getElementById("esquemaImg");
    var currWidth = myImg.clientWidth;
    //if(currWidth == 2500) return false;
    // else{
    //    myImg.style.width = (currWidth + 100) + "px";
    //} 
    myImg.style.width = (currWidth + 100) + "px";
}

function zoomout(){
    buzz(20);
    var myImg = document.getElementById("esquemaImg");
    var currWidth = myImg.clientWidth;
    if(currWidth == 100) return false;
     else{
        myImg.style.width = (currWidth - 100) + "px";
    }
}