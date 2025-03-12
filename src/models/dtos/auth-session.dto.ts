// Next step is to implement data validation
export class AuthSessionInputDTO {
  readonly username: string;
  readonly token?: string;
  readonly expiresAt: Date;

  constructor({ username, token, expiresAt }: T_AuthSessionDTO) {
    this.username = username;
    this.token = token;
    this.expiresAt = expiresAt;
  }
}

// Next step is to implement data validation
export class AuthSessionOutputDTO extends AuthSessionInputDTO {
  readonly token: string;
}
