import { Injectable } from '@nestjs/common';
import { IPokemon } from 'src/@core/domain/pokemon/domain.interface';
import { IService } from 'src/@core/shared/service.interface';
import { PokemonService as DomainService } from 'src/@core/domain/pokemon/domain.service';
import { PokemonRepository } from './pokemon.repository';
import { eventEmitter } from '../main-module/event.emitter';

@Injectable()
export class PokemonService implements IService<IPokemon> {

    domainService: DomainService

    constructor(private pokemonRepository: PokemonRepository){
        this.domainService = new DomainService(pokemonRepository)
    }

    async getAll(): Promise<IPokemon[]>{
        eventEmitter.emit('delete-pokemon')
        return this.domainService.getAll()
    }

    async findOneById(id: string): Promise<IPokemon>{
        return this.domainService.findOneById(id)
    }

    async createOne(data: Omit<IPokemon, 'id'>): Promise<IPokemon>{
        return this.domainService.createOne(data)
    }

    async save(data: IPokemon): Promise<IPokemon>{
        return this.domainService.save(data)
    }

    async deleteById(id: string): Promise<IPokemon> {
        return this.domainService.deleteById(id)
    }
}
