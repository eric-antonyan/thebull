// src/app.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as crypto from 'crypto';

@Controller()
export class AppController {
  @Get('csrf-token')
  generateCsrf(@Res() res: Response) {
    const token = crypto.randomBytes(32).toString('hex');

    res.cookie('csrf_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return res.json({ csrfToken: token });
  }
}
