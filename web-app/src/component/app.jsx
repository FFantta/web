import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavBar from './navBar';
import NotFound from './content/notFound';
import Register from './content/register';
import Login from './content/login';
import Setting from './content/setting';
import StudyHome from './content/studyhome';
import Participant from './content/participant';
import './content/setting.css';
// import './content/register.css';

const App = () => {
    const location = useLocation(); 

    const showNavBar = location.pathname !== '/login' && location.pathname !== '/';

    return (
        <React.Fragment>
            {showNavBar && <NavBar />}
            <div className='container'>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/setting' element={<Setting />} />
                    <Route path='/notFound' element={<NotFound />} />
                    <Route path='/studyHome' element={<StudyHome />} />
                    <Route path='/participant' element={<Participant />} />
                    <Route path='*' element={<Navigate replace to='/notFound' />} />
                </Routes>
            </div>
        </React.Fragment>
    );
};

export default App;
