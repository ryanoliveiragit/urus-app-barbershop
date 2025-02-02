import { getOrderByIdController } from './../resources/payment/controller';
import { Router } from "express";
import { 
  createOrUpdateOrderPaymentController, 
  updateOrderPaymentController, 
getOrdersByUserIdController,
  getAllOrdersController, 

  deleteOrderPaymentController
} from "../resources/payment/controller"; 

const router = Router();

// Buscar todas as ordens de pagamento
router.get("/", getAllOrdersController);

// Buscar ordens pelo e-mail do usuário
router.get("/user/:userId", getOrdersByUserIdController);

// Buscar ordem específica por ID
router.get("/:id", getOrderByIdController);

// Criar ou atualizar uma ordem de pagamento
router.post("/", createOrUpdateOrderPaymentController);

// Atualizar ordem de pagamento
router.patch("/", updateOrderPaymentController);

// Deletar ordem de pagamento por ID
router.delete("/:id", deleteOrderPaymentController);

export default router;
