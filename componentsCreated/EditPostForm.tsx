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
    const updatedTags = currentTags.filter((tag: any) => tag !== deletedTagText);
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
                          {field.value.map((tag: string, index: Key | null | undefined) => (
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
                          ))}
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

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CreatePostSchema } from "~/lib/validations";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/components/ui/form";
// import { Input } from "~/components/ui/input";
// import { Button } from "~/components/ui/button";
// import Editor from "./editor";
// import { useRef, useState, useEffect, type Key } from "react";
// import type { MDXEditorMethods } from "@mdxeditor/editor";
// import {
//   ChipDirective,
//   ChipListComponent,
//   ChipsDirective,
// } from "@syncfusion/ej2-react-buttons";
// import { cn, getFirstWord, getTagIcons } from "~/lib/utils";
// import type z from "zod";
// import { appwriteConfig, tablesDB } from "~/appwrite/client";
// import { ID } from "appwrite";
// import { useNavigate } from "react-router";

// type ImageItem = {
//   id: string;
//   src: string;
//   uploaded: boolean;
// };

// interface EditPostFormProps {
//   post: any;
//   onCancel: () => void;
//   onSuccess: () => void;
// }

// const EditPostForm = ({ post, onCancel, onSuccess }: EditPostFormProps) => {
//   const navigate = useNavigate();
//   const editorRef = useRef<MDXEditorMethods>(null);
//   const [images, setImages] = useState<ImageItem[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Safely parse the existing post data
//   const getExistingData = () => {
//     if (!post) return {};

//     // Try to get data from raw.postDetails first
//     if (post.raw?.postDetails) {
//       try {
//         return JSON.parse(post.raw.postDetails);
//       } catch (err) {
//         console.error("Error parsing raw.postDetails:", err);
//       }
//     }

//     // If raw doesn't exist or parsing fails, use post directly
//     return {
//       title: post.title || "",
//       subTitle: post.subTitle || "",
//       titleDescription: post.titleDescription || "",
//       location: post.location || "",
//       tags: post.tags || [],
//       postDetails: post.postDetails || "",
//       imageUrls: post.imageUrls || [],
//       createdAt: post.createdAt || new Date().toISOString(),
//     };
//   };

//   const existingData = getExistingData();

//   const form = useForm({
//     resolver: zodResolver(CreatePostSchema),
//     defaultValues: {
//       title: existingData.title || "",
//       subTitle: existingData.subTitle || "",
//       miniSubTitle: existingData.titleDescription || "",
//       content: existingData.postDetails || "",
//       tags: existingData.tags || [],
//       location: existingData.location || "",
//     },
//   });

//   // Initialize images from existing post
//   useEffect(() => {
//     if (existingData.imageUrls) {
//       setImages(
//         existingData.imageUrls.map((url: string) => ({
//           id: ID.unique(),
//           src: url,
//           uploaded: true,
//         }))
//       );
//     }
//   }, [existingData.imageUrls]);

//   const handleImageUploaded = (url: string) => {
//     setImages((prev) => {
//       if (url.startsWith("blob:")) {
//         return [...prev, { id: ID.unique(), src: url, uploaded: false }];
//       }

//       const pendingIndex = prev.findIndex((p) => !p.uploaded);
//       if (pendingIndex !== -1) {
//         const copy = [...prev];
//         copy[pendingIndex] = {
//           ...copy[pendingIndex],
//           src: url,
//           uploaded: true,
//         };
//         return copy;
//       }

//       if (prev.some((p) => p.src === url)) return prev;
//       return [...prev, { id: ID.unique(), src: url, uploaded: true }];
//     });
//   };

//   const handleInputKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     field: { value: string[] }
//   ) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const tagInput = e.currentTarget.value.trim();
//       const iconClass = getTagIcons(tagInput);

//       if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
//         form.setValue("tags", [...field.value, tagInput]);
//         e.currentTarget.value = "";
//         form.clearErrors("tags");
//       } else if (field.value.includes(tagInput)) {
//         form.setError("tags", {
//           type: "manual",
//           message: "Tag already exists",
//         });
//       }
//     }
//   };

