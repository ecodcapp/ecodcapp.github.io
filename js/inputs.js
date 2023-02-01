function getInputStatus(section, log = false) {

    console.log('FUNCTION: --------------- getInputStatus');

    const inputList = Array.from(document.querySelectorAll(`.inputParent.${section}`));
    const inputShownList = inputList.filter(x => x.dataset.show);
    const inputHiddenList = inputList.filter(x => !x.dataset.show);

    const response = {
        inputList: inputList,
        inputShownList: inputShownList,
        inputHiddenList: inputHiddenList,
        log: function () {
            console.log(`inputList: ${this.inputList.length}`, inputList)
            console.log(`inputShownList: ${this.inputShownList.length}`);
            console.log(`inputHiddenList: ${this.inputHiddenList.length}`);
        }
    };

    if (log === 'log') { response.log() }

    return response;

}

function showInput(input, back = false) {

    console.log('FUNCTION: --------------- showInput');

    const jinput = $(input);
    jinput.slideToggle(300);

    back && input.dataset.show == 1 ?
        input.dataset.show = '' :
        input.dataset.show = 1

}

function ableInput(input) {

    console.log('FUNCTION: --------------- ableInput');

    const seccion = input.classList[2];
    // console.log(seccion)

    switch (input.dataset.inputtype) {
        case "arrows":
            habilitarFlechas();
            activateSiguiente(seccion);
            const inputDisplay = input.children[0].children[1].children[0];
            inputDisplay.classList.remove('disabled');
            const inputFlechas = input.children[0].children[1].children[1];
            inputFlechas.classList.remove('disabled');
            break;
        case "checkbox":
        case "checkboxCol":
            const inputs = [...input.children[0].children[1].children].filter(x => x.nodeName === "INPUT");
            inputs.forEach(x => {
                if (x.disabled) { x.disabled = false };
                if (x.checked) { activateSiguiente(seccion) };
                x.addEventListener('click', preActivateSiguiente);
            });

            const lastInput = inputs[inputs.length - 1];
            // const lastLabel = document.querySelectorAll(`[for=${lastInput.id}]`)[0];

            const checked = inputs.filter(x => x.checked)[0];
            if (!checked) { break; };
            const checkedLabel = document.querySelectorAll(`[for=${checked.id}]`)[0];
            checkedLabel.style.zIndex -= 5;
            // checkedLabel.style.color = 'hsl(0, 0%, 95%)';
            // checkedLabel.style.background = 'var(--headerBG)';

            const labels = inputs.map(x => document.querySelectorAll(`[for=${x.id}]`)[0]);
            labels.forEach(x => {
                x.style.left = `0px`;
                // x.style.transform = `translateX(0px)`;
                x.style.top = `0px`;
                // x.style.transform = `translateY(0px)`;
            })

            const unchecked = inputs.filter(x => !x.checked);
            const uncheckedLabels = unchecked.map(x => document.querySelectorAll(`[for=${x.id}]`)[0]);
            uncheckedLabels.forEach(x => {
                x.style.opacity = '1';
                // x.display = 'block';
            });

            if (input.dataset.inputtype == "checkboxCol") {
                const parent = lastInput.parentElement;
                console.log(checkedLabel.offsetHeight);
                parent.style.height = parent.offsetHeight + checkedLabel.offsetHeight + 7 + 'px';
            }

            break;
        case "slider":
            const potInput = input.children[0].children[1].children[1].children[0];
            potInput.disabled = false;
            const potInputParent = potInput.parentElement
            potInputParent.classList.remove('disabled');
            const potDisplay = input.children[0].children[1].children[0];
            potDisplay.classList.remove('disabled');
            potDisplay.style.left = 0;
            break;
        default:
            console.error('No input found');
            break;
    }
}

function disableInput(input) {

    console.log('FUNCTION: --------------- ableInput (PREVIOUS input)');

    const seccion = input.classList[2];

    switch (input.dataset.inputtype) {
        case "arrows":
            inhabilitarFlechas();
            const inputDisplay = input.children[0].children[1].children[0];
            inputDisplay.classList.add('disabled');
            const inputFlechas = input.children[0].children[1].children[1];
            inputFlechas.classList.add('disabled');
            break;

        case "checkbox":
        case "checkboxCol":
            const inputs = [...input.children[0].children[1].children].filter(x => x.nodeName === "INPUT");
            const lastInput = inputs[inputs.length - 1];
            const lastLabel = document.querySelectorAll(`[for=${lastInput.id}]`)[0];
            const leftOffset = lastLabel.offsetLeft;
            const firstInput = inputs[0];
            const firstLabel = document.querySelectorAll(`[for=${firstInput.id}]`)[0];
            const topOffset = firstLabel.offsetTop;



            inputs.forEach(x => {
                if (!x.checked) { x.disabled = true };
                x.removeEventListener('click', preActivateSiguiente);
            });

            const checked = inputs.filter(x => x.checked)[0];
            const checkedLabel = document.querySelectorAll(`[for=${checked.id}]`)[0];
            checkedLabel.style.zIndex += 5;

            const labels = inputs.map(x => document.querySelectorAll(`[for=${x.id}]`)[0]);
            labels.forEach(x => {
                if (leftOffset != x.offsetLeft) {
                    x.style.left = `${leftOffset - x.offsetLeft}px`;
                }

                if (topOffset != x.offsetTop) {
                    x.style.top = `${topOffset - x.offsetTop}px`;
                }
            })

            const unchecked = inputs.filter(x => !x.checked);
            const uncheckedLabels = unchecked.map(x => document.querySelectorAll(`[for=${x.id}]`)[0]);
            uncheckedLabels.forEach(x => {
                x.style.opacity = '0';
            });

            if (input.dataset.inputtype == "checkboxCol") {
                const parent = firstInput.parentElement;
                const h = parent.offsetHeight;
                parent.style.height = h + 'px';
                parent.style.height = h - checkedLabel.offsetHeight - 7 + 'px';
            }



            break;

        case 'slider':
            const potInput = input.children[0].children[1].children[1].children[0];
            potInput.disabled = true;
            const potInputParent = potInput.parentElement
            potInputParent.classList.add('disabled');
            const potDisplay = input.children[0].children[1].children[0];
            potDisplay.classList.add('disabled');
            const leftDisplacement = potDisplay.parentElement.offsetLeft;
            console.log(leftDisplacement);
            potDisplay.style.left = potDisplay.parentElement.offsetWidth - potDisplay.offsetWidth + 'px';
            break;

        default:
            console.error('No input found');
            break;
    }
}

function showProdutBtn(section) {

    const mostrarProductBTN = document.querySelectorAll(`.proteccion${section}.mostrarEquipo`)[0];
    mostrarProductBTN.style.display = 'block';

    let lastInput = mostrarProductBTN.parentElement.parentElement.children;
    lastInput = lastInput[lastInput.length - 2];
    lastInput.classList.add('lastInput');

}

function hideProdutBtn(section) {

    const mostrarProductBTN = document.querySelectorAll(`.proteccion${section}.mostrarEquipo`)[0];
    mostrarProductBTN.style.display = 'none';

    let lastInput = mostrarProductBTN.parentElement.parentElement.children;
    lastInput = lastInput[lastInput.length - 2];
    lastInput.classList.remove('lastInput');
    
}