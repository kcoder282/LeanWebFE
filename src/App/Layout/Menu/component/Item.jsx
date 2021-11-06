import { NavLink } from 'react-router-dom';
import './Item.css';

const Item = ({name, path}) => {
    const icon = (name)=>
    {
        if (name === "Home") return 'home';
        if (name === "Courses") return "e-learning";
        if (name === "Topics") return "interrogation";
        if (name === "Blogs") return "feather";
        if (name === "files") return "file-check";
        return "cross-circle";
    }
    return (
      <NavLink to={path} className="container-item">
        <div className="item p-3 m-2 rounded d-flex justify-content-center align-items-center ">
          <i className={"fi fi-rr-" + icon(name)} />
          <span>
            {}
          </span>
        </div>
      </NavLink>
    );
}

export default Item;
