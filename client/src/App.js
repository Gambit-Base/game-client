import { TextField } from '@mui/material'
import Container from '@mui/material/Container'
import { useCallback, useEffect, useState } from 'react'
import Game from './Game'
import InitGame from './InitGame'
import CustomDialog from './components/CustomDialog'
import socket from './socket'

export default function App() {
	const [username, setUsername] = useState('')
	const [usernameSubmitted, setUsernameSubmitted] = useState(false)
	const [room, setRoom] = useState('')
	const [orientation, setOrientation] = useState('')
	const [players, setPlayers] = useState([])
	const cleanup = useCallback(() => {
		setRoom('')
		setOrientation('')
		setPlayers('')
	}, [])
	useEffect(() => {
		socket.on('opponentJoined', roomData => {
			console.log('roomData', roomData)
			setPlayers(roomData.players)
		})
	}, [])

	return (
		<Container>
			<CustomDialog
				open={!usernameSubmitted}
				handleClose={() => setUsernameSubmitted(true)}
				title='Pick a username'
				contentText='Please select a username'
				handleContinue={() => {
					if (!username) return
					socket.emit('username', username)
					setUsernameSubmitted(true)
				}}
			>
				<TextField
					autoFocus
					margin='dense'
					id='username'
					label='Username'
					name='username'
					value={username}
					required
					onChange={e => setUsername(e.target.value)}
					type='text'
					fullWidth
					variant='standard'
				/>
			</CustomDialog>
			{room ? (
				<Game
					room={room}
					orientation={orientation}
					username={username}
					players={players}
					cleanup={cleanup}
				/>
			) : (
				<InitGame
					setRoom={setRoom}
					setOrientation={setOrientation}
					setPlayers={setPlayers}
				/>
			)}
		</Container>
	)
}
