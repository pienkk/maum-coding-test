
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePostInput {
    title: string;
    description: string;
}

export class UpdatePostInput {
    id: string;
    title: string;
    description: string;
}

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
    abstract fetchPost(id: string): Post | Promise<Post>;

    abstract fetchPosts(page?: Nullable<string>, search?: Nullable<string>): Nullable<FetchPosts> | Promise<Nullable<FetchPosts>>;

    abstract fetchMyPosts(page?: Nullable<string>, search?: Nullable<string>): Nullable<FetchPosts> | Promise<Nullable<FetchPosts>>;

    abstract user(): User | Promise<User>;
}

export abstract class IMutation {
    abstract createPost(createPostInput: CreatePostInput): Post | Promise<Post>;

    abstract updatePost(updatePostInput: UpdatePostInput): Post | Promise<Post>;

    abstract removePost(id: string): boolean | Promise<boolean>;

    abstract signIn(email: string, password: string): Nullable<Token> | Promise<Nullable<Token>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(password: string): boolean | Promise<boolean>;
}

export class FetchPosts {
    posts?: Nullable<Nullable<Post>[]>;
    count: string;
}

export class Post {
    id: string;
    title: string;
    description: string;
    created_at: string;
    user: User;
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
