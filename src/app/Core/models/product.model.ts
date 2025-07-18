import { IUsers } from "./auth.model";
import { ICategory } from "./category.model";

export interface IProduct {
  id: string;
  name: string;
  shortDescription: string;
  categoryId: string;
  category: ICategory;
  imageUrl: string;
  createdAt: string;
  createdBy: string;
  author: IUsers;
  status: boolean;
}


export interface IProductCreateDto {
  name: string;
  shortDescription: string;
  categoryId: string;
}

export interface IProductUpdateDto {
  name?: string;
  shortDescription?: string;
  categoryId?: string;
  imageUrl?: string;
}

export interface IPagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

