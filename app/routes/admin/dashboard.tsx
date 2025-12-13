// dashboard.tsx - Updated with original styling and pagination
import { Header, PostCard, StatsCard } from "componentsCreated";
import { getAllUsers, getUser } from "~/appwrite/auth";
import type { Route } from "./+types/dashboard";
import type { LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  getUserGrowthPerDay,
  getUsersAndPostStats,
} from "~/appwrite/dashboard";
import { getAllPosts } from "~/appwrite/posts";
import { getMessages } from "~/appwrite/messages";
import MessageSection from "./MessageSection";
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import {
  allTrips,
  tripXAxis,
  tripyAxis,
  userXAxis,
  useryAxis,
} from "~/constants";

interface UsersItineraryCount {
  id: string;
  name: string;
  count: number;
  imageUrl: string;
}

export const clientLoader = async ({ request }: LoaderFunctionArgs) => {
  // Get page from URL for messages
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 5;
  const offset = (page - 1) * limit;

  const [user, dashboardStats, posts, userGrowth, allUsers, messages] =
    await Promise.all([
      getUser(),
      getUsersAndPostStats(),
      getAllPosts(4, 0),
      getUserGrowthPerDay(),
      getAllUsers(4, 0),
      getMessages(limit, offset),
    ]);

  // Get total messages for pagination
  const allMessages = await getMessages(1000, 0);
  const totalMessages = allMessages.length;

  const allPosts = posts.allPosts.map(
    ({ $id, postDetails, title, tags, imageUrls }) => {
      let details = {};

      try {
        details =
          typeof postDetails === "string"
            ? JSON.parse(postDetails)
            : postDetails;
      } catch (e) {
        console.error("Invalid JSON in postDetails", postDetails);
      }

      return {
        id: $id,
        ...details,
      };
    }
  ) as any[];

  const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    id: user.$id,
    name: user.name,
    count: user.itineraryCount || 0,
    imageUrl: user.imageUrl || "/assets/images/avatar-placeholder.png",
  }));

  return {
    user,
    dashboardStats,
    allPosts,
    userGrowth,
    allUsers: mappedUsers,
    messages: messages || [],
    totalMessages,
    page,
  };
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as any;
  const {
    dashboardStats,
    allPosts,
    userGrowth,
    allUsers,
    messages,
    totalMessages,
    page,
  } = loaderData;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Use React Router navigation instead of window.location
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <main className="dashboard wrapper p-0 m-0">
      {/* Fixed Header - Remove duplicate user name */}
      <Header
        title="Welcome Back 👋"
        description="Track and Manage created posts in real time."
      />

      <section className="flex flex-col gap-6 container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Posts"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100 ">Created Posts</h1>
        <div className="trip-grid">
          {allPosts
            .slice(0, 4)
            .map(({ id, title, tags, imageUrls, location }) => (
              <PostCard
                key={id}
                id={id.toString()}
                imageUrl={imageUrls?.[0]}
                location={location || "No location"}
                tags={tags}
                name={title}
                price={tags?.[0]}
              />
            ))}
        </div>
      </section>

      <section className="container grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-lg shadow">
          <ChartComponent
            id="chart-1"
            primaryXAxis={userXAxis}
            primaryYAxis={useryAxis}
            title="User Growth"
            tooltip={{ enable: true }}
          >
            <Inject
              services={[
                ColumnSeries,
                SplineAreaSeries,
                Category,
                DataLabel,
                Tooltip,
              ]}
            />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={userGrowth}
                xName="day"
                yName="count"
                type="Column"
                name="Column"
                columnWidth={0.3}
                cornerRadius={{ topLeft: 10, topRight: 10 }}
              />
              <SeriesDirective
                dataSource={userGrowth}
                xName="day"
                yName="count"
                type="SplineArea"
                name="Wave"
                fill="rgba(71,132,238,0.3)"
                border={{ width: 2, color: "#4784EE" }}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>

        {/* You can add another chart or component in the second column here */}
      </section>

      {/* Messages Section - This will NOT overlap with navbar */}
      <MessageSection
        messages={messages}
        totalMessages={totalMessages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <section className="user-trip wrapper "></section>
    </main>
  );
};

export default Dashboard;