//   const handleUpdatePost = async (data: z.infer<typeof CreatePostSchema>) => {
//     if (!post?.id) {
//       alert("Post ID is missing!");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const pending = images.filter((i) => !i.uploaded).length;
//       if (pending > 0) {
//         alert(
//           `Please wait for ${pending} image(s) to finish uploading before updating.`
//         );
//         return;
//       }

//       const payload = {
//         postDetails: data.content,
//         imageUrls: images.map((i) => i.src),
//         tags: data.tags,
//         title: data.title,
//         subTitle: data.subTitle,
//         titleDescription: data.miniSubTitle,
//         location: data.location,
//         createdAt: existingData.createdAt || new Date().toISOString(),
//         updatedAt: new Date().toISOString(), // Add update timestamp
//       };

//       // Make sure we're importing updatePost from the correct location
//       const { updatePost } = await import("~/appwrite/posts");

//       await updatePost(post.id, payload);

//       alert("Post updated successfully!");
//       onSuccess();
//     } catch (error) {
//       console.error("Error updating post:", error);
//       alert("Failed to update post. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleTagRemove = (e: any) => {
//     const deletedTagText = e.data.text;
//     const currentTags = form.getValues("tags");
//     const updatedTags = currentTags.filter(
//       (tag: any) => tag !== deletedTagText
//     );
//     form.setValue("tags", updatedTags, { shouldDirty: true });
//   };

//   const handleRemoveImage = (url: string) => {
//     setImages((prev) => prev.filter((img) => img.src !== url));
//     if (url.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(url);
//       } catch {
//         /* noop */
//       }
//     }
//   };

//   return (
//     <Form {...form}>
//       <form
//         className="flex w-full flex-col gap-10"
//         onSubmit={form.handleSubmit(handleUpdatePost)}
//       >
//         {/* Title */}
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col">
//               <FormLabel className="paragraph-semibold text-dark-100">
//                 <span className="text-dark-100 font-bold">Title</span>{" "}
//                 <span className="text-red-700">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   className="paragraph-regular text-dark-100 no-focus min-h-[56px] rounded-1.5 border font-bold text-3xl"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Sub Title */}
//         <FormField
//           control={form.control}
//           name="subTitle"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col">
//               <FormLabel>
//                 <span className="font-bold">Sub Title</span>{" "}
//                 <span className="text-red-700">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Mini Sub Title */}
//         <FormField
//           control={form.control}
//           name="miniSubTitle"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col">
//               <FormLabel>
//                 <span className="font-semibold text-sm">Title Description</span>{" "}
//                 <span className="text-red-700">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Location */}
//         <FormField
//           control={form.control}
//           name="location"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col">
//               <FormLabel>
//                 <span className="font-bold">Location</span>
//                 <span className="text-red-700">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input {...field} placeholder="Enter location " />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Content Editor */}
//         <FormField
//           control={form.control}
//           name="content"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col">
//               <FormLabel>
//                 <span className="font-semibold text-sm">Content</span>{" "}
//                 <span className="text-red-700">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Editor
//                   editorRef={editorRef}
//                   value={field.value}
//                   fieldChange={field.onChange}
//                   onImageUploaded={handleImageUploaded}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Image Previews */}
//         {images.length > 0 && (
//           <div className="grid grid-cols-3 gap-4">
//             {images.map((img, idx) => (
//               <div key={img.id} className="relative">
//                 <img
//                   src={img.src}
//                   alt={`uploaded-${idx}`}
//                   className="w-full h-32 object-cover rounded-lg border"
//                 />
//                 {!img.uploaded && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs">
//                     Uploading...
//                   </div>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(img.src)}
//                   className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Tags */}
//         <FormField
//           control={form.control}
//           name="tags"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col gap-3">
//               <FormLabel>
//                 <span className="font-bold">Tags</span>{" "}
//                 <span className="text-red-700">*</span>
//               </FormLabel>
//               <FormControl>
//                 <div>
//                   <Input
//                     placeholder="Add Tags..."
//                     onKeyDown={(e) => handleInputKeyDown(e, field)}
//                   />
//                   {field.value.length > 0 && (
//                     <div className="flex-start mt-2.5 flex-wrap gap-2.5">
//                       <ChipListComponent
//                         id="tag-chip"
//                         enableDelete={true}
//                         deleted={handleTagRemove}
//                       >
//                         <ChipsDirective>
//                           {field.value.map(
//                             (tag: string, index: Key | null | undefined) => (
//                               <ChipDirective
//                                 key={index}
//                                 trailingIconCss="e-dlt-btn"
//                                 text={getFirstWord(tag)}
//                                 cssClass={cn(
//                                   "iconClass",
//                                   index === 1
//                                     ? "!bg-pink-50 !text-pink-500 !font-medium"
//                                     : "!bg-success-50 !text-success-700 !font-medium"
//                                 )}
//                               />
//                             )
//                           )}
//                         </ChipsDirective>
//                       </ChipListComponent>
//                     </div>
//                   )}
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Action Buttons */}
//         <div className="mt-16 flex justify-end gap-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onCancel}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="!w-full sm:w-[240px] !h-11 cursor-pointer"
//           >
//             {isSubmitting ? "Updating..." : "Update Post"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default EditPostForm;

// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { CreatePostSchema } from "~/lib/validations";
// // import {
// //   Form,
// //   FormControl,
// //   FormDescription,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "~/components/ui/form";
// // import { Input } from "~/components/ui/input";
// // import { Button } from "~/components/ui/button";
// // import Editor from "./editor";
// // import { useRef, useState, useEffect, type Key } from "react";
// // import type { MDXEditorMethods } from "@mdxeditor/editor";
// // import {
// //   ChipDirective,
// //   ChipListComponent,
// //   ChipsDirective,
// // } from "@syncfusion/ej2-react-buttons";
// // import { cn, getFirstWord, getTagIcons } from "~/lib/utils";
// // import type z from "zod";
// // import { appwriteConfig, tablesDB } from "~/appwrite/client";
// // import { ID } from "appwrite";
// // import { useNavigate } from "react-router";

// // type ImageItem = {
// //   id: string;
// //   src: string;
// //   uploaded: boolean;
// // };

// // interface EditPostFormProps {
// //   post: any;
// //   onCancel: () => void;
// //   onSuccess: () => void;
// // }

// // const EditPostForm = ({ post, onCancel, onSuccess }: EditPostFormProps) => {
// //   const navigate = useNavigate();
// //   const editorRef = useRef<MDXEditorMethods>(null);
// //   const [images, setImages] = useState<ImageItem[]>([]);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Parse the existing post data
// //   const existingData = post ? JSON.parse(post.raw.postDetails) : {};

// //   const form = useForm({
// //     resolver: zodResolver(CreatePostSchema),
// //     defaultValues: {
// //       title: existingData.title || "",
// //       subTitle: existingData.subTitle || "",
// //       miniSubTitle: existingData.titleDescription || "",
// //       content: existingData.postDetails || "",
// //       tags: existingData.tags || [],
// //       location: existingData.location || "",
// //     },
// //   });

// //   // Initialize images from existing post
// //   useEffect(() => {
// //     if (existingData.imageUrls) {
// //       setImages(
// //         existingData.imageUrls.map((url: string) => ({
// //           id: ID.unique(),
// //           src: url,
// //           uploaded: true,
// //         }))
// //       );
// //     }
// //   }, [existingData.imageUrls]);

// //   const handleImageUploaded = (url: string) => {
// //     setImages((prev) => {
// //       if (url.startsWith("blob:")) {
// //         return [...prev, { id: ID.unique(), src: url, uploaded: false }];
// //       }

// //       const pendingIndex = prev.findIndex((p) => !p.uploaded);
// //       if (pendingIndex !== -1) {
// //         const copy = [...prev];
// //         copy[pendingIndex] = {
// //           ...copy[pendingIndex],
// //           src: url,
// //           uploaded: true,
// //         };
// //         return copy;
// //       }

// //       if (prev.some((p) => p.src === url)) return prev;
// //       return [...prev, { id: ID.unique(), src: url, uploaded: true }];
// //     });
// //   };

