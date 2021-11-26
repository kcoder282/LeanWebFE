import { useEffect, useState } from "react";
import axios from "axios";
import { host, key } from "./../../../Static";
import CmtItem from "./CmtItem";

export default function Comment({cmt, setcmt, id_lesson, user, admin, comment, setComment }) {
  const [content, setContent] = useState("");
  const [listCmt, setListCmt] = useState([]);
  const [cmtsub, setCmtsub] = useState("");
  const [loadsub, setLoadsub] = useState(false);

  useEffect(() => {
    axios
      .get(host + `cmt?key=${key()}&type=lesson&id_lesson=${id_lesson}`)
      .then((result) => {
        setListCmt(result.data);
        let count = result.data.length;
        result.data.map((e) => (count += e.cmt.length));
        setcmt(count);
      })
      .catch((err) => {});
  }, [id_lesson,setcmt]);
  const sendcmt = (e, i) => {
    if (cmtsub.length > 0) {
      setLoadsub(true);
      axios
        .post(`${host}cmt?key=${key()}`, {
          id: -1,
          id_cmt: e.id,
          content: cmtsub,
          id_lesson: id_lesson,
          type: "lesson",
        })
        .then((result) => {
          listCmt[i].cmt = result.data[i].cmt;
          setListCmt([...listCmt]);
          setCmtsub("");
        })
        .finally(() => setLoadsub(false));
    }
  };
  const sendCmtNew = () => {
    axios
      .post(host + "cmt?key=" + key(), {
        id: -1,
        id_lesson: id_lesson,
        content: content,
        type: "lesson",
      })
      .then((result) => {
        setListCmt(result.data);
        setContent("");
        setComment(true);
      })
      .catch();
  };

  return (
    <div className="commentData">
      <div
        onClick={() => setComment(!comment)}
        className="p-2 d-none d-md-block"
        style={{
          border: "1px solid var(--primary)",
          borderRadius: ".5rem",
          cursor: "pointer",
        }}
      >
        <div id="comment" className=" d-flex justify-content-between text-primary ">
          <div>
            <i className="fi fi-rr-comment" /> Comment
          </div>
          <span>
            <span className="d-none d-md-inline">{cmt}</span>
            <i
              className={
                comment
                  ? "fi fi-rr-angle-small-down"
                  : "fi fi-rr-angle-small-right"
              }
            />
          </span>
        </div>
      </div>
        <div className="d-flex mt-2">
          <input
            value={content}
            onInput={(e) => setContent(e.target.value)}
            type="text"
            className="form-control mr-1"
            placeholder="Enter Comment"
          />
          <div onClick={sendCmtNew} className="btn btn-primary">
            <i className="fi fi-rr-paper-plane" />
          </div>
        </div>
        {comment ?<>
        <div className="pr-1 mt-2" style={{maxHeight:'80vh',overflowY:'auto'}}>
          {listCmt.map((e, i) => (
            <div key={i}>
              <CmtItem
                setlist={setListCmt}
                value={e}
                user={user}
                admin={admin}
                id_lesson={id_lesson}
              />
              <div
                className="d-flex align-items-center"
                style={{ fontSize: "1.1rem", marginLeft: "3.5rem" }}
              >
                <span
                  onClick={() => {
                    axios
                      .get(
                        `${host}cmt/${
                          e.id
                        }?key=${key()}&id_lesson=${id_lesson}&type=lesson`
                      )
                      .then((result) => {
                        setListCmt(result.data);
                      })
                      .catch((err) => {});
                  }}
                  style={{ width: "4rem", cursor: "pointer" }}
                >
                  <i
                    className={
                      "fi mr-1 " +
                      (e.mlike ? "fi-sr-heart text-danger" : "fi-rr-heart")
                    }
                  />
                  {e.like}
                </span>
                <span
                  onClick={() => {
                    if (listCmt[i].viewcmt) listCmt[i].viewcmt = undefined;
                    else {
                      listCmt.forEach((data) => (data.viewcmt = undefined));
                      listCmt[i].viewcmt = true;
                    }
                    setListCmt([...listCmt]);
                  }}
                  style={{ width: "4rem", cursor: "pointer" }}
                >
                  <i
                    className={
                      "fi mr-1 " +
                      (e.viewcmt ? "fi-sr-comment" : "fi-rr-comment")
                    }
                  />
                  {e.cmt.length}
                </span>
              </div>
              {e.viewcmt ? (
                <div className="" style={{ marginLeft: "2.5rem" }}>
                  {e.cmt.map((dataitem) => (
                    <div key={dataitem.id}>
                      <CmtItem
                        index={i}
                        setlist={setListCmt}
                        list={listCmt}
                        id_lesson={id_lesson}
                        value={dataitem}
                        user={user}
                        admin={admin}
                      />
                      <div
                        className="d-flex align-items-center"
                        style={{ fontSize: "1.1rem", marginLeft: "3.5rem" }}
                      >
                        <span
                          onClick={() => {
                            axios
                              .get(
                                `${host}cmt/${
                                  dataitem.id
                                }?key=${key()}&id_lesson=${id_lesson}&type=lesson`
                              )
                              .then((result) => {
                                listCmt[i].cmt = result.data[i].cmt;
                                setListCmt([...listCmt]);
                              })
                              .catch((err) => {});
                          }}
                          style={{ width: "4rem", cursor: "pointer" }}
                        >
                          <i
                            className={
                              "fi mr-1 " +
                              (dataitem.mlike
                                ? "fi-sr-heart text-danger"
                                : "fi-rr-heart")
                            }
                          />
                          {dataitem.like}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex">
                    <input
                      onKeyDown={(data) => {
                        if (data.key === "Enter") sendcmt(e.i);
                      }}
                      style={{ marginLeft: "2.5rem" }}
                      onInput={(item) => setCmtsub(item.target.value)}
                      value={cmtsub}
                      className="flex-fill form-control mr-1"
                      placeholder="Enter comment"
                    />
                    <div
                      onClick={() => sendcmt(e, i)}
                      className="btn btn-primary"
                    >
                      {loadsub ? (
                        <span className="load">
                          <i className="fi fi-rr-spinner" />
                        </span>
                      ) : (
                        <i className="fi fi-rr-paper-plane" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        </>
      :''}


    </div>
  );
}
