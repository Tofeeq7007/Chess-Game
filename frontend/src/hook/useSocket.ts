import { useEffect, useState } from "react"

const WS_URL = import.meta.env.VITE_BACKEND_URL as string || 'ws://localhost:8080';
export const useSocket = ()=>{
    const [socket , setSocket] = useState<WebSocket | null>(null);
    console.log("WS_URL", WS_URL);
    useEffect(()=>{
        const ws  = new WebSocket(WS_URL);
        ws.onopen=()=>{
            console.log('connected');
            setSocket(ws);
        }
        ws.onclose=()=>{
            console.log('disconnected');
            setSocket(null);
        }

        return ()=>{
            ws.close();
        }
    }
    ,[])
    return socket;
}