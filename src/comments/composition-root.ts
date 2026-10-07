import { container } from "../settings/container";
import { CommentsService } from "./application/comments.service";
import { CommentsController } from "./controllers/comments.controllers";
import {
  CommentsCommandRepository,
  CommentsQueryRepository,
} from "./repositories";

container.bind(CommentsCommandRepository).to(CommentsCommandRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);

container.bind(CommentsService).to(CommentsService);

container.bind(CommentsController).to(CommentsController);

export const commentsController = container.get(CommentsController);
