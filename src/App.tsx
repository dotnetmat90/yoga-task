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
import Course from './components/Course';
import Logout from './components/Logout';
import { useNavigate } from "react-router-dom";
import React from 'react';
import NavbarMinimal from './components/AdminPanel';
import { useState, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

function App() {
  // useEffect(() => {
  //   const loggedIn = localStorage.getItem("accessToken") !== null;
  //   const login = document.querySelectorAll("a[href='/login']")[0] as HTMLElement;
  //   const register = document.querySelectorAll("a[href='/register']")[0] as HTMLElement;
  //   const courses = document.querySelectorAll("a[href='/courses']")[0] as HTMLElement;
  //   const logout = document.querySelectorAll("a[href='/logout']")[0] as HTMLElement;
  //   if (loggedIn) {
  //     login.style.display = 'none';
  //     register.style.display = 'none';
  //     courses.style.display = 'block';
  //     logout.style.display = 'block';
  //   }
  //   else {
  //     login.style.display = 'block';
  //     register.style.display = 'block';
  //     courses.style.display = 'none';
  //     logout.style.display = 'none';
  //   }
  // });
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
