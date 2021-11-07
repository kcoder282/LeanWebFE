import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function CourseItem(data) {

    const [course, setCourse] = useState({});
    useEffect(() => {
        setCourse({...data});
    }, [data])
  return (
    <div className={"col mt-2 "+(course.status===0? course.admin?"fade":"d-none":"")}>
      <Link to={course.admin ? "" : "/courses/" + course.id + "/" +(course.name+"").replaceAll(" ","-")}>
        <div
          className="course"
          onClick={
            course.admin
              ? () => {
                  course.setCourseModal(course);
                  course.setSave(false);
                }
              : () => null
          }
        >
          <div
            className="card-main text-center py-4 rounded font-weight-bold"
            style={{
              background: "linear-gradient(145deg, " + course.color + ")",
              color: "#fff",
              overflow: "hidden",
            }}
          >
            {course.admin ? (
              <i className="fi fi-rr-settings btn-setting animate__animated animate__zoomIn animate__faster" />
            ) : null}
            <div className="des" style={{ textAlign: "justify" }}>
              {course.description}
            </div>
            <div className="key my-2">
              <div style={{ fontSize: "2.5rem" }}>{course.keyWord}</div>
              <div style={{ fontSize: "1.25rem" }}>
                <span style={{ color: "var(--yellow)" }}>
                  {[1, 2, 3, 4, 5].map((e) =>
                    course.evaluate + 0.5 >= e ? "★" : "☆"
                  )}
                </span>
                <span>
                  {course.evaluate === null ? "" : `/${course.evaluate}`}
                </span>
              </div>
            </div>
          </div>
          <h3 className="my-1 px-2">{course.name}</h3>
          {course.admin ? (
            <div className="px-2">Có {course.lessons} bài học</div>
          ) : null}
          <div className="d-flex justify-content-between mb-3 px-2">
            <span>
              <i className="fi fi-rr-bookmark mr-2" />
              {course.price + "" === "0"
                ? "Khóa học Miễn Phí"
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(course.price)}
            </span>
            <span>
              {course.member} <i className="fi fi-rr-user" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
