import { PostsService } from "../posts/application/posts.service";
import { container } from "../settings/container";
import { userService } from "../users/composition-root";
import { CommentsService } from "./application/comments.service";
import { CommentsController } from "./controllers/comments.controllers";
import {
  CommentsCommandRepository,
  CommentsQueryRepository,
} from "./repositories";

export const commentsCommandRepository = new CommentsCommandRepository();
export const commentsQueryRepository = new CommentsQueryRepository();

export const commentsService = new CommentsService(
  commentsCommandRepository,
  commentsQueryRepository,
  container.get(PostsService),
  userService,
);

export const commentsController = new CommentsController(
  commentsService,
  commentsQueryRepository,
);
