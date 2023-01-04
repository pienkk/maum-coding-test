
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

export class CreateReplyInput {
    postId: string;
    comment: string;
    replyId?: Nullable<string>;
}

export class UpdateReplyInput {
    id: string;
    postId: string;
    comment: string;
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

    abstract fetchReplies(postId: string, page?: Nullable<string>): Nullable<FetchReplies> | Promise<Nullable<FetchReplies>>;

    abstract user(): User | Promise<User>;
}

export abstract class IMutation {
    abstract createPost(createPostInput: CreatePostInput): Post | Promise<Post>;

    abstract updatePost(updatePostInput: UpdatePostInput): Post | Promise<Post>;

    abstract removePost(id: string): boolean | Promise<boolean>;

    abstract createReply(createReplyInput: CreateReplyInput): Reply | Promise<Reply>;

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
    created_at: DateTime;
    user: User;
}

export class FetchReplies {
    replies?: Nullable<Nullable<Reply>[]>;
    count: string;
}

export class Reply {
    id: string;
    postId: string;
    comment: string;
    created_at: DateTime;
    user: User;
    parents?: Nullable<Nullable<Reply>[]>;
}

export class User {
    id: string;
    name: string;
    email: string;
    created_at: DateTime;
}

export class Token {
    accessToken?: Nullable<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;
