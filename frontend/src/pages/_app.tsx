import '@/styles/globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../styles/custom.css' 
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Navbar from '../components/navbar'
import { Container } from '@mui/material'
import io, { Socket } from 'socket.io-client'
import { useEffect } from 'react'
import {SocketContext} from '../context/socketContext'


export default function App({ Component, pageProps }: AppProps) {

  let socket: Socket

  const getSocket = () => {
    if(!socket){
      socket = io('https://pokedex-api.gustavotorregrosa.link', {autoConnect: true, reconnection: true})

    }
    return socket
  }

  return <>
  <SocketContext.Provider value={getSocket()}>
          <Head>
              <title>Pokedex</title>
              <meta name="description" content="Created by gustavo torregrosa" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.png" />
        </Head>
        <Navbar />
        <Container maxWidth="lg">
          <br/><br/><br/>
            <Component {...pageProps} />
        </Container>
    </SocketContext.Provider>
  </>
}
