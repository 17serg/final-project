import type { AxiosInstance, AxiosResponse } from "axios";
import { IBook, IBookCreateData} from "../model";
import { axiosInstance } from "@/shared/lib/axiosInstance";

class BookService {
  constructor(private readonly client: AxiosInstance) {}

  async getBooks(): Promise<IBook[]> {
    const { data } = await this.client<IBook[]>("/books");
    return data;
  }

  async getFavouriteBooks(): Promise<IBook[]> {
    const { data } = await this.client<IBook[]>("/books/favourite");
    return data;
  }

  // async getReadedBooks(): Promise<IBook[]> {
  //   const { data } = await this.client<IBook[]>("/books/readed");
  //   return data;
  // }

  async getMyBooks(): Promise<IBook[]> {
    const { data } = await this.client<IBook[]>("/books/my");
    return data;
  }

  async likeBook(id: IBook["id"]): Promise<IBook> {
    const { data } = await this.client.post<IBook>(`/books/${id}/likeBook`);
    // console.log(data)
    return data;
  }

  async readBook(id: IBook["id"]): Promise<IBook> {
    const { data } = await this.client.post<IBook>(`/books/${id}/readBook`);
    // console.log(data)
    return data;
  }

  async addBook(book: IBookCreateData): Promise<IBook> {
    const { data } = await this.client.post<IBook>("/books/addbook", book);
    return data;
  }

  async deleteBook(id: IBook["id"]): Promise<AxiosResponse> {
    return this.client.delete<AxiosResponse>(`/books/${id}/delete`);
  }
}
export default new BookService(axiosInstance);