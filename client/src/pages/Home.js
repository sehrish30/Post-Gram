import { useQuery, useLazyQuery } from "@apollo/client";
import { useContext, useState } from "react";

// Context
import { AuthContext } from "../context/auth";
import { GET_ALL_POSTS, TOTAL_POSTS } from "../components/graphql/queries";
import PostCard from "../components/PostCard";

import "../css/Home.scss";
import PostPagination from "../components/PostPagination";

const Home = () => {
  const [page, setPage] = useState(1);
  // Return all posts query
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });

  // access Context from value in AuthContext.provider
  const { state } = useContext(AuthContext);
  console.log(state.user?.token);

  // To avoid naming conflicts change variables name using :
  const [
    fetchPosts,
    { data: posts, loading: loadingData, error: loadingError },
  ] = useLazyQuery(GET_ALL_POSTS);

  // Get total posts based on which we will figure out
  // how many paginations links we will generate
  const { data: postCount } = useQuery(TOTAL_POSTS);

  // HANDLE LOADING STATE
  if (loading) return <p className="p-5">Loading...</p>;

  // HANDLE ERROR
  if (error) return <p className="p-5">Something is wrong...</p>;

  return (
    <div className="container main-bg m-0 p-0">
      <div className="row p-5">
        {data?.allPosts.map((p) => (
          <div className="col-md-3 py-2">
            <PostCard post={p} />
          </div>
        ))}
      </div>

      <hr />
      {JSON.stringify(posts)}
      <strong>{JSON.stringify(state.user)}</strong>
      <PostPagination page={page} setPage={setPage} postCount={postCount} />
    </div>
  );
};

export default Home;
