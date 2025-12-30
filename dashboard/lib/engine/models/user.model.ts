export interface IUser {
    id: string;
    email: string;
    username: string;
    password: string; // hashed
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserRegistration {
    email: string;
    username: string;
    password: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUserResponse {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
}

export interface IAuthResponse {
    user: IUserResponse;
    token: string;
}
