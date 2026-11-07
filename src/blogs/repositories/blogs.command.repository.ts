import { injectable } from "inversify";
import { BlogDocument, BlogModel } from "../db/blog.model";
import { BlogDb } from "../types";

@injectable()
export class BlogsCommandRepository {
  async save(blog: BlogDocument): Promise<string> {
    try {
      const savedBlog = await blog.save();

      return savedBlog._id.toString();
    } catch (error) {
      console.error("[blogs.save] Ошибка сохранения", error);
      throw error;
    }
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
