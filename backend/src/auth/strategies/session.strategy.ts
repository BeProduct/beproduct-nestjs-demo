import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import type { Request } from 'express';

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'session') {
  constructor() {
    super();
  }

  async validate(req: Request): Promise<any> {
    // Passport session has already deserialized the user into req.user
    if (!req.user) {
      return null;
    }

    return req.user;
  }
}
