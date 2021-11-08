import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { host, key } from "./../../../Static";
import { toast } from "react-toastify";
import LessonItem from "./LessonItem";
import Modal from "../../Component/Modal";

export default function Lessons({ admin, id_course, regis, price, viewLesson, idLesson }) {
  const [lessons, setLessons] = useState([]);
  const [name, setName] = useState("");
  const [pos, setPos] = useState({});
  const [confrim, setConfrim] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    axios
      .get(host + "lessons?id_course=" + id_course + "&key=" + key())
      .then((result) => {
        setLessons(result.data);
        setLoad(false);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  }, [id_course]);
  const addLesson = useCallback(() => {
    setLoad(true);
    axios
      .post(host + "lessons?id_course=" + id_course + "&key=" + key(), {
        name: name,
      })
      .then((result) => {
        setLessons(result.data);
        toast.success("Thêm bài học mới vào cuối danh sách thành công");
        setName("");
        setLoad(false);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  }, [id_course, name]);
  const setPosLesons = (index) => {
    if (pos.id === undefined) setPos(index);
    else if (pos.id === index.id) setPos({});
    else {
      setConfrim(index);
    }
  };
  const changePosition = () => {
    setLoad(true);
    let data = { id1: pos.id, id2: confrim.id };
    setConfrim({});
    setPos({});
    axios
      .post(host + "lessons/change?key=" + key(), data)
      .then((result) => {
        toast.success("Thay đổi vị trí thành công");
        setLessons(result.data);
        setLoad(false);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  };

  return lessons.map !== undefined ? (
    <>
      {confrim.id === undefined ? null : (
        <Modal>
          <div>
            Bạn thật sự muốn thay đổi vị trí của bài "{pos.name}" và "
            {confrim.name}"
          </div>
          <div className="d-flex justify-content-around mt-3">
            <div onClick={changePosition} className="btn btn-primary">
              Thay đổi
            </div>
            <div
              className="btn btn-primary"
              onClick={() => {
                pos.setSelect(false);
                confrim.setSelect(false);
                setPos({});
                setConfrim({});
              }}
            >
              Hủy
            </div>
          </div>
        </Modal>
      )}
      <div className="row pb-5 mb-5">
        <div className="col-12">
          <h3 className="text-primary">
            {admin ? (
              <>
                {load ? (
                  <span className="load">
                    <i className="fi fi-rr-spinner" />
                  </span>
                ) : (
                  <i className="fi fi-rr-list-check" />
                )}{" "}
                Edit Lessons
              </>
            ) : (
              <span className="fi fi-rr-list"> List Lessons</span>
            )}
          </h3>
        </div>
        {admin ? (
          <div className="col-12 position-relative animate__animated animate__zoomIn animate__faster">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Thêm tên bài học mới..."
              style={{ paddingRight: "2rem" }}
              value={name}
              onInput={(e) => {
                setName(e.target.value);
              }}
            />
            {name.length > 0 ? (
              <i
                onClick={addLesson}
                className="fi fi-rr-apps-add position-absolute btn-add"
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div className="col-12 mb-2 position-relative animate__animated animate__zoomIn animate__faster">
          {pos.id === undefined ? (
            ""
          ) : (
            <>
              Thay đổi vị trí{" "}
              {pos.id === undefined ? (
                ""
              ) : (
                <span className="pos">{pos.index}</span>
              )}{" "}
              {confrim.id === undefined ? (
                ""
              ) : (
                <>
                  với <span className="pos">{confrim.index}</span>
                </>
              )}
            </>
          )}
        </div>
        <div className="col-12">
          {regis || admin ? (
            lessons.map((e, i) => (
              <LessonItem
                id={e.id}
                change={setPosLesons}
                key={i}
                index={i + 1}
                name={e.name}
                check={e.check}
                admin={admin}
                setLessons={setLessons}
                viewLesson={viewLesson}
                idLesson={idLesson}
              />
            ))
          ) : (
            <div className="mb-2">
              <div className="btn btn-primary d-block">
                <div>
                  <i className="fi fi-rr-bookmark"></i>{" "}
                  {price === undefined
                    ? "Đăng nhap"
                    : price + "" === "0"
                    ? "Khóa học Miễn Phí"
                    : new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(price)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  ) : null;
}
