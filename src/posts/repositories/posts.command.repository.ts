import { injectable } from "inversify";
import { Types } from "mongoose";
import { PostDocument, PostModel } from "../db/post.model";
import { LikePostDocument, LikePostModel } from "../db/likePost.model";

@injectable()
export class PostsCommandRepository {
  async save(post: PostDocument): Promise<string> {
    const savedPost = await post.save();

    return savedPost._id.toString();
  }

  async delete(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<PostDocument | null> {
    const result = await PostModel.findById(id);

    if (!result) {
      return null;
    }

    return result;
  }

  async findLikeStatusByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<LikePostDocument | null> {
    const result = await LikePostModel.findOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async saveLike(likeModel: LikePostDocument): Promise<Types.ObjectId> {
    const result = await likeModel.save();

    return result._id;
  }

  async deleteLikeStatus(userId: string, postId: string): Promise<void> {
    await LikePostModel.deleteOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });
  }
}
