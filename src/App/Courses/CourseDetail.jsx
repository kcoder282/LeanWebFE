import { NavLink } from "react-router-dom";
import "./CourseDetail.css";

export default function CourseDetail() {
    // const {id} = useParams();
    
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-9"></div>
          <div className="col-3">
            <h2 className="text-primary"><i className="fi fi-rr-list"/> List Lessons</h2>
            <NavLink to="/" className="lesson check">Bài 1 đây là bài text</NavLink>
            <NavLink to="/" className="lesson check">Bài 2 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 3 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 4 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 5 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 6 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 7 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 8 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 9 đây là bài text</NavLink>
            <NavLink to="/" className="lesson">Bài 10 đây là bài text</NavLink>
          </div>
        </div>
      </div>
    );
}
