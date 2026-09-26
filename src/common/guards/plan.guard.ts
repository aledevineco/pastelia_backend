import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PLAN_KEY } from "../decorator/require-plan.decorator";

const PLAN_HIERARCHY: Record<string, number> = {
    starter: 1, pro: 2
}

@Injectable()
export class PlanGuard implements CanActivate {
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean {
        const requiredPlan = this.reflector.get<string>(
            PLAN_KEY,
            context.getHandler()
        )

        if(!requiredPlan){
            return true
        }

        const request = context.switchToHttp().getRequest()
        const businessPlan = request.business?.plan

        if(!businessPlan){
            throw new ForbiddenException("No se pudo determinar el plan del negocio")
        }

        const hasAccess = PLAN_HIERARCHY[businessPlan] >= PLAN_HIERARCHY[requiredPlan]

        if(!hasAccess){
            throw new ForbiddenException(`Esta función requiere el plan ${requiredPlan} o superior`)
        }

        return true;
    }

    
}
