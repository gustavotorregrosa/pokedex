import { Box, Button, Chip, Modal, TextField, Typography, Grid } from '@mui/material'
import { ChangeEvent, useState } from 'react'

export interface EmailModalProps {
    open: boolean
    email: string
    setEmailTo: (email: string) => void
    handleClose: () => void
    handleSend: () => void
}

export const EmailModal: React.FC<EmailModalProps> = ({open, email, setEmailTo, handleClose, handleSend}) => {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField style={{
                            width: '100%'
                        }} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailTo(e.target.value)} value={email} id="standard-basic" label="E-mail" variant="standard"/>
                    </Grid>
                </Grid>
                <br/>
                <div className='row'><Button onClick={() => {
                    handleClose()
                    handleSend()
                }} variant="outlined">Send List</Button></div>
            </Box>
        </Modal>)

}