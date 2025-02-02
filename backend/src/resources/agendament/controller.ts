import { Request, Response } from "express";
import { createAgendament, getAllAgendaments } from "./services";

export const getAgendaments = async (req: Request, res: Response) => {
  try {
    const agendaments = await getAllAgendaments();
    res.status(200).json(agendaments);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter agendamentos" });
  }
};

export const createNewAgendament = async (req: Request, res: any) => {
  try {
    const { userId, professionalId, serviceId, appointmentDate, appointmentTime } = req.body;

    // Verificação de campos obrigatórios
    if (!userId) {
      return res.status(400).json({ error: "É necessário fornecer userId." });
    }
    if (!professionalId || !serviceId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Cria o novo agendamento
    const newAgendament = await createAgendament({
      userId,
      professionalId,
      serviceId,
      appointmentDate,
      appointmentTime,
    });

    return res.status(201).json({ newAgendament });

  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error instanceof Error ? error.stack : error);
    return res.status(500).json({
      error: "Erro ao criar agendamento",
      message: error.message || "Erro desconhecido",
    });
  }
};
