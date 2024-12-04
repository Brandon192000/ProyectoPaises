async function listarPaises() {
    const listaDePaises = document.getElementById("listaPaises"); // Contenedor donde muestro los países

    try {
        let datosApi; // Variable para almacenar los datos

        // Verifico si hay datos en el localStorage
        if (localStorage.getItem("paises")) {

            console.log("Cargando datos desde el localStorage");
            datosApi = JSON.parse(localStorage.getItem("paises")); // Obtengo los datos del localStorage

        } else {

            console.log("Solicitando datos a la API");

            const respuestaApi = await fetch("https://restcountries.com/v3.1/all"); // Solicito los datos a la API

            if (!respuestaApi.ok) {
                throw new Error("Error al obtener los datos de la API"); // Manejo de errores en caso de respuesta no OK
            }

            datosApi = await respuestaApi.json(); // Paso a JSON

            localStorage.setItem("paises", JSON.stringify(datosApi)); // Guardo los datos en el localStorage

        }

        // Limpio la lista de países antes de agregar nuevos elementos
        listaDePaises.innerHTML = "";

        // Recorro los datos y los agrego a la lista
        datosApi.forEach(datos => agregarPaisALaLista(datos));

        // Vinculo eventos al campo de búsqueda y botón
        const inputBuscar = document.getElementById("inputBuscar"); // Campo de entrada
        const btnBuscar = document.getElementById("btnBuscar"); // Botón de búsqueda

        inputBuscar.addEventListener("input", () => filtrarPaises(datosApi)); // Filtrar mientras se escribe
        btnBuscar.addEventListener("click", () => filtrarPaises(datosApi)); // Filtrar al hacer clic en el botón

    } catch (e) {
        console.error("Error al listar los países", e); // Si ocurre un error, lo muestro en consola
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