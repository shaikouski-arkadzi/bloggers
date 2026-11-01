import { injectable } from "inversify";
import { BlogModel } from "../db/blog.model";
import { BlogDb } from "../types";

@injectable()
export class BlogsCommandRepository {
  async save(blog: any): Promise<string> {
    const savedBlog = await blog.save();

    return savedBlog._id.toString();
  }

  async delete(id: string): Promise<void> {
    await BlogModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<BlogDb | null> {
    const result = await BlogModel.findById(id);

    if (!result) {
      return null;
    }

    return result;
  }
}
