import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import './index.css';
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark-reasonable.css";
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

export default function Lesson({cmt ,idCourse, id, admin, nameCoures, setLessons, setSearch, setChange, comment, setComment}) {
    const [lesson, setLesson] = useState({});
    const [likeNumber, setlikeNumber] = useState(0);
    const [name, setName] = useState("");
    const [video, setVideo] = useState("");
    const content = useRef("");
    const [quill, setQuill] = useState(true);
    const [myLike, setmyLike] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [regis, setRegis] = useState(false);

    const check = useRef();
    let navigate = useNavigate();

    useEffect(() => {
       if(id!==undefined)
       axios.get(host+`lessons/${id}?key=${key()}`)
       .then((result) => {  
           content.current = result.data.content;      
           setLesson(result.data);
           setName(result.data.name);
           setVideo(result.data.video);
           content.current = result.data.content;
           setmyLike(result.data.mylike);
           setlikeNumber(result.data.like);
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
       return () => {
         clearTimeout(check.current);
       };
    }, [id, idCourse, setLessons])

   

    const createLesson = () =>{
        setName("");
        setVideo("");
        content.current="";
        setLesson({id:-1, name:"", content:'', video:'', id_course: lesson.id_course});
    }
    const saveLesson = () => {
        lesson.name = name;
        lesson.video = video;
        lesson.content = content.current;
        if(lesson.id!==-1)
        {
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
              Xác nhận xóa bài học <b>{name}</b>
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
            <div onClick={()=>setComment(!comment)} className="d-flex flex-row flex-md-column">
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
                <input
                  onFocus={() => setQuill(true)}
                  disabled={!admin}
                  type="text"
                  className="form-control text-center text-uppercase fs-3 mb-5 mt-4"
                  value={name}
                  placeholder="Enter name lesson"
                  onInput={(data) => {
                    setName(data.target.value);
                  }}
                  style={{ color: "#007bff", fontWeight: "700" }}
                />

                {lesson.name !== name ? (
                  <i
                    onClick={() => setName(lesson.name)}
                    className="position-absolute fi fi-rr-cross-circle fs-3 text-primary"
                    style={{ top: ".5rem", right: "1rem", cursor: "pointer" }}
                  />
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div
                className="text-uppercase fs-3 mb-5 mt-4 text-center"
                style={{ color: "#007bff", fontWeight: "700" }}
              >
                {name}
              </div>
            )}
            <div
              className={"position-relative " + (!admin ? "d-none" : "mt-3")}
            >
              <input
                onFocus={() => setQuill(true)}
                type="text"
                className="form-control"
                placeholder="Enter URL video or ID video..."
                value={video}
                onInput={(e) => setVideo(e.target.value)}
              />
              {lesson.video !== video ? (
                <i
                  onClick={() => setVideo(lesson.video)}
                  className="position-absolute fi fi-rr-cross-circle text-primary"
                  style={{ top: ".5rem", right: "1rem", cursor: "pointer" }}
                />
              ) : (
                ""
              )}
            </div>
            {video !== "" ? (
              <div className="px-2">
                <div className="embed-responsive embed-responsive-16by9 mb-3">
                  <iframe
                    className="embed-responsive-item"
                    src={
                      "https://www.youtube.com/embed/" +
                      video
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
              {quill ? (
                <div
                  onClick={() => (admin ? setQuill(false) : {})}
                  className={"quill admin " + (admin ? "focus" : "")}
                >
                  <div className="ql-container ql-bubble">
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{ __html: content.current }}
                    />
                  </div>
                </div>
              ) : (
                <ReactQuill
                  className={(admin ? "focus" : "") + " active"}
                  placeholder="Enter content"
                  theme="bubble"
                  readOnly={!admin}
                  defaultValue={content.current}
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
                  onChange={(e) => {
                    content.current = e;
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {regis?<Exercise admin={admin} id_lesson={id} id_course={idCourse} />:''}
      </div>
    );
}
