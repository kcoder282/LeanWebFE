import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CourseDetail.css";
import { host, key } from "./../../Static";
import { toast } from 'react-toastify';
import Lesson from "./Lesson";
import Modal from './../Component/Modal';
import Comment from "./Lesson/Comment";

export default function CourseDetail({user}) {
    const { id,name } = useParams();
    const [lessons, setLessons] = useState([]);
    const [admin, setAdmin] = useState(false)
    const [search, setSearch] = useState(Object.fromEntries(new URLSearchParams(window.location.search)));
    const [change, setChange] = useState(-1);
    const [loadchange, setLoadChange] = useState(false);
    const [modal, setModal] = useState(false);
    const [idChange, setIdChange] = useState(-1);
    const [comment, setComment] = useState(false);
    const [cmt, setCmt] = useState(0);
    const changeData = (number)=>{
      setCmt(number);
    }
    const execChangeIndex = () =>{
      setLoadChange(true);
      axios.post(host + "lessons/change?key="+key(),{
        id1: change,
        id2:idChange
      }).then((result) => {
        setLoadChange(false);
        setIdChange(-1);
        setChange(-1);
        setModal(false);
        setLessons(result.data);
        toast.success("Thay đổi vị trí thành công");
      }).catch((err) => {
        toast.err(""+err);
      });;
    }
    useEffect(() => {
        axios.get(host + `lessons?id_course=${id}&key=${key()}`)
        .then((result) => {
          setLessons(result.data);
        }).catch((err) => {
          toast.error("" + err);
        });
      }, [id])
    const changeIndex = (id) =>{
      if(change===id) setChange(-1);   
      setModal(true);
      setIdChange(id);
    }
    return (
      <div className="container-fluid">
        <div className="row pb-5 mb-5">
          <div className="col-lg-9 px-0">
          {search.id===undefined?'topics':
          <Lesson setComment={setComment} comment={comment}
          cmt={cmt} idCourse={id} setChange={setChange} setSearch={setSearch}
          setLessons={setLessons} nameCoures={name} id={search.id} admin={admin}/>}
          </div>
          <div className="col-lg-3 d-flex flex-column-reverse flex-lg-column">
            <div>
            <h2 className="text-primary d-flex justify-content-between">
              <div><i className="fi fi-rr-list"/> List Lessons</div>
              <div onClick={()=>setSearch({})}>
                <Link title="Chủ đề thảo luận: " to={`/courses/${name}/${id}`}>
                  <i className="fi fi-rr-interrogation"/>
                </Link>
              </div>
            </h2>
            {change!==-1?<>Thay đổi vị trí với bài </>:""}
            {
              lessons.map((e,i)=>
              <div key={i}  onClick={()=>{change===-1?setSearch({id: e.id}):changeIndex(e.id); window.scrollTo(0, 0);}}>
                <Link to={window.location.pathname+"?lesson="+e.name.replaceAll(/ |\?/g,'-')+"&id="+e.id} 
                title={`Bài ${i+1}: ${e.name}`} 
                // eslint-disable-next-line eqeqeq
                className={"position-relative lesson d-flex "+(search.id==e.id?'active':'')}>
                  {change!==-1?<i className="fi fi-rr-apps-sort text-primary mr-2"/>:''}
                  <div style={{overflow:"hidden",textOverflow:'ellipsis',whiteSpace: 'nowrap', flex: 1}}>Bài {i+1}: {e.name}</div>
                  {e.check?<i className="fi fi-rr-check animate__animated animate__bounceIn animate__faster" style={{color: 'var(--success)'}}/>:''}
                </Link>
              </div>
              )
            }
            </div>
            {search.id!==undefined?<Comment id_lesson={search.id}
            cmt={cmt}
            setcmt={changeData}
            user={user} admin={admin}
            comment={comment} setComment={setComment}/>:''}         
          </div>
        
          {user.type===1?
          <div onClick={() => setAdmin(!admin)}
            className={"btn btn-admin rounded-pill " + (admin ? "btn-primary" : "")}>
              <i className="fi fi-rr-key" />{" "}
              <span className="d-none d-sm-inline">admin</span>
          </div>:''}

      </div>
      {modal?<Modal>
          <div>
            Bạn thực sự muốn thay đổi vị trí của 2 bài học
          </div>
          <div className="d-flex justify-content-around">
            <div className="btn btn-primary" onClick={execChangeIndex}>
              {loadchange?<span className="load ml-1"><i className="fi fi-rr-spinner" /></span>:''} Thay đổi
            </div>
            <div className="btn btn-primary" onClick={()=>{setChange(-1);setModal(false);setIdChange(-1);setChange(-1)}}>
              Hủy
            </div>
          </div>
      </Modal>:''}
      </div>
    );
}
