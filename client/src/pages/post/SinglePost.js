import { useState, useMemo, useEffect } from "react";

import { useParams } from "react-router-dom";

// GRAPHQL
import { useLazyQuery } from "@apollo/client";
import { SINGLE_POST } from "../../components/graphql/queries";

// Components
import PostCard from "../../components/PostCard";

const SinglePost = () => {
  const { postId } = useParams();
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
    postedBy: {},
  });
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);

  useMemo(() => {
    if (singlePost) {
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: singlePost.singlePost.image,
        postedBy: singlePost.singlePost.postedBy,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singlePost]);

  // As soon as component mounts we get single Post
  // If params has params.postid so it will be
  // variables: {postId: postid}
  useEffect(() => {
    getSinglePost({ variables: { postId } });
  }, [postId, getSinglePost]);

  return (
    <div className="container py-2 pe-0 main-bg ">
      <div className="row">
        <div className="col-md-10 mx-auto text-center singlePost">
          <PostCard post={values} />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
