import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Business } from 'src/entities/business.entity';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private client: jwksClient.JwksClient;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Business)
    private readonly businessesRepository: Repository<Business>,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    this.client = jwksClient({
      jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
    });
  }

  private getSigningKey(kid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(kid, (err, key) => {
        if (err) return reject(err);
        resolve(key.getPublicKey());
      });
    });
  }

  private verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const decodedHeader = jwt.decode(token, { complete: true });
      if (!decodedHeader || typeof decodedHeader === 'string') {
        return reject(new Error('Token mal formado'));
      }

      const kid = decodedHeader.header.kid;

      this.getSigningKey(kid)
        .then((publicKey) => {
          jwt.verify(token, publicKey, { algorithms: ['ES256'] }, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
          });
        })
        .catch(reject);
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');

    let payload: any;
    try {
      payload = await this.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const userId = payload.sub;

    const business = await this.businessesRepository.findOneBy({ userId });

    if (!business) {
      throw new ForbiddenException('No se encontró un negocio asociado a este usuario');
    }

    if (business.status !== 'active') {
      throw new ForbiddenException('Tu suscripción no está activa');
    }

    request.userId = userId;
    request.business = business;

    return true;
  }
}