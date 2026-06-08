import React from "react";
import { getAdminStats } from "@/lib/actions/admin.action";
import Link from "next/link";
import ROUTES from "@/constants/route";

const AdminDashboard = async () => {
  const { data, success } = await getAdminStats();
  
  const totalUsers = success && data ? data.totalUsers : 0;
  const totalQuestions = success && data ? data.totalQuestions : 0;
  const totalTags = success && data ? data.totalTags : 0;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Admin Dashboard</h1>
      <div className="mt-10 flex flex-col gap-6">
        <p className="paragraph-regular text-dark400_light700">
          Welcome to the DevOverflow Admin Panel.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users" className="card-wrapper rounded-[10px] p-6 flex flex-col items-center justify-center border-none shadow-none hover:opacity-80 transition-opacity">
            <h3 className="h3-bold text-dark200_light900">Users</h3>
            <p className="text-5xl font-bold text-primary-500 mt-4">{totalUsers}</p>
            <p className="base-medium text-dark400_light700 mt-2">Manage all registered users</p>
          </Link>
          <Link href="/admin/questions" className="card-wrapper rounded-[10px] p-6 flex flex-col items-center justify-center border-none shadow-none hover:opacity-80 transition-opacity">
            <h3 className="h3-bold text-dark200_light900">Questions</h3>
            <p className="text-5xl font-bold text-primary-500 mt-4">{totalQuestions}</p>
            <p className="base-medium text-dark400_light700 mt-2">Moderate platform questions</p>
          </Link>
          <Link href="/admin/tags" className="card-wrapper rounded-[10px] p-6 flex flex-col items-center justify-center border-none shadow-none hover:opacity-80 transition-opacity">
            <h3 className="h3-bold text-dark200_light900">Tags</h3>
            <p className="text-5xl font-bold text-primary-500 mt-4">{totalTags}</p>
            <p className="base-medium text-dark400_light700 mt-2">Oversee tag usage</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
