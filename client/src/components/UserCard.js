import React from "react";
import Image from "./Image";

import { Link } from "react-router-dom";

import "../css/UserCard.scss";

const UserCard = ({ user, show }) => {
  const { username, images, about, name, email } = user;
 
  return (
    <div className="card mb-3 user text-center main-card">
      <div className="row g-0">
        <div className="col-md-4 col-sm-4">
          {!show ? (
            <Image image={images[0]} />
          ) : (
            images.map((image) => (
              <div className="image">
                <Image image={image} key={image.public_id} />
              </div>
            ))
          )}
        </div>
        <div className="col-md-8 col-sm-8">
          <div className="card-body">
            <Link to={`/user/${username}`}>
              <h5 className="card-title user-click user-name">@{username}</h5>
            </Link>

            <p className="card-text">
              <small>{about}</small>
            </p>
            {show && (
              <ul class="list-group list-group-flush">
                <li class="list-group-item">{name}</li>
                <li class="list-group-item">{email}</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
