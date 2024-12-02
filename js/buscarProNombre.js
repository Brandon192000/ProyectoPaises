document.addEventListener("DOMContentLoaded", () => {
    const inputBuscar = document.getElementById("inputBuscar");

  
    inputBuscar.addEventListener("input", (evento) => {

        inputBuscar.value = inputBuscar.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");///uso el replace para elimiar numeros de texto que es ingresado

    });

    const btnBuscar = document.getElementById("btnBuscar");
    btnBuscar.addEventListener("click", buscarPorNombre);
});



async function buscarPorNombre() {

    const resultados = document.getElementById("resultados");
    const nombre = document.getElementById("inputBuscar").value.toLowerCase();

    if (nombre === "") {

        alert("Por favor, ingresa un nombre valido sin vacios.");
        return;

    }

    resultados.innerHTML = ""; // Limpiar los resultados previos

    try {

        let datosApi = JSON.parse(localStorage.getItem("paises"));

        if (datosApi.length === 0) {
            // Si no están en el localStorage, hacer la solicitud
            let respuestaApi = await fetch("https://restcountries.com/v3.1/all");
            if (!respuestaApi.ok) {
                alert("Error al obtener los datos api");
            }
            datosApi = await respuestaApi.json();
            localStorage.setItem("paises", JSON.stringify(datosApi));
        }

        // Filtrar los países por el nombre ingresado
        const resultado = datosApi.filter(pais =>pais.name.common.toLowerCase().includes(nombre));

        if (resultado.length === 0) {
            alert("No se encontraron países con ese nombre");
            return;
        }

        // Crear elementos para cada país encontrado
        resultado.forEach(pais => {

            const item = document.createElement("div");
            item.className = "collection-item";

            // Nombre del país
            const nombrePais = document.createElement("span");
            nombrePais.textContent = pais.name.common;

            // Btn para ver detalles
            const btnDetalles = document.createElement("button");
            btnDetalles.className = "btn waves-effect waves-light blue darken-3";
            btnDetalles.textContent = "Ver detalles";
            btnDetalles.style.marginLeft = "10px";
            btnDetalles.addEventListener("click", () => mostrarNombreModal(pais));

            // Agregar el nombre y botón al contenedor del país
            item.appendChild(nombrePais);
            item.appendChild(btnDetalles);

            // Agrega 
            resultados.appendChild(item);
        });

    } catch (e) {
        
        console.error("Error al buscar el país:", e);
        
    }
}


function mostrarNombreModal(datos){

    const nombreDelPais = document.getElementById("nombrePais");
    const banderaPais = document.getElementById("banderaPais");
    const nombreNativo = document.getElementById("nativo");
    const poblacion = document.getElementById("poblacionPais");
    const lenguaje = document.getElementById("lenguajesPais");
    const capital = document.getElementById("capitalPais");

    nombreDelPais.textContent = datos.name.common;

    banderaPais.src = datos.flags.png; 
    banderaPais.alt = `Bandera de ${datos.name.common}`;


    if (datos.name.nativeName && datos.name.nativeName.eng) {

        nombreNativo.textContent = datos.name.nativeName.eng.official;

    } else {
        
        nombreNativo.textContent = "Nombre nativo no disponible";
    }

    poblacion.textContent = datos.population.toLocaleString();
    

    lenguaje.textContent = JSON.stringify(Object.values(datos.languages)).replace(/[\[\]"]+/g, "");//lo paso a JSON.STRINGIIFY  por que al pasar solo la propieda datos.languajes me retorna object object ese problema se da por esos datos son objetos no cadenas entonces por eso uso ese metodo de json

    console.log(JSON.stringify(datos.languages));

    capital.textContent = datos.capital ?  datos.capital[0] : "No disponible";


    const modal = M.Modal.getInstance(document.getElementById("modalPais"));
    modal.open();

}


document.addEventListener("DOMContentLoaded", () => {

    // inicializo el modal
    const modales = document.querySelectorAll(".modal");
    M.Modal.init(modales);

    // asigno el btnbuscar el evento click de buscr por nombre
    const btnBuscar = document.getElementById("btnBuscar");
    btnBuscar.addEventListener("click", buscarPorNombre);

});//llamo a la funcion cuando el html document este cargado.
