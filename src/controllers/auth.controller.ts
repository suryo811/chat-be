import type { NextFunction, Request, Response } from 'express';
import prisma from '../config/db.config.js';
import jwt from 'jsonwebtoken';

interface LoginPayloadType {
  name: string;
  email: string;
  provider: string;
  oauthId: string;
  image?: string;
}

interface JWTPayload {
  name: string;
  email: string;
  id: number;
}

class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const body: LoginPayloadType = req.body;

      let findUser = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!findUser) {
        findUser = await prisma.user.create({
          data: body,
        });
      }

      let jwtPayload: JWTPayload = {
        name: body.name,
        email: body.email,
        id: findUser.id,
      };

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '333d' });

      return res.status(200).json({
        message: 'User logged in successfully',
        user: {
          ...findUser,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}

export default AuthController;
