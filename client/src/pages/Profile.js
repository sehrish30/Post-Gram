import { useState, useMemo, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import Toast from "../components/Toast";
import Resizer from "react-image-file-resizer";
import axios from "axios";

import "../css/register.scss";
import { PROFILE } from "../components/graphql/queries";
import { USER_UPDATE } from "../components/graphql/mutations";
import { AuthContext } from "../context/auth";

const Profile = () => {
  const { state } = useContext(AuthContext);
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
      values.images = [];
      images.map((image) => {
        // Remove __typename property
        const newValue = Object.keys(image).reduce((object, key) => {
          if (key !== "__typename") {
            object[key] = image[key];
          }
          return object;
        }, {});

        values.images.push(newValue);
      });

      // not updating images because already mutated
      setValues({
        ...values,
        username,
        email,
        name,
        about,
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

  const handleImageRemove = async (public_id) => {
    setLoading(true);
    try {
      // must send headers for authCheckMiddleware
      const response = await axios.post(
        `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
        {
          public_id,
        },
        {
          headers: {
            authtoken: state.user.token,
          },
        }
      );
      if (response) {
        setLoading(false);
        let filteredImages = values.images.filter((item) => {
          return item.public_id !== public_id;
        });
        setValues({ ...values, images: filteredImages });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

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
  const fileResizeAndUpload = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
                {
                  image: uri,
                },
                {
                  headers: {
                    authtoken: state.user.token,
                  },
                }
              )
              .then((response) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD", response);

                // response.data will have url and public id

                setValues({
                  ...values,
                  images: [...values.images, response.data],
                });
                console.log("VALUES", values);
              })
              .catch((error) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD FAILED", error);
              });
            // this.setState({ newImage: uri });
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

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
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-lg-4">
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
                onChange={fileResizeAndUpload}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-8 pt-4">
          {values.images.map((image) => (
            <img
              src={image.url}
              key={image.public_id}
              alt="Uploaded posts"
              style={{ height: "100px" }}
              className="float-right p-2"
              onClick={() => handleImageRemove(image.public_id)}
            />
          ))}
        </div>
      </div>
      {profileUpdateForm()}
    </div>
  );
};

export default Profile;
