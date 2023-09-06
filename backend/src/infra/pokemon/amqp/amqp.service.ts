import { Injectable } from '@nestjs/common';
import amqp, {Channel, Connection}  from 'amqplib'

@Injectable()
export class AmqpService {

    public queue = 'send-email'
    public connection: Connection
    public channel: Channel

    constructor(){
        this._connect()
    }

    public sendMessage(msg: string){
        this.channel && this.channel.sendToQueue(this.queue, Buffer.from(msg))
    }

    private async _connect(){
        this.connection = await  amqp.connect('amqp://admin:admin@rabbitmq:5672')
        this.channel = await this.connection.createChannel()
        this.channel.assertQueue(this.queue, {
            durable: false
        })
    }

}
