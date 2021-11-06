
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Load from '../../Error/Load';

export default function Content(){
    return (
      <div className="content flex-fill order-0 order-sm-1">
        <Routes>
          <Route path="/" element={<Load />} />
          <Route path="/courses" element={<Load />} />
        </Routes>
      </div>
    );
}