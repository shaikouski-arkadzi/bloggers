import { injectable } from "inversify";
import { PostDocument, PostModel } from "../db/post.model";

@injectable()
export class PostsCommandRepository {
  async save(post: PostDocument): Promise<string> {
    const savedPost = await post.save();

    return savedPost._id.toString();
  }

  async delete(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id);
  }
}
