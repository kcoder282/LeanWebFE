import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import './index.css';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { host, key } from "./../../../Static";
import { toast } from 'react-toastify';
import Load from "../../../Error/Load";
import { useNavigate } from "react-router-dom";
import Modal from './../../Component/Modal';
import Exercise from "../Exercise";

hljs.configure({
  languages: ["javascript", "cpp", "python", "java"]
});

export default function Lesson({cmt, setCmt, idCourse, id, admin, nameCoures, setLessons, setSearch, setChange, comment, setComment}) {
    const [lesson, setLesson] = useState({});
    const [likeNumber, setlikeNumber] = useState(0);
    const [myLike, setmyLike] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [regis, setRegis] = useState(false);

    const check = useRef();
    let navigate = useNavigate();

    useEffect(() => {
       if(parseInt(id)!==-1)
       {
         axios.get(host+`lessons/${id}?key=${key()}`)
          .then((result) => {       
              setLesson(result.data);
              setmyLike(result.data.mylike);
              setlikeNumber(result.data.like);
              setCmt(result.data.cmt)
              setRegis(result.data.regis);
              check.current = setTimeout(() => {
                  axios.get(host + "lessons/proccess/"+id+"?key="+key()+"&id_course="+idCourse)
                  .then((result) => {
                    setLessons(result.data);
                  }).catch((err) => {});
              }, 120000)
          }).catch((err) => {
              toast.error(''+ err);
          });
       }else{
          setLesson({id:-1, name:"", content:'', video:'', id_course: idCourse});
          setmyLike(false);
          setlikeNumber(0);
          setCmt(0);
          setRegis(false);
       }
       return () => {
         clearTimeout(check.current);
       };
    }, [id, idCourse, lesson.id_course, setCmt, setLessons])

   

    const createLesson = () =>{
        setLesson({id:-1, name:"", content:'', video:'', id_course: lesson.id_course});
        
    }

    const saveLesson = () => {
        let name = document.getElementById("inputname").innerText;
        if(name === "") toast.error("Bạn chưa nhập tên");
        else
        {
          lesson.content = document.querySelector(".ql-editor").innerHTML;
          lesson.video = document.getElementById("inputvideo").innerText;
          lesson.name = name;
          if(lesson.id!==-1)
          {
            lesson.content = document.querySelector(".ql-editor").innerHTML;
              axios.put(host + "lessons/" + id + "?key=" + key(), lesson)
              .then((result) => {
              setLesson(result.data);
              toast.success("Lưu dữ liệu thành công");
              console.log(result.data);
              })
              .catch((err) => {
                  toast.error(""+err);
              });
          }else{
              lesson.content = document.querySelector(".ql-editor").innerHTML;
              axios.post(host + "lessons?key=" + key(), lesson)
              .then((result) => {
                  setLesson(result.data);
                  navigate(`/courses/${nameCoures}/${result.data.id_course}?lesson=${result.data.name.replaceAll(" ","-").replaceAll("?","")}&id=${result.data.id}`);
                  toast.success("Thêm dữ liệu thành công"); 
                  axios.get(host + `lessons?id_course=${lesson.id_course}&key=${key()}`)
                  .then((result) => {setLessons(result.data);})
                  .catch((err) => {toast.error("" + err);}); 
                  setSearch({id:result.data.id});          
              })
              .catch((err) => {
                  toast.error(""+ err);
              })
          }
        }
    }
    const like =()=>{
        setmyLike(true);
        axios.post(host+"lessons/like?key="+key(),{
            id: lesson.id
        })
        .then((result) => {
            if(result.data.messen==="require")
            {
                toast.error("Yêu cầu đăng nhập");
                setmyLike(false);
            }else
            setlikeNumber(result.data);
        }).catch((err) => {
            toast.error(""+err)
            setmyLike(false);
        });
    }
    const unlike=()=>{
        setmyLike(false);
        axios.post(host+"lessons/unlike?key="+key(),{
            id: lesson.id
        })
        .then((result) => {
            if (result.data.messen === "require") {
                toast.error("Yêu cầu đăng nhập");
                setmyLike(true);
            }else 
            setlikeNumber(result.data);
        }).catch((err) => {
            toast.error(""+err)
            setmyLike(true);
        });
    }
    const deleteLesson = () =>{
        axios.delete(host + "lessons/" + id + "?key=" + key())
        .then((result) => {
            setLessons(result.data);
            toast.success("Xóa dữ liệu thành công");
            navigate(`/courses/${nameCoures}/${lesson.id_course}`);
            setSearch({ id: result.data[0].id });
            setConfirm(false);
        }).catch((err) => {
            toast.err(""+err);
        });
    }

    return lesson.id === undefined ? (
      <Load />
    ) : (
      <div className="container mx-0 mx-lg-3 mt-3">
        {confirm ? (
          <Modal>
            <div>
              Xác nhận xóa bài học <b>{lesson.name}</b>
            </div>
            <div className="mt-2 d-flex justify-content-around">
              <div onClick={deleteLesson} className="btn btn-danger">
                Xóa
              </div>
              <div
                onClick={() => setConfirm(false)}
                className="btn btn-primary"
              >
                hủy
              </div>
            </div>
          </Modal>
        ) : (
          ""
        )}
        <div className="row flex-column-reverse flex-md-row ">
          <div className="mt-4 ml-md-3 d-flex flex-row flex-md-column justify-content-around justify-content-md-start">
            <div className="d-flex  flex-row flex-md-column ">
              {myLike ? (
                <i
                  onClick={unlike}
                  className="fi clickIn fs-3 mr-1 mr-md-0 fi-sr-heart"
                  style={{ color: "#f13535", cursor: "pointer" }}
                />
              ) : (
                <i
                  onClick={like}
                  className="fi clickOut fs-3 mr-1 mr-md-0 fi-rr-heart"
                  style={{ color: "#f13535", cursor: "pointer" }}
                />
              )}

              <span style={{ color: "#f13535", textAlign: "center" }}>
                {likeNumber}
              </span>
            </div>
            <div
              onClick={() => setComment(!comment)}
              className="d-flex flex-row flex-md-column"
            >
              <i
                className="fi fi-rr-comment fs-3 mt-md-3 mr-1 mr-md-0"
                style={{ color: "var(--dark)", cursor: "pointer" }}
              />
              <span style={{ color: "var(--dark)", textAlign: "center" }}>
                {cmt}
              </span>
            </div>
          </div>

          <div
            style={{ flex: 1 }}
            className="d-flex flex-column mx-md-5 position-relative"
          >
            {admin ? (
              <div
                className="row justify-content-end mb-3 mx-2"
                style={{ overflow: "hidden" }}
              >
                <div
                  onClick={saveLesson}
                  title="Lưu bài học"
                  className="btn btn-primary animate__animated animate__fadeInDown animate__faster"
                >
                  <i className="fi fi-rr-disk d-inline d-sm-none d-md-inline" />{" "}
                  <span className="d-none d-sm-inline">
                    {lesson.id === -1 ? "Lưu mới" : "Lưu lại"}
                  </span>
                </div>
                {lesson.id !== -1 ? (
                  <>
                    <div
                      title="Thêm mới"
                      onClick={createLesson}
                      className="btn btn-primary ml-1 animate__animated animate__fadeInDown animate__faster"
                      style={{ animationDelay: ".1s" }}
                    >
                      <i className="fi fi-rr-add d-inline d-sm-none d-md-inline" />{" "}
                      <span className="d-none d-sm-inline">Thêm mới</span>
                    </div>
                    <div
                      onClick={() => setChange((e) => (e === id ? -1 : id))}
                      title="thay doi vi tri"
                      className="btn btn-primary ml-1 animate__animated animate__fadeInDown animate__faster"
                      style={{ animationDelay: ".2s" }}
                    >
                      <i className="fi fi-rr-apps-sort d-inline d-sm-none d-md-inline" />{" "}
                      <span className="d-none d-sm-inline">Vị trí</span>
                    </div>
                    <div
                      onClick={() => setConfirm(true)}
                      title="Xóa bài học"
                      className="btn btn-danger ml-1 animate__animated animate__fadeInDown animate__faster"
                      style={{ animationDelay: ".3s" }}
                    >
                      <i className="fi fi-rr-cross-circle d-inline d-sm-none d-md-inline" />{" "}
                      <span className="d-none d-sm-inline">Xóa</span>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            {admin ? (
              <div className="text-uppercase position-relative">
                {admin ? <h5 className="my-0">Tên bài học</h5> : ""}
                <div
                  contentEditable={admin}
                  id="inputname"
                  className={
                    "form-control w-100 text-uppercase fs-3 mb-5 " +
                    (admin ? " mt-1" : " text-center mt-4")
                  }
                  dangerouslySetInnerHTML={{ __html: lesson.name }}
                  style={{ color: "#007bff", fontWeight: "700" }}
                />
              </div>
            ) : (
              <div
                className="text-uppercase fs-3 mb-5 mt-4 text-center"
                style={{ color: "#007bff", fontWeight: "700" }}
              >
                {lesson.name}
              </div>
            )}
            {admin ? <h5 className="my-0 text-uppercase">Tên bài học</h5> : ""}
            <div className={!admin ? "d-none" : "d-flex mb-1"}>
              <div
                id="inputvideo"
                contentEditable={admin}
                className="form-control flex-fill"
                dangerouslySetInnerHTML={{ __html: lesson.video }}
              />
              <div
                onClick={() => {
                  lesson.video =
                    document.getElementById("inputvideo").innerText;
                  setLesson({ ...lesson });
                }}
                className="btn btn-primary ml-2"
              >
                Load Video
              </div>
            </div>
            {lesson.video !== "" ? (
              <div className="px-2">
                <div className="embed-responsive embed-responsive-16by9 mb-3">
                  <iframe
                    className="embed-responsive-item"
                    src={
                      "https://www.youtube.com/embed/" +
                      lesson.video
                        .replace("https://youtu.be/", "")
                        .replace("https://www.youtube.com/watch?v=", "")
                    }
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="mb-3" />
            )}
            <div>
              <ReactQuill
                className={(admin ? "focus" : "") + " active"}
                placeholder={admin?"Enter content":"Yêu cầu đăng nhập..."}
                theme="bubble"
                readOnly={!admin}
                value={lesson.content ?? ""}
                modules={{
                  toolbar: [
                    ["bold", "italic", { size: ["small", false, "large"] }],
                    ["link", "image", "blockquote", "code-block"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { align: [] },
                      { script: "sub" },
                      { script: "super" },
                    ],
                    [
                      {
                        color: [
                          "#007bff",
                          "#ffc107",
                          "#28a745",
                          "#6c757d",
                          "#dc3545",
                          "#000000",
                          "#f8f9fa",
                        ],
                      },
                      {
                        background: [
                          "#000000",
                          "#f8f9fa",
                          "#007bff",
                          "#ffc107",
                          "#28a745",
                          "#6c757d",
                          "#dc3545",
                        ],
                      },
                    ],
                    ["clean"],
                  ],
                  syntax: {
                    highlight: (text) => hljs.highlightAuto(text).value,
                  },
                }}
              />
            </div>
          </div>
        </div>
        {regis ? (
          <Exercise admin={admin} id_lesson={id} id_course={idCourse} />
        ) : (
          ""
        )}
      </div>
    );
}
