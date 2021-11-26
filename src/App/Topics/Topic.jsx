import { useState, useEffect } from "react";
import icon from '../../Icon/svg/fi-rr-user.svg'
import axios from 'axios';
import { host, key } from "./../../Static";
import './index.css'
import ImgView from "../Component/ImgView";

export default function Topic({user}) {
    const [admin, setAdmin] = useState(false);
    const [name, setName] = useState("");
    const [courses, setcourses] = useState([]);
    const [course, setcourse] = useState({});
    const [select, setSelect] = useState(false)
    const [img, setImg] = useState([]);

    useEffect(() => {
       axios.get(host + "courses?key=" + key())
       .then((result) => {
           setcourses(result.data)
           setcourse(result.data[0])
       }).catch();
    }, []);

    const senData = ()=>{
        console.log({
            content: name,
            id_course: course.id,
            img: img,
        });
    }
    const clearData = () =>{
        setName("");
        setcourse(courses[0]);
        setImg([]);
    }
    const changeImg = (input) =>{
        let e = input.files;
        let list = [];
        let length = img.length;
        for(let i=0; i<e.length; i++)
        {
            let data = new FileReader();
            data.onload= ()=>
            {
                img[length+i] = data.result;
                
                if(length+i === img.length-1)
                {
                    setImg([...img]); 
                    input.value = '';
                }      
            }
            data.readAsDataURL(e[i]);
            list.push('');
        }
        img.push(...list);
        setImg([...img]);
    }
    return (
      <>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="px-2 col col-sm-10 col-md-9 col-lg-6 ">
              <div
                className="mt-4 shadow p-2 d-flex"
                style={{ borderRadius: ".5rem " }}
              >
                <img
                  className="mx-2 shadow"
                  src={user.avata ?? icon}
                  alt=""
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    outline: "5px solid #fff",
                  }}
                />
                <input
                  onInput={(e) => {
                    setName(e.target.value);
                  }}
                  style={{ cursor: "pointer" }}
                  value={name}
                  type="text"
                  className="form-control ml-2"
                  placeholder="Tạo chủ đề của bạn"
                />
                {name.length > 0 ? (
                  <>
                    <div
                      onClick={clearData}
                      className="btn btn-danger ml-2 animate__animated animate__faster animate__fadeInRight"
                    >
                      <i className="fi fi-sr-cross-circle" />
                    </div>
                    <div
                      onClick={senData}
                      className="btn btn-primary ml-2 animate__animated animate__fast animate__fadeInRight"
                    >
                      <i className="fi fi-rr-paper-plane" />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
              {name.length > 0 ? (
                <div
                  className="mt-2 bg-white shadow p-2 animate__animated animate__fadeInUp animate__faster"
                  style={{ borderRadius: ".5rem " }}
                >
                  <div className="d-flex align-items-center">
                    <div className="ml-3 mr-2" style={{ whiteSpace: "nowrap" }}>
                      Khóa học
                    </div>
                    <div className=" position-relative" style={{flex:1}}>
                      <div className="d-flex align-items-center position-relative">
                        <div
                          onClick={(e) => setSelect(!select)}
                          type="text"
                          className="form-control"
                          readOnly={true}
                          style={{ cursor: "pointer" }}
                        >
                            <span className="d-inline d-sm-none">{(course.name+"").substring(0,20)}</span>
                            <span className="d-none d-sm-inline">{course.name}</span>
                            <b className="d-none ml-2 d-sm-inline-block px-2 rounded" style={{ color: "#fff", background:
                                  "linear-gradient(45deg, " + course.color + ")"}}>
                              {course.key}
                            </b>
                        </div>
                        <i
                          style={{ right: ".5rem", pointerEvents: "none" }}
                          className={
                            "fi position-absolute " +
                            (select
                              ? "fi-rr-angle-small-down"
                              : "fi-rr-angle-small-right")
                          }
                        />
                      </div>
                      <div
                        className="bg-white position-absolute w-100 shadow"
                        style={{
                          top: "calc(100% + 0.25rem)",
                          left: 0,
                          zIndex: 200,
                          borderRadius: ".5rem",
                          overflow: "hidden",
                        }}
                      >
                        {select
                          ? courses.map((e) => (
                              <div
                                key={e.id}
                                onClick={() => {
                                  setcourse(e);
                                  setSelect(false);
                                }}
                                className="item px-3 py-1 d-flex justify-content-between"
                              >
                                <div>
                                  {e.name}
                                  <b
                                    className="d-inline-block px-2 rounded ml-1"
                                    style={{
                                      color: "#fff",
                                      background:
                                        "linear-gradient(45deg, " +
                                        e.color +
                                        ")",
                                    }}
                                  >
                                    {e.key}
                                  </b>
                                </div>
                                <div>
                                  {e.member}
                                  <i className="fi fi-rr-user fs-6" />
                                </div>
                              </div>
                            ))
                          : ""}
                      </div>
                    </div>
                  </div> 
                  <ImgView setListImg={setImg} listImg={img} edit={true} />
                  <label
                    htmlFor="img"
                    className="position-relative btn btn-primary d-block mt-2"
                  >
                    <i className="fi fi-rr-add" /> Thêm ảnh
                  </label>
                  <input
                    hidden
                    multiple
                    type="file"
                    id="img"
                    accept="image/*"
                    onChange={(event) => changeImg(event.currentTarget)}
                  />
                </div>
              ) : (
                ""
              )}
              <div
                className="shadow bg-white mt-3"
                style={{ height: "100vh", borderRadius: ".5rem " }}
              ></div>
            </div>
          </div>

          {user.type === 1 ? (
            <div
              onClick={() => setAdmin(!admin)}
              className={
                "btn btn-admin rounded-pill " + (admin ? "btn-primary" : "")
              }
            >
              <i className="fi fi-rr-key " />
              <span className="d-none d-sm-inline">admin</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
}
