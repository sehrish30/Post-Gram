// f => f passign default value of func

const Image = ({ image, handleImageRemove = (f) => f }) => {
  return (
    <img
      src={image.url}
      key={image.public_id}
      alt="Uploaded posts"
      style={{ height: "100px" }}
      className="float-right p-2"
      onClick={() => handleImageRemove(image.public_id)}
    />
  );
};

export default Image;
