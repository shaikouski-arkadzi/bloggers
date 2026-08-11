import { Request, Response } from "express";
import { Post } from "../../posts/types";
import { postRepository } from "../../posts/repositories";
import {
  PaginatorData,
  SortBy,
  SortDirection,
  SortDirections,
} from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";

interface PostsQuery {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: SortBy<Post>;
  sortDirection?: SortDirection;
}

export const getBlogPosts = async (
  req: Request<{ id: string }, {}, {}, PostsQuery>,
  res: Response<PaginatorData<Post>>,
) => {
  const id = req.params.id;

  const page = Number(req.query.pageNumber) || PAGE_DAFAULT;
  const pageSize = Number(req.query.pageSize) || PAGE_SIZE_DAFAULT;
  const sortBy = req.query.sortBy || SORT_FIELD_DAFAULT;
  const sortDirection =
    req.query.sortDirection === SortDirections.ASC
      ? SortDirections.ASC
      : SortDirections.DESC;

  const allPostsCount = await postRepository.count({
    field: "id",
    condition: id,
  });

  const pagesCount = Math.ceil(allPostsCount / pageSize);

  const result = await postRepository.findPostsByBlog(id, {
    page,
    pageSize,
    sortBy,
    sortDirection,
  });

  const returnData: PaginatorData<Post> = {
    pagesCount,
    page,
    pageSize,
    totalCount: allPostsCount,
    items: result,
  };

  res.status(200).json(returnData);
};
