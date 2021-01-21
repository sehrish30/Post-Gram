import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useParams, useHistory } from "react-router-dom";

// GRAPHQL
import { useLazyQuery, useMutation } from "@apollo/client";
import { SINGLE_POST } from "../../components/graphql/queries";
import { POST_UPDATE } from "../../components/graphql/mutations";

// Components
import Toast from "../../components/Toast";
import FileUpload from "../../components/FileUpload";

const PostUpdate = () => {
  const history = useHistory();
  const { postId } = useParams();
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
  });
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [postUpdate] = useMutation(POST_UPDATE);

  const [loading, setLoading] = useState(false);
  const { content, image } = values;

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
    window.scrollTo(0, 0);
    getSinglePost({ variables: { postId } });
  }, [postId, getSinglePost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    postUpdate({ variables: { input: values } });
    setLoading(false);
    toast(`Post updated`, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      draggablePercent: 60,
    });
    history.push("/post/create");
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const updateForm = () => (
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
            Update
          </button>
        </div>
      )}
    </form>
  );

  return (
    <div>
      {loading ? <Loader /> : <h4 className="createpost-heading">Update</h4>}
      <FileUpload
        setLoading={setLoading}
        values={values}
        setValues={setValues}
        singleUpload={true}
      />
      {updateForm()}
    </div>
  );
};

export default PostUpdate;
