import { IPokemon } from 'src/@core/domain/pokemon/domain.interface'
import { PokemonRepository } from '../pokemon.repository'
import { PokemonService } from '../pokemon.service'
import originalPokemons from './db-pokemon-complete.json';

export const restoreOriginal = async () => {

    const pokemonRepository = new PokemonRepository()
    const pokemonService = new PokemonService(pokemonRepository)
    const allPokemons = await pokemonService.getAll()
    // console.log({allPokemons})
    // console.log({
    //     originalPokemons
    // })

    originalPokemons.map(oP => console.log({oP}))

    for(const pokemon of allPokemons){
        await pokemonService.deleteById(pokemon.id)
    }

    for(const pokemon of (originalPokemons as IPokemon[])){
        console.log({pokemon})
        await pokemonService.createOne(pokemon)
    }
}