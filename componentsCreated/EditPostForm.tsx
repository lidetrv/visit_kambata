import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "~/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Editor from "./editor";
import { useRef, useState, type Key } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "~/lib/utils";
import type z from "zod";
import { updatePost } from "~/appwrite/posts";
import { ID } from "appwrite";

interface EditPostFormProps {
  post: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditPostFormFixed = ({
  post,
  onCancel,
  onSuccess,
}: EditPostFormProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract data safely from post
  const existingData = post
    ? {
        title: post.title || "",
        subTitle: post.subTitle || "",
        titleDescription: post.titleDescription || "",
        location: post.location || "",
        tags: post.tags || [],
        postDetails: post.postDetails || "",
        imageUrls: post.imageUrls || [],
        createdAt: post.createdAt || new Date().toISOString(),
      }
    : {
        title: "",
        subTitle: "",
        titleDescription: "",
        location: "",
        tags: [],
        postDetails: "",
        imageUrls: [],
        createdAt: new Date().toISOString(),
      };

  const form = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: existingData.title,
      subTitle: existingData.subTitle,
      miniSubTitle: existingData.titleDescription,
      content: existingData.postDetails,
      tags: existingData.tags,
      location: existingData.location,
    },
  });

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleUpdatePost = async (data: z.infer<typeof CreatePostSchema>) => {
    if (!post?.id) {
      alert("Post ID is missing!");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        postDetails: data.content,
        imageUrls: existingData.imageUrls, // Keep existing images for now
        tags: data.tags,
        title: data.title,
        subTitle: data.subTitle,
        titleDescription: data.miniSubTitle,
        location: data.location,
        createdAt: existingData.createdAt,
        updatedAt: new Date().toISOString(),
      };

      await updatePost(post.id, payload);

      alert("Post updated successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagRemove = (e: any) => {
    const deletedTagText = e.data.text;
    const currentTags = form.getValues("tags");
    const updatedTags = currentTags.filter(
      (tag: any) => tag !== deletedTagText
    );
    form.setValue("tags", updatedTags, { shouldDirty: true });
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleUpdatePost)}
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark-100">
                <span className="text-dark-100 font-bold">Title</span>{" "}
                <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular text-dark-100 no-focus min-h-[56px] rounded-1.5 border font-bold text-3xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sub Title */}
        <FormField
          control={form.control}
          name="subTitle"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>
                <span className="font-bold">Sub Title</span>{" "}
                <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mini Sub Title */}
        <FormField
          control={form.control}
          name="miniSubTitle"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>
                <span className="font-semibold text-sm">Title Description</span>{" "}
                <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>
                <span className="font-bold">Location</span>
                <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter location " />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Editor */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>
                <span className="font-semibold text-sm">Content</span>{" "}
                <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  editorRef={editorRef}
                  value={field.value}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Existing Images Display */}
        {existingData.imageUrls.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Existing Images:</h3>
            <div className="grid grid-cols-3 gap-4">
              {existingData.imageUrls.map((url: string, idx: number) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`existing-${idx}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div className="text-xs text-center mt-1">
                    Image {idx + 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Note: Image editing not implemented yet. Images remain unchanged.
            </p>
          </div>
        )}

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel>
                <span className="font-bold">Tags</span>{" "}
                <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    placeholder="Add Tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      <ChipListComponent
                        id="tag-chip"
                        enableDelete={true}
                        deleted={handleTagRemove}
                      >
                        <ChipsDirective>
                          {field.value.map(
                            (tag: string, index: Key | null | undefined) => (
                              <ChipDirective
                                key={index}
                                trailingIconCss="e-dlt-btn"
                                text={getFirstWord(tag)}
                                cssClass={cn(
                                  "iconClass",
                                  index === 1
                                    ? "!bg-pink-50 !text-pink-500 !font-medium"
                                    : "!bg-success-50 !text-success-700 !font-medium"
                                )}
                              />
                            )
                          )}
                        </ChipsDirective>
                      </ChipListComponent>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="mt-16 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="!w-full sm:w-[240px] !h-11 cursor-pointer"
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPostFormFixed;
