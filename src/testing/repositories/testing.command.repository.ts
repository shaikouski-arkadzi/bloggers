import { injectable } from "inversify";

import { BlogModel } from "../../blogs/db/blog.model";
import { PostModel } from "../../posts/db/post.model";
import { UserModel } from "../../users/db/user.model";
import { CommentModel } from "../../comments/db/comment.model";
import { LikeModel } from "../../comments/db/like.model";
import { SessionModel } from "../../auth/db/session.model";

@injectable()
export class TestingCommandRepository {
  async clearDB(): Promise<void> {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await SessionModel.deleteMany({});
    await LikeModel.deleteMany({});
  }
}
