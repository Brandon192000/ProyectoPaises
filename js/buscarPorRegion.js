async function obtenerRegiones() {
    const selectRegion = document.getElementById('selectRegion'); // combo donde muestro los continentes
    const contenedorPaises = document.getElementById('contenedorPaises'); // contenedor donde voy a mostrar los paises

    try {
        let continentes;

        
        if (localStorage.getItem('datosContinentes')) { // verifico si los datos ya estan en localStorage

            console.log("Cargando datos desde el localStorage");
            continentes = JSON.parse(localStorage.getItem('datosContinentes'));// si ya estan los datos en localStorage, los muestro


        } else {

            console.log("Solicitando datos a la API");

            const respuestaApi = await fetch('https://restcountries.com/v3.1/all'); // si no estan, hago la solicitud a la API
            
            if (!respuestaApi.ok) {
                throw new Error("Error al obtener los datos de la API"); // Manejo de errores en caso de respuesta no OK
            }

            continentes = await respuestaApi.json(); // paso a JSON
            localStorage.setItem('datosContinentes', JSON.stringify(continentes)); // guardo los datos en localStorage
            
        }

        let regionesUnicas = []; // creo un arreglo para mostrar las regiones

        continentes.forEach(continente => { // hago un ciclo por todas las regiones que hay
            if (continente.region && !regionesUnicas.includes(continente.region)) { // si hay una region y no esta en el arreglo de regiones unicas
                
                regionesUnicas.push(continente.region); // agrego la region al arreglo
            }
        });

        regionesUnicas.forEach(region => { // agrego las regiones al combo
            const option = document.createElement("option"); // creo una opción
            option.value = region;
            option.textContent = region; // nombre que va a tener, ejemplo: Americas, Arctic, etc.
            selectRegion.appendChild(option); //lo agrego al combo
        });

        M.FormSelect.init(selectRegion); // inicializo el combo

        selectRegion.addEventListener("change", async () => { 
            // hago un evento change al combo para mostrar los paises por región esto asegura que solo se ejecuta cuando cambia el valor del combo
           
            const regionSeleccionada = selectRegion.value; // selecciono el valor elegido por el usuario en el combo
            contenedorPaises.innerHTML = ""; // limpio el contenedor

            const paisesPorRegion = continentes.filter(pais => pais.region === regionSeleccionada); // filtro los paises y digo que quiero solo los paises de la region seleccionada
            

            paisesPorRegion.forEach(pais => { // hago un ciclo por la condicion
                const tarjeta = document.createElement("div"); // creo un div
                tarjeta.className = "collection-item"; // clase para estilos

                let btnDetalles = document.createElement("button");
                btnDetalles.textContent = "Ver detalles del país"; 
                btnDetalles.classList.add("btn", "blue", "darken-1"); 

                tarjeta.innerHTML = // muestro la tarjeta en el HTML
                    `
                    <div class="card-content">
                        <span class="card-title">
                            <i class="material-icons" style="vertical-align: middle; color: #252525; margin-right: 8px;">public</i>
                            ${pais.name.common}
                        </span>
                        <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : "No Disponible"}</p>
                        <p><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
                        <p><strong>Región:</strong> ${pais.region}</p>
                    </div>
                    `;

                btnDetalles.addEventListener("click", () => mostrarModalPais(pais)); // evento click para mostrar detalles en el modal
                

                tarjeta.appendChild(btnDetalles); // agrego el btn a la tarjeta
                contenedorPaises.appendChild(tarjeta); // agrego la tarjeta al contenedor
            });
        });

    } catch (e) {
        console.error("Error al obtener las regiones:", e); // si ocurre un error, lo muestro en consola
    }
}


function mostrarModalPais(pais) {// funcion para mostrar el modal con detalles del pais
    const nombreDelPais = document.getElementById("nombrePais"); 
    const banderaPais = document.getElementById("banderaPais"); 
    const nombreNativo = document.getElementById("nativo"); 
    const poblacion = document.getElementById("poblacionPais");
    const lenguaje = document.getElementById("lenguajesPais"); 
    const capital = document.getElementById("capitalPais"); 

    nombreDelPais.textContent = pais.name.common; // asigno el nombre del pais
    banderaPais.src = pais.flags.png; // asigno la URL de la bandera
    banderaPais.alt = `Bandera de ${pais.name.common}`; 

    if (pais.name.nativeName) {  // si hay un nombre nativo disponible
       
        nombreNativo.textContent = Object.values(pais.name.nativeName)[0]?.official || "Nombre nativo no disponible";

    } else {

        nombreNativo.textContent = "Nombre nativo no disponible"; // si no hay, muestro mensaje

    }

    poblacion.textContent = pais.population.toLocaleString(); // formateo la poblacion con separadores de miles

    lenguaje.textContent = JSON.stringify(Object.values(pais.languages)).replace(/[\[\]"]+/g, "");//lo paso a JSON.STRINGIIFY  por que al pasar solo la propieda datos.languajes me retorna object object ese problema se da por esos datos son objetos no cadenas entonces por eso uso ese metodo de json
    
    capital.textContent = pais.capital ? pais.capital[0] : "No disponible"; // Si hay capital, la muestro

    const modal = M.Modal.getInstance(document.getElementById("modalPais")); // obtengo la instancia del modal
    modal.open(); // abro el modal
}

document.addEventListener("DOMContentLoaded", () => { 
    
    obtenerRegiones(); // Llamo a la función para obtener regiones

    const modales = document.querySelectorAll(".modal"); // obtengo el modal
    M.Modal.init(modales); // inicializo los modales con Materialize

});
