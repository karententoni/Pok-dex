// Seleção de elementos do DOM
const pokemonName = document.getElementById('pokemon-name');
const pokemonNumber = document.getElementById('pokemon-number');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonTypes = document.getElementById('pokemon-types');
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

// Variável de controle do ID atual do Pokémon
let searchPokemon = 1;

// Função para buscar os dados na PokéAPI
const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toString().toLowerCase().trim()}`);
        
        if (APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data;
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
        return null;
    }
};

// Função para renderizar as informações na tela
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Buscando...';
    pokemonNumber.innerHTML = '';
    pokemonTypes.innerHTML = '';
    pokemonImage.style.display = 'none';

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = `#${data.id} - `;
        
        // Caminho ultra seguro para a imagem oficial de alta qualidade (Official Artwork)
        const officialArtwork = data['sprites']['other']['official-artwork']['front_default'];
        // Caso não encontre a oficial, usa o sprite padrão como plano B
        const defaultSprite = data['sprites']['front_default'];
        
        pokemonImage.src = officialArtwork || defaultSprite;
        
        // Renderiza os tipos do Pokémon
        data.types.forEach(typeInfo => {
            const typeName = typeInfo.type.name;
            const badge = document.createElement('span');
            badge.classList.add('type-badge', `type-${typeName}`);
            badge.innerText = typeName;
            pokemonTypes.appendChild(badge);
        });

        // Atualiza o ID atual para controle dos botões próximo/anterior
        searchPokemon = data.id;
        input.value = '';
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Não encontrado :(';
        pokemonNumber.innerHTML = '';
        pokemonTypes.innerHTML = '';
    }
};

// Evento de envio do formulário de busca
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value.trim() !== '') {
        renderPokemon(input.value);
    }
});

// Eventos dos botões de navegação
btnPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

btnNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

// Inicializa a Pokédex com o primeiro Pokémon (Bulbasaur)
renderPokemon(searchPokemon);