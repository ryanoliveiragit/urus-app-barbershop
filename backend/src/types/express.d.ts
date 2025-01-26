import { UserPayload } from './path-to-your-user-payload'; // Importando a interface do payload

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Agora o TypeScript sabe que 'req.user' pode ser um UserPayload
    }
  }
}