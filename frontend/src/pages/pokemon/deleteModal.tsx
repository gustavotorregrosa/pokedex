import { IPokemon } from '@/@core/domains/pokemon/domain.interface'
import { Box, Button, Chip, Modal, TextField, Typography, Grid } from '@mui/material'
import { ChangeEvent, useState } from 'react'

export interface DeleteModalProps {
    open: boolean
    pokemon: IPokemon
    setCurrentPokemon: (p: IPokemon) => void
    handleClose: () => void
    handleDelete: () => void
}

export const DeleteModal: React.FC<DeleteModalProps> = ({open, pokemon, handleClose, handleDelete, setCurrentPokemon}) => {
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
                    <p>Do you wish to delete {pokemon.name}?</p>
                </Grid>
                <br/>
                <div className='row'><Button onClick={() => {
                    handleClose()
                    handleDelete()
                }} variant="outlined">Delete</Button></div>
            </Box>
        </Modal>)

}