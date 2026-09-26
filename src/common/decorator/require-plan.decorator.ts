import { SetMetadata } from "@nestjs/common";

export const PLAN_KEY = 'requiredPlan';
export const RequirePlan = (plan: 'starter' | 'pro') => SetMetadata(PLAN_KEY, plan);