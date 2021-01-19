import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";

import "../css/PostCard.scss";

const PostCard = ({
  post,
  showUpdateButton = false,
  showDeleteButton = false,
  handleDelete = (f) => f,
}) => {
  console.log(post);
  return (
    <div className="card post-card">
      <img src={post.image.url} className="img-thumbnail img-fluid" alt="..." />
      <div className="card-body">
        <h5>@{post.postedBy.username}</h5>
        <p className="card-text post-text">{post.content}</p>

        {showDeleteButton && (
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => handleDelete(post._id)}
          >
            <FontAwesomeIcon
              style={{ color: "#839b97" }}
              transform="down-4 grow-2.5"
              icon={faTrashAlt}
            />
          </button>
        )}

        {showUpdateButton && (
          <button type="button" className="btn btn-icon">
            <FontAwesomeIcon
              icon={faEdit}
              style={{ color: "#16c79a" }}
              transform="down-4 grow-2.5"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
