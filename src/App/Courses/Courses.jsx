import React from "react";
import CourseItem from "./CourseItem";
import "./Courses.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { host, key } from "./../../Static";
import { toast } from "react-toastify";
import Modal from "../Component/Modal";
import Load from "./../../Error/Load";
import { Link } from "react-router-dom";

export default function Courses({user}) {
  const [courses, setCourses] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [courseEdit, setCourseEdit] = useState(false);
  const [load, setLoad] = useState(true);
  const [loadExec, setLoadExec] = useState(false);
  const [save, setSave] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    axios
      .get(host + "courses?key=" + key())
      .then((result) => {
        setCourses(result.data);
        setLoad(false);
      })
      .catch((err) => {
        toast.error("" + err);
        setLoad(false);
      });
  }, []);

  const excuteData = () => {
    setLoadExec(true);
    courseEdit.key = courseEdit.keyWord;
    if (courseEdit.id === -1) {
      axios
        .post(host + "courses?key=" + key(), courseEdit)
        .then((result) => {
          setCourses(result.data);
          toast.success("Thêm khóa học Thành công");
          setLoadExec(false);
          setCourseEdit(false);
          setSave(false);
        })
        .catch((err) => {
          toast.error(err + "");
        });
    } else {
      axios
        .put(host + "courses/" + courseEdit.id + "?key=" + key(), courseEdit)
        .then((result) => {
          setCourses(result.data);
          toast.success("Lưu thay đổi thành công");
          setCourseEdit(false);
        })
        .catch((err) => {
          toast.error(err + "");
        })
        .finally(() => setLoadExec(false));
    }
  };
  const deleteData = () => {
    axios
      .delete(host + "courses?key=" + key() + courseEdit.id)
      .then((result) => {
        setCourses(result.data);
        toast.success("Xóa khóa học Thành công");
        setLoadExec(false);
        setCourseEdit(false);
      })
      .catch((err) => {
        toast.error(err + "");
      });
  };

  return load ? (
    <Load />
  ) : (
    <div className="container-fluid">
      {courseEdit === false ? null : (
        <Modal>
          <div className="row mb-3">
            <div className="col">
              {loadExec ? (
                <span className="load mr-2">
                  <i className="fi fi-rr-spinner" />
                </span>
              ) : (
                ""
              )}
              Khóa học <b>{courseEdit.name}</b>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 align-items-stretch">
            <div
              className="col rounded d-none d-sm-block"
              style={{ border: "1px solid #5555", width: "350px" }}
            >
              <CourseItem
                id={courseEdit.id}
                name={courseEdit.name}
                description={courseEdit.description}
                keyWord={courseEdit.keyWord}
                price={courseEdit.price}
                status={courseEdit.status}
                color={courseEdit.color}
                lessons={courseEdit.lessons}
                member={courseEdit.member}
                evaluate={courseEdit.evaluate}
                admin={admin}
                setCourseModal={setCourseEdit}
                setSave={setSave}
                regis={courseEdit.regis}
              />
              {courseEdit.id !== -1 ? (
                <Link
                  to={`/courses/${(courseEdit.name + "").replaceAll(
                    " ",
                    "-"
                  )}/${courseEdit.id}`}
                >
                  <div className="btn btn-primary d-block">
                    <i className="fi fi-rr-interactive" /> Edit Lessons
                  </div>
                </Link>
              ) : null}
            </div>
            <form className="col p-2">
              Tên Khóa học
              <input
                type="text"
                className="form-control"
                value={courseEdit.name}
                onInput={(e) => {
                  courseEdit.name = e.target.value;

                  if (
                    courseEdit.name.length === 0 ||
                    courseEdit.name.length > 40
                  )
                    setSave(false);
                  else setSave(true);

                  setCourseEdit({ ...courseEdit });
                }}
              />
              <div>
                {courseEdit.name.length === 0 ? (
                  <small style={{ color: "red" }}>Tên không được rỗng</small>
                ) : null}
                {courseEdit.name.length > 40 ? (
                  <small style={{ color: "red" }}>
                    Vướt quá {courseEdit.name.length - 40} kí tự
                  </small>
                ) : null}
              </div>
              KeyWord Khóa học
              <input
                type="text"
                className="form-control"
                value={courseEdit.keyWord}
                onInput={(e) => {
                  courseEdit.keyWord = e.target.value;
                  if (
                    courseEdit.keyWord.length === 0 ||
                    courseEdit.keyWord.length > 10
                  )
                    setSave(false);
                  else setSave(true);
                  setCourseEdit({ ...courseEdit });
                }}
              />
              <div>
                {courseEdit.keyWord.length === 0 ? (
                  <small style={{ color: "red" }}>
                    KeyWord không được rỗng
                  </small>
                ) : null}
                {courseEdit.keyWord.length > 10 ? (
                  <small style={{ color: "red" }}>
                    Vướt quá {courseEdit.keyWord.length - 10} kí tự
                  </small>
                ) : null}
              </div>
              Color
              <div className="form-control d-flex justify-content-around">
                <input
                  type="color"
                  className="flex-fill"
                  value={courseEdit.color.split(",")[0]}
                  onInput={(e) => {
                    courseEdit.color =
                      e.target.value + "," + courseEdit.color.split(",")[1];
                    setSave(true);
                    setCourseEdit({ ...courseEdit });
                  }}
                />
                <input
                  type="color"
                  className="flex-fill ml-2"
                  value={courseEdit.color.split(",")[1]}
                  onInput={(e) => {
                    courseEdit.color =
                      courseEdit.color.split(",")[0] + "," + e.target.value;
                    setSave(true);
                    setCourseEdit({ ...courseEdit });
                  }}
                />
              </div>
              Giá khóa học
              <input
                step="100000"
                type="number"
                className="form-control"
                value={courseEdit.price}
                onInput={(e) => {
                  courseEdit.price = e.target.value;
                  setSave(true);
                  setCourseEdit({ ...courseEdit });
                }}
              />
              <span
                className={
                  "checkbox " + (courseEdit.status === 1 ? "checked" : "")
                }
                onClick={() => {
                  courseEdit.status === 1
                    ? (courseEdit.status = 0)
                    : (courseEdit.status = 1);
                  setSave(true);
                  setCourseEdit({ ...courseEdit });
                }}
              ></span>{" "}
              Ẩn khóa học
              <br />
              Mô tả
              <textarea
                style={{ resize: "none" }}
                rows="3"
                className="form-control"
                value={courseEdit.description}
                onInput={(e) => {
                  courseEdit.description = e.target.value;
                  if (
                    courseEdit.description.length === 0 ||
                    courseEdit.description.length > 90
                  )
                    setSave(false);
                  else setSave(true);
                  setCourseEdit({ ...courseEdit });
                }}
              />
              <div>
                {courseEdit.description.length === 0 ? (
                  <small style={{ color: "red" }}>Mô tả không được rỗng</small>
                ) : null}
                {courseEdit.description.length > 90 ? (
                  <small style={{ color: "red" }}>
                    Vượt quá {courseEdit.description.length - 90} kí tự
                  </small>
                ) : null}
              </div>
            </form>
          </div>
          <div className="d-flex mt-3 justify-content-around">
            {courseEdit.id === -1 ? null : (
              <div
                onClick={() => setConfirm(true)}
                className={
                  "btn btn-danger " +
                  (courseEdit.lessons === 0 ? "" : "disable")
                }
              >
                <i className="fi fi-rr-apps-delete" />
                <span className="d-none d-sm-inline ml-2">Xóa</span>
                {courseEdit.lessons === 0
                  ? ""
                  : "(có " + courseEdit.lessons + " bài học)"}
              </div>
            )}

            {save ? (
              courseEdit.id === -1 ? (
                <div onClick={excuteData} className="btn btn-primary">
                  <i className="fi fi-rr-apps-add" />
                  <span className="d-none d-sm-inline ml-2">Tạo mới</span>
                </div>
              ) : (
                <div onClick={excuteData} className="btn btn-primary">
                  <i className="fi fi-rr-disk" />
                  <span className="d-none d-sm-inline ml-2">Lưu thay đổi</span>
                </div>
              )
            ) : null}
            <div
              className="btn btn-primary"
              onClick={() => {
                setCourseEdit(false);
                setSave(false);
              }}
            >
              <i className="fi fi-rr-cross-circle" />
              <span className="d-none d-sm-inline ml-2">Hủy</span>
            </div>
          </div>
        </Modal>
      )}
      {confirm && courseEdit !== false ? (
        <Modal>
          <div>Bạn Chắc chắn muốn xóa khóa học</div>
          <div className="d-flex justify-content-around">
            <div
              className="btn btn-danger"
              onClick={() => {
                deleteData();
                setConfirm(false);
              }}
            >
              Xóa
            </div>
            <div className="btn btn-primary" onClick={() => setConfirm(false)}>
              Hủy
            </div>
          </div>
        </Modal>
      ) : null}
      {admin ? null : (
        <div className="row">
          <h2 className="col d-flex justify-content-between justify-content-sm-start">
            My Courses
          </h2>
        </div>
      )}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 align-items-md-stretch">
        {courses.map((e, i) =>
          !admin && e.regis ? (
            <CourseItem
              key={i}
              id={e.id}
              name={e.name}
              description={e.description}
              keyWord={e.key}
              price={e.price}
              status={e.status}
              color={e.color}
              lessons={e.lessons}
              member={e.member}
              evaluate={e.evaluate}
              admin={admin}
              setCourseModal={setCourseEdit}
              setSave={setSave}
              regis={e.regis}
              myevaluate={e.myevaluate}
              mEvaluate={e.mEvaluate}
              setCourses={setCourses}
            />
          ) : (
            ""
          )
        )}
      </div>
      <div className="row">
        <h2 className="col d-flex justify-content-between justify-content-sm-start">
          {admin ? (
            <>
              <span>Edit Courses</span>{" "}
              <i
                onClick={() =>
                  setCourseEdit({
                    id: -1,
                    name: "Chưa có tên",
                    description: " Chưa có mô tả",
                    keyWord: "Key Word",
                    price: 0,
                    status: 1,
                    color: "#000000,#000000",
                    lessons: 0,
                    member: 0,
                    evaluate: null,
                    myevaluate: 0,
                  })
                }
                className="fi fi-rr-add ml-5 text-primary"
                style={{ cursor: "pointer" }}
              />
            </>
          ) : (
            "List Courses"
          )}
        </h2>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 align-items-md-stretch">
        {courses.map((e, i) =>
          !e.regis || admin ? (
            <CourseItem
              key={i}
              id={e.id}
              name={e.name}
              description={e.description}
              keyWord={e.key}
              price={e.price}
              status={e.status}
              color={e.color}
              lessons={e.lessons}
              member={e.member}
              evaluate={e.evaluate}
              admin={admin}
              setCourseModal={setCourseEdit}
              setSave={setSave}
              regis={e.regis}
              setCourses={setCourses}
              mEvaluate={e.mEvaluate}
            />
          ) : (
            ""
          )
        )}
      </div>

      {user.type === 1 ? (
        <div
          onClick={() => setAdmin(!admin)}
          className={
            "btn btn-admin rounded-pill " + (admin ? "btn-primary" : "")
          }
        >
          <i className="fi fi-rr-key" />{" "}
          <span className="d-none d-sm-inline">admin</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
