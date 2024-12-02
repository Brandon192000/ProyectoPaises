async function obtenerRegiones() {
    const selectRegion = document.getElementById('selectRegion');
    const contenedorPaises = document.getElementById('contenedorPaises');

    try {
        const respuestaApi = await fetch('https://restcountries.com/v3.1/all');
        const paises = await respuestaApi.json();

        let regionesUnicas = [];

        paises.forEach(pais => {
            if (pais.region && !regionesUnicas.includes(pais.region)) {
                regionesUnicas.push(pais.region); // Agregar región si no está en el arreglo
            }
        });

        // Agregar regiones al select
        regionesUnicas.forEach(region => {
            const option = document.createElement("option");
            option.value = region.toLowerCase(); // Valor en minúsculas
            option.textContent = region; // Nombre mostrado
            selectRegion.appendChild(option);
        });

        M.FormSelect.init(selectRegion);

        // Evento para mostrar países por región
        selectRegion.addEventListener("change", async () => {
            const regionSeleccionada = selectRegion.value;
            contenedorPaises.innerHTML = ""; // Limpiar contenedor

            const paisesPorRegion = paises.filter(pais => pais.region && pais.region.toLowerCase() === regionSeleccionada);

            paisesPorRegion.forEach(pais => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "card";

                tarjeta.innerHTML = `
                    <div class="card-content">
                        <span class="card-title">${pais.name.common}</span>
                        <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : "N/A"}</p>
                        <p><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
                        <p><strong>Región:</strong> ${pais.region}</p>
                    </div>
                    <div class="card-action">
                        <button class="btn blue darken-3 btn-ver-mas" data-pais='${JSON.stringify(pais)}'>Ver más</button>
                    </div>
                `;
                contenedorPaises.appendChild(tarjeta);
            });

            // Agregar evento a cada botón "Ver más"
            const botonesVerMas = document.querySelectorAll(".btn-ver-mas");
            botonesVerMas.forEach(boton => {
                boton.addEventListener("click", (e) => {
                    const paisSeleccionado = JSON.parse(e.target.dataset.pais);
                    mostrarModalPais(paisSeleccionado);
                });
            });
        });

    } catch (error) {
        console.error("Error al obtener las regiones:", error);
    }
}

// Función para mostrar el modal con detalles del país
function mostrarModalPais(pais) {
    
    const nombreDelPais = document.getElementById("nombrePais");
    const banderaPais = document.getElementById("banderaPais");
    const nombreNativo = document.getElementById("nativo");
    const poblacion = document.getElementById("poblacionPais");
    const lenguaje = document.getElementById("lenguajesPais");
    const capital = document.getElementById("capitalPais")

    nombreDelPais.textContent = pais.name.common;

    banderaPais.src = pais.flags.png; 
    banderaPais.alt = `Bandera de ${pais.name.common}`;


    if (pais.name.nativeName && pais.name.nativeName.eng) {

        nombreNativo.textContent = pais.name.nativeName.eng.official;

    } else {
        
        nombreNativo.textContent = "Nombre nativo no disponible";
    }

    poblacion.textContent = datos.population.toLocaleString();

    lenguaje.textContent = JSON.stringify(Object.values(pais.languages)).replace(/[\[\]"]+/g, "");//lo paso a JSON.STRINGIIFY  por que al pasar solo la propieda datos.languajes me retorna object object ese problema se da por esos datos son objetos no cadenas entonces por eso uso ese metodo de json
    

    console.log(JSON.stringify(pais.languages));

    capital.textContent = pais.capital ?  pais.capital[0] : "No disponible";


    const modal = M.Modal.getInstance(document.getElementById("modalPais"));
    modal.open();

}

document.addEventListener("DOMContentLoaded", () => {
    
    
    obtenerRegiones();

    const modales = document.querySelectorAll(".modal");
    M.Modal.init(modales);


});//llamo a la funcion cuando el html document este cargado.
