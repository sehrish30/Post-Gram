import { useQuery, useLazyQuery } from "@apollo/client";
import { useContext } from "react";

// Context
import { AuthContext } from "../context/auth";
import { GET_ALL_POSTS } from "../components/graphql/queries";
import PostCard from "../components/PostCard";

import "../css/Home.scss";

const Home = () => {
  // Return all posts query
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  // access Context from value in AuthContext.provider
  const { state } = useContext(AuthContext);
  console.log(state.user?.token);

  // To avoid naming conflicts change variables name using :
  const [
    fetchPosts,
    { data: posts, loading: loadingData, error: loadingError },
  ] = useLazyQuery(GET_ALL_POSTS);

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
      <div className="row p-5">
        <button
          onClick={() => fetchPosts()}
          className="btn-btn-raised btn-primary"
        >
          Fetch posts
        </button>
      </div>
      <hr />
      {JSON.stringify(posts)}
      <strong>{JSON.stringify(state.user)}</strong>
    </div>
  );
};

export default Home;
