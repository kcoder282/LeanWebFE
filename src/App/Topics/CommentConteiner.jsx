import Comment from "../Courses/Lesson/Comment";
import { useCallback, useState } from 'react';

export default function CommentConteiner({id, admin, user, type, check, setTopics, topics, index}) {
    const [cmt, setCmt] = useState(0);

    const setNumberComment = (number)=>{
        topics[index].cmt = number;
        setTopics([...topics]);
        setCmt(number)
    }
    const setCmtCheck = useCallback(
        (data)=>{
        topics.forEach(element => {
            element.checkcmt = undefined;
        });
        topics[index].checkcmt = data;
        setTopics([...topics])
    },[index, setTopics, topics]) 
    
    return (
      <Comment
        head={false}
        id_lesson={id}
        cmt={cmt}
        setcmt={setNumberComment}
        user={user}
        admin={admin}
        comment={check}
        setComment={setCmtCheck}
        type={type}
      />
    );
}
