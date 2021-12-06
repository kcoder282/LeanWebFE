import React, { useState } from 'react'
import './index.css'
import axios from 'axios';
import { host, key } from '../../../../Static';
import hljs from 'highlight.js';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Modal from '../../../Component/Modal';

export default function MultipleChoice({ admin, id_lesson, value, setListQuestion, id_course}) {
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionCode, setQuestionCode] = useState("");
  const [type, setType] = useState('');
  const [multi, setMulti] = useState(false);
  const [res, setRes] = useState([]);
  const [error, setError] = useState([]);
  const [load, setLoad] = useState(false);
  const [happy, setHappy] = useState(false);
  const [modal, setModal] = useState(false);
  const [test, setTest] = useState(0);
  const [loadRun, setLoadRun] = useState(false);
  const [loadTest, setLoadTest] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [testCase, setTestCase] = useState(false);

  const [userCode, setUserCode] = useState("");

  useEffect(() => {
    
    setAnswer(value.answer);
    let data = value.question.split("<codeQuestion/>");
    setQuestion(data[0]);
    setQuestionCode(data[1] ?? "");
    setType(value.type);
    setMulti(value.multi);
    if (value.res !== "") {
      setHappy(true);
      if (value.type === "qz") {
        setRes(JSON.parse(value.res));
      } else {
        setUserCode(value.res);
      }
    }
  }, [value]);

  const addAnswer = () => {
    setAnswer([...answer, { id: Math.random()+"", answer: "", check: false }]);
  };
  const Save = () => {
    if (question === "") toast.error("Chưa có câu hỏi");
    else if (questionCode === "//Enter Code ...") toast.error("Chưa nhập code");
    else if (type==='qz' && answer.length === 0) toast.error("Chưa có câu trả lời");
    else {
      let check = false;
      for (let i = 0; i < answer.length; i++) {
        if (answer[i].check) {
          check = true;
          break;
        }
      }
      if (check || type === 'cd') {
        setLoad(true);
        console.log(answer);
        axios
          .post(host + "questions?key=" + key(), {
            id: value.id,
            question: question + "<codeQuestion/>" + questionCode,
            code: questionCode,
            answer: answer,
            type: type,
            id_lesson: id_lesson,
            role: "add",
            id_course: id_course,
          })
          .then((result) => {
            setListQuestion(result.data);
            setLoad(false);
            toast.success("Cập nhật dữ liệu thành công");
          })
          .catch((err) => {
            toast.error("" + err);
            setLoad(false);
          });
      } else {
        toast.error("Chưa có câu trả lời nào đúng");
      }
    }
  };

  const onchangeCode = (e) => {
    if (e.target.innerText === "")
      e.target.parentNode.children[0].innerHTML =
        hljs.highlightAuto("//Enter Code ...").value;
    else
      e.target.parentNode.children[0].innerHTML = hljs.highlightAuto(
        e.target.innerText
      ).value;
  };

  const sendRes = () =>{  
    if(res.length===0)
    {
      setError(<><i className="fi fi-rr-shield-exclamation"/> Chưa chọn đáp án</>);
    }
    else
    {
      setError("");
      setLoad(true);
      axios
        .post(host + "questions/?key=" + key(), {
          id: value.id,
          answer: res.sort((a,b)=>a - b),
          role: "answer",
          id_course:id_course
        })
        .then((result) => {
          setLoad(false);
          if (result.data === 0) {
            setError(<><i className="fi fi-rr-interrogation"/> Đáp án chưa đúng</>);
            setRes([]);
          }else{
            setHappy(true);
          }
        })
        .catch((err) => {});
    }
  }

  const deleteQuestion = () => {
    setLoad(true);
     axios.delete(host+'questions/'+ value.id +"?key="+key())
     .then((result) => {
       setListQuestion(result.data);
       toast.success("Xóa Thành công");
       setLoad(false);
       setModal(false);
     }).catch((err) => {
       toast.error(""+err);
     });
  }

  return (
    <div
      className="mx-0 mx-md-5 mb-2 mt-5"
      style={{
        border: admin ? "1px solid #5555" : "none",
        borderRadius: ".25rem",
      }}
    >
      {modal ? (
        <Modal>
          <div>Bạn Thật sự muốn xóa câu hỏi hiện tại</div>
          <div className="d-flex justify-content-around mt-2">
            <div onClick={deleteQuestion} className="btn btn-danger">
              {load ? (
                <span className="load mr-2">
                  {" "}
                  <i className="fi fi-rr-spinner" />{" "}
                </span>
              ) : (
                ""
              )}Xóa
            </div>
            <div onClick={() => setModal(false)} className="btn btn-primary">
              Hủy
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}
      {admin ? (
        <div className="d-flex justify-content-end">
          <div onClick={Save} className="btn btn-primary my-2">
            {load ? (
              <span className="load">
                <i className="fi fi-rr-spinner" />
              </span>
            ) : (
              <i className="fi fi-rr-disk" />
            )}
            Lưu
          </div>

          {type === "qz" ? (
            <div
              onClick={() =>
                questionCode === ""
                  ? setQuestionCode("//Enter Code ...")
                  : setQuestionCode("")
              }
              className="btn btn-primary my-2 ml-2"
            >
              <i className="fi fi-rr-bug" /> Code
            </div>
          ) : (
            ""
          )}

          <div onClick={() => setModal(true)} className="btn btn-danger m-2">
            <i className="fi fi-rr-cross-circle" /> Xóa
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="d-flex align-items-start mx-1">
        <div className="flex-fill px-2 " style={{ maxWidth: "100%" }}>
          {admin ? (
            <input
              value={question}
              onInput={(e) => setQuestion(e.target.value)}
              style={{ fontWeight: "bold" }}
              className="form-control px-2 py-1 w-100"
              placeholder="Enter Question ...."
            />
          ) : (
            <div
              className="px-2 py-1 w-100"
              style={{ fontWeight: "bold", border: "none" }}
            >
              {question}
            </div>
          )}
          {questionCode !== "" || type === "cd" ? (
            <div
              className="position-relative"
              style={{ overflow: "auto", maxWidth: "100%" }}
            >
              <pre className="position-relative">
                <code
                  className="hljs w-100"
                  style={{ top: 0, left: 0 }}
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlightAuto(
                      admin?(questionCode === "" ? "//Enter Code ..." : questionCode):(userCode === "" ? "//Enter Code ..." : userCode)
                    ).value,
                  }}
                ></code>
                <code
                  onBlur={(e) => admin?setQuestionCode(e.target.innerText):setUserCode(e.target.innerText)}
                  onInput={onchangeCode}
                  style={{
                    caretColor: "var(--danger)",
                    outline: "none",
                    color: "#fff0",
                    background: "#0000",
                    zIndex: 2,
                    top: 0,
                    left: 0,
                  }}
                  suppressContentEditableWarning={true}
                  contentEditable={admin || type === "cd"}
                  className="hljs position-absolute w-100 h-100"
                >
                  {admin?questionCode:userCode}
                </code>
              </pre>

              <div className="d-flex p-2">
                {type === "cd" ? (
                  <>
                    <div
                      onClick={() => {
                        setLoadRun(true);
                        let a = {answer:input}
                        axios
                          .post(host + "code", {
                            code: admin?questionCode:userCode,
                            input: [a],
                          })
                          .then((result) => {
                            if (result.data.error === null) {
                              setOutput('Output:\n'+result.data.data[0]);                              
                            } else {
                              setOutput('Error:\n'+result.data.error);
                            }
                          })
                          .catch((err) => {})
                          .finally(() => setLoadRun(false));
                      }}
                      title="Run code"
                      className="text-white d-flex align-items-center justify-content-center "
                      style={{
                        zIndex: 100,
                        background: "var(--success)",
                        width: "2.5rem",
                        height: "2.5rem",
                        cursor: "pointer",
                        borderRadius: "50%",
                      }}
                    >
                      {loadRun ? (
                        <span className="load">
                          <i className="fi fi-rr-spinner" />
                        </span>
                      ) : (
                        <i
                          className="fi fi-sr-play"
                          style={{ marginTop: ".45rem" }}
                        />
                      )}
                    </div>
                    {answer.length > 0 ? (
                      <div
                        onClick={() => {
                          setLoadTest(true);
                          setOutput("");
                          if(admin)
                          {
                            axios.post(host + "code", {
                              code: questionCode,
                              input: answer,
                            })
                            .then((result) => {
                              
                              if (result.data.error === null) {
                                answer.map(
                                  (e, i) =>
                                    (answer[i].output = result.data.data[i])
                                );
                                setAnswer([...answer]);
                                setTestCase(true);
                              } else {
                                setOutput('error:\n'+result.data.error);
                              }
                            })
                            .catch((err) => {})
                            .finally(() => setLoadTest(false));
                          }else{
                            axios
                              .post(host + "questions?key=" + key(), {
                                id: value.id,
                                code: userCode,
                                input: answer,
                                role: "answer",
                                type: "cd",
                                id_course: id_course,
                              })
                              .then((result) => {
                                result.data.array.forEach((e,i) => {
                                   answer[i].ouput = e.ouput;
                                   answer[i].check = e.check;
                                });
                                setAnswer([...answer]);
                                setTestCase(true);
                              })
                              .catch((err) => {})
                              .finally(() => setLoadTest(false));
                          }
                        }}
                        title="Test code"
                        className="text-white d-flex align-items-center justify-content-center ml-2"
                        style={{
                          zIndex: 100,
                          background: "var(--secondary)",
                          width: "2.5rem",
                          height: "2.5rem",
                          cursor: "pointer",
                          borderRadius: "50%",
                          bottom: ".5rem",
                          right: ".5rem",
                        }}
                      >
                        {loadTest ? (
                          <span className="load">
                            <i className="fi fi-rr-spinner" />
                          </span>
                        ) : (
                          <i
                            className="fi fi-rr-test-tube"
                            style={{ marginTop: ".45rem" }}
                          />
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}
                <input
                  value={input}
                  onInput={(item) => setInput(item.target.value)}
                  type="text"
                  className="flex-fill mx-2 px-2 "
                  placeholder="Enter Input..."
                  style={{
                    border: "1px solid #0001",
                    fontFamily: "monospace",
                    outline: "none",
                    borderRadius: ".25rem",
                    minWidth: "1px",
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {admin ? (
          ""
        ) : happy && type==='qz' ? (
          <span style={{ color: "var(--success)" }}>
            <i className="fi fi-sr-checkbox ml-2" /> Chính xác
          </span>
        ) : type === "qz" ? (
          <div onClick={sendRes} className="btn btn-primary">
            {load ? (
              <span className="load">
                <i className="fi fi-rr-spinner" />
              </span>
            ) : (
              <i className="fi fi-rr-paper-plane" />
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      {error.length !== 0 ? (
        <div className="ml-3" style={{ color: "var(--danger)" }}>
          {error}
        </div>
      ) : (
        ""
      )}

      {output.length===0?'':<div className="mx-3 position-relative">
      <pre className="p-3"
      style={{maxWidth: '100%', overflow:'auto', maxHeight:'10rem',background:'var(--dark)',color: 'var(--light)', border:'.25rem'}}>
        {output}
      </pre>
      <i onClick={()=>setOutput("")} className="position-absolute fi fi-sr-cross-circle "
      style={{color: 'var(--danger)', cursor:'pointer', top:'.5rem', right:'.5rem', zIndex:'5'}}/>
      </div>}

      <div className="row row-cols-1 px-3">
        {type === "qz" ? (
          answer.map((e, i) => (
            <div key={i}>
              <div className="col d-flex mt-1 align-items-center">
                {type === "qz" ? (
                  admin ? (
                    e.check ? (
                      <i
                        onClick={() => {
                          answer[i].check = false;
                          setAnswer([...answer]);
                        }}
                        className="fi fi-sr-checkbox mr-2 fs-5 animate__animated animate__bounceIn animate__faster"
                        style={{ cursor: "pointer", color: "var(--success)" }}
                      />
                    ) : (
                      <i
                        onClick={() => {
                          answer[i].check = true;
                          setAnswer([...answer]);
                        }}
                        className="fi fi-rr-square mr-2 fs-5"
                        style={{ cursor: "pointer" }}
                      />
                    )
                  ) : multi ? (
                    <i
                      onClick={() => {
                        if (value.res === "")
                          res.includes(e.id)
                            ? res.splice(res.indexOf(e.id), 1)
                            : res.push(e.id);
                        setRes([...res]);
                      }}
                      className={
                        "fi fs-5 mr-2 " +
                        (res.includes(e.id)
                          ? "fi-sr-rec animate__animated animate__rubberBand animate__faster "
                          : "fi-rr-circle")
                      }
                      style={{
                        cursor: "pointer",
                        color: res.includes(e.id) ? "var(--primary)" : "",
                      }}
                    />
                  ) : (
                    <i
                      onClick={() => {
                        if (value.res === "")
                          res.includes(e.id) ? setRes([]) : setRes([e.id]);
                      }}
                      className={
                        "fi mr-2 fs-5 " +
                        (res.includes(e.id)
                          ? "fi-sr-checkbox animate__animated animate__rubberBand animate__faster"
                          : "fi-rr-square")
                      }
                      style={{
                        cursor: "pointer",
                        color: res.includes(e.id) ? "var(--primary)" : "",
                      }}
                    />
                  )
                ) : (
                  <span className="mr-2"> TestCase[{i + 1}]: </span>
                )}
                {admin ? (
                  <>
                    <input
                      disabled={!admin}
                      onInput={(e) => {
                        answer[i].answer = e.target.value;
                        setAnswer([...answer]);
                      }}
                      className="flex-fill pl-1 form-control"
                      style={{ border: "none" }}
                      placeholder={
                        type === "qz" ? "Enter answer..." : "Enter TestCase..."
                      }
                      value={e.answer}
                    />
                    <div
                      className="ml-2"
                      onClick={() => {
                        setAnswer(answer.filter((data) => e.id !== data.id));
                      }}
                      style={{ color: "var(--danger)", cursor: "pointer" }}
                    >
                      <i className="fs-5 fi fi-rr-cross-circle" />
                    </div>
                  </>
                ) : (
                  <div className="flex-fill pl-1">
                    <span>{String.fromCharCode(65 + i)}. </span>
                    {e.answer}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : answer.length > 0 && (admin||testCase)? (
          <div className="d-flex px-3 align-items-stretch position-relative">
            <div
              className="py-2"
              style={{ background: "#ddd", marginLeft: ".5rem" }}
            >
              {answer.map((e, i) => (
                <div
                  key={i}
                  className={
                    "testcase px-2 ml-2 " + (i === test ? "active" : "")
                  }
                >
                  <span
                    onClick={() => {
                      setTest(i);
                    }}
                  >
                    <span className="d-none d-sm-inline">
                      Test[{(i < 9 ? "0" : "") + (i + 1)}]
                    </span>
                    <span
                      className="d-inline d-sm-none"
                      style={{
                        color: e.check ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {i + 1}
                    </span>
                  </span>
                  {admin ? (
                    <i
                      onClick={() => {
                        answer.splice(i, 1);
                        setAnswer([...answer]);
                      }}
                      className="fi fi-sr-cross-circle mx-2"
                      style={{ color: "var(--danger)" }}
                    />
                  ) : e.check ? (
                    <i
                      className="d-none d-sm-inline fi fi-rr-check mx-2"
                      style={{ color: "var(--success)" }}
                    />
                  ) : (
                    <i
                      className="d-none d-sm-inline fi fi-rr-cross-circle mx-2"
                      style={{ color: "var(--danger)" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex-fill p-3 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-end">
                <span><i className="fi fi-rr-cube mr-2" /> Input:</span> 
                {admin?'':<i onClick={()=>setTestCase(false)} className="fi fi-rr-cross-circle fs-5" style={{color:'var(--danger)', cursor: 'pointer'}}/>}
              </div>
              <input
                disabled={!admin}
                value={answer[test].answer}
                type="text"
                onInput={(e) => {
                  answer[test].answer = e.target.value;
                  setAnswer([...answer]);
                }}
                style={{ fontFamily: "monospace" }}
                className="form-control my-2 w-100"
                placeholder="Enter input TestCase"
              />
              <div>
                <i className="fi fi-sr-cube mr-2" /> Output:{" "}
              </div>
              <div className="flex-fill mt-2 output mt-2">
                {answer[test].output ?? ""}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {admin ? (
          <div
            onClick={addAnswer}
            className="col mt-1 mb-3"
            style={{ color: "var(--primary)", cursor: "pointer" }}
          >
            <i className="fi fi-rr-add" />{" "}
            {type === "qz" ? "Thêm đáp án" : "Thêm TestCase"}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
