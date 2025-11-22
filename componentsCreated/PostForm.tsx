import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "~/lib/validations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Editor from "./editor";
import { useRef, useState } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord, getTagIcons } from "~/lib/utils";
import type z from "zod";
import { appwriteConfig, tablesDB } from "~/appwrite/client";
import { ID } from "appwrite";
import { useNavigate } from "react-router";

type ImageItem = {
  id: string;
  src: string;
  uploaded: boolean;
};

const PostForm = () => {
  const navigate = useNavigate();
  const editorRef = useRef<MDXEditorMethods>(null);

  // 🔥 Store uploaded images as objects so we can track preview vs final
  const [images, setImages] = useState<ImageItem[]>([]);

  const form = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      miniSubTitle: "",
      content: "",
      tags: [],
      location: "", // ✅ Added location default
    },
  });

  // ✅ Callback from Editor: handles both blob previews and final URLs
  const handleImageUploaded = (url: string) => {
    setImages((prev) => {
      // PREVIEW (blob) -> append a pending image
      if (url.startsWith("blob:")) {
        return [...prev, { id: ID.unique(), src: url, uploaded: false }];
      }

      // FINAL URL -> try to replace the first pending (uploaded: false)
      const pendingIndex = prev.findIndex((p) => !p.uploaded);
      if (pendingIndex !== -1) {
        const copy = [...prev];
        copy[pendingIndex] = {
          ...copy[pendingIndex],
          src: url,
          uploaded: true,
        };
        return copy;
      }

      // No pending found: append final URL (avoid duplicates)
      if (prev.some((p) => p.src === url)) return prev;
      return [...prev, { id: ID.unique(), src: url, uploaded: true }];
    });
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();
      const iconClass = getTagIcons(tagInput);

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

  const handleCreatePost = async (data: z.infer<typeof CreatePostSchema>) => {
    try {
      // If some uploads are still pending, block submit and notify
      const pending = images.filter((i) => !i.uploaded).length;
      if (pending > 0) {
        alert(
          `Please wait for ${pending} image(s) to finish uploading before posting.`
        );
        return;
      }

      const payload = {
        postDetails: data.content,
        imageUrls: images.map((i) => i.src), // only final URLs are here (we prevented submit when pending > 0)
        tags: data.tags,
        title: data.title,
        subTitle: data.subTitle,
        titleDescription: data.miniSubTitle,
        location: data.location, // ✅ Added location to payload
        createdAt: new Date().toISOString(),
      };

      // Store payload in Appwrite
      const response = await tablesDB.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tripCollectionId,
        rowId: ID.unique(),
        data: {
          postDetails: JSON.stringify(payload),
        },
      });

      console.log("Post created successfully:", response);
      form.reset();
      setImages([]); // clear images after submit
      alert("Post created successfully!");
      navigate(`/posts/${response.$id}`); // optional redirect
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleTagRemove = (e: any) => {
    const deletedTagText = e.data.text;
    const currentTags = form.getValues("tags");
    const updatedTags = currentTags.filter((tag) => tag !== deletedTagText);
    form.setValue("tags", updatedTags, { shouldDirty: true });
  };

  // remove image manually (revoke blob URL if needed)
  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img.src !== url));
    if (url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* noop */
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreatePost)}
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
              <FormDescription className="text-gray-100 mt-2.5">
                Write the main title for your post.
              </FormDescription>
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
              <FormDescription className="text-sm text-gray-100 mt-2.5">
                Write Sub Title for your post.
              </FormDescription>
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
              <FormDescription className="text-sm text-gray-100 mt-2.5">
                Short description for your post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Location (Added) */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>
                <span className="font-bold">Location</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter location (optional)" />
              </FormControl>
              <FormDescription className="text-sm text-gray-100 mt-2.5">
                Where was this post created? Example: Addis Ababa, Ethiopia.
              </FormDescription>
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
                  onImageUploaded={handleImageUploaded} // ✅ pass callback
                />
              </FormControl>
              <FormDescription className="text-sm text-gray-100 mt-2.5">
                Write detailed content of your post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative">
                <img
                  src={img.src}
                  alt={`uploaded-${idx}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                {!img.uploaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs">
                    Uploading...
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.src)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
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
                          {field.value.map((tag: string, index) => (
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
              <FormDescription className="text-sm text-gray-100 mt-2.5">
                You can add up to 4 tags. Press Enter to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="!w-full sm:w-[240px] !h-11 cursor-pointer"
          >
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;

//original code

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
// import { useRef, useState } from "react";
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

// const PostForm = () => {
//   const navigate = useNavigate();
//   const editorRef = useRef<MDXEditorMethods>(null);

//   // 🔥 Store uploaded images as objects so we can track preview vs final
//   const [images, setImages] = useState<ImageItem[]>([]);

//   const form = useForm({
//     resolver: zodResolver(CreatePostSchema),
//     defaultValues: {
//       title: "",
//       subTitle: "",
//       miniSubTitle: "",
//       content: "",
//       tags: [],
//     },
//   });

//   // ✅ Callback from Editor: handles both blob previews and final URLs
//   const handleImageUploaded = (url: string) => {
//     setImages((prev) => {
//       // PREVIEW (blob) -> append a pending image
//       if (url.startsWith("blob:")) {
//         return [...prev, { id: ID.unique(), src: url, uploaded: false }];
//       }

//       // FINAL URL -> try to replace the first pending (uploaded: false)
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

//       // No pending found: append final URL (avoid duplicates)
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

//   const handleCreatePost = async (data: z.infer<typeof CreatePostSchema>) => {
//     try {
//       // If some uploads are still pending, block submit and notify
//       const pending = images.filter((i) => !i.uploaded).length;
//       if (pending > 0) {
//         alert(
//           `Please wait for ${pending} image(s) to finish uploading before posting.`
//         );
//         return;
//       }

//       const payload = {
//         postDetails: data.content,
//         imageUrls: images.map((i) => i.src), // only final URLs are here (we prevented submit when pending > 0)
//         tags: data.tags,
//         title: data.title,
//         subTitle: data.subTitle,
//         titleDescription: data.miniSubTitle,
//         createdAt: new Date().toISOString(),
//       };

//       // Store payload in Appwrite
//       const response = await tablesDB.createRow({
//         databaseId: appwriteConfig.databaseId,
//         tableId: appwriteConfig.tripCollectionId,
//         rowId: ID.unique(),
//         data: {
//           postDetails: JSON.stringify(payload),
//         },
//       });

//       console.log("Post created successfully:", response);
//       form.reset();
//       setImages([]); // clear images after submit
//       alert("Post created successfully!");
//       navigate(`/posts/${response.$id}`); // optional redirect
//     } catch (error) {
//       console.error("Error creating post:", error);
//       alert("Failed to create post. Please try again.");
//     }
//   };

//   const handleTagRemove = (e: any) => {
//     const deletedTagText = e.data.text;
//     const currentTags = form.getValues("tags");
//     const updatedTags = currentTags.filter((tag) => tag !== deletedTagText);
//     form.setValue("tags", updatedTags, { shouldDirty: true });
//   };

//   // remove image manually (revoke blob URL if needed)
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
//         onSubmit={form.handleSubmit(handleCreatePost)}
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
//               <FormDescription className="text-gray-100 mt-2.5">
//                 Write the main title for your post.
//               </FormDescription>
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
//               <FormDescription className="text-sm text-gray-100 mt-2.5">
//                 Write Sub Title for your post.
//               </FormDescription>
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
//               <FormDescription className="text-sm text-gray-100 mt-2.5">
//                 Short description for your post.
//               </FormDescription>
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
//                   onImageUploaded={handleImageUploaded} // ✅ pass callback
//                 />
//               </FormControl>
//               <FormDescription className="text-sm text-gray-100 mt-2.5">
//                 Write detailed content of your post.
//               </FormDescription>
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
//                           {field.value.map((tag: string, index) => (
//                             <ChipDirective
//                               key={index}
//                               trailingIconCss="e-dlt-btn"
//                               text={getFirstWord(tag)}
//                               cssClass={cn(
//                                 "iconClass",
//                                 index === 1
//                                   ? "!bg-pink-50 !text-pink-500 !font-medium"
//                                   : "!bg-success-50 !text-success-700 !font-medium"
//                               )}
//                             />
//                           ))}
//                         </ChipsDirective>
//                       </ChipListComponent>
//                     </div>
//                   )}
//                 </div>
//               </FormControl>
//               <FormDescription className="text-sm text-gray-100 mt-2.5">
//                 Add up to 4 tags. Press Enter to add.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Submit */}
//         <div className="mt-16 flex justify-end">
//           <Button
//             type="submit"
//             className="!w-full sm:w-[240px] !h-11 cursor-pointer"
//           >
//             Post
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default PostForm;
