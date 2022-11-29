import { Route, Routes } from 'react-router';
import { HeaderMenu } from './components/Header';
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
import NavbarMinimal from './components/AdminPanel';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Settings from './components/Settings';
import NotFound from './components/NotFound';

function App() {

  return (
    <>

      <BrowserRouter>
        <MantineProvider withNormalizeCSS withGlobalStyles >
          <NotificationsProvider position="top-right">
            <ModalsProvider>
              <HeaderMenu links={[
                { label: "Login", link: "/login", links: null, userType: "none" },
                { label: "Register", link: "/register", links: null, userType: "none" },
                { label: "Courses", link: "/courses", links: null, userType: "student" },
                { label: "Settings", link: "/settings", links: null, userType: "student" },
                { label: "Sign out", link: "/signout", links: null, userType: "student" },

                {
                  label: "User", link: "/manage-panel", userType: "creator", links: [
                    {
                      label: "Management", link: "/manage-panel", userType: "creator"

                    },
                    {
                      label: "My courses", link: "/my-courses", userType: "creator"

                    },

                    { label: "Settings", link: "/settings", userType: "none" },
                    { label: "Sign out", link: "/signout", userType: "none" }
                  ]
                },

              ]} />


              <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/courses" element={<Courses />}></Route>
                <Route path="/courses/*" element={<Course />}></Route>
                <Route path="/my-courses" element={<MyCourses />}></Route>
                <Route path="/settings" element={<Settings />}></Route>

                <Route path="/manage-panel" element={<NavbarMinimal />}></Route>

                <Route path="/" element={<Landing />}></Route>
                <Route path="*" element={<NotFound />} />

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
