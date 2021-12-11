import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Load from '../../Error/Load';
import { host, imgurl, key } from './../../Static';
import './blog.css';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import hljs from 'highlight.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Comment from '../Courses/Lesson/Comment';
import ListView from './../Component/ListView';
import Modal from '../Component/Modal';
import { useRef } from 'react';
hljs.configure({
  languages: ["javascript", "cpp", "python", "java"],
});

export default function BlogAction({user}) {
    const {name, id} = useParams();
    const [blog, setBlog] = useState("");
    const [edit, setEdit] = useState(false);
    const [mylike, setmyLike] = useState(false);
    const [likeNumber, setlikeNumber] = useState(0);
    const [cmt, setCmt] = useState(0);
    const [comment, setComment] = useState(false);
    const [newBlog, setNewBlog] = useState([]);
    const [modal, setModal] = useState(false);
    const [view, setView] = useState(0);
    const check = useRef()
    const navi = useNavigate();
    useEffect(() => {
        if(name !== "action")
        {
            axios.get(host+"blogs/"+id)
            .then((result) => {
              setBlog(result.data.blog);
              setmyLike(result.data.blog.mlike);
              setlikeNumber(result.data.blog.like); 
              setCmt(result.data.blog.cmt);
              setNewBlog(result.data.new);
              setView(result.data.blog.view);
              check.current = setTimeout(() => {
                axios
                  .get(host + "blogs/view/" + result.data.blog.id)
                  .then((result) => {
                    setView(result.data);
                  })
           }, 120000)
            }).catch()
        }
        else{
          setBlog({
            img:"",
          });
          setEdit(true);
        }
    }, [id, name])

    const like = () => {
      setmyLike(true);
      axios
        .post(host + "blogs/like?key=" + key(), {
          id: blog.id,
        })
        .then((result) => {
          if (result.data.messen === "require") {
            toast.error("Yêu cầu đăng nhập");
            setmyLike(false);
          } else setlikeNumber(result.data);
        })
        .catch((err) => {
          toast.error("" + err);
          setmyLike(false);
        });
    };
    const unlike = () => {
      setmyLike(false);
      axios
        .post(host + "blogs/unlike?key=" + key(), {
          id: blog.id,
        })
        .then((result) => {
          if (result.data.messen === "require") {
            toast.error("Yêu cầu đăng nhập");
            setmyLike(true);
          } else setlikeNumber(result.data);
        })
        .catch((err) => {
          toast.error("" + err);
          setmyLike(true);
        });
    };

    const setImgEdit = (e) => {
      if (e.target.files.length !== 0) {
        let fileRead = new FileReader();
        fileRead.readAsDataURL(e.target.files[0]);
        fileRead.onload = () => {
          blog.img = (fileRead.result);
          setBlog({...blog});
        };
      }
    };
    const setEditData=()=>
    {
      if(edit)
      {
        setBlog("");
        setEdit(false);
        axios.get(host+"blogs/"+id)
        .then((result) => {
        setBlog(result.data.blog);
        }).catch((err) => {})
      }else{
        setEdit(true);
      }
    }
    const setDataBlog = (id_blog)=>{
        setBlog("");
        setEdit(false);
        axios.get(host+"blogs/"+id_blog)
        .then((result) => {
          setBlog(result.data.blog);
          setmyLike(result.data.blog.mlike);
          setlikeNumber(result.data.blog.like);
          setCmt(result.data.blog.cmt);
          setNewBlog(result.data.new);
        }).catch()
    }
    const Save = () =>{
      
      if(name==="action")
      {
          let nameBlog = document.getElementById("name");
          let editer = document.querySelector(".ql-editor");
          if (blog.img === "") toast.error("Chưa chọn hình ảnh nào");
          else if (nameBlog.value === "") toast.error("Chưa nhập tên bài blog");
          else if (editer.innerText === "") toast.error("Chưa nhập nội dung bài blog");
          else{
            axios.post(host+"blogs",{
              name: nameBlog.value,
              content: editer.innerHTML,
              description: editer.innerText.substr(0,160)+"...",
              img: blog.img,
              id_user: user.id
            })
            .then(() => {
              toast.success("Thêm bài viết Thành công");
              navi("/blogs");
            }).catch((err) => {
              toast.error(""+err);
            });
          }

      }else
      {
        setBlog("");
        axios.put(host+`blogs/${blog.id}`,{
          name: document.getElementById("name").value,
          content: document.querySelector(".ql-editor").innerHTML,
          description: document.querySelector(".ql-editor").innerText.substr(0,160)+"...",
          img: blog.img,
          id_user: user.id
        })
        .then((result) => {
          setBlog(result.data);
          toast.success("Chỉnh sửa bài viết thành công!");
          
        }).catch((err) => {toast.success(""+err)});
      }

    }
    const deleteBlog = () =>{
      axios.delete(host+`blogs/${blog.id}`)
      .then(() => {
        toast.success(<>Xóa Bài Blog <b>"{blog.name}"</b> thành công</>)
      }).catch(() => {
        toast.error(<>Xóa Bài Blog <b>"{blog.name}"</b> thất bại</>)
      });
    }
    return blog === "" ? (
      <Load />
    ) : (
      <div className="container-fluid">
        {modal ? (
          <Modal>
            <div>
              Bạn có thực sự muốn xóa bài Blog <strong>{blog.name}</strong>
            </div>
            <div className="d-flex mt-2 justify-content-around">
              <Link
                to={"/blogs"}
                onClick={deleteBlog}
                className="btn btn-danger"
              >
                Xóa
              </Link>
              <div onClick={() => setModal(false)} className="btn btn-primary">
                Hủy
              </div>
            </div>
          </Modal>
        ) : (
          ""
        )}
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-9 col-lg-8">
            <h1 className="text-center text-uppercase text-primary my-5">
              {blog.name}
            </h1>
            {edit ? (
              <div className="d-flex justify-content-end my-1">
                <div onClick={Save} className="btn btn-primary">
                  {name === "action" ? (
                    <i className="fi fi-rr-paper-plane mr-1" />
                  ) : (
                    <i className="fi fi-rr-disk mr-1" />
                  )}
                  <span className="d-none d-sm-inline">
                    {name === "action" ? "Tạo bài viêt" : "Lưu thay đổi"}
                  </span>
                </div>
                <label htmlFor="setImg" className="btn btn-primary ml-1">
                  <i className="fi fi-rr-picture mr-1" />
                  <span className="d-none d-sm-inline">Tải ảnh</span>
                  <input hidden type="file" id="setImg" onChange={setImgEdit} />
                </label>
                {name === "action" ? (
                  <Link to="/blogs" className="btn btn-danger ml-1">
                    <i className="fi fi-rr-cross-circle mr-1" />
                    <span className="d-none d-sm-inline">Hủy</span>
                  </Link>
                ) : (
                  <div
                    onClick={() => setModal(true)}
                    className="btn btn-danger ml-1"
                  >
                    <i className="fi fi-rr-cross-circle mr-1" />
                    <span className="d-none d-sm-inline">Xóa</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <Link
                    title="Bài viết cùng tác giả"
                    to={`/blogs?name=${blog.user.name}&tool=search&id=${blog.user.id}`}
                    className={edit ? "d-none" : "d-block ml-3"}
                  >
                    <div className="d-flex">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          style={{
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "50%",
                          }}
                          src={imgurl(blog.user.avata)}
                          alt=""
                        />
                        <div className="mx-2">
                          <div>
                            <strong>{blog.user.name}</strong>
                          </div>
                          <div style={{ fontSize: ".8rem", color: "#ccc" }}>
                            <i className="fi fi-rr-clock" /> {blog.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="fs-5 mr-4" style={{ cursor: "pointer" }}>
                    <i
                      onClick={() => (mylike ? unlike() : like())}
                      className={
                        "fi mr-1" +
                        (mylike
                          ? " fi-sr-heart text-danger animate__animated animate__faster animate__bounceIn"
                          : " fi-rr-heart")
                      }
                    />
                    <span>{likeNumber}</span>
                  </div>
                </div>
                <hr />
              </>
            )}

            <div className="d-flex align-items-center">
              {edit ? (
                <div className="flex-fill mb-2">
                  <div className="my-2">
                    <strong>Tên bài Blog</strong>
                  </div>
                  <input
                    id="name"
                    accept="image/*"
                    className="form-control w-100"
                    defaultValue={blog.name}
                    placeholder="Nhập Tên bài Blog"
                  />
                </div>
              ) : (
                <div>
                  <span>Bài viết:</span> <strong>{blog.name}</strong>
                </div>
              )}
            </div>
            {name === "action" ? (
              ""
            ) : (
              <div className="my-3" style={{ color: "#aaa" }}>
                <i>
                  <u>Tóm tắt:</u> {blog.description}
                </i>
              </div>
            )}
            <div
              className={
                "position-relative img-load shadow" +
                (blog.img === "" ? " d-none" : "")
              }
              style={{
                paddingTop: "60%",
                borderRadius: ".5rem",
                backgroundImage: "url(" + blog.img + ")",
              }}
            >
              {name === "action" ? (
                <i
                  onClick={() => {
                    blog.img = "";
                    setBlog({ ...blog });
                  }}
                  className="position-absolute fi fi-sr-cross-circle fs-3 text-danger"
                  style={{ top: "1rem", right: "1rem", cursor: "pointer" }}
                />
              ) : (
                ""
              )}
            </div>
            <hr />
            <h4>Nội dung bài viết</h4>
            <ReactQuill
              className={edit ? "" : "edit"}
              readOnly={!edit}
              modules={{
                toolbar: [
                  ["bold", "italic", { size: ["small", false, "large"] }],
                  ["link", "image", "code-block", { align: [] }],
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
                      background: ["#000000", "#f8f9fa"],
                    },
                  ],
                  ["clean"],
                ],
                syntax: {
                  highlight: (text) => hljs.highlightAuto(text).value,
                },
              }}
              style={{ zIndex: 3000 }}
              theme={edit ? "snow" : "bubble"}
              placeholder="Nhập nội dung bài blog..."
              defaultValue={blog.content}
            />
            {name === "action" ? (
              ""
            ) : (
              <>
                <div className="my-3 mx-1 mr-sm-4 d-flex align-items-center justify-content-end">
                  <i className="fi fi-rr-eye mr-2" />{" "}
                  <span>{view} Lượt xem</span>
                </div>
                <hr />
                <Comment
                  id_lesson={blog.id}
                  cmt={cmt}
                  setcmt={setCmt}
                  user={user}
                  admin={user.type === 1}
                  comment={comment}
                  type="blog"
                  setComment={setComment}
                />
                <div className="my-4">
                  <h3>Bài Blog mới nhất</h3>
                  <ListView>
                    {newBlog.map((e, i) => (
                      <div
                        key={i}
                        className="d-flex align-content-center justify-content-center shadow"
                        style={{
                          borderRadius: "1rem",
                          background: " url(" + e.img + ")",
                          backgroundPosition: "center center",
                          backgroundSize: "cover",
                          padding: "20% 0",
                        }}
                      >
                        <Link
                          to={
                            "/blogs/" +
                            (e.name + "").replaceAll(/ |\?/gm, "-") +
                            "/" +
                            e.id
                          }
                          onClick={() => setDataBlog(e.id)}
                          className="w-100"
                          style={{ background: "#000c" }}
                        >
                          <div className="text-center text-white mx-3 fs-2 pt-3">
                            {e.name}
                          </div>
                          <div className="mx-5 text-center text-white">
                            <small style={{ opacity: ".8" }}>
                              <i className="fi fi-rr-clock mr-1" />
                              <i>{e.time}</i>
                            </small>
                          </div>
                          <div className="mx-5 text-center text-white pb-3">
                            {e.description}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </ListView>
                </div>
              </>
            )}
            <div className="mt-3 p-2 d-flex align-items-center flex-column text-white bg-primary">
              <div>Trần Thanh Khan - DTH185282</div>
              <div>
                Copyright <i className="fi fi-rr-copyright" /> - DH19TH2
              </div>
            </div>
            <div className="pb-5 pb-sm-0 bg-primary"></div>
          </div>
        </div>
        {name !== "action" ? (
          <div
            onClick={setEditData}
            className={
              "btn-admin d-flex align-items-center show-btn-admin" +
              (user.id === blog.user.id || user.type === 1 ? "" : " d-none")
            }
            style={{ background: "#0000" }}
          >
            <div
              className="position-absolute"
              style={{
                color: "#000",
                right: "calc(100% - 1rem)",
                width: "9em",
                overflow: "hidden",
              }}
            >
              <div
                className="px-4 py-2 position-relative show-title"
                style={{
                  top: "0",
                  transform: edit ? "translateX(100%)" : "",
                  background: "#eee",
                  whiteSpace: "nowrap",
                  borderRadius: "2rem 0 0 2rem",
                }}
              >
                Chỉnh sửa
              </div>
            </div>
            <div
              className={
                "rounded-pill d-flex align-items-center justify-content-center btn-create" +
                (edit ? " close" : "")
              }
              style={{ width: "3rem", height: "3rem", zIndex: 10 }}
            >
              {edit ? (
                <i className="fi fi-sr-plus pt-1" />
              ) : (
                <i className="fi fi-rr-edit pt-1" />
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
}
