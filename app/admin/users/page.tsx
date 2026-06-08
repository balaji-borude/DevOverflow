import React from "react";
import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { EMPTY_USERS } from "@/constants/states";
import { getAdminUsers } from "@/lib/actions/admin.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const AdminUsersPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query } = await searchParams;

  const { success, data } = await getAdminUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
  });

  const { users = [] } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Manage Users</h1>
      <div className="mt-10 flex flex-col gap-6">
        <p className="paragraph-regular text-dark400_light700">
          List of all users will appear here. You can manage their accounts, roles, and status.
        </p>

        <LocalSearch
          route="/admin/users"
          iconPostion="Left"
          imgSrc="/icons/search.svg"
          placeholder="Search for users"
          otherClasses="flex-1"
        />

        <DataRenderer
          empty={EMPTY_USERS}
          data={users}
          success={success}
          render={(users) => (
            <div className="mt-8 flex flex-wrap gap-5">
              {users.map((user) => (
                <UserCard key={user._id} {...user} isAdmin={true} />
              ))}
            </div>
          )}
        />
      </div>
    </>
  );
};

export default AdminUsersPage;
