import React, { useState } from 'react'
import './index.css'
import axios from 'axios';
import { host, key } from '../../../../Static';
import hljs from 'highlight.js';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Confetti from "react-native-confetti";

export default function MultipleChoice({ admin, id_lesson, value, setListQuestion }) {
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionCode, setQuestionCode] = useState("");
  const [type, setType] = useState('');
  const [multi, setMulti] = useState(false);
  const [res, setRes] = useState([]);
  const [error, setError] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setAnswer(value.answer);
    let data = value.question.split("<codeQuestion/>");
    setQuestion(data[0]);
    setQuestionCode(data[1] ?? "");
    setType(value.type);
    setMulti(value.multi);
    if (value.res !== "")
    if (value.type === "qz") {
      setRes(JSON.parse(value.res));
    }else{
      //code type
    }
  }, [value]);

  const addAnswer = () => {
    setAnswer([...answer, { id: -1, answer: "", check: false }]);
  };
  const Save = () => {
    if (question === "") toast.error("Chưa có câu hỏi");
    else if (questionCode === "//Enter Code ...") toast.error("Chưa nhập code");
    else if (answer.length === 0) toast.error("Chưa có câu trả lời");
    else {
      let check = false;
      for (let i = 0; i < answer.length; i++) {
        if (answer[i].check) {
          check = true;
          break;
        }
      }
      if (check) {
        setLoad(true);
        axios
          .post(host + "questions?key=" + key(), {
            question: question + "<codeQuestion/>" + questionCode,
            answer: answer,
            type: "qz",
            id_lesson: id_lesson,
            role: 'add'
          })
          .then((result) => {
            console.log(result.data);
            setLoad(false);
          })
          .catch((err) => {
            toast.error("" + err);
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
        e.target.innerText.replaceAll("\n\n", "\n")
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
        })
        .then((result) => {
          setLoad(false);
          if (result.data === 0) {
            setError(<><i className="fi fi-rr-interrogation"/> Đáp án chưa đúng</>);
            setRes([]);
          }else{

          }
        })
        .catch((err) => {});
    }
  }
  return (
    <div
      className="mx-0 mx-md-5 my-2"
      style={{
        border: admin ? "1px solid #5555" : "none",
        borderRadius: ".25rem",
      }}
    >
      {admin ? (
        <div className="d-flex justify-content-end">
          <div onClick={Save} className="btn btn-primary my-2">
            <i className="fi fi-rr-disk" /> Lưu
          </div>
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
          <div className="btn btn-danger m-2">
            <i className="fi fi-rr-cross-circle" /> Xóa
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="d-flex align-items-center mx-1">
        <div className="flex-fill">
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
          {questionCode !== "" ? (
            <pre className="position-relative w-100">
              <code
                className="hljs w-100"
                style={{ top: 0, left: 0 }}
                dangerouslySetInnerHTML={{
                  __html: hljs.highlightAuto(questionCode).value,
                }}
              ></code>
              <code
                onBlur={(e) =>
                  setQuestionCode(e.target.innerText.replaceAll("\n\n", "\n"))
                }
                onInput={onchangeCode}
                style={{
                  caretColor: "var(--danger)",
                  outline: "none",
                  color: "#0000",
                  background: "#0000",
                  zIndex: 2,
                  top: 0,
                  left: 0,
                }}
                contentEditable={admin}
                className="hljs position-absolute w-100"
              ></code>
            </pre>
          ) : (
            ""
          )}
        </div>
        {admin || value.res!=="" ? (
          ""
        ) : (
          <div onClick={sendRes} className="btn btn-primary">
            {
              load?<span className="load">
                <i className="fi fi-rr-spinner" />
              </span>:
              <i className="fi fi-rr-paper-plane" />
            }
          </div>
        )}
      </div>
      {error.length !== 0 ? (
        <small className="ml-" style={{ color: "var(--danger)" }}>
          {error}
        </small>
      ) : (
        ""
      )}
      <div className="row row-cols-1 px-3">
        {answer.map((e, i) => (
          <div key={i} className="col d-flex mt-1 align-items-center">
            {admin ? (
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
                  if(value.res === "")
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
                style={{cursor: 'pointer', color: res.includes(e.id) ? "var(--primary)" : "" }}
              />
            ) : (
              <i onClick={() => {
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
            )}
            {admin ? (
              <input
                disabled={!admin}
                onInput={(e) => {
                  answer[i].answer = e.target.value;
                  setAnswer([...answer]);
                }}
                className="flex-fill pl-1 form-control"
                style={{ border: "none" }}
                placeholder="Enter answer...."
                value={e.answer}
              />
            ) : (
              <div className="flex-fill pl-1">
                <span>{String.fromCharCode(65 + i)}. </span>
                {e.answer}
              </div>
            )}
          </div>
        ))}
        {admin ? (
          <div
            onClick={addAnswer}
            className="col mt-1"
            style={{ color: "var(--primary)", cursor: "pointer" }}
          >
            <i className="fi fi-rr-add" /> Thêm đáp án
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
