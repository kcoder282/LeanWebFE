import axios from "axios";
import React, { useEffect, useState } from "react";
import { host } from "./../../../Static";
import { toast } from "react-toastify";
import LessonItem from "./LessonItem";

export default function Lessons({ admin, id_course }) {
  const [lessons, setLessons] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get(host + "lessons?id_course=" + id_course)
      .then((result) => {
        setLessons(result.data);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  }, [id_course]);
  const addLesson=()=>{
    axios
      .post(host + "lessons?id_course=" + id_course,{name: name })
      .then((result) => {
        setLessons(result.data);
        console.log(result.data);
        toast.success("Thêm bài học mới thành công");
        setName("");
      })
      .catch((err) => {
        toast.error("" + err);
      });
  }
  return (lessons.map!==undefined?
    <>
      <div className="row pb-5 mb-5">
        <div className="col-12">
          <h3 className="px-2">
            <span>{admin ? "Edit Lessons" : "List Lessons"}</span>
          </h3>
        </div>
        {admin? <div className="col-12 position-relative animate__animated animate__zoomIn animate__faster">
          <input type="text" className="form-control mb-3" placeholder="Thêm tên bài học mới..." style={{paddingRight:'2rem'}}
          value={name}
          onInput={(e)=>{
            setName(e.target.value)
          }}/>
          {name.length>0?<i onClick={addLesson} className="fi fi-rr-apps-add position-absolute text-white btn-add"/>:''}
        </div>:""}
        {lessons.map((e, i) => (
          <LessonItem key={i} index={i + 1} name={e.name} check={e.check}/>
        ))}
      </div>
    </>:null
  );
}
