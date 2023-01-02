
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export class UpdateUserInput {
    name: string;
    email: string;
    password: string;
}

export abstract class IQuery {
    abstract user(): User | Promise<User>;

    abstract hello(): string | Promise<string>;
}

export abstract class IMutation {
    abstract signIn(email: string, password: string): Nullable<Token> | Promise<Nullable<Token>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: string): boolean | Promise<boolean>;
}

export class User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export class Token {
    accessToken?: Nullable<string>;
}

type Nullable<T> = T | null;
