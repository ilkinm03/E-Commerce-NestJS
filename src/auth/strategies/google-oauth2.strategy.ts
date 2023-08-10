import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { ConfigService } from "../../config/config.service";
import { IGoogleUser } from "../../users/interfaces";

export class GoogleOauth2Strategy extends PassportStrategy(Strategy, "google") {
    constructor(public readonly configService: ConfigService) {
      super({
        clientID: configService.googleOauthClientId,
        clientSecret: configService.googleOauthClientSecert,
        callbackURL: configService.googleOauthCallbackUrl,
        scope: ["profile", "email"],
      });
    }

    public async validate(
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: VerifyCallback,
    ): Promise<void> {
      const { id, name, emails } = profile;
      const user: IGoogleUser = {
        provider: "google",
        providedId: id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
      };
      done(null, user);
    }
}