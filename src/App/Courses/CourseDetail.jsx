import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { host, key } from "../../Static";
import { toast } from "react-toastify";
import axios from "axios";
import "./CourseDetail.css";
import Lessons from "./Lessons/Lessons";
import LessonDetail from './Lessons/LessonDetail';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [admin, setAdmin] = useState(false);
  const [idLesson, setIdLesson] = useState(-1);
  useEffect(() => {
    axios
      .get(`${host}courses/${id}?key=`+key())
      .then((result) => {
        setCourse(result.data);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  }, [id]);

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="col-12 col-sm-9 order-1">
          <div className="container-fluid">
            <LessonDetail id={idLesson} admin={admin} />
          </div>
        </div>
        <div className="col-12 col-sm-3 order-2">
          <div className="">
            <Lessons
              admin={admin}
              id_course={id}
              price={course.price}
              regis={course.regis}
              viewLesson={setIdLesson}
              idLesson={idLesson}
            />
          </div>
        </div>
      </div>
      <div
        onClick={() => setAdmin(!admin)}
        className={"btn btn-admin " + (admin ? "btn-primary" : "")}
      >
        <i className="fi fi-rr-key" />{" "}
        <span className="d-none d-sm-inline">admin</span>
      </div>
    </div>
  );
}
