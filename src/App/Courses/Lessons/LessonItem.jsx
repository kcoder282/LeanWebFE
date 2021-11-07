import React from 'react'
import { useState } from 'react';

export default function LessonItem() {
    const [edit, setEdit] = useState(false);
    return (
      <div className="col-12 pb-2">
        <div className="pl-3 p-2 lessonsItem">Bài 1: Dữ liệu xong</div>
      </div>
    );
}
