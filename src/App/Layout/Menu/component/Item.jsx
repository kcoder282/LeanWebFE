import {GrHomeRounded} from 'react-icons/gr';
import { NavLink } from 'react-router-dom';
import './Item.css';

const Item = ({name, path}) => {
    const Icon = ({name})=>
    {
        if (name === "Home") return <GrHomeRounded size={"1.5rem"} />;
        if (name === "Courses") return <GrHomeRounded size={"1.5rem"} />;
        if (name === "Topics") return <GrHomeRounded size={"1.5rem"} />;
        if (name === "Blogs") return <GrHomeRounded size={"1.5rem"} />;
        if (name === "files") return <GrHomeRounded size={"1.5rem"} />;
    }
    return (
      <NavLink to={path} className="container-item">
        <div className="item p-3 m-2 rounded d-flex justify-content-center align-items-center ">
          <Icon name={name} />
        </div>
      </NavLink>
    );
}

export default Item;
