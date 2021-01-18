import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

// Context
import { AuthContext } from "../context/auth";
import { GET_ALL_POSTS } from "../components/graphql/queries";

const Home = () => {
  const history = useHistory();
  // Return all posts query
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  // access Context from value in AuthContext.provider
  const { state } = useContext(AuthContext);

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
    <div className="container">
      <div className="row p-5">
        {data?.allPosts.map((p) => (
          <div className="col-md-4" key={p.id}>
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h4>{p.title}</h4>
                </div>
                <p className="card-text">{p.description}</p>
              </div>
            </div>
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
