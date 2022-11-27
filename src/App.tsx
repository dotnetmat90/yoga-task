import { Route, Routes } from 'react-router';
import DoubleHeader from './components/Header';
import Login from './components/Login';
import Landing from './components/Landing';
import { BrowserRouter } from 'react-router-dom';
import NoHeader from './components/NoHeader';
import FooterSocial from './components/Footer';
 import { NotificationsProvider } from '@mantine/notifications';
import Register from './components/Register';
import './App.css';
import Courses from './components/Courses';
import MyCourses from './components/MyCourses';

import Course from './components/Course';
import Logout from './components/Logout';
import { useNavigate } from "react-router-dom";
import React from 'react';
import NavbarMinimal from './components/AdminPanel';
import { useState, useEffect } from 'react';
import { AppShell, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

function App() {
 
  return (
    <>

      <BrowserRouter>
        <MantineProvider withNormalizeCSS withGlobalStyles >
          <NotificationsProvider position="top-right">
          <ModalsProvider>
            <DoubleHeader mainLinks={[
              { link: "/login", label: 'Login', loggedOnly: false },
              { link: "/register", label: 'Register', loggedOnly: false },
              { link: "/courses", label: 'Courses', loggedOnly: true },
              { link: "/manage-panel", label: 'Management', loggedOnly: true },

              { link: "/logout", label: 'Sign out', loggedOnly: true },

            ]} userLinks={[]} />

 
            <Routes>
              <Route path="/login" element={<Login />}></Route>

              <Route path="/register" element={<Register />}></Route>
              <Route path="/courses" element={<Courses />}></Route>
              <Route path="/courses/*" element={<Course />}></Route>
              <Route path="/my-courses" element={<MyCourses />}></Route>

              <Route path="/manage-panel" element={<NavbarMinimal />}></Route>

              <Route path="/" element={<Landing />}></Route>

            </Routes>
            {
              window.location.href.includes("login") != true ? (<FooterSocial />
              ) : (<NoHeader></NoHeader>)
            }
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </BrowserRouter>

    </>

  );
}

export default App;
