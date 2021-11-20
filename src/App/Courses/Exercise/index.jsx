import MultipleChoice from "./multipleChoice/MultipleChoice";
import { useEffect } from 'react';
import  axios from 'axios';
import { host, key } from "./../../../Static";
import { useState } from 'react';

export default function Exercise({ admin, id_lesson }) {
  const [listQuestion, setListQuestion] = useState([]);

  useEffect(()=>{
    axios.get(host+'questions?key='+key()+'&id='+id_lesson)
    .then((result) => {
      setListQuestion(result.data);
    }).catch((err) => {
      console.log(""+err);
    })

  },[id_lesson]);

  return (
    <div className="mt-3 mb-5 mx-2" style={{ borderTop: "1px solid #007bff" }}>
      {listQuestion.map((e,i)=>
        <MultipleChoice key={i+"question"} value={e} setListQuestion={setListQuestion} admin={admin} id_lesson={id_lesson} />
      )}
      {admin ? (
        <div className="d-flex justify-content-center">
          <div className="btn btn-primary mr-1">
            <i className="fi fi-rr-checkbox " />{" "}
            <span className="d-none d-sm-inline"> Thêm trắc nghiệm</span>
          </div>
          <div className="btn btn-primary ">
            <i className="fi fi-rr-bug" />{" "}
            <span className="d-none d-sm-inline"> Thêm bài code</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
