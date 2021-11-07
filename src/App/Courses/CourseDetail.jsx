import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { host } from "../../Static";
import { toast } from 'react-toastify';
import axios from 'axios';
import "./CourseDetail.css";
import LessonItem from "./Lessons/LessonItem";
export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState({});

  useEffect(() => {
    axios   
    .get(`${host}courses/${id}`)
    .then((result) => {
        setCourse(result.data);
        console.log(result.data);
    }).catch((err) => {
        toast.error(""+err);
    });
  }, [id]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-sm-5 order-0"></div>
        <div className="col-12 col-sm-4 order-1"></div>
        <div className="col-12 col-sm-3 order-2">
          <div className="row">
            <
          </div>
        </div>
      </div>
    </div>
  );
}
