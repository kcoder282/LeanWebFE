import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { host } from "../../Static";
import { useState } from "react";
import Load from "../../Error/Load";
import { Link } from "react-router-dom";
import icon from "../../Icon/svg/fi-rr-user.svg";
import { toast } from "react-toastify";
import './index.css'

export default function BlogList({user}) {
  const [isLoad, setIsLoad] = useState(false);
  const [list, setList] = useState([]);
  const [pagi, setPagi] = useState([]);
  const [action, setAction] = useState("");

  useEffect(() => {
    setIsLoad(true);
    const {tool, id} = Object.fromEntries(new URLSearchParams(window.location.search));
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
    else {
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

  return (
    <div style={{ overflowX: "hidden" }}>
      <div>
        <div className="container mt-3">
          <div className="row justify-content-center">
            <div className="col col-sm-11 col-md-10 col-lg-9 pb-4">
                <h2 className="text-uppercase text-primary mt-2 mb-4 pb-2 px-3 animate__animated animate__fadeInUp animate__faster"
                  style={{ borderBottom: "2px solid var(--primary)" }}>
                  <i className="fi fi-rr-feather mr-2" />
                  {action === undefined ? "Blogs của bạn" : "Blog của tác giả "}
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
                    className="blog-item shadow mb-2 bg-white px-3 py-3 d-block animate__animated animate__fadeInUp animate__faster"
                    style={{ animationDelay: `${i * 200}ms` }}>
                        <div className="d-flex align-items-center mb-2">
                          <img
                            style={{
                              width: "1.2rem",
                              height: "1.2rem",
                              borderRadius: "50%",
                            }}
                            src={e.user.avata ?? icon}
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
      <Link to="/blogs/action/add" className="btn-admin d-flex align-items-center show-btn-admin"
        style={{ background: "#0000" }}>
        <div className="rounded-pill d-flex align-items-center justify-content-center btn-create"
        style={{ width: "3rem", height: "3rem", zIndex: 10 }}>
            <i className="fi fi-sr-plus pt-1" />
        </div>
       </Link>
    </div>
  );
}
