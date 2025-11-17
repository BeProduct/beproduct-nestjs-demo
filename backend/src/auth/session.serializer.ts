import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from './interfaces/user.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, id?: string) => void): void {
    console.log('=== SERIALIZE USER ===');
    console.log('User ID:', user.id);
    // Store only user ID in session
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: (err: Error | null, user?: User) => void): Promise<void> {
    try {
      console.log('=== DESERIALIZE USER ===');
      console.log('User ID from session:', userId);
      // Fetch full user from storage (includes accessToken/refreshToken)
      const user = await this.authService.findById(userId);
      console.log('User found:', user ? 'YES' : 'NO');
      done(null, user || undefined);
    } catch (error) {
      console.error('Deserialize error:', error);
      done(error);
    }
  }
}
