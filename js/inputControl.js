function preActivateSiguiente(e) {
    // console.log(e.currentTarget)
    const section = e.currentTarget.dataset.protection;
    // console.log(section)
    activateSiguiente(section);
}

function activateSiguiente(section) {

    const siguiente = document.querySelector(`.siguiente${section}`);
    if (siguiente.disabled) {
        // console.log('activateSiguiente');
        siguiente.disabled = false;
    }
}

function preUnactivateSiguiente(e) {
    const section = e.currentTarget.dataset.protection;
    unactivateSiguiente(section)
}

function unactivateSiguiente(section) {

    const siguiente = document.querySelector(`.siguiente${section}`);

    if (!siguiente.disabled) {
        // console.log('unactivateSiguiente');
        siguiente.disabled = true;
    }
}

// ########################################

function activateAtras(section) {
    // console.log(section);
    const atras = document.querySelector(`.atras${section}`);
    if (atras.disabled) {
        atras.disabled = !atras.disabled;
    }
}

function unactivateAtras(section) {
    // console.log(section);
    const atras = document.querySelector(`.atras${section}`);
    if (!atras.disabled) {
        atras.disabled = !atras.disabled;
    }
}

function goForward(e) {

    console.log('---------- FORWARD ----------');

    const section = [...e.currentTarget.classList][2];
    // console.log(section)
    const inputStatus = getInputStatus(section);
    // console.log(inputStatus);
    const selectedInput = inputStatus.inputList.filter(x => x.dataset.select)[0];

    saveInputValue(selectedInput);

    const nextInput = selectedInput.nextElementSibling;

    if (inputStatus.inputHiddenList.length > 0) {

        // console.log('OPCION 1')
        nextInput.dataset.select = 1;
        // console.log(nextInput.dataset.inputtype);

        if (nextInput.dataset.inputtype === "checkbox" || nextInput.dataset.inputtype === "checkboxCol") {
            unactivateSiguiente(section);
        } else {
            activateSiguiente(section);
        };

        activateAtras(section)

        setInput(nextInput);
        ableInput(nextInput);
        showInput(nextInput);

    } else {
        // console.log('OPCION 2')
        showProdutBtn(section)
        unactivateSiguiente(section)
    }

    selectedInput.dataset.select = '';
    disableInput(selectedInput);

}

function goBackward(e) {

    console.log('---------- BACKWARD ----------');

    const section = [...e.currentTarget.classList][2];
    const inputStatus = getInputStatus(section);
    const selectedInput = inputStatus.inputList.filter(x => x.dataset.select)[0];


    if (!selectedInput) {
        const lastInput = inputStatus.inputShownList[inputStatus.inputList.length - 1];
        lastInput.dataset.select = 1;

        ableInput(lastInput);
        hideProdutBtn(section);

        activateSiguiente(section);
        return;
    }

    if (inputStatus.inputShownList.length === 2) {
        unactivateAtras(section);
    };

    const prevInput = selectedInput.previousElementSibling;
    prevInput.dataset.select = 1;
    ableInput(prevInput);

    showInput(selectedInput, 'back');
    resetInput(selectedInput);

    selectedInput.dataset.select = '';

}

function saveInputValue(input) {
    // console.log('saveInputValue: ', input);

    let value;

    switch (input.dataset.inputtype) {
        case "arrows":
            // console.log(input.dataset.inputtype);
            value = input.children[0].children[1].children[0].value;
            input.dataset.value = value;
            break;
        case "checkbox":
        case "checkboxCol":
            value = [...input.children[0].children[1].children].filter(x => x.checked)[0].value;
            input.dataset.value = value;
            break;
        case "slider":
            value = input.children[0].children[1].children[1].children[0].value;
            input.dataset.value = value;
            break;
        default:
            console.error('No input found');
            break;
    }
}

