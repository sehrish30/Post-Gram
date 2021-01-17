import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, gql } from "@apollo/client";
import Toast from "../components/Toast";

import "../css/register.scss";
import { PROFILE } from "../components/graphql/queries";
import { USER_UPDATE } from "../components/graphql/mutations";

const Profile = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    name: "",
    about: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  // Query backend and get user profile
  const { data } = useQuery(PROFILE);

  // push data to state to populate UI
  // GraphQL allows you to request __typename ,
  //a meta field, at any point in a query to get the name of the object type
  // at that point.
  useMemo(() => {
    if (data) {
      let { username, email, name, about, images } = data.profile;

      images.map((image) => {
        // Remove __typename property
        const newImages = Object.keys(image).reduce((object, key) => {
          if (key !== "__typename") {
            object[key] = image[key];
          }
          return object;
        }, {});
        images = newImages;
      });
      setValues({
        ...values,
        username,
        email,
        name,
        about,
        images,
      });
    }
  }, [data]);

  // mutation
  const [userUpdate] = useMutation(USER_UPDATE, {
    // data all the values returned
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast(`Profile updated`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        draggablePercent: 60,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // execute mutation
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Resize the image and get the binary data of that image
  // send it back to our server
  // in the server we have upload images end point that will
  // upload to cloudinary and as a response get url that url
  // we send to client as well
  const fileResizeAndUpload = () => {};

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit} className="row g-3 mt-4">
      <Toast />
      <div className="form-group">
        <label htmlFor="username" className="col-sm-2 mt-0 col-form-label">
          Username
        </label>
        <div className="col-sm-10 ">
          <input
            type="text"
            name="username"
            className="form-control"
            value={values.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="name" className="col-sm-2 mt-0 col-form-label">
          Name
        </label>
        <div className="col-sm-10 ">
          <input
            type="text"
            name="name"
            className="form-control"
            value={values.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="email" className="col-sm-2 mt-0 col-form-label">
          Email
        </label>
        <div className="col-sm-10 ">
          <input
            type="email"
            name="email"
            className="form-control"
            value={values.email}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="image" className="col-sm-2 mt-0 col-form-label">
          Image
        </label>
        <div className="col-sm-10 ">
          <input
            type="file"
            name="image"
            accept="image//*"
            className="form-control"
            value={values.image}
            onChange={fileResizeAndUpload}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="about" className="col-sm-2 mt-0 col-form-label">
          About
        </label>
        <div className="col-sm-10 ">
          <textarea
            name="about"
            className="form-control"
            value={values.about}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          className="mt-4 mb-4 box text-center"
          disabled={!values.email || loading}
        >
          Update
        </button>
      </div>
    </form>
  );
  return <h4>{profileUpdateForm()}</h4>;
};

export default Profile;
