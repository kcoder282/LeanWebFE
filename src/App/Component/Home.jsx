import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Load from '../../Error/Load';
import { host, key } from './../../Static';
import ListView from './ListView';
import './cube.css'

export default function Home({user}) {
    const [load, setLoad] = useState(false);
    const [data, setData] = useState({});
    useEffect(() => {
        axios.get(host+"home")
        .then((result) => {
            console.log(result.data);
            setData(result.data);
        }).catch((err) => {
            toast.error(err+"");
        })
        return () => setData({});
    }, [])
    const upData=()=>{
        setLoad(true);
        axios
          .post(host + "home?key=" + key(), {
            name: document.querySelector("#name").innerText,
            content: document.querySelector("#content").innerHTML,
            content1: document.querySelector("#content1").innerHTML,
            content2: document.querySelector("#content2").innerHTML,
            email: document.querySelector("#email").innerText,
            sdt: document.querySelector("#sdt").innerText,
          })
          .then((e) => {
            toast.success("Lưu Thành Công");
          })
          .catch(() => {
            toast.error("Lưu thất bại");
          })
          .finally(() => setLoad(false));

    }
    return data.content===undefined?
    <Load/>:(
    <div className='container' style={{overflow:'hidden'}}>
        <div id="name" contentEditable={user.type===1} dangerouslySetInnerHTML={{__html:data.content.name}} 
        className='fs-1 my-5 mb-4 text-uppercase text-center text-primary animate__animated animate__fadeInUp'></div>

        <div id="content" className='p-2 animate__animated animate__fadeInUp mb-5' 
        contentEditable={user.type===1} style={{textAlign:'justify'}} 
        dangerouslySetInnerHTML={{__html:data.content.content}}></div>

        <div className="mb-5">
            <div className="scene">
                <div className="cube">
                    <div className="cube__face cube__face--front d-flex justify-content-center align-items-center fs-1">
                        <i className="fi fi-rr-physics mr-2"></i> <span>LEARN</span>
                    </div>
                    <div className="cube__face cube__face--back" >
                        <div className='text-center'>
                           <i className="fi fi-rr-cloud"></i> Cloud
                        </div>
                    </div>
                    <div className="cube__face cube__face--right">
                        <div className='text-center'>
                            Social network
                        </div>
                    </div>
                    <div className="cube__face cube__face--left">
                        <div className='text-center'>
                            Forum
                        </div>
                    </div>
                    <div className="cube__face cube__face--top"></div>
                    <div className="cube__face cube__face--bottom"></div>
                </div>
            </div>
        </div>

        {user.id===undefined?"":
        <div onClick={upData} className="btn-admin d-flex align-items-center show-btn-admin"
            style={{ background: "#0000" }}>
            <div className="rounded-pill d-flex align-items-center justify-content-center btn-create"
            style={{ width: "3rem", height: "3rem", zIndex: 10 }}>
                {load?<span className="load">
                    <i className="fi fi-rr-spinner"></i>
                </span>
                :<i className="fi fi-sr-disk pt-1" />}
            </div>
        </div>}
        <div className="row align-items-stretch mb-5">
            <div className="col-sm-6 col-md-5 col-lg-4 animate__animated animate__fadeInLeft d-flex flex-column">
                <div className='text-center fs-4'>Bài Blog mới</div>
                <ListView className="flex-fill">
                {data.blogs.map((item,i)=>
                <div key={i}>
                    <div className='py-5 mx-2' style={{background:`url(${item.img})`, borderRadius:'1rem',
                    backgroundSize:'cover', backgroundPosition:'center center'}}>
                        <Link to={"/blogs/"+(item.name.replaceAll(" ", "-"))+"/"+item.id} 
                        className='d-block text-center text-white' style={{background:'#2225'}}>
                            <div className="fs-2" style={{textOverflow:'ellipsis', whiteSpace:'nowrap', overflow:'hidden'}}>{item.name}</div>
                            <small>{(item.description+"").substring(0, 40)+"..."}</small>
                        </Link>
                    </div>
                </div> )}
                </ListView>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 animate__animated animate__fadeInUp">
                <div className='text-center fs-4'>Khóa học mới</div>
                <ListView durTime={7000}>
                {data.courses.map((item,i)=>
                <Link to={`/courses/${(item.name+"").replaceAll(" ","-")}/${item.id}`} key={i}>
                    <div className='py-5 mx-2' style={{background:`linear-gradient(45deg,${item.color})`, borderRadius:'1rem'}}>
                        <div className='text-center text-white'>
                            <div className="fs-2">{item.key}</div>
                            <small>{item.name}</small>
                        </div>
                    </div>
                </Link> )}
                </ListView>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 animate__animated animate__fadeInRight">
                <div className='text-center fs-4'>Chủ đề mới</div>
                <ListView>
                {data.topics.map((item,i)=>
                <div key={i}>
                    <div className='py-5 mx-2' style={{background: item.color?`linear-gradient(45deg,${item.img})`:`url(${item.img})`, borderRadius:'1rem',
                    backgroundSize:'cover', backgroundPosition:'center center'}}>
                        <Link to="/topics" className='text-center text-white d-block' style={{background:'#2225'}}>
                            <div className="fs-2" style={{textOverflow:'ellipsis', whiteSpace:'nowrap', overflow:'hidden'}}>{item.key}</div>
                            <small>{(item.content+"").substring(0, 40)+"..."}</small>
                        </Link>
                    </div>
                </div> )}
                </ListView>
            </div>
        </div>
        <h3 className='text-center text-uppercase'>chúng tôi có gì cho bạn?</h3>
        <div className="row">
            <div className="col-sm-6 col-md-3 text-center  p-3 text-white"  
            style={{background:'linear-gradient(-30deg,var(--dark), #333)'}}>
                <div className='fs-1'><i className="fi fi-sr-user"></i></div>
                <div className='fs-3'>{data.info.user}</div>
                <small>Thành viên</small>
            </div>
            <div className="col-sm-6 col-md-3 text-center  p-3 text-white"  
            style={{background:'linear-gradient(-30deg,var(--dark), #333)'}}>
                <div className='fs-1'><i className="fi fi-sr-e-learning"></i></div>
                <div className='fs-3'>{data.info.courses}</div>
                <small>Khóa học</small>
            </div>
            <div className="col-sm-6 col-md-3 text-center  p-3 text-white"  
            style={{background:'linear-gradient(-30deg,var(--dark), #333)'}}>
                <div className='fs-1'><i className="fi fi-sr-book-alt"></i></div>
                <div className='fs-3'>{data.info.lessons}</div>
                <small>Bài học</small>
            </div>
            <div className="col-sm-6 col-md-3 text-center  p-3 text-white"  
            style={{background:'linear-gradient(-30deg,var(--dark), #333)'}}>
                <div className='fs-1'><i className="fi fi-sr-feather"></i></div>
                <div className='fs-3'>{data.info.blogs}</div>
                <small>Bài Viết</small>
            </div>
        </div>
        
        <div id="content2" className='p-2 animate__animated animate__fadeInUp mb-5' 
        contentEditable={user.type===1} style={{textAlign:'justify'}} 
        dangerouslySetInnerHTML={{__html:data.content.content2}}></div>

        <h3 id="content1" className="mx-5 py-2 px-5 text-center" contentEditable={user.type===1}
        dangerouslySetInnerHTML={{__html: data.content.content1}}></h3>
        <div className='mx-sm-5 form-control'>
            <input type="text" className='form-control w-100 my-2' name="" id="" placeholder='Tên bạn là gì?'/>
            <input type="email" className='form-control w-100' name="" id="" placeholder='Gmail của bạn....' />
            <div className='mx-3 mt-2'>Nội dung câu hỏi?</div>
            <div style={{minHeight:'5rem'}} className="form-control" contentEditable></div>
            <div className="text-right">
                <div className="btn btn-primary mt-3">
                    <i className="fi fi-rr-paper-plane"></i> Gửi
                </div>
            </div>
        </div>
        <footer className='mt-5 text-center mb-5 py-3 ' style={{background:'#ddd5', borderRadius:'1rem'}}>
                <div className='text-uppercase text-primary' style={{fontSize:'1.2rem', fontWeight:'700'}}>Bản quyền thuộc về Thanh Khan - Copyright <i className="fi fi-rr-copyright"></i> 2020-2021 </div>
                <div>Liên hệ với chung tôi Email: <span id="email" style={{fontWeight:'600'}} contentEditable={user.type===1} dangerouslySetInnerHTML={{__html: data.content.email}}></span></div>
                <div><i className="fi fi-rr-phone-call"></i> Số diện Thoại: <span id="sdt" style={{fontWeight:'600'}} contentEditable={user.type===1} dangerouslySetInnerHTML={{__html: data.content.sdt}}></span></div>
        </footer>
    </div>
    )
}
