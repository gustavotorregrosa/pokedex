import { IPokemon } from '@/interfaces/Pokemon.interface'
import { Box, Button, Chip, Modal, TextField, Grid } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export interface EditModalProps {
    open: boolean
    pokemon: IPokemon
    setCurrentPokemon: (p: IPokemon) => void
    handleClose: () => void
    handleSave: () => void
    url: string
}

export const EditModal: React.FC<EditModalProps> = ({open, pokemon, handleClose, handleSave, setCurrentPokemon, url}) => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1100,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const [newMove, setNewMove] = useState<string>()

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container>
                    <Grid item xs={4}>
                        <TextField onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setCurrentPokemon({
                                ...pokemon,
                                name: e.target.value
                            })      
                        }} value={pokemon.name} id="standard-basic" label="Pokemon" variant="standard"/>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMove(e.target.value)} value={newMove} id="standard-basic" label="New move" variant="standard"/>
                        <Button onClick={() => {
                            if(!newMove || pokemon.moves.includes(newMove) ){
                                setNewMove('')
                                return
                            }

                            const newPokemon: IPokemon = {
                            ...pokemon,
                            moves: [
                                ...pokemon.moves,
                                newMove
                            ]
                            }
                            setCurrentPokemon(newPokemon)
                            setNewMove('')
                        }} variant="outlined">Add New Move</Button>
                    </Grid>
                </Grid>
                <br/>

                <Grid container>
                    <Grid item xs={6} style={{
                         maxHeight: '400px',
                         overflowY: 'scroll',
                    }}>
                        {pokemon.moves && pokemon.moves.map(move => <Chip style={{ margin: '0.5em'}} label={move} onClick={() => {}} onDelete={() => {
                        const newPokemon: IPokemon = {
                            ...pokemon,
                            moves: pokemon.moves.filter(m => m != move)
                        }
                        setCurrentPokemon(newPokemon)

                        }} />)}
                    </Grid>
                    <Grid item xs={6}>
                        <Carousel>
                            {pokemon.images &&pokemon.images.map(_image => {
                                const imageURL = url+"/images/"+_image
                                return (<div><img src={imageURL} /></div>)
                            })} 
                        </Carousel>
                    </Grid>
                </Grid>
                <div className='row'>
                   
                </div>
                <br/>
                <div className='row'><Button onClick={() => {
                    handleClose()
                    handleSave()
                }} variant="outlined">Save</Button></div>
            </Box>
        </Modal>)

}