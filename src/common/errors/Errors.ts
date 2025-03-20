import { Auth } from 'common/errors/AuthErrors';
import { Common } from 'common/errors/CommonErrors';
import { User } from 'common/errors/UserErrors';
enum ErrorsNumber {
  Common = 100,
  Auth = 200,
  User = 300,
}

export const Errors = {
  Common,
  Auth,
  User
};