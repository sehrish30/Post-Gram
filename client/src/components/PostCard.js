import React from "react";

import "../css/PostCard.scss";

const PostCard = ({ post }) => {
  console.log(post);
  return (
    <div className="card post-card">
      <img src={post.image.url} className="img-thumbnail img-fluid" alt="..." />
      <div className="card-body">
        <h5>@{post.postedBy.username}</h5>
        <p className="card-text post-text">{post.content}</p>
      </div>
    </div>
  );
};

export default PostCard;
