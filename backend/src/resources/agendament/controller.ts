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

    if (!userId || !professionalId || !serviceId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const newAgendament = await createAgendament({
      userId,
      professionalId,
      serviceId,
      appointmentDate,
      appointmentTime,
    });

    return res.status(201).json(newAgendament);
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao criar agendamento", message: error.message });
  }
};