export const jwtConfig = {
  accessTokenSecret: "secret-access-token", // deve ser armazenado no .env
  accessTokenExpiresIn: "1h", // expira em 1 hora
  refreshTokenSecret: "secret-refresh-token", // deve ser armazenado no .env
  refreshTokenExpiresIn: "7d", // expira em 7 dias
};
