
import { prisma } from "../../lib/prisma";
import { sendSMS } from "../sms/sms-service";

export const getUserById = async (id: number) =>  {
    const search = await prisma.user.findFirst({ where: { id }})
    return search
}

export const sendAuthCode = async (id: number, phone: string) => {
    const authCode = Math.floor(100000 + Math.random() * 900000)
    let updateSuccess = false
    try {
        await prisma.user.update({
            where: { id },
            data: { authCode }
        })
        updateSuccess = true
        await sendSMS(`+seunumero`, `Código de verificação: ${authCode}`)
    } catch (err) {
        if (updateSuccess) {
            try {
                await prisma.user.update({
                    where: { id },
                    data: { authCode: null }
                });
            } catch (revertErr) {
                console.error('Falha ao reverter o authCode:', revertErr);
            }
        }
        throw new Error(`Erro ao enviar código de autenticação`)
    }
}

export const verifyAuthCode = async (id: number, authCode: number) => {
    const search = await getUserById(id)
    if (!search) throw new Error(`O usuário de id ${id} não existe`)
    if (search.authCode === null) throw new Error(`Código de verificação não existe`)
    if (search.authCode != authCode) throw new Error(`Código incorreto`)

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