function setInput(input) {

    console.log('FUNCTION: --------------- setInput: ', input);

    let inputsWithValues = [...input.parentNode.children]
        .filter(x => [...x.classList].includes('inputParent'));
    // console.log(inputsWithValues);

    const selectedInputIndex = inputsWithValues.indexOf(inputsWithValues.filter(x => x.dataset.select)[0]);
    inputsWithValues = inputsWithValues.filter(x => inputsWithValues.indexOf(x) <= selectedInputIndex);
    console.log(inputsWithValues);

    const formId = input.parentNode.id;
    // console.log(formId);
    let proteccion = { dataset: {} };
    proteccion.dataset.input = formId.split('n')[0] + 'n';
    proteccion.dataset.value = formId.split('n')[1];
    console.log(proteccion.dataset);

    let productos = jsonDB.productos;
    // console.log(productos);
    inputsWithValues.push(proteccion);
    // console.log(inputsWithValues);
    inputsWithValues.forEach(x => {
        // console.log(productos);
        let key = x.dataset.input;
        let value = x.dataset.value;
        // console.log(`key/value: ${key}, ${value}`)
        productos = productos.filter(x => x[key] == value);
    })

    console.log(productos);
    console.log(input.dataset.input);

    let initialData;
    switch (input.dataset.inputtype) {
        case "arrows":
            initialData = [...new Set(productos.map(x => x[input.dataset.input]))].sort((a, b) => a - b).join(',');
            // console.log('initialData: ', initialData);
            input
                .children[0]
                .children[1]
                .children[0]
                .dataset
                .initialData = initialData;
            let initialValue = initialData.split(',');
            initialValue = Math.floor((Math.max(...initialValue) - Math.min(...initialValue)) / 2);
            input.children[0].children[1].children[0].value = initialValue > 1 ? initialValue : 2;
            break;

        case "checkbox":
        case "checkboxCol":
            // console.log('checkbox');
            initialData = [...new Set(productos.map(x => x[input.dataset.input]))].sort((a, b) => a - b);
            console.log(initialData);
            newCheckboxInput(input, initialData);

            // if (input.dataset.inputtype == "checkboxCol") {
            //     const checkboxCol = input.children[0].children[1];
            //     console.log(checkboxCol.style.height);
            //     // checkboxCol.style.height = checkboxCol.offsetHeight + 'px';
            // }

            break;

        case "slider":
            console.log('potencia');

            initialData = [...new Set(productos.map(x => x.potencia))].sort((a, b) => a - b);
            let maxPotencia = Math.max(...initialData);
            // console.log(maxPotencia);

            const sliderInput = document.getElementById('potencia' + input.classList[2]);
            sliderInput.max = maxPotencia;
            sliderInput.value = Math.floor(maxPotencia / 3);
            // console.log(input.classList[2]);
            const sliderInputDisplay = document.getElementById('potenciaDisplay' + input.classList[2]);
            // console.log(sliderInputDisplay);
            sliderInputDisplay.textContent = Math.floor(maxPotencia / 3);
            break;

        default:
            console.error('default EEROR setInput');
            break;
    }
}

function resetInput(input, inputtype = undefined) {
    // console.log('reset hiddenInput');

    switch (inputtype) {
        case 'checkbox':
        case 'checkboxCol':
            // console.log('checkbox');
            let inputs = [...input.children[0].children[1].children].filter(x => x.nodeName === "INPUT");
            inputs.forEach(x => {
                x.checked = false;
            });
            const labels = inputs.map(x => document.querySelectorAll(`[for=${x.id}]`)[0]);
            labels.forEach(x => {
                x.style.top = '0';
                x.style.left = '0';
                x.style.opacity = '1';
            })
            input.dataset.value = '';

            if (input.dataset.inputtype == "checkboxCol") {
                // console.log('reset checkboxCol: ', input);
                const inputContainer = input.children[0].children[1];
                // console.log(parent.style.height, parent.offsetHight);
                inputContainer.style.height = 'min-content';
            }

            break;
        // case: 'inversor'
        default:
            input.dataset.value = '';
            break;
    }
}

