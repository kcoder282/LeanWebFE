import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { host, key } from "./../../Static";
import { toast } from 'react-toastify';

export default function CourseItem(data) {
  const [load, setLoad] = useState(false);
  const [myEvaluate, setMyEvaluate] = useState(0);
  const [course, setCourse] = useState({});
  useEffect(() => {
      setCourse({...data});
      setMyEvaluate(data.myevaluate);
  }, [data])

  const evaluate = () => {
    setLoad(true);
    axios
      .post(host + "evaluate/" + course.id + "?key=" + key(), {
        evaluate: myEvaluate
      })
      .then((result) => {
        toast.success("Đánh giá thành công");
        let data = result.data;
        data.keyWord = data.key;
        setCourse(data);
      })
      .catch((err) => {
        toast.error("" + err);
      })
      .finally(() => setLoad(false));
  };

  const regis = () => {
    setLoad(true);
    axios
      .post(host + "regis/" + course.id + "?key=" + key())
      .then((result) => {
        toast.success("Đăng ký thành công");
        data.setCourse(result.data);
      })
      .catch((err) => {
        toast.error("" + err);
      })
      .finally(() => setLoad(false));
  }
  return (
    <div
      className={
        "col mt-2 " +
        (course.status === 0 ? (course.admin ? "fade" : "d-none") : "")
      }
    >
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
        <Link
          to={
            course.admin || !course.regis
              ? ""
              : "/courses/" +
                (course.name + "").replaceAll(" ", "-") +
                "/" +
                course.id
          }
        >
          <div
            className="card-main text-center py-4 rounded font-weight-bold shadow"
            style={{
              background: "linear-gradient(145deg, " + course.color + ")",
              color: "#fff",
              overflow: "hidden",
            }}
          >
            {course.admin ? (
              <i className="fi fi-sr-settings btn-setting animate__animated animate__zoomIn animate__faster" />
            ) : null}
            <div className="des" style={{ textAlign: "justify" }}>
              {course.description}
            </div>
            <div className="key my-2">
              <div style={{ fontSize: "2.5rem" }}>{course.keyWord}</div>
              <div style={{ fontSize: "1.25rem" }}>
                <span style={{ color: "var(--yellow)" }}>
                  {[1, 2, 3, 4, 5].map((e) =>
                    course.evaluate + 0.5 >= e ? (
                      <i className="fi fi-sr-star ml-1" />
                    ) : (
                      <i className="fi fi-rr-star ml-1" />
                    )
                  )}
                </span>
                <span>
                  {course.evaluate === null ? (
                    ""
                  ) : (
                    <>
                      /{course.evaluate}
                      <small style={{fontWeight: '400'}}> {course.mEvaluate}<i className="fi fi-rr-user" style={{fontSize: '.8em'}}/></small>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <h3 className="my-1 px-2 nameCourse" title={course.name}>
            {course.name}
          </h3>
        </Link>
        {!data.regis || data.admin ? (
          <div className="px-2 pb-2 d-flex justify-content-between">
            <span>Có {course.lessons} bài học</span>
            <span>
              {course.member} <i className="fi fi-rr-user" />
            </span>
          </div>
        ) : null}
        <div className="d-flex mb-3">
          {data.regis && !data.admin ? (
            <span className="flex-wrap flex-fill align-items-center justify-content-center d-flex py-2">
              <div className="">
                {" "}
                {[1, 2, 3, 4, 5].map((e) =>
                  e <= myEvaluate ? (
                    <i
                      key={e}
                      onClick={() => setMyEvaluate(e)}
                      className="fi fi-sr-star mx-1 fs-5"
                      style={{
                        color:
                          myEvaluate === 0
                            ? "var(--secondary)"
                            : "var(--yellow)",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <i
                      key={e}
                      onClick={() => setMyEvaluate(e)}
                      className="fi fi-rr-star mx-1 fs-5"
                      style={{
                        color:
                          myEvaluate === 0
                            ? "var(--secondary)"
                            : "var(--yellow)",
                        cursor: "pointer",
                      }}
                    />
                  )
                )}
              </div>
              <div
                onClick={evaluate}
                className="btn btn-primary flex-fill mx-2"
              >
                {load ? (
                  <span className="load mr-2">
                    <i className="fi fi-rr-spinner" />
                  </span>
                ) : (
                  ""
                )}
                Đánh giá
              </div>
            </span>
          ) : (
            <span onClick={regis} className="btn btn-primary flex-fill shadow">
              <i className="fi fi-rr-bookmark mr-2" />
              {course.price + "" === "0"
                ? "Khóa học Miễn Phí"
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(course.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
