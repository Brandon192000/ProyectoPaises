async function listarPaises() {
    const listaDePaises = document.getElementById("listaPaises");

    try {
        let datosApi;

        if (localStorage.getItem("paises")) {
            console.log("Cargando datos desde el localStorage");
            datosApi = JSON.parse(localStorage.getItem("paises"));
        } else {
            console.log("Solicitando datos a la API");
            const respuestaApi = await fetch("https://restcountries.com/v3.1/all");
            if (!respuestaApi.ok) {
                throw new Error("Error al obtener los datos de la API");
            }
            datosApi = await respuestaApi.json();
            localStorage.setItem("paises", JSON.stringify(datosApi));
        }

        listaDePaises.innerHTML = "";

        // Verificar si existe un término de búsqueda guardado
        const ultimoFiltro = localStorage.getItem("ultimoFiltro");

        if (ultimoFiltro) {

            document.getElementById("inputBuscar").value = ultimoFiltro; // Restaurar el filtro en el 
            
            datosApi.filter(pais => pais.name.common.toLowerCase().includes(ultimoFiltro))
            .forEach(datos => agregarPaisALaLista(datos)); // Aplicar el filtro

        } else {

            datosApi.forEach(datos => agregarPaisALaLista(datos)); // Mostrar todos los países
            
        }

        const inputBuscar = document.getElementById("inputBuscar");
        const btnBuscar = document.getElementById("btnBuscar");

        inputBuscar.addEventListener("input", () => filtrarPaises(datosApi));
        btnBuscar.addEventListener("click", () => filtrarPaises(datosApi));

    } catch (e) {

        console.error("Error al listar los países", e);

    }
}


function agregarPaisALaLista(datos) {

    let listaDePaises = document.getElementById("listaPaises");

    let itemLista = document.createElement("li");
    itemLista.classList.add("collection-item");
    itemLista.dataset.nombre = datos.name.common.toLowerCase();

    const paises = document.createElement("span");
    paises.innerHTML = `
        <i class="material-icons" style="vertical-align: middle; color: #252525; margin-right: 8px;">public</i> 
        ${datos.name.common} - ${datos.capital ? datos.capital[0] : "No disponible"}
    `;

    let btnDetalles = document.createElement("button");
    btnDetalles.textContent = "Ver detalles del país";
    btnDetalles.classList.add("btn", "blue", "darken-1");
    btnDetalles.addEventListener("click", () => mostrarModal(datos));

    itemLista.appendChild(paises);
    itemLista.appendChild(btnDetalles);
    listaDePaises.appendChild(itemLista);

}

function filtrarPaises(datosApi) {

    let inputBuscar = document.getElementById("inputBuscar").value.toLowerCase();
    localStorage.setItem("ultimoFiltro", inputBuscar);
    let listaDePaises = document.getElementById("listaPaises");
    listaDePaises.innerHTML = "";

    
    datosApi.filter(pais => pais.name.common.toLowerCase().includes(inputBuscar)).forEach(datos => agregarPaisALaLista(datos));// Filtrar países por nombre

}

function mostrarModal(datos) {
    
    const nombreDelPais = document.getElementById("nombrePais");
    const banderaPais = document.getElementById("banderaPais");
    const nombreNativo = document.getElementById("nativo");
    const poblacion = document.getElementById("poblacionPais");
    const lenguaje = document.getElementById("lenguajesPais");
    const capital = document.getElementById("capitalPais");

    nombreDelPais.textContent = datos.name.common;
    banderaPais.src = datos.flags.png;
    banderaPais.alt = `Bandera de ${datos.name.common}`;

    if (datos.name.nativeName) {  // si hay un nombre nativo disponible
       
        nombreNativo.textContent = Object.values(datos.name.nativeName)[0]?.official || "Nombre nativo no disponible";

    } else {

        nombreNativo.textContent = "Nombre nativo no disponible"; // si no hay, muestro mensaje
        
    }

    poblacion.textContent = datos.population.toLocaleString();

    lenguaje.textContent = JSON.stringify(Object.values(datos.languages)).replace(/[\[\]"]+/g, "");//lo paso a JSON.STRINGIIFY  por que al pasar solo la propieda datos.languajes me retorna object object ese problema se da por esos datos son objetos no cadenas entonces por eso uso ese metodo de json
    
    capital.textContent = datos.capital ? datos.capital[0] : "No disponible";

    const modal = M.Modal.getInstance(document.getElementById("modalPais"));
    modal.open();

}

document.addEventListener("DOMContentLoaded", () => {

    listarPaises();

    const modales = document.querySelectorAll(".modal");
    M.Modal.init(modales);

});