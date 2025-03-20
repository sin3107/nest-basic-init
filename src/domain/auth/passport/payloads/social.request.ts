import { Provider } from 'domain/users/entities/user.entity';

type SocialUser = {
  email: string;
  provider: Provider;
};

export type SocialRequest = Request & { user: SocialUser };