import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonController } from '../pokemon/pokemon.controller';
import { PokemonService } from '../pokemon/pokemon.service';
import { PokemonRepository } from '../pokemon/pokemon.repository';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppGateway } from './app.gateway';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { PokemonModule } from '../pokemon/pokemon.module';


@Module({
  imports: [
    PokemonModule,
    EventEmitterModule.forRoot(), 
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot(
        {
          rootPath: join(__dirname, '..', '..', '..', 'assets'),
          renderPath: '/assets',
        },
        {
          rootPath: join(__dirname, '..', '..', '..', 'assets', 'images'),
          renderPath: '/images',
        },
    ),
  
  ],
  // controllers: [AppController, PokemonController],
  // providers: [AppService, PokemonService, PokemonRepository, AppGateway, EventService],

  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
