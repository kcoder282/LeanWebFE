import React from 'react'
import { Link } from 'react-router-dom';

export default function CourseItem({
  id,
  name,
  description,
  keyWord,
  price,
  color,
  member,
  evaluate,
  admin,
}) {
  return (
    <div className="col mt-2">
      <Link to={"/courses/" + id}>
        <div className="course">
          <div
            className="card-main text-center py-4 rounded font-weight-bold"
            style={{
              background: "linear-gradient(145deg, " + color + ")",
              color: "#fff",
            }}
          >
            {admin?<i className="fi fi-rr-settings btn-setting" />:null}
            <div className="des" style={{ textAlign: "justify" }}>
              {description}
            </div>
            <div className="key my-2">
              <div style={{ fontSize: "2.5rem" }}>{keyWord}</div>
              <div style={{ fontSize: "1.25rem" }}>
                <span style={{ color: "var(--yellow)" }}>
                  {[1, 2, 3, 4, 5].map((e) =>
                    evaluate + 0.5 >= e ? "★" : "☆"
                  )}
                </span>
                <span>{evaluate === null ? "" : `/${evaluate}`}</span>
              </div>
            </div>
          </div>
          <h3 className="my-1 px-2">{name}</h3>
          <div className="d-flex justify-content-between mb-3 px-2">
            <span>
              <i className="fi fi-rr-bookmark" />
              {price + "" === "0"
                ? " Khóa học Miễn Phí"
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(price)}
            </span>
            <span>
              {member} <i className="fi fi-rr-user" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
