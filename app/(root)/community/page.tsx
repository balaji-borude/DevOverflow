import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/route";
import { EMPTY_USERS } from "@/constants/states";
import { getUser } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/action"
import { User } from "@/types/global";

const Community = async({searchParams}:RouteParams) => {
  // searchparams madhun query ghene ani

  const{page,pageSize,query,filter} = await searchParams;

  const {success,data,error} = await getUser({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "newest",
  });

  const {users} = data || {};

  console.log("Printing the users Data -->", data);

  return (
    <div>
      {/* <h1 className="text-xl text-white">
        page: {page}
      </h1>
      <h1>
       pagesize  {pageSize}
      </h1> */}

      <h1 className="h1-bold text-dark100_light900">
        ALl Users
      </h1>

      <div className="mt-11">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPostion="Left"
          imgSrc="/icons/search.svg"
          placeholder="Search for users"
          otherClasses="flex-1"
        />

        <DataRenderer
         empty={EMPTY_USERS} 
         data={users}
         success={success}
         error={error}
          render={(users)=>(
            <div className="mt-12 flex flex-wrap gap-5 ">
              {
                users.map((user)=>(
                 <UserCard key={user._id}  {...user}/>
                ))
              }
            </div>
          )}
        />

      </div>
    </div>
  )
}

export default Community
