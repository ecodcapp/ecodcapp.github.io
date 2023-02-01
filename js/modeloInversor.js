const selectorMarca = document.getElementById('selectorMarca');
selectorMarca.addEventListener('change', setModeloInversor);

const selectorModelo = document.getElementById('selectorModelo');
selectorModelo.addEventListener('change', afterSetModeloInversor);

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

function setModeloInversor(e) {

    const marca = e.target.value;

    const inversorBtn = document.getElementById('inversorBtn');

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
            option.value = JSON.stringify({
                marca: marca,
                modelo: modelos[i],
                referencia: referenciasT[i]
            }); // TIENE QUE SER UN OBJETO CON MODELO DE INVERSOR
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

    const inversorBtn = document.getElementById('inversorBtn');
    if (e.target.value !== '') {
        inversorBtn.disabled = false;
        return
    }

    inversorBtn.disabled = true;
}