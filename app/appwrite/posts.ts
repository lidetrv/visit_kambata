

export const getAllPosts = async (limit: number, offset: number) => {
    const allPosts = await tablesDB.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tripCollectionId,
        queries: [
            Query.limit(limit),Query.offset(offset), Query.orderDesc('$createdAt')
        ]
    })

    if(allPosts.total === 0){
        console.log('no posts found!')
        return { allPosts: [], total: 0}
    }

    return {
        allPosts: allPosts.rows,
        total: allPosts.total
    }

}

export const getPostById = async (postId: string) => {
    const post = await tablesDB.getRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tripCollectionId,
        rowId: postId
    });
    if(!post.$id){
        console.log('Trip not found!')
        return null
    }

    return post;
}

//Add this function to your appwrite/posts.ts
export const updatePost = async (postId: string, data: any) => {
  try {
    const response = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tripCollectionId,
      rowId: postId,
      data: {
        postDetails: JSON.stringify(data),
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// appwrite/posts.ts
import { Query } from "appwrite"
import { tablesDB, appwriteConfig } from "./client"

// export const fetchPosts = async (limit = 8, offset = 0) => {
//   try {
//     const response = await tablesDB.listRows({
//       databaseId: appwriteConfig.databaseId,
//       tableId: appwriteConfig.tripCollectionId,
//       queries: [
//         Query.limit(limit),
//         Query.offset(offset),
//         Query.orderDesc("$createdAt"), // ✅ sort by system field
//       ],
//     });

//     if (response.total === 0) {
//       return { posts: [], total: 0 };
//     }

//     // Normalize posts
//     const posts = response.rows.map((row: any) => ({
//       id: row.$id,
//       createdAt: row.$createdAt, // ✅ use system timestamp
//       updatedAt: row.$updatedAt,
//       ...row, // include everything else in case you need tags, title, etc.
//     }));

//     return { posts, total: response.total };
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     throw error;
//   }
// };
export const deletePost = async (postId: string ) =>  {
  return await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tripCollectionId,
    rowId: postId,
  });
};
export const fetchPosts = async (limit = 8, offset = 0) => {
  try {
    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tripCollectionId,
      queries: [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"),
      ],
    });

    if (response.total === 0) {
      return { posts: [], total: 0 };
    }

    const posts = response.rows.map((row: any) => {
      let details: any = {};
      try {
        details = row.postDetails ? JSON.parse(row.postDetails) : {};
      } catch (err) {
        console.warn("Invalid JSON in postDetails", row.postDetails);
      }

      return {
        id: row.$id,
        createdAt: row.$createdAt,
        updatedAt: row.$updatedAt,
        ...details,   // spread parsed details like title, subTitle, tags
        raw: row,     // keep original row in case you need it
      };
    });

    return { posts, total: response.total };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
