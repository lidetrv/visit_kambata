import type { LoaderFunctionArgs } from "react-router";
import { getPostById, deletePost } from "~/appwrite/posts";
import type { Route } from "./+types/post-detail";
import { cn, formatDate, parseTripData, timeAgo } from "~/lib/utils";
import { Header, InfoPill } from "componentsCreated";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import MarkdownRenderer from "componentsCreated/MarkdownRenderer";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";
import EditPostForm from "componentsCreated/EditPostForm";
// import EditPostForm from "~/components/EditPostForm"; // Make sure this path is correct

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { postId } = params;

  if (!postId) throw new Error("Post Id is required!");

  const row = await getPostById(postId);
  const post = parseTripData(row);

  return { post };
};

const PostDetail = ({ loaderData }: Route.ComponentProps) => {
  const { post } = loaderData;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  //checking the debug
  console.log("Post data in PostDetail: ", post);
  console.log("Post raw data: ", post?.raw);
  const handleDelete = async () => {
    if (!post?.id) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deletePost(post.id);
      alert("Post deleted successfully!");
      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    // You can either refresh the page or update the post data
    window.location.reload(); // Simple refresh to get updated data
  };

  if (isEditing) {
    return (
      <main className="travel-detail wrapper">
        <Header title="Edit Post" description="Update your post details" />
        <EditPostForm
          post={post}
          onCancel={() => setIsEditing(false)}
          onSuccess={handleEditSuccess}
        />
      </main>
    );
  }

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Post Details"
        description="View and manage created posts"
      />

      <div className="flex justify-end gap-4 mb-6">
        <Button
          onClick={() => setIsEditing(true)}
          variant="outline"
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Edit Post
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Delete Post
        </Button>
      </div>

      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold !text-success-500">{post?.title}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={formatDate(post?.createdAt)}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={post?.location}
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>
        <section className="gallery">
          {post?.imageUrls.map((url: string, i: number) => (
            <img
              src={url}
              key={i}
              className={cn(
                "w-full rounded-xl object-cover",
                i === 0
                  ? "md:col-span-2 row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>
        <section className="flex gap-3 md:gap-5 flex-wrap items-center">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {post?.tags.map((tag: string, i: number) => (
                <ChipDirective
                  key={i}
                  text={tag}
                  cssClass={`!text-base !font-medium !px-4 ${i === 0 ? "!bg-pink-50 !text-pink-500" : i === 1 ? "!bg-primary-50 !text-primary-500" : i === 2 ? "!bg-success-50 !text-success-500" : "!bg-amber-50 !text-amber-500"}`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
          <ChipListComponent>
            <ChipsDirective>
              <ChipDirective
                text={`Posted ${timeAgo(post?.createdAt)}`}
                cssClass="!bg-success-500 !text-white !font-small"
              />
            </ChipsDirective>
          </ChipListComponent>
        </section>
        <section className="title">
          <article>
            <h3>{post?.subTitle}</h3>
            <p>{post?.titleDescription}</p>
          </article>
        </section>
        <MarkdownRenderer content={post?.postDetails ?? ""} />
      </section>
    </main>
  );
};

export default PostDetail;
