// dashboard.tsx - Updated with original styling
import { Header, PostCard, StatsCard } from "componentsCreated";
import { getAllUsers, getUser } from "~/appwrite/auth";
import type { Route } from "./+types/dashboard";
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

export const clientLoader = async () => {
  const [user, dashboardStats, posts, userGrowth, allUsers, messages] =
    await Promise.all([
      getUser(),
      getUsersAndPostStats(),
      getAllPosts(4, 0),
      getUserGrowthPerDay(),
      getAllUsers(4, 0),
      getMessages(5, 0),
    ]);

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
  };
};

const dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const { dashboardStats, allPosts, userGrowth, allUsers, messages } =
    loaderData;

  return (
    <main className="dashboard wrapper p-0 m-0">
      <Header
        title={`Welcome ${user?.name ?? "Guest"} 👋`}
        description="Track and Manage created posts in real time."
      />

      <section className="flex flex-col gap-6">
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-dark-100 mb-4">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Active Users</p>
              <p className="text-2xl font-bold text-blue-700">
                {allUsers.length}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-green-700">
                {allPosts.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Messages Section - This will NOT overlap with navbar */}
      <MessageSection messages={messages} />

      <section className="user-trip wrapper "></section>
    </main>
  );
};

export default dashboard;
