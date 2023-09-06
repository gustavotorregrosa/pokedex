import { IRepository } from "src/@core/shared/repository.interface"
import { IPokemon } from "./domain.interface"
import { PokemonService } from "./domain.service"

describe('testing service', () => {

    let repository: IRepository<IPokemon>
    let service: PokemonService


    beforeAll(() => {
        repository = {
            getAll: jest.fn(),
            findOneById: jest.fn(),
            createOne: jest.fn(),
            save: jest.fn(),
            deleteById: jest.fn(),
        }

        service = new PokemonService(repository)
    })

    it('get all', async () => {
        const pokemonList = await service.getAll()
        expect(repository.getAll).toBeCalled()
    })


    it('save existing pokemon', async () => {
        const pokemon: IPokemon = {
            id: '1',
            images: [],
            moves: [],
            name: 'testing pokemon'
        }

        await service.save(pokemon)
        expect(repository.save).toBeCalled()
        expect(repository.createOne).not.toBeCalled()
    })

    it('creating pokemon', async () => {
        const pokemon: Omit<IPokemon, "id"> = {
            // id: '1',
            images: [],
            moves: [],
            name: 'testing pokemon'
        }

        await service.createOne(pokemon)
        // expect(repository.save).not.toBeCalled()
        expect(repository.createOne).toBeCalled()
    })


    it('deleting pokemon', async () => {
        const pokemon: Omit<IPokemon, "id"> = {
            // id: '1',
            images: [],
            moves: [],
            name: 'testing pokemon'
        }

        await service.deleteById('1')
        expect(repository.deleteById).toBeCalled()
    })


})