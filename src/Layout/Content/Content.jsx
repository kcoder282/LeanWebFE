
import { Routes } from 'react-router-dom';
export default function Content({children}){
    return (
      <div className="content flex-fill">
        <Routes>{children}</Routes>
      </div>
    );
}