import { Types } from "mongoose";
import { inject, injectable } from "inversify";
import { UnauthorizedException } from "../../auth/exceptions";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";
import { PaginatorData } from "../../common/types";
import { PostsService } from "../../posts/application/posts.service";
import {
  CommentsCommandRepository,
  CommentsQueryRepository,
} from "../repositories";
import {
  Comment,
  CommentInputModel,
  CommentsQuery,
  TLikeStatus,
} from "../types";
import { jwtService, TokenType } from "../../auth/application/jwt.service";
import {
  booleanToLikeStatus,
  mapCommentDbToComment,
  mapCommentWithMyStatus,
} from "../utils";
import { CommentModel } from "../db/comment.model";
import { UserCommandRepository } from "../../users/repositories";
import { LikeModel } from "../db/like.model";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsCommandRepository)
    private commentsCommandRepository: CommentsCommandRepository,

    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,

    @inject(PostsService)
    private postsService: PostsService,

    @inject(UserCommandRepository)
    private userCommandRepository: UserCommandRepository,
  ) {}

  async getCommentById(id: string, auth?: string): Promise<Comment | null> {
    let userId: string | undefined;

    if (auth) {
      const [authType, token] = auth.split(" ");

      if (authType === "Bearer" && token) {
        const verified = await jwtService.verifyToken(token, TokenType.Access);

        if (verified) {
          userId = verified.uuid;
        }
      }
    }

    const commentDb = await this.commentsQueryRepository.findByField({
      _id: new Types.ObjectId(id),
    });

    if (!commentDb) {
      return null;
    }

    if (!userId) return mapCommentDbToComment(commentDb);

    const userCommentStatus =
      await this.commentsQueryRepository.findLikeByUserAndComment(userId, id);

    if (!userCommentStatus) return mapCommentDbToComment(commentDb);

    return mapCommentWithMyStatus(commentDb, userCommentStatus);
  }

  async findManyByPost(
    postId: string,
    queries: CommentsQuery,
    auth?: string,
  ): Promise<PaginatorData<Comment>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;

    let userId: string | undefined;

    if (auth) {
      const [authType, token] = auth.split(" ");

      if (authType === "Bearer" && token) {
        const verified = await jwtService.verifyToken(token, TokenType.Access);

        if (verified) {
          userId = verified.uuid;
        }
      }
    }

    await this.postsService.findById(postId);

    const allCommentsCount = await this.commentsQueryRepository.count({
      postId: new Types.ObjectId(postId),
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

    const items: Comment[] = [];

    for (const commentDb of result) {
      if (!userId) {
        items.push(mapCommentDbToComment(commentDb));
        continue;
      }

      const userCommentStatus =
        await this.commentsQueryRepository.findLikeByUserAndComment(
          userId,
          commentDb._id.toString(),
        );

      if (!userCommentStatus) {
        items.push(mapCommentDbToComment(commentDb));
        continue;
      }

      items.push(mapCommentWithMyStatus(commentDb, userCommentStatus));
    }

    return {
      pagesCount,
      page,
      pageSize,
      totalCount: allCommentsCount,
      items,
    };
  }

  async create(
    userId: string,
    postId: string,
    commentContent: string,
  ): Promise<Types.ObjectId> {
    const user = await this.userCommandRepository.findById(userId);

    if (!user) throw new UnauthorizedException();

    await this.postsService.findById(postId);

    const commentModel = CommentModel.createComment(
      commentContent,
      user,
      postId,
    );

    const commentId = await this.commentsCommandRepository.save(commentModel);

    return commentId;
  }

  async update(
    userId: string,
    commentId: string,
    commentInput: CommentInputModel,
  ): Promise<void> {
    const user = await this.userCommandRepository.findById(userId);

    if (!user) throw new UnauthorizedException();

    const comment = await this.commentsCommandRepository.findById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId.toString() !== userId) {
      throw new PermissionException();
    }

    comment.updateCommentContent(commentInput.content);

    await this.commentsCommandRepository.update(comment);
  }

  async delete(userId: string, commentId: string): Promise<void> {
    const user = await this.userCommandRepository.findById(userId);

    if (!user) throw new UnauthorizedException();

    const comment = await this.getCommentById(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.commentatorInfo.userId !== userId) {
      throw new PermissionException();
    }

    await this.commentsCommandRepository.delete(commentId);
  }

  async setLike(
    userId: string,
    commentId: string,
    likeStatus: TLikeStatus,
  ): Promise<void> {
    //TODO: check

    const comment = await this.commentsCommandRepository.findById(commentId);

    if (!comment) throw new NotFoundException();

    let likeModel =
      await this.commentsCommandRepository.findLikeStatusByUserAndComment(
        userId,
        commentId,
      );

    if (!likeModel && (likeStatus === "Like" || likeStatus === "Dislike")) {
      likeModel = LikeModel.createLikeStatus(userId, commentId, likeStatus);

      await this.commentsCommandRepository.createLike(likeModel);

      if (likeStatus === "Like") {
        comment.likesInfo.likesCount += 1;
      }

      if (likeStatus === "Dislike") {
        comment.likesInfo.dislikesCount += 1;
      }
    }

    if (!likeModel) {
      console.error("likeModel error");
      throw new Error();
    }

    const previousLike = booleanToLikeStatus(likeModel.like);

    if (previousLike && likeStatus !== previousLike) {
      if (likeStatus === "Like" || likeStatus === "Dislike") {
        await this.commentsCommandRepository.updateLikeStatus(
          userId,
          commentId,
          likeStatus,
        );
      }

      if (likeStatus === "None") {
        await this.commentsCommandRepository.deleteLikeStatus(
          userId,
          commentId,
        );
      }

      if (likeStatus === "Like" && previousLike === "Dislike") {
        comment.likesInfo.dislikesCount -= 1;
        comment.likesInfo.likesCount += 1;
      }

      if (likeStatus === "Dislike" && previousLike === "Like") {
        comment.likesInfo.likesCount -= 1;
        comment.likesInfo.dislikesCount += 1;
      }

      if (likeStatus === "None") {
        if (previousLike === "Like") {
          comment.likesInfo.likesCount -= 1;
        }
        if (previousLike === "Dislike") {
          comment.likesInfo.dislikesCount -= 1;
        }
      }
    }
    await this.commentsCommandRepository.save(comment);
  }
}