function resetSection(proteccion) {
    console.log('resetSection');
    const inputsInsideSection = document.querySelectorAll(`.inputParent.${proteccion}`);
    // console.log(inputsInsideSection);
    inputsInsideSection.forEach((x, i) => {
        // console.log(i, x);
        hideProdutBtn(proteccion);
        if (x.dataset.show && i) {
            showInput(x, 'back');
        }

        resetInput(x, x.dataset.inputtype);

        // console.log(!i);
        if (!i) {
            // console.log('KAKA: ', x)
            // resetInput(x, x.dataset.inputtype);
            ableInput(x)
        }


        unactivateAtras(proteccion);
        unactivateSiguiente(proteccion)
    })
    inputsInsideSection[0].dataset.select = 1;
}

function newCheckboxInput(inputIn, initialData) {

    console.log('FUNCTION: --------------- newCheckboxInput')

    const proteccion = inputIn.classList[2];
    const inputName = inputIn.dataset.input;
    // console.log(proteccion, input.dataset.input);
    const inputMain = inputIn.children[0].children[1];
    inputMain.innerHTML = '';
    let MPPTs = initialData;
    console.log(initialData);
    // initialData = initialData.map(x => (x.toString()).split(' ').join(''));
    // console.log(initialData);
    for (let i = 0; i < MPPTs.length; i++) {

        const input = document.createElement('input');
        input.type = 'radio';
        input.className = `${inputName} Option`;
        input.name = inputName;
        input.id = `${inputName}${(initialData[i]).toString().split(' ').join('_')}`;
        input.value = initialData[i];
        input.onclick = () => buzz(20);
        input.dataset.protection = proteccion;
        input.addEventListener('click', preActivateSiguiente);
        // input.dataset.proteccion = proteccion;
        inputMain.append(input);

        const label = document.createElement('label');
        label.htmlFor = `${inputName}${(initialData[i]).toString().split(' ').join('_')}`;
        // label.dataset.proteccion = proteccion;
        label.textContent = initialData[i];
        // console.log(inputIn.dataset.inputtype == 'checkboxCol');
        if (i && inputIn.dataset.inputtype == 'checkboxCol') {
            // console.log('hellow!')
            label.style.marginTop = '0.5rem';
        }
        // label.dataset.protection = proteccion;
        inputMain.append(label);
    }
}

function habilitarFlechas() {
    // console.log('habilitar flechas');
    const arrows = Array.from(document.getElementsByClassName('arrow'));
    arrows.forEach(x => {
        x.addEventListener('click', changeInputValue);
        x.style.backgroundColor = 'var(--headerBG)';
    });
}

function inhabilitarFlechas() {
    const arrows = Array.from(document.getElementsByClassName('arrow'));
    arrows.forEach(x => {
        x.removeEventListener('click', changeInputValue);
        x.style.backgroundColor = 'lightgrey';
    });
}

function changeInputValue(e) {

    // console.log('change input value STRINGS')

    e.preventDefault();

    const arrow = e.currentTarget;
    const listaClases = Array.from(arrow.classList);
    const input = document.getElementById(listaClases[0]);
    // console.log(input)

    if (listaClases[0] === 'DCNStrings') {
        let numStrIndx = processStrings(arrow, listaClases, input);
        // setMPPT(numStrIndx);
        return
    }

    if (listaClases[0] === 'ACDCNStrings') {
        // console.log('seteando ACDC');
        processStrings(arrow, listaClases, input);
        // setMaxPowerString(listaClases[0], input)
        return
    }
}

function processStrings(arrow, listaClases, input) {

    // console.log('processStrings');
    // console.log(input.value);

    // let stringsRange = ['1', '2', '3', '4', '5', '6', '8'];
    // console.log(input)
    let stringsRange = input.dataset.initialData.split(',');
    // console.log(stringsRange);

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

function updatePotencia(value, proteccion) {
    buzz(20);
    const potenciaDisplay = 'potenciaDisplay' + proteccion;
    if (value.indexOf('.') === -1) { value += '.0' };
    document.getElementById(potenciaDisplay).textContent = value;
    const potenciaInputId = 'potencia' + proteccion;
    // console.log(potenciaInputId);
    const potenciaInput = document.getElementById(potenciaInputId);
    // console.log(potenciaInput.value);
    // console.log(value);
    potenciaInput.value = value;
    // console.log(potenciaInput.value);
}
