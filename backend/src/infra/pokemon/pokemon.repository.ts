import { Injectable } from '@nestjs/common';
import { IPokemon } from 'src/@core/domain/pokemon/domain.interface';
import { IRepository } from 'src/@core/shared/repository.interface';
import {promises as fs} from 'fs'
import { randomUUID } from "crypto";
const path: string = __dirname + '/db.json'
const {readFile, writeFile} = fs

@Injectable()
export class PokemonRepository implements IRepository<IPokemon> {

    async getAll(): Promise<IPokemon[]> {
        return await this.readAllData();
    }

    async findOneById(id: string): Promise<IPokemon> {
        return (await this.readAllData()).find(poke => poke.id == id)
    }

    async createOne(data: Omit<IPokemon, 'id'>): Promise<IPokemon> {
        const _data: IPokemon = {
            ...data,
            id: randomUUID()
        }

        const allData = await this.readAllData()
        allData.push(_data)
        await this.saveData(allData)
        console.log({_data})
        return _data
    }

    async save(data: IPokemon): Promise<IPokemon> {
        let pokemonList: IPokemon[] = []
        const oldPokemonList = await this.readAllData()
        oldPokemonList.map(poke => {
            let _poke = poke
            if(poke.id == data.id){
                _poke = {
                    ..._poke,
                    ...data
                }
            }
            pokemonList.push(_poke)
        })

        await this.saveData(pokemonList)
        return data
    }

    async deleteById(id: string): Promise<IPokemon> {
        const pokemon = await this.findOneById(id)
        const data = (await this.readAllData()).filter(p => p.id != pokemon.id)
        this.saveData(data)
        return pokemon
    }


    private async readAllData(): Promise<IPokemon[]> {
        try {
            const data: string = await readFile(path, 'utf-8')
            return JSON.parse(data) as IPokemon[]
        } catch(e){
            await this.saveData([])
            return this.readAllData()
        }
       
    }

    private async saveData(data: IPokemon[]): Promise<IPokemon[]> {
        await writeFile(path, JSON.stringify(data), 'utf8')
        return data
    }

}
