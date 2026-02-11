export interface SessionUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export interface SessionPayload {
  user: SessionUser;
  exp: number;
}

export interface LineTokenResponse {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  scope: string;
  token_type: 'Bearer';
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}
