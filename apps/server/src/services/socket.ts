import { Server } from "socket.io";
import { Redis } from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";

const pub = new Redis("rediss://default:AeNBAAIjcDFlOWQzM2U3OTMyYTY0ZDUzYWE0N2RlY2FiYmYwZjEzOHAxMA@good-heron-58177.upstash.io:6379");
const sub=new Redis("rediss://default:AeNBAAIjcDFlOWQzM2U3OTMyYTY0ZDUzYWE0N2RlY2FiYmYwZjEzOHAxMA@good-heron-58177.upstash.io:6379");
class SocketService {
    private _io: Server;
    constructor(){
        console.log("Init Socket Service.....");
        this._io = new Server({
            cors:{
                origin:'*',
                allowedHeaders:['*'],
            }
        });
        sub.subscribe('MESSAGES')
    }

    public initListeners(){
        const io = this._io;
        console.log('Init Socket Listeners...')
        io.on("connect", (socket) => {
            console.log("New connection:", socket.id);
            socket.on('event:message',async ({message}:{message:string})=>{
                console.log("New Message Received:", message);
                await pub.publish('MESSAGES',JSON.stringify({message}))
            })
        });
        
        sub.on('message',async (channel,message)=>{
            if(channel==='MESSAGES'){
                io.emit('message',message)
                produceMessage(message);
                console.log("Message Produced to Kafka");
            }
        })
    }

    get io(){
        return this._io;
    }
}

export default SocketService;
