import React from 'react'
import CourseItem from './CourseItem'
import "./Courses.css";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { host } from './../../Static';
import { toast } from 'react-toastify';
import Modal from '../Component/Modal';

export default function Courses() {

    const [courses, setCourses] = useState([]);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        axios.get(host+'courses/')
        .then((result) => {
            setCourses(result.data);
        }).catch((err) => {
            toast.error(''+err);
        });
     
    }, [])

    return (
      <div className="container-fluid">
        <Modal/>
        <div className="row">
          <h2 className="col d-flex justify-content-between justify-content-sm-start">
            {admin ? (
              <>
                <span>Edit Courses</span> <i className="fi fi-rr-add ml-5" style={{cursor:'pointer'}}/>
              </>
            ) : (
              "List Courses"
            )}
          </h2>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 align-items-md-stretch">
          {courses.map((e, i) => (
            <CourseItem key={i} {...e} keyWord={e.key} admin={admin} />
          ))}
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