// //   const handleInputKeyDown = (
// //     e: React.KeyboardEvent<HTMLInputElement>,
// //     field: { value: string[] }
// //   ) => {
// //     if (e.key === "Enter") {
// //       e.preventDefault();
// //       const tagInput = e.currentTarget.value.trim();
// //       const iconClass = getTagIcons(tagInput);

// //       if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
// //         form.setValue("tags", [...field.value, tagInput]);
// //         e.currentTarget.value = "";
// //         form.clearErrors("tags");
// //       } else if (field.value.includes(tagInput)) {
// //         form.setError("tags", {
// //           type: "manual",
// //           message: "Tag already exists",
// //         });
// //       }
// //     }
// //   };

// //   const handleUpdatePost = async (data: z.infer<typeof CreatePostSchema>) => {
// //     try {
// //       setIsSubmitting(true);

// //       const pending = images.filter((i) => !i.uploaded).length;
// //       if (pending > 0) {
// //         alert(
// //           `Please wait for ${pending} image(s) to finish uploading before updating.`
// //         );
// //         return;
// //       }

// //       const payload = {
// //         postDetails: data.content,
// //         imageUrls: images.map((i) => i.src),
// //         tags: data.tags,
// //         title: data.title,
// //         subTitle: data.subTitle,
// //         titleDescription: data.miniSubTitle,
// //         location: data.location,
// //         createdAt: existingData.createdAt, // Keep original creation date
// //         updatedAt: new Date().toISOString(), // Add update timestamp
// //       };

// //       await tablesDB.updateRow({
// //         databaseId: appwriteConfig.databaseId,
// //         tableId: appwriteConfig.tripCollectionId,
// //         rowId: post.id,
// //         data: {
// //           postDetails: JSON.stringify(payload),
// //         },
// //       });

// //       alert("Post updated successfully!");
// //       onSuccess();
// //     } catch (error) {
// //       console.error("Error updating post:", error);
// //       alert("Failed to update post. Please try again.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleTagRemove = (e: any) => {
// //     const deletedTagText = e.data.text;
// //     const currentTags = form.getValues("tags");
// //     const updatedTags = currentTags.filter((tag: any) => tag !== deletedTagText);
// //     form.setValue("tags", updatedTags, { shouldDirty: true });
// //   };

// //   const handleRemoveImage = (url: string) => {
// //     setImages((prev) => prev.filter((img) => img.src !== url));
// //     if (url.startsWith("blob:")) {
// //       try {
// //         URL.revokeObjectURL(url);
// //       } catch {
// //         /* noop */
// //       }
// //     }
// //   };

