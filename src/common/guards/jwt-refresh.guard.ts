import { AuthGuard, IAuthGuard } from "@nestjs/passport";

export class JwtRefreshGuard extends AuthGuard("jwt-refresh")
  implements IAuthGuard {
  constructor() {
    super();
  }
}