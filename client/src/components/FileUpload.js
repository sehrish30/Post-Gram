import { useContext } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../context/auth";
import Image from "./Image";

const FileUpload = ({
  setLoading,
  values,
  setValues,
  singleUpload = false,
}) => {
  const { state } = useContext(AuthContext);

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

        // setValues to parent components based on either
        // it is used for single/multiple upload
        if (singleUpload) {
          setValues({
            ...values,
            image: {
              url: "",
              public_id: "",
            },
          });
        } else {
          let filteredImages = values.images.filter((item) => {
            return item.public_id !== public_id;
          });
          setValues({ ...values, images: filteredImages });
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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

                // setValues to parent components based on either
                // it is used for single/multiple upload
                if (singleUpload) {
                  setValues({ ...values, image: response.data });
                } else {
                  setValues({
                    ...values,
                    images: [...values.images, response.data],
                  });
                }

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

  return (
    <div className="row p-4">
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
      <div className="col-md-6">
        <div className="col-lg-8 pt-4">
          {/* for single image */}
          {values.image && (
            <Image
              key={values.image.public_id}
              image={values.image}
              handleImageRemove={handleImageRemove}
            />
          )}
          {/* for multiple images */}
          {values.images &&
            values.images.map((image) => (
              <Image
                key={image.public_id}
                image={image}
                handleImageRemove={handleImageRemove}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
