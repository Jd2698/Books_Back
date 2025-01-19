import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private role: string) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const role = this.role
		if (!role) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const userRole = request.user.rol

		return role == userRole
	}
}
