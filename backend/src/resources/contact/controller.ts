
import { Request, Response } from "express";
import { sendAuthCode, verifyAuthCode, setContactOption } from "./services";

export const sendCode = async (req: Request, res: Response): Promise<void> => {
    const { userId, phone } = req.body

    if (!userId) {
        res.status(400).json({ error: "É necessário fornecer userId." })
        return
    }
    if (!phone) {
        res.status(400).json({ error: "É necessário fornecer um número de telefone." })
        return
    }

    try {
        const send = await sendAuthCode(userId, phone)
        res.status(204).json({ send })
    } catch (error: any) {
        console.error("Erro ao enviar código de verificação:", error instanceof Error ? error.stack : error)
        res.status(500).json({
            error: "Erro ao enviar código de verificação",
            message: error.message || "Erro desconhecido",
        })
    }
}

export const verifyPhone = async (req: Request, res: Response): Promise<void> => {
    const { userId, authCode } = req.body

    if (!userId) {
        res.status(400).json({ error: "É necessário fornecer userId." })
        return
    }
    if (!authCode) {
        res.status(400).json({ error: "É necessário fornecer um código de autenticação" })
    }

    try {
        const verify = await verifyAuthCode(userId, authCode)
        res.status(204).json({ verify })
    } catch (error: any) {
        console.error("Erro ao verificar número:", error instanceof Error ? error.stack : error)
        res.status(500).json({
            error: "Erro ao verificar número",
            message: error.message || "Erro desconhecido",
        })
    }
}

export const contactOption = async (req: Request, res: Response): Promise<void> => {
    const { userId, contactOption } = req.body

    if (!userId) {
        res.status(400).json({ error: "É necessário fornecer userId." })
        return
    }
    if (!contactOption) {
        res.status(400).json({ error: "É necessário fornecer uma opção de contato" })
        return
    }
    if (contactOption != "email" || contactOption != "phone" || contactOption != "both" ) {
        res.status(400).json({ error: "Opção de contato inválida" })
    }

    try {
        const setContact = await setContactOption(userId, contactOption)
        res.status(204).json({ setContact })
    } catch (error: any) {
        console.error("Erro ao selecionar opção para contato:", error instanceof Error ? error.stack : error)
        res.status(500).json({
            error: "Erro ao selecionar opção para contato",
            message: error.message || "Erro desconhecido",
        })
    }
}