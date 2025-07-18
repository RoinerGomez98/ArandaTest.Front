export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUsers {
    id: string,
    name: string,
    email: string,
    document: string,
    token: string,
    expires: string,
    status: boolean
}

export interface IGenericResponse<T> {
  message: string;
  status: number;
  result: T;
}