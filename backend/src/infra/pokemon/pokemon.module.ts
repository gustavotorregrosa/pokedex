import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonRepository } from './pokemon.repository';
import { PokemonService } from './pokemon.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AmqpService } from './amqp/amqp.service';


@Module({
    imports: [
        EventEmitterModule.forRoot()
    ],
    controllers: [PokemonController],
    providers: [PokemonService, PokemonRepository, AmqpService]
})
export class PokemonModule {}
