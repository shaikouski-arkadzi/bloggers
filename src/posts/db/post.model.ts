import { HydratedDocument, Model, model } from "mongoose";
import { PostDb, PostInputDto } from "../types";
import { postSchema } from "./post.schema";
import { PostEntity } from "../domain/Post.entity";

export interface PostMethods {
  updatePost(input: PostInputDto): void;
}

type PostStatics = typeof PostEntity;

export type TPostModel = Model<PostDb, {}, PostMethods> & PostStatics;

export type PostDocument = HydratedDocument<PostDb, PostMethods>;

postSchema.loadClass(PostEntity);

export const PostModel = model<PostDb, TPostModel>("Post", postSchema);
