export interface JwtPayload {
  id: string;
  email: string;
  role: JwtRole;
  iat?: number;
  exp?: number;
}

export interface JwtRole {
    _id:any;
    roleDisplayName:string;
    roleGroup:string;
}