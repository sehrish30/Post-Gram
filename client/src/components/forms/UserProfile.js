import Loader from "../Loader";
import Toast from "../Toast";

const UserProfile = ({ handleSubmit, handleChange, loading, values }) => (
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
      {loading ? (
        <Loader />
      ) : (
        <button
          className="mt-4 mb-4 box text-center"
          disabled={!values.email || loading}
        >
          Update
        </button>
      )}
    </div>
  </form>
);
export default UserProfile;
