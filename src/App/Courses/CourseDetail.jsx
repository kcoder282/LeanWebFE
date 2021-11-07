import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { host } from "../../Static";
import { toast } from "react-toastify";
import axios from "axios";
import "./CourseDetail.css";
import Lessons from "./Lessons/Lessons";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    axios
      .get(`${host}courses/${id}`)
      .then((result) => {
        setCourse(result.data);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  }, [id]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-sm-5 order-0"></div>
        <div className="col-12 col-sm-4 order-1"></div>
        <div className="col-12 col-sm-3 order-2">
          <div className="">
            <Lessons admin={admin} id_course={id} />
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