// //   return (
// //     <Form {...form}>
// //       <form
// //         className="flex w-full flex-col gap-10"
// //         onSubmit={form.handleSubmit(handleUpdatePost)}
// //       >
// //         {/* Title */}
// //         <FormField
// //           control={form.control}
// //           name="title"
// //           render={({ field }) => (
// //             <FormItem className="flex w-full flex-col">
// //               <FormLabel className="paragraph-semibold text-dark-100">
// //                 <span className="text-dark-100 font-bold">Title</span>{" "}
// //                 <span className="text-red-700">*</span>
// //               </FormLabel>
// //               <FormControl>
// //                 <Input
// //                   className="paragraph-regular text-dark-100 no-focus min-h-[56px] rounded-1.5 border font-bold text-3xl"
// //                   {...field}
// //                 />
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         {/* Sub Title */}
// //         <FormField
// //           control={form.control}
// //           name="subTitle"
// //           render={({ field }) => (
// //             <FormItem className="flex w-full flex-col">
// //               <FormLabel>
// //                 <span className="font-bold">Sub Title</span>{" "}
// //                 <span className="text-red-700">*</span>
// //               </FormLabel>
// //               <FormControl>
// //                 <Input {...field} />
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         {/* Mini Sub Title */}
// //         <FormField
// //           control={form.control}
// //           name="miniSubTitle"
// //           render={({ field }) => (
// //             <FormItem className="flex w-full flex-col">
// //               <FormLabel>
// //                 <span className="font-semibold text-sm">Title Description</span>{" "}
// //                 <span className="text-red-700">*</span>
// //               </FormLabel>
// //               <FormControl>
// //                 <Input {...field} />
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         {/* Location */}
// //         <FormField
// //           control={form.control}
// //           name="location"
// //           render={({ field }) => (
// //             <FormItem className="flex w-full flex-col">
// //               <FormLabel>
// //                 <span className="font-bold">Location</span>
// //                 <span className="text-red-700">*</span>
// //               </FormLabel>
// //               <FormControl>
// //                 <Input {...field} placeholder="Enter location " />
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         {/* Content Editor */}
// //         <FormField
// //           control={form.control}
// //           name="content"
// //           render={({ field }) => (
// //             <FormItem className="flex w-full flex-col">
// //               <FormLabel>
// //                 <span className="font-semibold text-sm">Content</span>{" "}
// //                 <span className="text-red-700">*</span>
// //               </FormLabel>
// //               <FormControl>
// //                 <Editor
// //                   editorRef={editorRef}
// //                   value={field.value}
// //                   fieldChange={field.onChange}
// //                   onImageUploaded={handleImageUploaded}
// //                 />
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         {/* Image Previews */}
// //         {images.length > 0 && (
// //           <div className="grid grid-cols-3 gap-4">
// //             {images.map((img, idx) => (
// //               <div key={img.id} className="relative">
// //                 <img
// //                   src={img.src}
// //                   alt={`uploaded-${idx}`}
// //                   className="w-full h-32 object-cover rounded-lg border"
// //                 />
// //                 {!img.uploaded && (
// //                   <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs">
// //                     Uploading...
// //                   </div>
// //                 )}
// //                 <button
// //                   type="button"
// //                   onClick={() => handleRemoveImage(img.src)}
// //                   className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs"
// //                 >
// //                   ✕
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Tags */}
// //         <FormField
// //           control={form.control}
// //           name="tags"
// //           render={({ field }) => (
// //             <FormItem className="flex w-full flex-col gap-3">
// //               <FormLabel>
// //                 <span className="font-bold">Tags</span>{" "}
// //                 <span className="text-red-700">*</span>
// //               </FormLabel>
// //               <FormControl>
// //                 <div>
// //                   <Input
// //                     placeholder="Add Tags..."
// //                     onKeyDown={(e) => handleInputKeyDown(e, field)}
// //                   />
// //                   {field.value.length > 0 && (
// //                     <div className="flex-start mt-2.5 flex-wrap gap-2.5">
// //                       <ChipListComponent
// //                         id="tag-chip"
// //                         enableDelete={true}
// //                         deleted={handleTagRemove}
// //                       >
// //                         <ChipsDirective>
// //                           {field.value.map((tag: string, index: Key | null | undefined) => (
// //                             <ChipDirective
// //                               key={index}
// //                               trailingIconCss="e-dlt-btn"
// //                               text={getFirstWord(tag)}
// //                               cssClass={cn(
// //                                 "iconClass",
// //                                 index === 1
// //                                   ? "!bg-pink-50 !text-pink-500 !font-medium"
// //                                   : "!bg-success-50 !text-success-700 !font-medium"
// //                               )}
// //                             />
// //                           ))}
// //                         </ChipsDirective>
// //                       </ChipListComponent>
// //                     </div>
// //                   )}
// //                 </div>
// //               </FormControl>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />

// //         {/* Action Buttons */}
// //         <div className="mt-16 flex justify-end gap-4">
// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={onCancel}
// //             disabled={isSubmitting}
// //           >
// //             Cancel
// //           </Button>
// //           <Button
// //             type="submit"
// //             disabled={isSubmitting}
// //             className="!w-full sm:w-[240px] !h-11 cursor-pointer"
// //           >
// //             {isSubmitting ? "Updating..." : "Update Post"}
// //           </Button>
// //         </div>
// //       </form>
// //     </Form>
// //   );
// // };

// // export default EditPostForm;

// // // // componentsCreated/EditPostForm.tsx
// // // import { useState } from "react";
// // // import { Button } from "~/components/ui/button";
// // // import { Input } from "~/components/ui/input";
// // // import { updatePost } from "~/appwrite/posts";

