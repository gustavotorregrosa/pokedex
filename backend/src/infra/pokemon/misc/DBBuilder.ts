import {promises as fs, link, mkdirSync, createWriteStream} from 'fs'
import { v4 as uuidv4 } from 'uuid'
import {promisify} from 'util'
import {pipeline} from 'stream'
const {readFile, writeFile, mkdir} = fs
const path_raw: string = __dirname + '/pokemon/db-pokemon-raw.json'
const path_complete: string = process.cwd() + '/db-pokemon-complete.json'

// const path_raw: string = '/pokemon/db-pokemon-raw.json'
// const path_complete: string = '/pokemon/db-pokemon-complete.json'

export class DBBuilder {

    public url: string = process.env.API_URL+'/pokemon'

    public pokemonRawList: any[] = []
    public pokemonCompleteList: any[] = []

    // public async setDB(){
    //     console.log({
    //         // process,
    //         end: process.env,
    //         // promisify,
    //         url: this.url
    //     })
    // }

    public pipelineAsync = promisify(pipeline);

    async saveImage(url: string, name: string) {
        try {
            const response: any = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to download image: ${response.statusText}`)
            }    

            const fileStream = createWriteStream(name)
            this.pipelineAsync(response.body, fileStream)
            return new Promise((resolve, reject) => {
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(name);
                  });
            
                  fileStream.on('error', (error) => {
                    reject(error);
                  });
            })
        } catch (error) {
            throw error;
        }       
    }

    waitABit(): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 20);
        });
    }

    waitABitMore(): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 20);
        });
    }

    async getPartialIndex(){
        let result: any =  await fetch(this.url)
        result = await result.json()
        result.results.map((poke: any) => {
            const segments = poke.url.split("/")
            const id = segments[segments.length - 2]
            this.pokemonRawList.push({
                id,
                name: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
                url: poke.url
            })

            console.log({
                id,
                name: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
                url: poke.url
            })

        })

        await this.waitABit()

        if(result.next){
            this.url = result.next
            await this.getPartialIndex()
        }else{
            try{
            //    await mkdirSync(__dirname + '/pokemon')
            //    await mkdirSync(__dirname + '/../../../static/pokemon')
            //    await mkdirSync(__dirname + '/../../../static/pokemon/images')

            await mkdirSync(__dirname + '/pokemon')
            // await mkdirSync(__dirname + '/../../../static/pokemon')
            await mkdirSync(__dirname + '/pokemon/images')
            }catch(e){
                console.log({e})
            }
            await writeFile(path_raw, JSON.stringify(this.pokemonRawList), 'utf8')
        }
    }

    async readPokemon(url: string){
        let result: any =  await fetch(url)
        result = await result.json()
        let moves: string[] = []
        result.moves.map((m: any) => {
            moves.push(m.move.name.charAt(0).toUpperCase() + m.move.name.slice(1))
        })

        let images: string[] = []

        for(const img of Object.values(result.sprites)){
            if(typeof img != 'string'){
                continue
            }
            // await this.waitABitMore()
            const newName = uuidv4() + '.png'
            const completeNewName = __dirname + '/pokemon/images/' + newName
            await this.waitABitMore()
            // console.log({completeNewName})
            await this.saveImage(img, completeNewName)
            images.push(newName)

        }

        return {
            moves,
            images
        }
    }

    async setDB(){
        await this.getPartialIndex()

        for(const poke of this.pokemonRawList){
            let pokeData = await this.readPokemon(poke.url)
            console.log({
                pokeData 
            })
            await this.waitABitMore()
            this.pokemonCompleteList.push({
                ...poke,
                ...pokeData
            })
        }

        console.log({
            pokemonCompleteList: this.pokemonCompleteList
        })
        await writeFile(path_complete, JSON.stringify(this.pokemonCompleteList), 'utf8')
    }
}