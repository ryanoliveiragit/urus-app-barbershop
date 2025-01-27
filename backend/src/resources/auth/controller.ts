import { compareSync, hashSync } from "bcrypt";
import { createUser } from "../users/services";
import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/secrets";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  let user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) {
    throw Error("User already exist");
  }
  user = await createUser({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw Error("User does not exist");
  }
  if (!compareSync(password, user.password ??'')) {
    throw Error("Incorrect password");
  }
  const token = jwt.sign({
    userId: user.id,
  }, JWT_SECRET)



  res.json({user, token})
};
