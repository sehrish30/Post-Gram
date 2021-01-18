import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loader from "./Loader";

const LoadingToRedirect = ({ path }) => {
  const [count, setCount] = useState(5);

  let history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    count === 0 && history.push(path);

    // cleanup
    return () => clearInterval(interval);
  }, [count, history, path]);

  return (
    <div className="container p-5 text-center">
      <h3>Redirecting you in {count} seconds</h3>
      <Loader />
    </div>
  );
};

export default LoadingToRedirect;
