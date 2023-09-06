import Head from 'next/head'
import { Button, Grid } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import EmailIcon from '@mui/icons-material/Email';
import Table, { column } from '../../components/table'
import { useContext, useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { EditModal } from './editModal'
import { DeleteModal } from './deleteModal'
import { IPokemon } from '@/interfaces/Pokemon.interface'
import { SocketContext } from '@/context/socketContext'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import { EmailModal } from './emailModal';

export default function PokemonPage({pokemons, url}: {pokemons: IPokemon[], url: string}){

    const socket = useContext(SocketContext)

    let socketClients: string[] = []

    const [searchText, setSearchText] = useState<string>('')
    const [editOpen, setEditOpen] = useState<boolean>(false)
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
    const [currentPokemon, setCurrentPokemon] = useState<IPokemon>({})
    const [_pokemons, setPokemons] = useState<IPokemon[]>(pokemons)
    const [emailTo, setEmailTo] = useState('')
    const [emailOpen, setEmailOpen] = useState<boolean>(false)
   
    const columns: column[] = [
        {
            label: 'Pokemon',
            name: 'name'
        }
    ]

    useEffect(() => {
        socket && socket.on('deleted-pokemon', (event) => {
            if(socketClients.includes(event.client)){
                return
            }

            setTimeout(() => {
                socketClients = socketClients.filter(client => client != event.client)
            }, 1000)

            socketClients.push(event.client)
            const {id, name} = event.payload.currentPokemon
           
            setPokemons(_pokemons => _pokemons.filter(pokemon => pokemon.id != id))
            Toastify({
                text: "Pokemon "+name + " deleted",
                duration: 3000
            }).showToast();
        })


        socket && socket.on('created-pokemon', (event) => {
            if(socketClients.includes(event.client)){
                return
            }
            setTimeout(() => {
                socketClients = socketClients.filter(client => client != event.client)
            }, 1000)

            socketClients.push(event.client)

            const {currentPokemon} = event.payload
            const {id, name} = currentPokemon
           
            setPokemons(_pokemons => {
                _pokemons.unshift(currentPokemon)
                return _pokemons
            })

            Toastify({
                text: "Pokemon "+name + " created",
                duration: 3000
            }).showToast();
        })


        socket && socket.on('changed-pokemon', (event) => {
            if(socketClients.includes(event.client)){
                return
            }

            setTimeout(() => {
                socketClients = socketClients.filter(client => client != event.client)
            }, 1000)

            socketClients.push(event.client)
            const {currentPokemon} = event.payload
            const {id, name} = currentPokemon
           
            setPokemons(_pokemons => {
                const newPokemonSet: IPokemon[] = []
                _pokemons.map(pokemon => {
                    if(pokemon.id == currentPokemon.id){
                        newPokemonSet.push(currentPokemon)
                    }else{
                        newPokemonSet.push(pokemon)
                    }
                })
                return newPokemonSet
            })

            Toastify({
                text: "Pokemon "+name + " changed",
                duration: 3000
            }).showToast();
        })

    }, [])

    const pokemonsFiltered = () => _pokemons.filter(pokemon => pokemon && pokemon.name && pokemon.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
    const handleEditOpen = () => setEditOpen(true)
    const handleEditClose = () => setEditOpen(false)
    const handleDeleteOpen = () => setDeleteOpen(true)
    const handleDeleteClose = () => setDeleteOpen(false)
    const handleEmailClose = () => setEmailOpen(false)
    const handleEmailOpen = () => setEmailOpen(true)

    const onEditClick = (pokemon: IPokemon) => {
        setCurrentPokemon(pokemon)
        handleEditOpen()
    }

    const sendEmail = async () => {

        const validateEmail = (input: string) => {
            const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return input.match(validRegex)
        }

        if(!validateEmail(emailTo)){
            Toastify({
                text: "Email invalid",
                duration: 3000
            }).showToast();
            return
        }

        const response = await fetch(url+'/pokemon/email', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({emailTo})
        })

        if(response.ok){
            Toastify({
                text: "Email containing the pokemon's list will be sent",
                duration: 6000
            }).showToast();
        }

    }

    const onNewPokemonClick = () => {
        const newPokemon: IPokemon = {
            id: '',
            moves: [],
            images: [],
            name: ''
        }

        setCurrentPokemon(newPokemon)
        handleEditOpen()
    }

    const onEmailButtonClick = () => {
        setEmailTo('')
        handleEmailOpen()
    }

    const onDeleteClick = (pokemon: IPokemon) => {
        setCurrentPokemon(pokemon)
        handleDeleteOpen()
    }

    const savePokemon = async () => {
        let method = 'POST'
        let eventName = 'created-pokemon'

        if(currentPokemon.id){
            method = 'PUT'
            eventName = 'changed-pokemon'
        }

        const response = await fetch(url+'/pokemon', {
            method,
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...currentPokemon
            })
        })
        const result = await response.json()
        const newPokemonSet: IPokemon[] = []
        let wasCreated: boolean = true
        _pokemons.map(pokemon => {
            if(pokemon.id == currentPokemon.id){
                wasCreated = false
                newPokemonSet.push(currentPokemon)
            }else{
                newPokemonSet.push(pokemon)
            }
        })

        if(wasCreated){
            newPokemonSet.unshift(result.pokemon)
        }

        socket && socket.emit(eventName, {
            currentPokemon: result
        })

        setPokemons(newPokemonSet)
    }

    const deletePokemon = async () => {
        const response = await fetch(url+'/pokemon/'+currentPokemon.id, {
            method: 'DELETE',
            mode: 'cors',
        })
        const result = await response.json()
        const newPokemonSet: IPokemon[] = _pokemons.filter(pokemon => pokemon.id != currentPokemon.id)
        setPokemons(newPokemonSet)
        socket && socket.emit('deleted-pokemon', {
            currentPokemon
        })
    }

    return <>
        <Head>
            <title>Pokemon</title>
        </Head>
    
        <Grid container spacing={2}>
            <Grid item xs={10}>
                <h4>Pokemon</h4>
            </Grid>
            <Grid item xs={1} >
                <Button onClick={() => onEmailButtonClick()} variant="outlined"><EmailIcon/></Button>
            </Grid>
            <Grid item xs={1} >
                <Button onClick={() => onNewPokemonClick()} variant="outlined"><AddIcon/></Button>
            </Grid>
        </Grid>
        <br/>
        <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
                Search bar
            </InputLabel>
            <Input
                onChange={e => {
                    setSearchText(e.target.value)
                }}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
            />
        </FormControl>
        <br/>
        <br/>
        <Table onDeleteClick={onDeleteClick} columns={columns} onEditClick={onEditClick} rows={pokemonsFiltered()} />
        <DeleteModal setCurrentPokemon={setCurrentPokemon} handleClose={handleDeleteClose} open={deleteOpen} pokemon={currentPokemon} handleDelete={deletePokemon} />
        <EditModal url={url} setCurrentPokemon={setCurrentPokemon}  pokemon={currentPokemon} handleSave={savePokemon} open={editOpen} handleClose={handleEditClose} />
        <EmailModal email={emailTo} handleClose={handleEmailClose} open={emailOpen} handleSend={sendEmail} setEmailTo={setEmailTo} />
    </>
}

export async function getServerSideProps() {
    let url = 'http://backend:3001'
    const response = await fetch(url+'/pokemon')
    const result = await response.json()
    const pokemons: IPokemon[] = result
    return { props: { 
        pokemons,  
        url: process.env.API_URL
    } }
}