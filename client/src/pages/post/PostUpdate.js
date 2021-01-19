import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const PostUpdate = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {loading ? <Loader /> : <h4 className="createpost-heading">Update</h4>}
    </div>
  );
};

export default PostUpdate;
