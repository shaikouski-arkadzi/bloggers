import { ObjectId } from "mongodb";
import { inject, injectable } from "inversify";
import { UnauthorizedException } from "../../auth/exceptions";
import { PaginatorData } from "../../common/types";
import { Comment, CommentInputModel, CommentsQuery } from "../types";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";
import { PostsService } from "../../posts/application/posts.service";
import { UserService } from "../../users/application/user.service";
import {
  CommentsCommandRepository,
  CommentsQueryRepository,
} from "../repositories";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsCommandRepository)
    private commentsCommandRepository: CommentsCommandRepository,

    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,

    @inject(PostsService)
    private postsService: PostsService,

    @inject(UserService)
    private userService: UserService,
  ) {}

  async getCommentById(id: string): Promise<Comment | null> {
    const commentObjectId = new ObjectId(id);

    const comment = await this.commentsQueryRepository.findByField({
      _id: commentObjectId,
    });

    return comment;
  }

  async findManyByPost(
    postId: string,
    queries: CommentsQuery,
  ): Promise<PaginatorData<Comment>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    await this.postsService.findById(postId);

    const allCommentsCount = await this.commentsQueryRepository.count({
      postId: new ObjectId(postId),
    });

    const pagesCount = Math.ceil(allCommentsCount / pageSize);

    const result = await this.commentsQueryRepository.findCommentsByPost(
      postId,
      {
        page,
        pageSize,
        sortBy,
        sortDirection,
      },
    );

    return {
      pagesCount,
      page,
      pageSize,
      totalCount: allCommentsCount,
      items: result,
    };
  }

  async create(
    userId: string,
    postId: string,
    content: string,
  ): Promise<ObjectId> {
    const userObjectId = new ObjectId(userId);

    const user = await this.userService.getUserById(userObjectId);

    if (!user) throw new UnauthorizedException();

    await this.postsService.findById(postId);

    const payload: Omit<Comment, "id"> = {
      content,
      commentatorInfo: {
        userId,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    };

    const commentId = await this.commentsCommandRepository.create(
      payload,
      postId,
    );

    return commentId;
  }

  async update(
    userId: string,
    commentId: string,
    commentInput: CommentInputModel,
  ): Promise<void> {
    const user = await this.userService.getUserById(new ObjectId(userId));

    if (!user) throw new UnauthorizedException();

    const comment = await this.getCommentById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId !== userId) {
      throw new PermissionException();
    }

    await this.commentsCommandRepository.update(commentId, commentInput);
  }

  async delete(userId: string, commentId: string): Promise<void> {
    const user = await this.userService.getUserById(new ObjectId(userId));

    if (!user) throw new UnauthorizedException();

    const comment = await this.getCommentById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId !== userId) {
      throw new PermissionException();
    }

    await this.commentsCommandRepository.delete(commentId);
  }
}
