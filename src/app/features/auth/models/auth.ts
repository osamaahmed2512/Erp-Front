export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenRequestDto {
  
  token: string;
  refreshToken: string;
}