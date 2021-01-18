import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";

import "../css/register.scss";
import "../css/Profile.scss";
import { PROFILE } from "../components/graphql/queries";
import { USER_UPDATE } from "../components/graphql/mutations";

import UserProfile from "../components/forms/UserProfile";
import FileUpload from "../components/FileUpload";

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
      setLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // execute mutation
    userUpdate({ variables: { input: values } });
  };
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="container p-4 profile">
      <FileUpload
        setValues={setValues}
        setLoading={setLoading}
        values={values}
      />

      <UserProfile
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        loading={loading}
        values={values}
      />
    </div>
  );
};

export default Profile;
