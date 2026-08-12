import { postRepository } from "../repositories";
import { Post } from "../types";
import { mapPostDbToPost } from "../utils";

export const postsService = {
  async findById(id: string): Promise<Post | null> {
    const result = await postRepository.findById(id);

    if (!result) {
      return null;
    }

    return mapPostDbToPost(result);
  },
};
