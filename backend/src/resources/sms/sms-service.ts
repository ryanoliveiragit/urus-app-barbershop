import twilio from 'twilio'

// Configurar as credenciais da conta Twilio
const accountSid = ''; // Substitua pelo seu Account SID
const authToken = '';   // Substitua pelo seu Auth Token
const client = twilio(accountSid, authToken);

async function sendSMS(to: string, message: string) {
    try {
        const sms = await client.messages.create({
            body: message,
            from: '+',
            to
        })
        console.log(`SMS enviado com sucesso! SID: ${sms.sid}`)
    } catch (err) {
        throw new Error(`Erro ao enviar SMS: ${err}`)
    }
}

export { sendSMS }