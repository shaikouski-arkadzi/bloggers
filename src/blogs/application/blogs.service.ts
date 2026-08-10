import { blogRepository } from "../repositories";
import { mapBlogDbToBlog } from "../utils";
import { Blog } from "../types";

export const blogsService = {
  async findById(id: string): Promise<Blog | null> {
    const result = await blogRepository.findById(id);

    if (!result) {
      return null;
    }

    return mapBlogDbToBlog(result);
  },
};
