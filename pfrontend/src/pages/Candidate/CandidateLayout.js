import React from 'react';
import { Outlet } from 'react-router-dom';
import CandidateNavbar from './CandidateNavbar';

const CandidateLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <CandidateNavbar />
        <div className="col-md-9 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CandidateLayout;
