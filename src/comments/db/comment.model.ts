import { model } from "mongoose";
import { CommentDb } from "../types";
import { commentSchema } from "./comment.schema";

export const CommentModel = model<CommentDb>("Comment", commentSchema);
