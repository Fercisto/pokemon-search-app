const formulario = document.querySelector('#formulario');
const pokemonInput = document.querySelector('#pokemon-input');
const pokemonInfo = document.querySelector('#pokemon');      

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', consultarAPI)
    mostrarFavoritos();
});

async function consultarAPI(e) {
    e.preventDefault();

    const pokemon = pokemonInput.value.toLowerCase().trim();

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    try {

        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarPokemon(resultado);
        
    } catch (error) {
        console.log(error);
        mostrarAlerta('Pokemon no Encontrado', 'error');
    }
}

function mostrarPokemon(pokemon) {

    if(pokemonInput.value.trim() === '') {
        mostrarAlerta('El campo es obligatorio', 'error');
        return;
    }
 
    limpiarHTML(pokemonInfo);
          
    const nombrePokemon = document.createElement('H2');
    nombrePokemon.classList.add('pokemon-name');
    
    const divImagen = document.createElement('DIV');
    divImagen.classList.add('pokemon-image-container');
    
    const tituloEstadisticas = document.createElement('H3');
    tituloEstadisticas.classList.add('section-title');
    
    const tituloHabilidades = document.createElement('H3');
    tituloHabilidades.classList.add('section-title');
    
    const divEstadisticas = document.createElement('DIV');
    divEstadisticas.classList.add('stats-section');
    
    const divHabilidades = document.createElement('DIV');
    divHabilidades.classList.add('abilities-section');

    // Nombre del pokemon       
    nombrePokemon.textContent = `Nombre del pokemon: ${pokemon.forms[0].name}`;

    // Imagen
    const imagenPokemonURL = pokemon.sprites.front_default
    const imagenPokemon = document.createElement('IMG');
    imagenPokemon.classList.add('pokemon-image');
    imagenPokemon.src = imagenPokemonURL;
    imagenPokemon.alt = `Imagen: ${pokemon.forms[0].name}`;
    divImagen.appendChild(imagenPokemon);

    // Boton Favoritos
    const btnFavoritos = document.createElement('BUTTON');
    btnFavoritos.classList.add('favorite-btn');
    btnFavoritos.textContent = 'Guardar en Favoritos';

    const pokemonObj = {
        nombre: pokemon.forms[0].name,
        imagen: imagenPokemonURL
    }

    btnFavoritos.onclick = () => {
        guardarLocalStorage(pokemonObj);
        mostrarFavoritos();
    }

    // Eatadísticas
    tituloEstadisticas.textContent = 'Estadísticas';
    divEstadisticas.appendChild(tituloEstadisticas);

    pokemon.stats.forEach(estadistica => {
        
        const estadisticaNombre = estadistica.stat.name.toUpperCase();
        const estadisticaBase =  estadistica.base_stat;

        const estadisticaParrafo = document.createElement('P');
        estadisticaParrafo.classList.add('stat-item');
        estadisticaParrafo.textContent = `${estadisticaNombre} ${estadisticaBase}`;

        divEstadisticas.appendChild(estadisticaParrafo);
    });

    // Habilidades
    tituloHabilidades.textContent = "Habilidades:";
    divHabilidades.appendChild(tituloHabilidades);

    pokemon.abilities.forEach(habilidad => {
        const nombreHabilidad = document.createElement('P');
        nombreHabilidad.classList.add('ability-item');
        nombreHabilidad.textContent = habilidad.ability.name;
        divHabilidades.appendChild(nombreHabilidad);
    });

    pokemonInfo.append(nombrePokemon, divImagen, btnFavoritos,divEstadisticas, divHabilidades );

    formulario.reset();

}

function guardarLocalStorage(pokemonObj) {
    const pokemones = JSON.parse(localStorage.getItem('pokemon')) ?? [];

    const existe = pokemones.some( pokemon => pokemon.nombre === pokemonObj.nombre );

    if(!existe) {
        localStorage.setItem('pokemon', JSON.stringify([...pokemones, pokemonObj]));
        mostrarAlerta('Pokemon agregado correctamente', 'exito');
    } else {
        mostrarAlerta('Ya has agregado ese pokemon a favoritos. Intenta con otro', 'error');
    }

}

function mostrarFavoritos() {

    limpiarHTML(favoritos);

    const pokemones = JSON.parse(localStorage.getItem('pokemon')) ?? [];

    if(pokemones.length) {
        const favoritos = document.querySelector('#favoritos');

        const title = document.createElement('H4');
        title.classList.add('favorites-title');
        title.textContent = "Mis Favoritos";

        favoritos.appendChild(title);

        pokemones.forEach(pokemon => {

            const pokemonDiv = document.createElement('DIV');
            pokemonDiv.classList.add('favorite-pokemon');

            const { nombre, imagen } = pokemon;

            const pokemonNombre = document.createElement('p');
            pokemonNombre.classList.add('pokemon-nombre');
            pokemonNombre.textContent = nombre;

            const pokemonImagen = document.createElement('IMG');
            pokemonImagen.classList.add('favorite-image');
            pokemonImagen.src = imagen;

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('remove-btn');
            btnEliminar.textContent = `Eliminar ${nombre}`;

            btnEliminar.onclick = () => {
                eliminarLocalStorage(nombre);
            }

            pokemonDiv.append(pokemonImagen, pokemonNombre, btnEliminar);
            favoritos.appendChild(pokemonDiv);
        });

    } else {
        const favoritos = document.querySelector('#favoritos');
        const emptyMessage = document.createElement('DIV');
        emptyMessage.classList.add('empty-favorites');
        emptyMessage.textContent = 'No hay pokémon en favoritos';
        favoritos.appendChild(emptyMessage);
    }

}

function eliminarLocalStorage(nombre) {

    const pokemones = JSON.parse(localStorage.getItem('pokemon')) ?? [];

    const pokemonesActualizados = pokemones.filter( pokemon => pokemon.nombre !== nombre );
    localStorage.setItem('pokemon', JSON.stringify(pokemonesActualizados));

    mostrarFavoritos();

}

function mostrarAlerta(mensaje, tipo) {

    const alertaPrevia = document.querySelector('.alerta');

    if(!alertaPrevia) {
        const alerta = document.createElement('DIV');
        alerta.textContent = mensaje;
        alerta.classList.add('alerta');

        if(tipo === 'error') {
            alerta.classList.add('alerta-error');
        }

        if(tipo === 'exito') {
            alerta.classList.add('alerta-exito');
        }

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3500);
    }
}

function limpiarHTML(ref) {
    while(ref.firstChild) {
        ref.removeChild(ref.firstChild);
    }
}