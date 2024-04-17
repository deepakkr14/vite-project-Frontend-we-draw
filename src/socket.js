// src/socket.js
import { io } from 'socket.io-client';

// Set the server URL (replace with your server's URL)
const URL = 'http://localhost:4000';
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

// Initialize the socket
export const socket = io(URL);
