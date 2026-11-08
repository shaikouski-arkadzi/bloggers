import { HydratedDocument, Model, model } from "mongoose";
import { PostDb } from "../types";
import { postSchema } from "./post.schema";
import { PostEntity } from "../domain/Post.entity";

type PostStatics = typeof PostEntity;

export type TPostModel = Model<PostDb> & PostStatics;

export type PostDocument = HydratedDocument<PostDb>;

postSchema.loadClass(PostEntity);

export const PostModel = model<PostDb, TPostModel>("Post", postSchema);
