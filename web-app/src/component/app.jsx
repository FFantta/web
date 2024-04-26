import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavBar from './navBar';
import NotFound from './content/notFound';
import Register from './content/register';
import Login from './content/login';
import Setting from './content/setting';
import StudyHome from './content/studyhome';
import ParticipantWrapper from './content/ParticipantWrapper'; 
import './content/setting.css';

/**
 * The app component which shows different pages depending of the URL route given.
 * @returns - the main app component.
 */
const App = () => {
  const location = useLocation();
  
  // shows navBar when the login page is not the current page
  const showNavBar = location.pathname !== '/login' && location.pathname !== '/';

  return (
    <>
      {showNavBar && <NavBar />}
      <div className='container'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/setting' element={<Setting />} />
          <Route path='/notFound' element={<NotFound />} />
          <Route path='/studyHome' element={<StudyHome />} />
          <Route path='/participant' element={<ParticipantWrapper />} />
          <Route path='*' element={<Navigate replace to='/notFound' />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
