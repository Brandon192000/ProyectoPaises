async function listarPaises(){

    let listaDePaises = document.getElementById("listaPaises");

    try {
        
        let datosApi = JSON.parse(localStorage.getItem("paises"));

        if (datosApi.length === 0) {

            // Hacer la petición si no hay datos guardados
            let respuestaApi = await fetch("https://restcountries.com/v3.1/all"); // Hago la petición a la API
            if (!respuestaApi.ok) {
                alert("Error al obtener los datos api")
            }
            datosApi = await respuestaApi.json(); // Parseo la respuesta a JSON

            // Guardar los datos en el localStorage
            localStorage.setItem("paises", JSON.stringify(datosApi));
        }


        datosApi.forEach(datos => {

            let itemLista = document.createElement("li");//creo un elemento li
            itemLista.classList.add("collection-item");//le agrego la clase del estilo

            //paises y capitales
            const paises = document.createElement("span");//creo un span para mostrar los pais con capital

            paises.textContent = `${datos.name.common} - ${datos.capital ? datos.capital[0] : "No se puedo cargar la capital"} `;///si hay capital muestra o  "no hay"

            
            //fin paises capitales
            
            //btn de detalles
            let btnDetalles = document.createElement("button");

            btnDetalles.textContent = "Ver detalles del pais";

            btnDetalles.classList.add("btn", "blue", "darken-1");

            btnDetalles.addEventListener("click", () => mostrarModal(datos)); // llamo al modal con los datos del pais

            //fin btn detalles
 
            itemLista.appendChild(paises); //agrego el span al elemento li
            itemLista.appendChild(btnDetalles);
            listaDePaises.appendChild(itemLista); //agrego el li a la lista

        });


    } catch (e) {

        console.error("Paso un error. No se puedo listar los paises", e); 

    }


}

function mostrarModal(datos){

    const nombreDelPais = document.getElementById("nombrePais");
    const banderaPais = document.getElementById("banderaPais");
    const nombreNativo = document.getElementById("nativo");
    const poblacion = document.getElementById("poblacionPais");
    const lenguaje = document.getElementById("lenguajesPais");
    const capital = document.getElementById("capitalPais")

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
    
    
    listarPaises();

    const modales = document.querySelectorAll(".modal");
    M.Modal.init(modales);


});//llamo a la funcion cuando el html document este cargado.