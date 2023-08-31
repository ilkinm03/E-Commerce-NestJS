import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Order } from "@prisma/client";
import { OrdersService } from "../orders.service";

@Injectable()
export class OrderOwnerGuard implements CanActivate {
  constructor(private readonly ordersService: OrdersService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orderId: number = parseInt(request.params.id, 10);
    const userId: number = request.user.sub;
    const order: Order = await this.ordersService.getOrderById(orderId);
    if (order && userId !== order.userId) {
      throw new ForbiddenException("order not found");
    }
    return true;
  }
}