import { useQuery } from "@apollo/client";

import { ALL_USERS } from "../components/graphql/queries";
import UserCard from "../components/UserCard";
import "../css/UserCard.scss";
const Users = () => {
  // Return all posts query
  const { data, loading, error } = useQuery(ALL_USERS);

  // HANDLE LOADING STATE
  if (loading) return <p className="p-5">Loading...</p>;

  // HANDLE ERROR
  if (error) return <p className="p-5">Something is wrong...</p>;

  return (
    <div className="container main-card">
      <div className="row p-5">
        {data?.allUsers.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;
