import { injectable } from "inversify";
import { PostModel } from "../db/post.model";

@injectable()
export class PostsCommandRepository {
  async save(post: any): Promise<string> {
    const savedPost = await post.save();

    return savedPost._id.toString();
  }

  async delete(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id);
  }
}
