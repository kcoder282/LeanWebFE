import React from "react";
import { useState } from "react";

export default function LessonItem({ name,index,check }) {
  const [edit, setEdit] = useState(false);
  return (
    <div className="col-12 mb-2">
      <div className="pl-3 p-2 lessonsItem d-flex justify-content-between">
        <span>
          Bài {index}: {name}
        </span>
        {check?<i className="fi fi-rr-check" style={{color:"var(--success)"}}/>:''}
      </div>
    </div>
  );
}
