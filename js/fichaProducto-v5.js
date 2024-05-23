// ----- BÚSQUEDA DE PRODUCTOS ----- //

const forms = Array.from(document.getElementsByClassName('formProduct'));
forms.forEach(x => x.addEventListener('submit', buscarProducto0));

async function buscarProducto0(formAnswers) {

    formAnswers.preventDefault();

    let test = [...formAnswers.target.children];
    test.pop();
    let keys = test.map(x => x.dataset.input);
    let values = test.map(x => x.dataset.value);
    // console.log(keys, values);
    let formData = {};
    keys.forEach((x, index) => formData[x] = values[index]);


    formData.proteccion = formAnswers.srcElement.id.split('n')[1];

    // console.log(formData);
    buscarProducto1(formData);

    // ------ HASTA AQUÍ SE TIENEN LOS DATOS PARA FILTRAR ------

}

async function buscarProducto1(formData) {

    // console.log(formData);

    if ('share' in formData) {
        delete formData.share;
    }

    // console.log(formData);

    // PUSH SEARCH IN HISTORY AS URL PARAMETERS:
    pushSearch2History(formData);

    // FILTRADO DE LA BASE DE DATOS
    let resultado = jsonDB.productos;

    // console.log(resultado);


    // REPOSICIONAR potencia SI EXISTE:
    keys = Object.keys(formData);
    values = Object.values(formData);

    let potenciaIndex = keys.indexOf('potencia');
    if (potenciaIndex > -1) {
        keys.splice(potenciaIndex, 1);
        keys.push('potencia');
        const potenciaValue = values.splice(potenciaIndex, 1)[0];
        values.push(potenciaValue);
    }

    // console.log(keys, values);

    // FILTRAR BASE DE DATOS DE PRODUCTOS
    // filter every key except 'potencia':
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = values[i];
        if (key != 'potencia') {
            resultado = resultado.filter(x => x[key] == value);
        }
    }
    console.log(resultado);
    // filter 'potencia' key by first ordering the array by increasing 'potencia' value and then taking the first element that is greater or equal to the 'potencia' value:
    if (keys.includes('potencia')) {
        resultado = resultado.sort((a, b) => a.potencia - b.potencia);
        console.log('Potencia: ' + values[keys.indexOf('potencia')])
        resultado = resultado.filter(x => x.potencia >= values[keys.indexOf('potencia')]);
        resultado.length > 1 ? resultado = resultado.splice(0, 1) : console.log(resultado);
    }
    console.log(resultado);


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
        document.getElementById('enlaceWeb').style.display = 'hidden';
        document.getElementById('esquema').style.display = 'hidden';

        return
    } //RETURN

    if (Array.isArray(resultado) && resultado.length === 1) { resultado = resultado[0] }
    // console.log(resultado)
    formatResultado(resultado)

    await timeout(100);

}

function formatResultado(resultado) {

    const familia = jsonDB.familias.filter(x => x.familia === resultado.familia)[0];

    // console.log(jsonDB.familias);

    const firstBlockImg = document.getElementById('firstBlockImg');
    let imageSrc = familia?.imagen || 'resources/productos/salta-el-diferencial.webp';
    if (firstBlockImg) { firstBlockImg.src = imageSrc }

    const esquema = document.getElementById('esquema');
    // console.log(familia?.esquema);
    esquema.dataset.esquema = familia?.esquema || 'resources/productos/salta-el-diferencial.webp';
    // if (!(familia?.esquema)) {
    //     esquema.style.display = 'hidden';
    // }

    const enlaceWeb = document.getElementById('enlaceWeb');
    enlaceWeb.dataset.enlace = familia?.enlaceWeb || 'https://toscano.es/categoria-producto/vigivolt/energias-renovables/';

    formatDisplay(resultado.display);

}

function formatDisplay(resultadoDisplay) {

    // console.log(resultadoDisplay);

    document.getElementById('secondBlockh1').textContent = resultadoDisplay.Referencia;

    const specsEntries = Object.entries(resultadoDisplay);
    // console.log(specsEntries);
    let specs = specsEntries.filter(x => x[0] !== 'Referencia');
    specs = Object.fromEntries(specs);
    specsKeys = Object.keys(specs);
    specsValues = Object.values(specs);
    // console.log({specs})

    const specList = document.getElementById('secondBlockListItems');
    specList.innerHTML = '';
    // console.log(specList);
    for (i = 0; i < specsKeys.length; i++) {
        let listItem = document.createElement('li');
        listItem.textContent = specsKeys[i] == 'Proteccion' ?
            'Protección: ' :
            `${specsKeys[i]}: `;
        let listItemValue = document.createElement('span');
        listItemValue.textContent = `${specsValues[i]}`;
        listItem.appendChild(listItemValue);
        specList.appendChild(listItem);
    }

    const compartir = document.getElementById('compartir');
    compartir.dataset.info = JSON.stringify(resultadoDisplay);

    let resultDiv = document.getElementById('formResultsDiv'); //JSON.stringify(resultado[0], null, 4);
    resultDiv.style.top = 0;
    resultDiv.style.bottom = 0;
}

const esquema = document.getElementById('esquema');
esquema.addEventListener('click', showEsquema);
function showEsquema(e) {

    console.log('FUNCTION: showEsquema');

    const dialog = document.createElement('dialog');
    dialog.id = 'esquemaDialog';
    const esquema = document.createElement('img');
    esquema.id = 'esquemaImg';
    esquema.src = e.currentTarget.dataset.esquema;
    console.log(esquema.src);
    if (esquema.src.includes('salta-el-diferencial.webp')) {
        dialog.classList.add('proximamente');
    };
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
    dialog.showModal();
    esquema.dataset.width = esquema.style.width;
    document.getElementsByTagName('main')[0].style.filter = 'blur(3px) grayscale(70%)';

}

function zoomin() {
    buzz(20);
    var myImg = document.getElementById("esquemaImg");
    var currWidth = myImg.clientWidth;
    myImg.style.width = (currWidth + 100) + "px";
}

function zoomout() {
    buzz(20);
    var myImg = document.getElementById("esquemaImg");
    var currWidth = myImg.clientWidth;
    if (currWidth == 100) return false;
    else {
        myImg.style.width = (currWidth - 100) + "px";
    }
}

const enlaceWeb = document.getElementById('enlaceWeb');
enlaceWeb.addEventListener('click', takeMe2Toscano);
function takeMe2Toscano(e) {
    window.open(e.currentTarget.dataset.enlace, '_blanck');
}