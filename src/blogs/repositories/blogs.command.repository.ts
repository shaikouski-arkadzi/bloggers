import { injectable } from "inversify";
import { BlogModel } from "../db/blog.model";

@injectable()
export class BlogsCommandRepository {
  async save(blog: any): Promise<void> {
    await blog.save();
  }

  async delete(id: string): Promise<void> {
    await BlogModel.findByIdAndDelete(id);
  }
}
