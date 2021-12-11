import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { host, imgurl } from "../../Static";
import { useState } from "react";
import Load from "../../Error/Load";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './index.css'

export default function BlogList({user}) {
  const [isLoad, setIsLoad] = useState(false);
  const [list, setList] = useState([]);
  const [pagi, setPagi] = useState([]);
  const [action, setAction] = useState("");
  const [load, setLoad] = useState(false);
  const [search_text, setSearch_text] = useState("");
  const search = useRef();
  const [listSearch, setListSearch] = useState([]);

  useEffect(() => {
    setIsLoad(true);
    const {tool, id, name} = Object.fromEntries(new URLSearchParams(window.location.search));

    setAction(tool);
    if (tool === undefined)
      axios
        .get(host + "blogs")
        .then((result) => {
          setList(result.data.list);
          setPagi(result.data.pagi);
        })
        .catch((err) => {
          toast.error("" + err);
        })
        .finally(() => setIsLoad(false));
    else
    {
      axios
        .get(host + "blogs?user_search=" + id)
        .then((result) => {
          setList(result.data.list);
          setPagi(result.data.pagi);
        })
        .catch((err) => {
          toast.error("" + err);
        })
        .finally(() => setIsLoad(false));
    }
    if(tool==="search")
    {
      searchName(name);
    }
  }, []);

  function gotoPage(url) {
    setIsLoad(true);
    axios
      .get(url)
      .then((result) => {
        setList(result.data.list);
        setPagi(result.data.pagi);
      })
      .catch((err) => {
        toast.error(err + "");
      })
      .finally(() => setIsLoad(false));
  }
  const searchName = (name)=>{
    if(name.trim()!=="")
    {
      setLoad(true);
      try {
        clearTimeout(search.current);
        search.current = "load";
      } catch (error) {}

      search.current = setTimeout(() => {
        axios
        .get(host + "blogs_search?search=" + name.toLowerCase())
        .then((result) => {
          if(result.data.length===0)
            setListSearch([{id:-1,name:'Không tìm thấy kết quả nào'}])
          else
            setListSearch(result.data);
        })
        .finally(() => setLoad(false));
        setSearch_text(name);
      }, 1000);
    }else setListSearch([]);
  }

  return (
    <div style={{ overflowX: "hidden" }}>
      <div>
        <div className="container mt-3">
          <div className="row justify-content-center">
            <div className="col col-sm-11 col-md-10 col-lg-9 pb-4">
                <h2 className="position-relative row text-uppercase text-primary mt-2 mb-4 pb-2 animate__animated animate__fadeInUp animate__faster"
                  style={{ borderBottom: "2px solid var(--primary)", zIndex:'1000' }}>
                    <div className="col-12 col-sm-7 col-md-8"><i className="fi fi-rr-feather mr-2" />
                    {action === undefined ? "Blogs của bạn" : "Blog của tác giả "}</div>
                    <div className="col-12 col-sm-5 col-md-4 position-relative d-flex align-items-center">
                      <input onChange={(e)=>searchName(e.currentTarget.value)} type="text"
                      defaultValue={Object.fromEntries(new URLSearchParams(window.location.search)).name}
                      className="input_search w-100 form-control rounded-pill" style={{paddingLeft:'2rem'}} placeholder="Tìm Tên bài Blog..." />
                      <span className="position-absolute fs-6" style={{left:'1.5rem'}}>
                        {load?
                        <span className="load">
                          <i className="fi fi-rr-spinner"/>
                        </span>:
                        <i className="fi fi-rr-search"/>}
                      </span>
                      {listSearch.length>0?<span onClick={()=>{document.querySelector(".input_search").value = "";setListSearch([])}} className="fs-6 position-absolute fi fi-sr-cross-circle text-danger" style={{right:'1.5rem'}}/>:''}
                      {listSearch.length===0?"":
                      <div className="position-absolute w-100 bg-white p-2 m-1 rounded shadow" style={{zIndex:'10000',fontSize:'.8rem', top:'100%', left:'0', color:'#000', textTransform:'none'}}>
                      {listSearch.map((e,i)=>e.id===-1?
                        <div key={i} onClick={()=>{document.querySelector(".input_search").value = "";setListSearch([])}}>
                          <div className="item w-100 p-2 text-center" style={{borderRadius:'.25rem', cursor:'pointer'}}>
                            {e.name}
                          </div>
                        </div>:
                        <div key={i} className="d-block item p-1" style={{borderRadius:'.5rem'}}>
                          <Link to={`/blogs/${(e.name + "").replaceAll(/ |\?/gm, "-")}/${e.id}`}
                          className="w-100 ">
                            <div className="mx-2" dangerouslySetInnerHTML={{__html: e.name.replaceAll(new RegExp(search_text,"ig"),"<b class='hl'>"+search_text+"</b>")}}></div>
                            <div className="mx-2 mt-1" style={{fontWeight:'100', fontSize:'.9em'}}
                            dangerouslySetInnerHTML={{__html: e.user_name.replaceAll(new RegExp(search_text,"ig"),"<b class='hl'>"+search_text+"</b>")}}/>
                          </Link>
                        </div>
                      )}
                      </div>}
                    </div>
                </h2>
                {isLoad ? (
                  <Load mini={true} />
                ) : (
                  <div>
                    {list.map((e, i) => (
                    <Link
                    key={i}
                    to={ "/blogs/"+(e.name + "").replaceAll(/ |\?/gm, "-") +"/"+e.id}
                    title={e.name}
                    className="position-relative blog-item shadow mb-2 bg-white px-3 py-3 d-block animate__animated animate__fadeInUp animate__faster"
                    style={{ animationDelay: `${i * 200}ms` }}>
                        <div className="d-flex align-items-center mb-2">
                          <img
                            style={{
                              width: "1.2rem",
                              height: "1.2rem",
                              borderRadius: "50%",
                            }}
                            src={imgurl(e.user.avata)}
                            alt=""
                          />
                          <span className="mx-2" style={{ fontSize: ".8rem" }}>
                            {e.user.name}
                          </span>
                        </div>

                        <div className="row align-items-stretch ">
                          <div className="col-12 col-sm-7 col-lg-8 d-flex flex-column">
                            <h3
                              className="fs-5 my-0 py-0 text-primary"
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {e.name}
                            </h3>
                            <div
                              className="my-2 flex-fill"
                              style={{
                                fontSize: ".8rem",
                                color: "#aaa",
                                textAlign: "justify",
                              }}
                            >
                              <i>{e.description}</i>
                            </div>
                            <div
                              className="d-flex align-items-center"
                              style={{ color: "#bbb", fontSize: ".9rem" }}
                            >
                              <span>
                                <i className="fi fi-rr-clock" /> {e.time}
                              </span>
                              <span>
                                <i className="fi fi-rr-heart ml-2" /> {e.like}
                              </span>
                              <span>
                                <i className="fi fi-rr-comment ml-2" /> {e.cmt}
                              </span>
                              <span>
                                <i className="fi fi-rr-eye ml-2" /> {e.view}
                              </span>
                            </div>
                          </div>
                          <div className="col-12 col-sm-5 col-lg-4 mt-2 mt-sm-0 d-flex align-items-center">
                            <div
                              className="w-100"
                              style={{
                                paddingTop: "60%",
                                background: `url(${e.img ?? ""})`,
                                borderRadius: ".5rem",
                                backgroundPosition: "center center",
                                backgroundSize: "cover",
                              }}
                            ></div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="pagination d-flex mt-4">
                      {pagi.links !== undefined
                        ? pagi.links.map((e, i) => (
                            <div
                              onClick={() => gotoPage(e.url)}
                              key={i}
                              className={e.active ? "active" : ""}
                              dangerouslySetInnerHTML={{ __html: e.label }}
                            ></div>
                          ))
                        : ""}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {user.id===undefined?"":
      <Link to="/blogs/action/add" className="btn-admin d-flex align-items-center show-btn-admin"
        style={{ background: "#0000" }}>
        <div className="rounded-pill d-flex align-items-center justify-content-center btn-create"
        style={{ width: "3rem", height: "3rem", zIndex: 10 }}>
            <i className="fi fi-sr-plus pt-1" />
        </div>
       </Link>}
    </div>
  );
}
