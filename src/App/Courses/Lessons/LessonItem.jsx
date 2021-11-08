import { useState, useEffect } from "react";
import Modal from "./../../Component/Modal";
import axios from "axios";
import { host, key } from "../../../Static";
import { toast } from "react-toastify";

export default function LessonItem({
  id,
  change,
  name,
  index,
  check,
  admin,
  setLessons,
  viewLesson,
  idLesson,
}) {
  const [editname, setEditname] = useState("");
  const [edit, setEdit] = useState(false);
  const [select, setSelect] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirm, setConfirm] = useState(-1);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setEditname(name);
    setEditMode(false);
    setSelect(false);
  }, [name]);


  const saveChange = () => {
    setLoad(true);
    axios
      .put(host + `lessons/${id}?key=` + key(), {
        name: editname,
      })
      .then((result) => {
        toast.success("Lưu bài học Thành công");
        setLessons(result.data);
        setEdit(false);
        setLoad(false);
        setEditMode(false);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  };
  const deleteLesson = () => {
    setLoad(true);
    axios
      .delete(host + `lessons/${id}?key=` + key())
      .then((result) => {
        setConfirm(-1);
        toast.success("Xóa bài học Thành công");
        setLessons(result.data);
        setLoad(false);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  };

  return (
    <div className="mb-2">
      {confirm === -1 ? (
        ""
      ) : (
        <Modal>
          <div>Bạn Thật sự Muốn xóa Bài học này</div>
          <div className="d-flex justify-content-around mt-3">
            <div className="btn btn-danger" onClick={deleteLesson}>
              Xóa
            </div>
            <div className="btn btn-primary" onClick={() => setConfirm(-1)}>
              Hủy
            </div>
          </div>
        </Modal>
      )}
      <div
        className={
          " p-2 lessonsItem d-flex justify-content-between " +
          (select ? "select" : "") +
          (idLesson === id?" detail":"")
        }
        style={{ zIndex: 2 }}
        onClick={() => viewLesson(id)}
      >
        {admin ? (
          <>
            {load ? (
              <span className="load mr-1">
                <i className="fi fi-rr-spinner" />
              </span>
            ) : (
              ""
            )}
            <span className="pr-1">{index}:</span>
            <input
              type="text"
              autoFocus={edit}
              className={"edit " + (edit ? "edit-add" : "")}
              value={editname}
              placeholder="Tên bài học..."
              onInput={(e) => {
                setEditname(e.target.value);
                setEdit(true);
                setEditMode(true);
              }}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  saveChange();
                }
                if (e.code === "Escape") {
                  setEditname(name);
                  setEdit(false);
                }
              }}
            />
            {edit ? (
              <i
                className="fi fi-rr-cross-circle ml-2"
                style={{ color: "var(--danger)" }}
                onClick={() => {
                  setEditname(name);
                  setEdit(false);
                }}
              />
            ) : null}
            <i
              onClick={() => {
                setEditMode(!editMode);
              }}
              className={
                editMode
                  ? "fi fi-rr-caret-down ml-2"
                  : "fi fi-rr-caret-right ml-2"
              }
            />
          </>
        ) : (
          <>
            <span className="pl-2">
              Bài {index}: {name}
            </span>
            {check ? (
              <i
                className="fi fi-rr-check"
                style={{ color: "var(--success)" }}
              />
            ) : (
              ""
            )}
          </>
        )}
      </div>
      {editname.length === 0 ? (
        <small className="pl-3" style={{ color: "var(--danger)" }}>
          Tên khóa học không rỗng
        </small>
      ) : null}
      {editname.length > 190 ? (
        <small className="pl-3" style={{ color: "var(--danger)" }}>
          Tên khóa học quá dài( vượt {editname.length - 190} )
        </small>
      ) : null}
      {editMode ? (
        <div
          className="d-flex justify-content-around pt-2 mx-2"
          style={{ overflow: "hidden" }}
        >
          <div
            className="btn btn-primary rounded animate__animated animate__fadeInDown animate__faster"
            style={{ animationDelay: "0" }}
            title={edit ? "Lưu thay đổi" : "Chỉnh sửa thông tin"}
            onClick={edit ? saveChange : () => setEdit(true)}
          >
            <span
              className={edit ? "fi fi-rr-disk" : "fi fi-rr-edit"}
              style={{ fontSize: ".8rem" }}
            />
          </div>

          <div
            className="btn btn-primary rounded animate__animated animate__fadeInDown animate__faster"
            style={{ animationDelay: ".1s" }}
            title="Thay đổi vị trí"
            onClick={() => {
              change({
                id: id,
                name: name,
                setSelect: setSelect,
                index: index,
              });
            }}
          >
            <span
              className="fi fi-rr-apps-sort"
              style={{ fontSize: ".8rem" }}
            />
          </div>
          <div
            onClick={() => {
              setConfirm(id);
            }}
            className="btn btn-danger rounded animate__animated animate__fadeInDown animate__faster"
            style={{ animationDelay: ".2s" }}
            title="Xóa bài học này"
          >
            <span
              className="fi fi-rr-cross-circle"
              style={{ fontSize: ".8rem" }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
