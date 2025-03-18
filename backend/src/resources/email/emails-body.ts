

const createAgendamentBody = (name: any, service: string, serviceDate: string, serviceHour: string) => {
    return (
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
            <h1 style="color: #4a4a4a; text-align: left;">Agendamento de serviço</h1>
            
            <p style="color: #4a4a4a; text-align: left;">Olá ${name},</p>
            <p style="color: #4a4a4a; text-align: left;">Dados do seu agendamento</p>
            <strong style="color: #4a4a4a; text-align: left;">${service}, Data: ${serviceDate} - Horário: ${serviceHour}</strong>
            
            <p style="color: #4a4a4a; text-align: left;">Se você não agendou esse serviço, por favor, ignore esta mensagem.</p>
            <p style="color: #4a4a4a; text-align: left;">Atenciosamente,<br>Equipe Urus Barber</p>
        </div>`
    )
}

const cancelAgendamentBody = (name: any, service: string, serviceDate: string, serviceHour: string) => {
    return (
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
            <h1 style="color: #4a4a4a; text-align: left;">Cancelamento de agendamento</h1>
            
            <p style="color: #4a4a4a; text-align: left;">Olá ${name},</p>
            <p style="color: #4a4a4a; text-align: left;">Dados do seu agendamento cancelado</p>
            <strong style="color: #4a4a4a; text-align: left;">${service}, Data: ${serviceDate} - Horário: ${serviceHour}</strong>
            
            <p style="color: #4a4a4a; text-align: left;">Se você não cancelou esse agendamento, por favor, ignore esta mensagem.</p>
            <p style="color: #4a4a4a; text-align: left;">Atenciosamente,<br>Equipe Urus Barber</p>
        </div>`
    )
}

// Barber body
const createAgendamentBarberBody = (name: any, service: string, serviceDate: string, serviceHour: string) => {
    return (
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
            <h1 style="color: #4a4a4a; text-align: left;">Novo agendamento de cliente</h1>
            
            <p style="color: #4a4a4a; text-align: left;">Olá ${name},</p>
            <p style="color: #4a4a4a; text-align: left;">Dados do agendamento</p>
            <strong style="color: #4a4a4a; text-align: left;">Nome do cliente: ${service}, Data: ${serviceDate} - Horário: ${serviceHour}</strong>
        </div>`
    )
}

const cancelAgendamentBarberBody = (name: any, service: string, serviceDate: string, serviceHour: string) => {
    return (
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
            <h1 style="color: #4a4a4a; text-align: left;">Cancelamento de agendamento</h1>
            
            <p style="color: #4a4a4a; text-align: left;">Olá ${name}, um cliente cancelou um agendamento</p>
            <p style="color: #4a4a4a; text-align: left;">Dados do cancelamento</p>
            <strong style="color: #4a4a4a; text-align: left;">${service}, Data: ${serviceDate} - Horário: ${serviceHour}</strong>
            
            <p style="color: #4a4a4a; text-align: left;">Se você não cancelou esse agendamento, por favor, ignore esta mensagem.</p>
            <p style="color: #4a4a4a; text-align: left;">Atenciosamente,<br>Equipe Urus Barber</p>
        </div>`
    )
}

export { createAgendamentBody, cancelAgendamentBody, createAgendamentBarberBody, cancelAgendamentBarberBody }