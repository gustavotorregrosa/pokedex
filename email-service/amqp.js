const amqp = require('amqplib');

class AmqpService {

    connection
    channel

    constructor(){
        this._connect()
    }

    sendMessage(msg){
        this.channel && this.channel.sendToQueue(this.queue, Buffer.from(msg))
    }

    async _connect(queueAndFuncs){
        if(!queueAndFuncs){
            return
        }

        this.connection = await  amqp.connect('amqp://admin:admin@rabbitmq:5672')
        this.channel = await this.connection.createChannel()
        
        queueAndFuncs.map(({queue, func}) => {
            this.channel.assertQueue(queue, {
                durable: false
            })

            this.channel.consume(queue, msg => {
                try{
                    this.channel.ack(msg)
                    func(msg)
                }catch(e){
                    console.log({e})
                }
                
            })
        })
    }
}

module.exports = AmqpService;

