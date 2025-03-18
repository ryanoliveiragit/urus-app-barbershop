
import nodemailer from 'nodemailer'
import { prisma } from "../../lib/prisma"
import { createAgendamentBody, cancelAgendamentBody, createAgendamentBarberBody, cancelAgendamentBarberBody } from './emails-body'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "vemencycompany@gmail.com", // env
        pass: "dpdykesfdejpkdpw", // env
    }
})

async function getUserById(userId: any) {
    return prisma.user.findUnique({
        where: { id: userId }
    })
}

async function getServiceById(id: number) {
    const verifyService = await prisma.services.findFirst({ where: { id } })
    if (!verifyService) throw new Error(`O serviço de id ${id} não existe`)
    return verifyService
}

async function getAgendamentById(id: number) {
    const verifyAgendament = await prisma.agendament.findFirst({ where: { id } })
    if (!verifyAgendament) throw new Error(`O agendamento de id ${id} não existe`)
    return verifyAgendament
}

async function getBarber(barberId: number) {
    return await prisma.user.findFirst({
        where: {
            id: barberId,
            role: 'professional',
        }
    })
}

// Refatorar depois a tipagem do userId para somente number em todas as ocasiões 
async function sendEmailCreatedAgendament(userId: string | number, agendamentId: number) {
    const clientInfo = await getUserById(userId)
    const agendamentInfo = await getAgendamentById(agendamentId)
    const serviceInfo = await getServiceById(agendamentInfo.serviceId)
    const barber = await getBarber(agendamentInfo.professionalId)

    try {
        await transporter.sendMail({
            from: '"Urus Barbearia" <urusbarbearia@gmail.com>',
            to: clientInfo?.email,
            subject: "Agendamento de serviço",
            text: `Olá ${clientInfo?.name}, agradecemos por confiar em nossa barbearia, segue o agendamento`,
            html: `${createAgendamentBody(clientInfo?.name, serviceInfo.name, agendamentInfo.appointmentDate, agendamentInfo.appointmentTime)}`
        })
        await transporter.sendMail({
            from: '"Urus Barbearia" <urusbarbearia@gmail.com>',
            to: barber?.email,
            subject: "Novo agendamento",
            text: `Olá ${barber?.name}, um novo serviço foi agendado com você`,
            html: `${createAgendamentBarberBody(barber?.name, serviceInfo.name, agendamentInfo.appointmentDate, agendamentInfo.appointmentTime)}`
        })
    } catch (err) {
        throw new Error('Error ao enviar email de agendamento')
    }
}

async function sendEmailCanceledAgendament(userId: string | number, agendamentId: number) {
    const clientInfo = await getUserById(userId)
    const agendamentInfo = await getAgendamentById(agendamentId) // Puxando a data do agendamento
    const serviceInfo = await getServiceById(agendamentInfo.serviceId) // Puxando o nome do serviço marcado
    const barber = await getBarber(agendamentInfo.professionalId)

    try {
        await transporter.sendMail({
            from: '"Urus Barbearia" <urusbarbearia@gmail.com>',
            to: clientInfo?.email,
            subject: "Cancelamento de agendamento",
            text: `Olá ${clientInfo?.name}, seu agendamento foi cancelado com sucesso`,
            html: `${cancelAgendamentBody(clientInfo?.name, serviceInfo.name, agendamentInfo.appointmentDate, agendamentInfo.appointmentTime)}`
        })
        await transporter.sendMail({
            from: '"Urus Barbearia" <urusbarbearia@gmail.com>',
            to: barber?.email,
            subject: "Cancelamento de agendamento",
            text: `Olá ${barber?.name}, um serviço agendado com você foi cancelado`,
            html: `${cancelAgendamentBarberBody(barber?.name, serviceInfo.name, agendamentInfo.appointmentDate, agendamentInfo.appointmentTime)}`
        })
    } catch (err) {
        throw new Error('Error ao enviar email')
    }
}

export { sendEmailCreatedAgendament, sendEmailCanceledAgendament }