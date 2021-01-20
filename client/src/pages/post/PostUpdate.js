import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";
import { SINGLE_POST } from "../../components/graphql/queries";

const PostUpdate = () => {
  const { postId } = useParams();
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
  });
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    if (singlePost) {
      // Remove __typename property from image property
      const newValue = Object.keys(singlePost.singlePost.image).reduce(
        (object, key) => {
          if (key !== "__typename") {
            object[key] = singlePost.singlePost.image[key];
          }
          return object;
        },
        {}
      );

      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: newValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singlePost]);

  // As soon as component mounts we get single Post
  // If params has params.postid so it will be
  // variables: {postId: postid}
  useEffect(() => {
    getSinglePost({ variables: { postId } });
  }, [postId]);

  return (
    <div>
      {loading ? <Loader /> : <h4 className="createpost-heading">Update</h4>}
      {JSON.stringify(values)};
    </div>
  );
};

export default PostUpdate;
