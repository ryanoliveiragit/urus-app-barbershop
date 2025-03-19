
import { prisma } from "../../lib/prisma";
import { sendSmsForPhone } from "../sms/services";

export const getUserById = async (id: number) =>  {
    const search = await prisma.user.findFirst({ where: { id }})
    return search
}

export const sendAuthCode = async (id: number, phone: string) => {
    const authCode = Math.floor(100000 + Math.random() * 900000)

    // Seta um codigo de autenticação
    try {
        await prisma.user.update({
            where: { id },
            data: {
                authCode
            }
        })
    } catch (err) {
        throw new Error(`Erro ao gerar código de autenticação`)
    }
    await sendSmsForPhone(phone)
}

export const verifyAuthCode = async (id: number, authCode: number) => {
    const search = await getUserById(id)
    if (!search) throw new Error(`O usuário de id ${id} não existe`)
    if (search.authCode === null) throw new Error(`Código de verificação não existe`)
    if (search.authCode != authCode) throw new Error(`Código inválido`)

    // Retorna ao valor padrao do authCode
    await prisma.user.update({
        where: { id },
        data: {
            authCode: null
        }
    })
}

export const setContactOption = async (id: number, sendContactOption: string) => {
    const search = getUserById(id)
    if (!search) throw new Error(`O usuário de id ${id} não existe`)

    await prisma.user.update({
        where: { id },
        data: {
            sendOptions: sendContactOption
        }
    })
}
