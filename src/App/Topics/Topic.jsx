import { useState, useEffect } from "react";
import axios from 'axios';
import { host, imgurl, key } from "./../../Static";
import './index.css'
import ImgView from "../Component/ImgView"; 
import Load from './../../Error/Load';
import { toast } from 'react-toastify';
import CommentConteiner from "./CommentConteiner";
import { Link } from "react-router-dom";
import Modal from './../Component/Modal';


export default function Topic({user, courses, select_course='*', show = false}) {
    const [admin, setAdmin] = useState(false);
    const [name, setName] = useState("");
    const [course, setcourse] = useState({});
    const [select, setSelect] = useState(false)
    const [img, setImg] = useState([]);
    const [topics, setTopics] = useState([]);
    const [load, setLoad] = useState(true);
    const [paginate, setPaginate] = useState({});
    const [send, setSend] = useState(false);
    const [loadSend, setLoadSend] = useState(false);
    const [Delete, setDelete] = useState([]);

    const like=(id, index)=>{
        topics[index].mlike = true;
        setTopics([...topics]);
        axios.post(host+"topics/like?key="+key(),{
            id: id
        })
        .then((result) => {
            if(result.data==="require")
            {
              toast.error("Yêu cầu đăng nhập");
              topics[index].mlike = false;
              setTopics([...topics]);
            }else{
              topics[index].like = result.data;
              setTopics([...topics])
            }
        }).catch((err) => {
            toast.error(""+err)
        });
    }

    const unlike=(id, index)=>{
        axios.post(host+"topics/unlike?key="+key(),{
            id: id
        })
        .then((result) => {
            if (result.data === "require") {
                toast.error("Yêu cầu đăng nhập");
            }else 
            {
              topics[index].like = result.data;
              topics[index].mlike = false;
              setTopics([...topics]);
            }
        }).catch((err) => {
            toast.error(""+err)
        });
    }

    useEffect(() => {
      let data = host + "topics?key=" + key();
      if (select_course !== "*")
        data = host + "topics?key=" + key() + "&course=" + select_course;
      setLoad(true);
      axios.get(data)
      .then((result) => {
        setTopics(result.data.topics);
        setPaginate(result.data.paginate);
        if(select_course!=="*" && show)
        {
          setcourse(courses.find((item) => item.id === parseInt(select_course)));
        }else{
          setcourse(courses[0]);
        }
      }).catch().finally(()=>setLoad(false));
    }, [courses, select_course, show]);

    const senData = ()=>{
        setLoadSend(true);
        axios.post(host+"topics?key="+key(),{
            content: name,
            id_course: course.id,
            img: img
        }).then((result) => {
            clearData();
            topics.unshift(result.data);
            setTopics([...topics])
            toast.success("Thêm topic thành công");
        }).finally(()=>setLoadSend(false));
    }

    const clearData = () =>{
        setName("");
        setcourse(courses[0]);
        setImg([]);
        setSend(false);
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

    const nextview = ()=>{
      setLoad(true);
      axios.get(paginate.next_page_url + "&key=" + key())
       .then((result) => {
          topics.push(...result.data.topics);
          setTopics([...topics]);
          setPaginate(result.data.paginate);
       }).catch().finally(()=>setLoad(false));
    }

    const deletetopic =(id,index)=>{
      topics[index].delete=true;
      setTopics([...topics])
      axios.delete(host + "topics/" + id + "?key=" + key())
      .then(() => {
        let list = [];
        topics.forEach((data,i)=>{if(index!==i)list.push(data)})
        setTopics(list)
        toast.success("Xoa Thanh Cong");
      }).catch(()=>{
        topics[index].delete = undefined;
        setTopics([...topics]);
        toast.error("Xoa That Bai");
      });
    }

    return (
      <div className="w-100">
        {Delete.length>0?
          <Modal>
            <div>Bạn thật sự muốn <b>Xóa</b> chủ đề này </div>
            <div className="d-flex justify-content-around mt-2">
              <div onClick={()=>deletetopic(...Delete)} className="btn btn-danger">
                <i className="fi fi-rr-cross-circle"/> Xóa
              </div>
              <div onClick={()=>setDelete([])} className="btn btn-primary">
                <i className="fi fi-rr-cross-circle"/> Hủy
              </div>
            </div>
          </Modal>
        :''}
        <div className="d-flex justify-content-center">
          <div className="w-100">
            {user.id===undefined?"":
            <div
              className="mt-4 shadow p-2 d-flex align-items-start"
              style={{ borderRadius: ".5rem " }}
            >
              <img
                className="mx-2 shadow"
                src={imgurl(user.avata)}
                alt=""
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  outline: "5px solid #fff",
                }}
              />
              <div
                contentEditable={true}
                onBlur={(e) => {
                  e.target.innerText === ""
                    ? clearData()
                    : setName(e.target.innerText);
                }}
                onClick={() => setSend(true)}
                style={{ cursor: "pointer" }}
                dangerouslySetInnerHTML={{
                  __html: !send
                    ? "<i style={{color:'#555'}}>Tạo chủ đề của bạn</i>"
                    : name,
                }}
                type="text"
                className="form-control ml-2 w-100"
                placeholder="Tạo chủ đề của bạn"
              />
              {send ? (
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
                    {loadSend ? (
                      <span className="load">
                        <i className="fi fi-rr-spinner" />
                      </span>
                    ) : (
                      <i className="fi fi-rr-paper-plane" />
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
            </div>}
            {send ? (
              <div
                className="mt-2 bg-white shadow p-2 animate__animated animate__fadeInUp animate__faster position-relative"
                style={{ borderRadius: ".5rem ", zIndex: 100 }}
              >
                {show?"":<div className="d-flex align-items-center">
                  <div className="ml-3 mr-2" style={{ whiteSpace: "nowrap" }}>
                    Khóa học
                  </div>
                  <div className=" position-relative" style={{ flex: 1 }}>
                    <div className="d-flex align-items-center position-relative">
                      <div
                        onClick={(e) => setSelect(!select)}
                        type="text"
                        className="form-control w-100"
                        readOnly={true}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="d-inline d-sm-none">
                          {(course.name + "").substring(0, 20)}
                        </span>
                        <span className="d-none d-sm-inline">
                          {course.name}
                        </span>
                        <b
                          className="d-none ml-2 d-sm-inline-block px-2 rounded"
                          style={{
                            color: "#fff",
                            background:
                              "linear-gradient(45deg, " + course.color + ")",
                          }}
                        >
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
                        zIndex: 2000,
                        borderRadius: ".5rem",
                        overflow: "hidden",
                      }}
                    >
                      {select
                        ? courses.map((e) => (
                            <div key={e.id}
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
                                      "linear-gradient(45deg, " + e.color + ")",
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
                </div>}
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
              className="bg-white mt-4 position-relative"
              style={{ zIndex: 0 }}
            >
              {topics.map((e, i) => (
                <div
                  key={i}
                  className="shadow bg-white mt-3 position-relative"
                  style={{ borderRadius: ".5rem " }}
                >
                  <div className="p-3">
                    <div className="row flex-fill align-items-start">
                      <div className="col-md-6 d-flex align-items-center">
                        <img
                          className="mr-1"
                          src={imgurl(e.user.avata)}
                          alt=""
                          style={{
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "50%",
                          }}
                        />
                        <div>
                          <b className="text-primary">{e.user.name}</b>
                          <div style={{ fontSize: ".8rem", color: "#1115" }}>
                            <i className="fi fi-rr-clock mr-1" />
                            <span>{e.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex">
                        <Link
                          className="d-flex justify-content-end flex-fill align-items-start"
                          to={`/courses/${(e.course.name + "").replaceAll(
                            / |\?/gm,
                            "-"
                          )}/${e.course.id}`}
                        >
                          <small className="d-none d-sm-inline">
                            {e.course.name}
                          </small>

                          <small
                            title={e.course.name}
                            className="d-inline d-sm-none"
                          >
                            {e.course.name.substring(0, 20)}...
                          </small>
                          <b
                            className="d-inline-block d-sm-none ml-2 d-md-inline-block px-2 rounded"
                            style={{
                              color: "#fff",
                              background:
                                "linear-gradient(45deg, " +
                                e.course.color +
                                ")",
                            }}
                          >
                            {e.course.key}
                          </b>
                        </Link>
                        {user.id === e.user.id || admin ? (
                          <i
                            onClick={() => setDelete([e.id, i])}
                            className="close-btn ml-2 fi fi-rr-cross-circle text-danger"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="mx-1 my-2">{e.content.content}</div>
                    <ImgView edit={false} listImg={e.content.img} />
                    <div className="mt-3 px-2 d-flex">
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "4rem", cursor: "pointer" }}
                      >
                        <i
                          onClick={() =>
                            e.mlike ? unlike(e.id, i) : like(e.id, i)
                          }
                          className={
                            "fi fs-4 mr-1 " +
                            (e.mlike
                              ? "fi-sr-heart text-danger animate__animated animate__faster animate__bounceIn"
                              : "fi-rr-heart")
                          }
                        ></i>
                        <span className="fs-5">{e.like}</span>
                      </div>
                      <div
                        onClick={() => {
                          topics.forEach((data, index) => {
                            index === i
                              ? data.checkcmt
                                ? (data.checkcmt = undefined)
                                : (data.checkcmt = true)
                              : (data.checkcmt = undefined);
                          });
                          setTopics([...topics]);
                        }}
                        className="d-flex align-items-center"
                        style={{ width: "4rem", cursor: "pointer" }}
                      >
                        <i
                          className={
                            "fi fs-4 mr-1 " +
                            (e.checkcmt ? "fi-sr-comment" : "fi-rr-comment")
                          }
                        ></i>
                        <span className="fs-5">{e.cmt}</span>
                      </div>
                    </div>
                    <div>
                      <CommentConteiner
                        setTopics={setTopics}
                        topics={topics}
                        index={i}
                        check={e.checkcmt}
                        id={e.id}
                        admin={admin}
                        user={user}
                        type="topic"
                      />
                    </div>
                  </div>
                  {e.delete ? (
                    <div className="delete-load">
                      <div className="text-white d-flex flex-column align-items-center">
                        <span>
                          <span className="load fs-4">
                            <i className="fi fi-rr-spinner" />
                          </span>
                        </span>
                        <span>Loading...</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
            {load ? (
              <div className="mb-5 pb-5">
                <div className="mb-5 mt-3">
                  <Load mini={true} />
                </div>
              </div>
            ) : (
              <div className="mb-5 pb-5 text-center">
                {paginate.next_page_url === null ? (
                  <div
                    className="shadow px-4 btn mt-3 mb-5 rounded-pill d-inline-flex align-items-center"
                    style={{
                      background: "var(--secondary)",
                      color: "#fff",
                      cursor: "no-drop",
                    }}
                  >
                    <i className="fi fi-sr-cross-small mr-1" />
                    <span>Không còn chủ đề nào</span>
                  </div>
                ) : (
                  <div
                    onClick={nextview}
                    className="shadow px-4 btn btn-primary mt-3 mb-5 rounded-pill d-inline-flex align-items-center"
                  >
                    <i className="fi fi-sr-interrogation mr-1" />
                    <span>Xem thêm</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className="btn-admin d-flex align-items-center"
            style={{ background: "#0000" }}
          >
            <div
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className="rounded-pill d-flex align-items-center justify-content-center"
              style={{ background: "#007bff", width: "2rem", height: "2rem" }}
            >
              <i className="fi fi-rr-angle-up" />
            </div>
            {user.type === 1 && !show ? (
              <div
                onClick={() => setAdmin(!admin)}
                className={
                  "ml-1 btn rounded-pill " +
                  (admin ? "btn-primary" : "btn-default")
                }
              >
                <i className="fi fi-rr-key " />
                <span className="d-none d-sm-inline">admin</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
}
