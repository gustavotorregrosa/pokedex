import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { restoreOriginal } from './misc/routines';
import { IPokemon } from 'src/@core/domain/pokemon/domain.interface';
import { DBBuilder } from './misc/DBBuilder';
import { AmqpService } from './amqp/amqp.service';

@Controller('pokemon')
export class PokemonController {

    constructor(private pokemonService: PokemonService, private amqpService: AmqpService){}

    @Get()
    async getAll(){
        return await this.pokemonService.getAll()
    }

    @Post('email')
    async sendEmail(@Body() {emailTo}){
        const email = emailTo
        const pokemons: string[] = (await this.pokemonService.getAll()).map(pokemon => pokemon.name)
        this.amqpService.sendMessage(JSON.stringify({pokemons, email}))
    }

    @Get('create-original')
    async createOriginal(){
        new DBBuilder().setDB()
        return 'created-original'
    }

    @Get('restore')
    async restore(){
        await restoreOriginal()
        return 'restored'
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.pokemonService.findOneById(id)
    }

    @Post()
    async createOne(@Body() pokemon: Omit<IPokemon, "id">){
        return await this.pokemonService.createOne(pokemon)
    }

    @Put()
    async save(@Body() pokemon: IPokemon){
        const poke = await this.pokemonService.save(pokemon)
        return poke
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string){
        return await this.pokemonService.deleteById(id)
    }

}
