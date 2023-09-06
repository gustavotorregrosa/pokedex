import { IService } from "src/@core/shared/service.interface";
import { IPokemon } from "./domain.interface";
import { IRepository } from "src/@core/shared/repository.interface";


export class PokemonService implements IService<IPokemon> {

    constructor(private pokemonRepository: IRepository<IPokemon>){}

    async getAll(): Promise<IPokemon[]>{
        return await this.pokemonRepository.getAll()
    }

    async findOneById(id: string): Promise<IPokemon>{
        return await this.pokemonRepository.findOneById(id)
    }

    async createOne(data: Omit<IPokemon, "id">): Promise<IPokemon>{
        return await this.pokemonRepository.createOne(data)
    }

    async save(data: IPokemon): Promise<IPokemon>{
        return this.pokemonRepository.save(data)
    }

    async deleteById(id: string): Promise<IPokemon> {
        return this.pokemonRepository.deleteById(id)
    }

}