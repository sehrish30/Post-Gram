import { useState } from "react";
import { useHistory } from "react-router-dom";

const Search = () => {
  let history = useHistory();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    history.push(`/search/${query}`);
  };
  return (
    <form className="d-flex input-group w-auto" onSubmit={handleSubmit}>
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        type="search"
        className="form-control"
        placeholder="..."
        aria-label="Search"
      />
      <button className="btn" type="button" data-mdb-ripple-color="dark">
        Search
      </button>
    </form>
  );
};

export default Search;
