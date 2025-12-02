// app/types/post.ts
export interface Post {
  id: string;
  title: string;
  subTitle: string;
  titleDescription: string;
  location: string;
  tags: string[];
  postDetails: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  title: string;
  subTitle: string;
  titleDescription: string;
  location: string;
  tags: string;
  postDetails: string;
}