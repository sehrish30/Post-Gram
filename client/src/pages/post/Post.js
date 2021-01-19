import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/auth";

import { useQuery, useMutation } from "@apollo/client";
import { POST_CREATE } from "../../components/graphql/mutations";
import { POSTS_BY_USER } from "../../components/graphql/queries";

// css
import "../../css/register.scss";
import "../../css/PostCard.scss";
import Loader from "../../components/Loader";
import FileUpload from "../../components/FileUpload";
import Toast from "../../components/Toast";
import PostCard from "../../components/PostCard";

const INITIAL_STATE = {
  content: "",
  image: {
    url: "https://via.placeholder.com/200x200.png?text=Post",
    public_id: "123",
  },
};

const Post = () => {
  const [values, setValues] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  // destructure
  const { content } = values;

  // Query
  const { data: posts } = useQuery(POSTS_BY_USER);

  // Mutation
  const [postCreate] = useMutation(POST_CREATE, {
    // **update cache
    update: (data) => console.log(data),
    onError: (err) => console.log(err),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // in input send what you want to store
    postCreate({ variables: { input: values } });

    // Now reset the state one post is created
    setValues(INITIAL_STATE);
    setLoading(false);
    toast(`Post successfully created`, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      draggablePercent: 60,
    });
  };

  const handleChange = (event) => {
    event.preventDefault();
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const createForm = () => (
    <form onSubmit={handleSubmit}>
      <Toast />
      <div className="form-group px-4">
        <textarea
          rows="10"
          placeholder="Type..."
          maxLength="150"
          disabled={loading}
          className="md-textarea form-control"
          value={content}
          onChange={handleChange}
          name="content"
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="container text-center ">
          <button
            type="submit"
            className="mt-4 mb-4 box text-center"
            disabled={loading || !content}
          >
            Post
          </button>
        </div>
      )}
    </form>
  );

  return (
    <div className="container px-2">
      {loading ? (
        <Loader />
      ) : (
        <h4 className="createpost-heading">Create Post</h4>
      )}

      <FileUpload
        setLoading={setLoading}
        values={values}
        setValues={setValues}
        singleUpload={true}
      />

      {createForm()}
      <div className="px-5 text-center row row-cols-1 row-cols-md-2 g-4">
        {posts?.postsByUser.map((p) => (
          <div className="col-md-4 col-sm-6">
            <PostCard post={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
