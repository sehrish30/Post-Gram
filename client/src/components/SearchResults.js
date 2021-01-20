import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SEARCH } from "./graphql/queries";
import Loader from "./Loader";
import PostCard from "./PostCard";

const SearchResults = () => {
  // route query
  const { query } = useParams();

  // gql query
  const { data, loading } = useQuery(SEARCH, {
    variables: { query },
  });

  if (loading)
    return (
      <div className="container search-bg text-center p-5 main-bg">
        <Loader />
      </div>
    );

  if (!data.search.length) {
    return (
      <div className="container search-bg text-center main-bg">
        <p className="text danger p-5">No results found...</p>
      </div>
    );
  }
  return (
    <div className="container search-bg main-bg">
      <div className="row pb-5">
        {data.search.map((post) => (
          <div className="col-md-4 p-5" key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
