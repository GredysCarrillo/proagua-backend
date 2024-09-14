import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { jwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ){}
  
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('usuario no autorizado');
    }

    try {
      const payload = await this.jwtService.verifyAsync<jwtPayload>(
        token, { secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findUserById(payload.id);
      if(!user) throw new UnauthorizedException('This user do no existe');
      if(!user.isActive) throw new UnauthorizedException('This user is not active');
      request['user'] = user;
    }
    catch (error) {
      console.error('error al verificar el token', error.message);
      throw new UnauthorizedException('El token tiene algun problema');
    } 
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}

