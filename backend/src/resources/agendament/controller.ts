import { Request, Response } from "express";
import { cancelAgendament, createAgendament, getAgendamentsByUserId, getAllAgendaments } from "./services";

export const getAgendaments = async (req: Request, res: Response): Promise<void> => {
  try {
    const agendaments = await getAllAgendaments();
    res.status(200).json(agendaments);
  } catch (error: any) {
    console.log(error) // debug
    res.status(500).json({ error: "Erro ao obter agendamentos" });
  }
};

export const getUserAgendaments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      res.status(400).json({ error: "É necessário fornecer o ID do usuário." });
      return;
    }
    
    const agendaments = await getAgendamentsByUserId(userId);
    
    // Formatar os dados para o frontend
    const formattedAgendaments = agendaments.map(appointment => ({
      id: appointment.id.toString(),
      professionalName: appointment.professional.name,
      professionalSpecialty: appointment.professional.specialty,
      professionalImage: appointment.professional.image,
      serviceName: appointment.service.name,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      price: appointment.service.price,
      isCanceled: appointment.status === 'CANCELED',
      status: appointment.status
    }));
    
    res.status(200).json(formattedAgendaments);
    
  } catch (error: any) {
    console.error("Erro ao buscar agendamentos do usuário:", error instanceof Error ? error.stack : error);
    res.status(200).json([]);
  }
};

export const createNewAgendament = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, professionalId, serviceId, appointmentDate, appointmentTime } = req.body;

    // Verificação de campos obrigatórios
    if (!userId) {
      res.status(400).json({ error: "É necessário fornecer userId." });
      return;
    }
    if (!professionalId || !serviceId || !appointmentDate || !appointmentTime) {
      res.status(400).json({ error: "Todos os campos são obrigatórios." });
      return;
    }

    // Cria o novo agendamento
    const newAgendament = await createAgendament({
      userId,
      professionalId,
      serviceId,
      appointmentDate,
      appointmentTime,
    });

    res.status(201).json({ newAgendament });
  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error instanceof Error ? error.stack : error);
    res.status(500).json({
      error: "Erro ao criar agendamento",
      message: error.message || "Erro desconhecido",
    });
  }
};

export const cancelAgendaments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agendamentId } = req.body;

    // Verificação de campos obrigatórios
    if (!agendamentId) {
      res.status(400).json({ error: "É necessário fornecer agendamentId." });
      return;
    }

    // Cancelando pelo id no service
    const cancel = await cancelAgendament(agendamentId)
    res.status(201).json({ cancel });
  } catch (error: any) {
    console.error("Erro ao cancelar agendamento:", error instanceof Error ? error.stack : error);
    res.status(500).json({
      error: "Erro ao cancelar agendamento",
      message: error.message || "Erro desconhecido",
    });
  }
};