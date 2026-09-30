import { postsService } from "../posts/composition-root";
import { userService } from "../users/composition-root";
import { CommentsService } from "./application/comments.service";
import {
  CommentsCommandRepository,
  CommentsQueryRepository,
} from "./repositories";

export const commentsCommandRepository = new CommentsCommandRepository();
export const commentsQueryRepository = new CommentsQueryRepository();

export const commentsService = new CommentsService(
  commentsCommandRepository,
  commentsQueryRepository,
  postsService,
  userService,
);
