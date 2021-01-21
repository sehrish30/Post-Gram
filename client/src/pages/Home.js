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
import {
  POST_ADDED,
  POST_UPDATED,
  POST_DELETED,
} from "../components/graphql/subscriptions";

const Home = () => {
  const [page, setPage] = useState(1);
  // Return all posts query
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });

  /*-------------------------------
     POST ADDED SUBS
  --------------------------------- */
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

  /*-------------------------------
         POST UPDATED SUBS
  --------------------------------- */

  // automatically updated
  // Acc to docs if id is returned and if id matches with id in the cache
  // then update particular info about that post
  const { data: updatedPost } = useSubscription(POST_UPDATED, {
    onSubscriptionData: () => {
      // show toast notifications
      toast(`Post Updated`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        draggablePercent: 60,
      });
    },
  });

  // no read or write to cache because alreasy in cache

  /*-------------------------------
         POST DELETED SUBS
  --------------------------------- */

  const { data: deletedPost } = useSubscription(POST_DELETED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // readQuery from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      // filter out the post deleted
      // data has the post deleted based on our resolver
      // we get post back
      let filteredPosts = allPosts.filter(
        (p) => p._id !== data.postDeleted._id
      );

      // Take all cached posts and newly created post that we got
      // from subscription
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPosts,
        },
      });

      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });

      // show toast notifications
      toast.error(`Post Deleted`, {
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
      <div className="row p-5">
        <Toast />
        {data?.allPosts.map((p) => (
          <div className="col-md-3 py-2">
            <PostCard post={p} />
          </div>
        ))}
      </div>

      <PostPagination page={page} setPage={setPage} postCount={postCount} />
    </div>
  );
};

export default Home;
