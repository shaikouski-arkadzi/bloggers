import { injectable } from "inversify";
import { BlogModel } from "../db/blog.model";

@injectable()
export class BlogsCommandRepository {
  async save(blog: any): Promise<string> {
    const savedBlog = await blog.save();

    return savedBlog._id.toString();
  }

  async delete(id: string): Promise<void> {
    await BlogModel.findByIdAndDelete(id);
  }
}
