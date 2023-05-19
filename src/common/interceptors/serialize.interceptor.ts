import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map(data => {
      return plainToInstance(this.dto, data, {
        excludeExtraneousValues: true,
      });
    }));
  }
}