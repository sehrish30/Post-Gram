import { useQuery } from "@apollo/client";

import { ALL_USERS } from "../components/graphql/queries";

const Users = () => {
  // Return all posts query
  const { data, loading, error } = useQuery(ALL_USERS);

  // HANDLE LOADING STATE
  if (loading) return <p className="p-5">Loading...</p>;

  // HANDLE ERROR
  if (error) return <p className="p-5">Something is wrong...</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {data?.allUsers.map((u) => (
          <div className="col-md-4" key={u._id}>
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h4>{u.username}</h4>
                </div>
                <p className="card-text">{u.about}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
