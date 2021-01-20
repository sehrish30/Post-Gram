import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Icons
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const PostPagination = ({ page, setPage, postCount }) => {
  let totalPages;
  const pagination = () => {
    totalPages = Math.ceil(postCount?.totalPosts / 4);
    if (totalPages > 10) totalPages = 10;

    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li>
          <Link
            className={`page-link ${page === i && "active-page"}`}
            onClick={() => setPage(i)}
          >
            {i}
          </Link>
        </li>
      );
    }
    return pages;
  };
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <button
          type="button"
          className={`btn arrow mx-4 btn-icon ${
            page === 1 && "disabled-arrow"
          }`}
          onClick={() => setPage(page - 1)}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ color: "#16c79a" }}
            transform="down-4 grow-2"
          />
        </button>
        {pagination()}
        <button
          type="button"
          className={`btn arrow btn-icon mx-4 ${
            page === totalPages && "disabled-arrow"
          }`}
          onClick={() => setPage(page + 1)}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{ color: "#16c79a" }}
            transform="down-4 grow-2"
          />
        </button>
      </ul>
    </nav>
  );
};

export default PostPagination;
