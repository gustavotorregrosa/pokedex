const AmqpService = require('./amqp');
const EmailService = require('./email');

const amqpService = new AmqpService();

const emailService = new EmailService()

const queueAndFuncs = [
    {
        queue: 'send-email',
        func: (msg) => {
            const {email, pokemons} = JSON.parse(msg.content.toString())
            const html = pokemons.join('<br/>')

            const mailOptions = {
                from: "gustavo.torregrosa@gmail.com",
                to: email,
                subject: "Gustavo's Pokedex - Pokemon's list",
                html
             };

            emailService.sendEmail(mailOptions)
            
        }
    }
]

amqpService._connect(queueAndFuncs)