
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

export class User {
    id: string;
    name: string;
    email: string;
    created_at?: Nullable<string>;
}

export abstract class IQuery {
    abstract user(): User | Promise<User>;

    abstract hello(): string | Promise<string>;
}

export abstract class IMutation {
    abstract createUser(createUserInput: CreateUserInput): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
