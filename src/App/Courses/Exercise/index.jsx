import MultipleChoice from "./multipleChoice/MultipleChoice";
import { useEffect } from 'react';
import  axios from 'axios';
import { host, key } from "./../../../Static";
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Exercise({ admin, id_lesson, id_course }) {
  const [listQuestion, setListQuestion] = useState([]);
  const [loadq, setLoadq] = useState(false);
  const [loadc, setLoadc] = useState(false);

  useEffect(() => {
    axios
      .get(host + "questions?key=" + key() + "&id=" + id_lesson)
      .then((result) => {
        setListQuestion(result.data);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  }, [id_lesson, id_course]);

  const answerQuiz = () => {
    setLoadq(true);
    axios
      .post(host + "questions?key=" + key(), {
        id: -1,
        question: "<codeQuestion/>",
        answer: [],
        type: "qz",
        id_lesson: id_lesson,
        role: "add",
      })
      .then((result) => {
        setListQuestion(result.data);
        setLoadq(false);
      })
      .catch((err) => {
        toast.error("" + err);
      });
  };

  const answerCode = () => {
    setLoadc(true);
    axios
      .post(host + "questions?key=" + key(), {
        id: -1,
        question: "<codeQuestion/>",
        answer: [],
        type: "cd",
        id_lesson: id_lesson,
        role: "add",
      })
      .then((result) => {
        setListQuestion(result.data);
      })
      .catch((err) => {
        toast.error("" + err);
      }).finally(()=>setLoadc(false));
  };
  return (
    <div className="mt-3 mb-5 mx-2" style={{ borderTop: "1px solid #007bff" }}>
      {listQuestion.map((e, i) => (
        <MultipleChoice
          key={i + "question"}
          value={e}
          setListQuestion={setListQuestion}
          admin={admin}
          id_lesson={id_lesson}
          id_course={id_course}
        />
      ))}
      {admin ? (
        <div className="d-flex justify-content-center">
          <div onClick={answerQuiz} className="btn btn-primary mr-1">
            {loadq ? (
              <span className="load">
                <i className="fi fi-rr-spinner" />
              </span>
            ) : (
              <i className="fi fi-rr-checkbox " />
            )}
            <span className="d-none d-sm-inline"> Thêm trắc nghiệm</span>
          </div>
          <div onClick={answerCode} className="btn btn-primary ">
            {loadc ? (
              <span className="load">
                <i className="fi fi-rr-spinner" />
              </span>
            ) : (
              <i className="fi fi-rr-bug" />
            )}
            <span className="d-none d-sm-inline"> Thêm bài code</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
