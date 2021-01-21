import { useQuery, useLazyQuery, useSubscription, gql } from "@apollo/client";
import { useContext, useState } from "react";

// Context
import { AuthContext } from "../context/auth";
import { GET_ALL_POSTS, TOTAL_POSTS } from "../components/graphql/queries";
import PostCard from "../components/PostCard";

import "../css/Home.scss";
import PostPagination from "../components/PostPagination";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Toast from "../components/Toast";

const POST_ADDED = gql`
  subscription {
    postAdded {
      _id
      content
      image {
        url
      }
      postedBy {
        username
      }
    }
  }
`;

const Home = () => {
  const [page, setPage] = useState(1);
  // Return all posts query
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });

  // subscription
  // In this func we will access to local cache and subs data
  const { data: newPost } = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // readQuery from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      // Take all cached posts and newly created post that we got
      // from subscription
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: [data.postAdded, ...allPosts],
        },
      });

      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });

      // show toast notifications
      toast(`New post`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        draggablePercent: 60,
      });
    },
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
  if (loading)
    return (
      <div className="container text-center p-5">
        <Loader />
      </div>
    );

  // HANDLE ERROR
  if (error) return <p className="p-5">Something is wrong...</p>;
  console.log(newPost);

  return (
    <div className="container main-bg m-0 p-0">
      <Toast />
      <div className="row p-5">
        {data?.allPosts.map((p) => (
          <div className="col-md-3 py-2">
            <PostCard post={p} />
          </div>
        ))}
      </div>

      <hr />
      {/* {JSON.stringify(posts)} */}
      {JSON.stringify(newPost)}
      {/* <strong>{JSON.stringify(state.user)}</strong> */}
      <PostPagination page={page} setPage={setPage} postCount={postCount} />
    </div>
  );
};

export default Home;
