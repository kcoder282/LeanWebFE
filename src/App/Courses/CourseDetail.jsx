import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CourseDetail.css";
import { host, key } from "./../../Static";
import { toast } from 'react-toastify';
import Lesson from "./Lesson";
import Modal from './../Component/Modal';
import Comment from "./Lesson/Comment";
import Topic from './../Topics/Topic';

export default function CourseDetail({user}) {
    const { id,name } = useParams();
    const [lessons, setLessons] = useState([]);
    const [admin, setAdmin] = useState(false)
    const [search, setSearch] = useState(Object.fromEntries(new URLSearchParams(window.location.search)));
    const [change, setChange] = useState(-1);
    const [loadchange, setLoadChange] = useState(false);
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [idChange, setIdChange] = useState(-1);
    const [comment, setComment] = useState(false);
    const [cmt, setCmt] = useState(0);
    const [course, setCourse] = useState({});
    const [load, setLoad] = useState(false);
    const navi = useNavigate();

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
        axios.get(host+`courses/${id}?key=`+key())
        .then((result) => {
          setCourse(result.data);
        })
      }, [id])
    const changeIndex = (id) =>{
      if(change===id) setChange(-1);   
      setModal(true);
      setIdChange(id);
    }
    const regis = () => {
      setLoad(true);
      axios
        .post(host + "regis/" + course.id + "?key=" + key())
        .then((result) => {
          toast.success("Đăng ký thành công");
          course.regis=true;
          setCourse({...course});
        }).finally(() => {setLoad(false);setModal(false)});
    }

    return (
      <div className="container-fluid">
      {modal1?
      <Modal>
        <div>
          Bạn thật sự muốn đăng ký khóa học này?
        </div>
        <div className="py-4 my-2 text-center rounded" style={{ background: "linear-gradient(145deg, " + course.color + ")", color: "#fff"}}>
          <h1 className="text-white">{course.keyWord}</h1>
        </div>
        <h4 className="my-0">{course.name}</h4>
        <div className="d-flex justify-content-around mt-3">
          <div onClick={user.id===undefined?navi("/login"):regis} className="btn btn-primary">
            {load?
              <span className="load mr-2">
                <i className="fi fi-rr-spinner"/>
              </span>:
              <i className="fi fi-rr-e-learning mr-2"/>
            } 
            <span>Đăng ký</span>
          </div>
          <div onClick={()=>setModal(false)} className="btn " style={{background:'#555', color:'#fff'}}>
            <i className="fi fi-rr-cross-circle mr-2"/> 
            <span>Hủy</span>
          </div>
        </div>
      </Modal>:''}
        <div className="row pb-5 mb-5">
          <div className="col-lg-9 px-0">
          {search.id===undefined? <div className="row justify-content-center">
            <div className="col-11 col-sm-9 col-md-8">
              <Topic user={user} courses={[{id:1}]} select_course={id} show={true}/>
            </div>
          </div> :
          <Lesson setComment={setComment} comment={comment} setCmt={setCmt} cmt={cmt}
          idCourse={id} setChange={setChange} setSearch={setSearch}
          setLessons={setLessons} nameCoures={name} id={search.id} admin={admin}/>}
          </div>
          <div className="col-lg-3 d-flex flex-column-reverse flex-lg-column">
            <div>
              {course.regis===false?
              <div onClick={()=>setModal1(true)} className="p-3 rounded flex-fill shadow" style={{cursor:'pointer'}}>
                <i className="fi fi-rr-bookmark mr-2" />
                {course.price + "" === "0"
                  ? "Khóa học Miễn Phí"
                  : new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(course.price)}
              </div>:""}
            <h2 className="text-primary d-flex justify-content-between">
              <div><i className="fi fi-rr-list"/> List Lessons</div>
              <div onClick={()=>setSearch({})}>
                <Link title="Chủ đề thảo luận: " to={`/courses/${name}/${id}`}>
                  <i className="fi fi-rr-interrogation"/>
                </Link>
              </div>
            </h2>

            {change!==-1?<>Thay đổi vị trí với bài </>:""}
            {admin?
            <div onClick={()=>{change===-1?setSearch({id: -1}):changeIndex(-1); window.scrollTo(0, 0);}}>
                <Link to={window.location.pathname+"?lesson=Them-Bai-Viet-Moi&id="+(-1)} 
                title="Thêm bài viết mới" 
                className={"position-relative lesson d-flex "+(search.id===-1?'active':'')}>
                  {change!==-1?<i className="fi fi-rr-apps-sort text-primary mr-2"/>:''}
                  <div style={{overflow:"hidden",textOverflow:'ellipsis',whiteSpace: 'nowrap', flex: 1}}>
                    <i className="fi fi-rr-plus-small mr-2"/>
                    <span>Thêm bài viết mới</span></div>
                </Link>
              </div>
            :''}
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
            {search.id!==undefined?
            <Comment id_lesson={search.id}
            cmt={cmt}
            setcmt={changeData}
            user={user} admin={admin}
            comment={comment}
            setComment={setComment}/>:''}         
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
