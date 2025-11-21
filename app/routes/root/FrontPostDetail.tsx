import type { LoaderFunctionArgs } from "react-router";
import { getPostById } from "~/appwrite/posts";

import {
  cn,
  formatDate,
  formatDateCgt,
  parseTripData,
  timeAgo,
} from "~/lib/utils";
import { Header, InfoPill } from "componentsCreated";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import MarkdownRenderer from "componentsCreated/MarkdownRenderer";
import type { Route } from "./+types/FrontPostDetail";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { postId } = params;

  if (!postId) throw new Error("Post Id is required!");

  const row = await getPostById(postId);
  const post = parseTripData(row);

  return { post };
};

const FrontPostDetail = ({ loaderData }: Route.ComponentProps) => {
  // const postData = parseTripData(loaderData?.post)
  // const { postDetails } = postData || {}
  //   // const postData = parseTripData(loaderData?.post);
  const { post } = loaderData;
  // console.log('post', post);

  return (
    <main className="travel-detail wrapper">
      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold !text-success-500">{post?.title}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={formatDate(post?.createdAt)}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={post?.location || post?.title}
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
        {/* <p className="text-sm md:text-lg font-normal text-dark-400">{post?.postDetails}</p> */}
        <MarkdownRenderer content={post?.postDetails ?? ""} />
      </section>
    </main>
  );
};

export default FrontPostDetail;
