import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleRedirectGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const user = request.user;
    
    if (!user) {
      return response.redirect('/login');
    }

    // Configuration des routes par rôle
    const roleRoutes = {
      'admin': '/admin/dashboard',
      'technicien': '/technician/dashboard',
      'client': '/client/dashboard',
      'comptable': '/accountant/dashboard'
    };

    const defaultRoute = '/dashboard';
    
    // Redirection vers le dashboard correspondant
    response.redirect(roleRoutes[user.role] || defaultRoute);
    
    return true;
  }
}