// // // interface EditPostFormProps {
// // //   post: any;
// // //   onSave: (updatedPost: any) => void;
// // //   onCancel: () => void;
// // // }

// // // const EditPostForm = ({ post, onSave, onCancel }: EditPostFormProps) => {
// // //   const [formData, setFormData] = useState({
// // //     title: post?.title || "",
// // //     subTitle: post?.subTitle || "",
// // //     titleDescription: post?.titleDescription || "",
// // //     location: post?.location || "",
// // //     tags: post?.tags?.join(", ") || "",
// // //     postDetails: post?.postDetails || "",
// // //   });

// // //   const [isLoading, setIsLoading] = useState(false);

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!post?.id) return;

// // //     setIsLoading(true);
// // //     try {
// // //       const postData = {
// // //         title: formData.title,
// // //         subTitle: formData.subTitle,
// // //         titleDescription: formData.titleDescription,
// // //         location: formData.location,
// // //         tags: formData.tags.split(",").map((tag: string) => tag.trim()),
// // //         postDetails: formData.postDetails,
// // //       };

// // //       await updatePost(post.id, postData);
// // //       onSave({ ...post, ...formData });
// // //     } catch (error) {
// // //       console.error("Error updating post:", error);
// // //       alert("Failed to update post. Please try again.");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const handleChange = (
// // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
// // //   ) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [name]: value,
// // //     }));
// // //   };

// // //   return (
// // //     <form onSubmit={handleSubmit} className="space-y-6">
// // //       <div>
// // //         <label htmlFor="title" className="block text-sm font-medium mb-2">
// // //           Title
// // //         </label>
// // //         <Input
// // //           id="title"
// // //           name="title"
// // //           value={formData.title}
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //       </div>

// // //       <div>
// // //         <label htmlFor="subTitle" className="block text-sm font-medium mb-2">
// // //           Subtitle
// // //         </label>
// // //         <Input
// // //           id="subTitle"
// // //           name="subTitle"
// // //           value={formData.subTitle}
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //       </div>

// // //       <div>
// // //         <label
// // //           htmlFor="titleDescription"
// // //           className="block text-sm font-medium mb-2"
// // //         >
// // //           Title Description
// // //         </label>
// // //         <textarea
// // //           id="titleDescription"
// // //           name="titleDescription"
// // //           value={formData.titleDescription}
// // //           onChange={handleChange}
// // //           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
// // //           rows={3}
// // //           required
// // //         />
// // //       </div>

// // //       <div>
// // //         <label htmlFor="location" className="block text-sm font-medium mb-2">
// // //           Location
// // //         </label>
// // //         <Input
// // //           id="location"
// // //           name="location"
// // //           value={formData.location}
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //       </div>

// // //       <div>
// // //         <label htmlFor="tags" className="block text-sm font-medium mb-2">
// // //           Tags (comma separated)
// // //         </label>
// // //         <Input
// // //           id="tags"
// // //           name="tags"
// // //           value={formData.tags}
// // //           onChange={handleChange}
// // //           placeholder="beach, summer, vacation"
// // //         />
// // //       </div>

// // //       <div>
// // //         <label htmlFor="postDetails" className="block text-sm font-medium mb-2">
// // //           Post Details (Markdown)
// // //         </label>
// // //         <textarea
// // //           id="postDetails"
// // //           name="postDetails"
// // //           value={formData.postDetails}
// // //           onChange={handleChange}
// // //           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
// // //           rows={10}
// // //           required
// // //         />
// // //       </div>

// // //       <div className="flex gap-4 justify-end">
// // //         <Button
// // //           type="button"
// // //           variant="outline"
// // //           onClick={onCancel}
// // //           disabled={isLoading}
// // //         >
// // //           Cancel
// // //         </Button>
// // //         <Button type="submit" disabled={isLoading}>
// // //           {isLoading ? "Saving..." : "Save Changes"}
// // //         </Button>
// // //       </div>
// // //     </form>
// // //   );
// // // };

// // // export default EditPostForm;
