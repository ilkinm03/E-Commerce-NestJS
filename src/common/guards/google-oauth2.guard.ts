import { CanActivate } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class GoogleOauth2Guard extends AuthGuard("google") implements CanActivate {
  constructor() {
    super({
      accessType: "offline",
    });
  }
}