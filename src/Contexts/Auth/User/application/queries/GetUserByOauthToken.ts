import {Query} from "../../../../Shared/domain/Query";
import {GetAuthTokenQuery} from "./GetAuthToken/GetAuthTokenQuery";
import {QueryHandler} from "../../../../Shared/domain/QueryHandler";
import {Auth} from "../../domain/services/Auth";
import {OAuthUser} from "../../domain/models/OAuthUser";

export class GetUserByOauthTokenQuery extends Query {
  constructor(readonly token: string) {
    super();
  }
}

export class GetUserByOauthTokenQueryHandler implements QueryHandler<GetUserByOauthTokenQuery, any | null> {
  constructor(private auth: Auth) {
  }

  subscribedTo(): Query {
    return GetAuthTokenQuery;
  }

  async handle(command: GetUserByOauthTokenQuery): Promise<OAuthUser> {
    const decodedToken = await this.auth.verify(command.token);
    const user = await this.auth.user(decodedToken.uid);

    return new OAuthUser(user.uid, user.email)
  }
}
