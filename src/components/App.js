import React, { Fragment, lazy, Suspense, useEffect } from "react"
import "../styles/app.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IndexPage from "./indexPage.js"

const Header = lazy(() => import("./dashboard/header"))
const Login = lazy(() => import("./dashboard/user/login"))
const Main = lazy(() => import("./dashboard/main/main"))
const Profile = lazy(() => import("./dashboard/user/profile"))
const Admin = lazy(() => import("./dashboard/admin/admin"))
const Contacts = lazy(() => import("./dashboard/contact/contact"))
const Forgot = lazy(() => import("./dashboard/user/forgot"))
const Signup = lazy(() => import("./dashboard/user/signup"))
const Chat = lazy(() => import("./dashboard/chat/chat"))
const Chats = lazy(() => import("./dashboard/chat/chats"))
const AdminProfile = lazy(() => import("./dashboard/admin/adminProfile"))


const setTitle = () => {
  document.title = "Comparer votre prime gratuitement"
}

const App = () => {
  useEffect(()=> {
    setTitle()
  },[])
 
  return (

    <div className="app">
      <BrowserRouter>


        <Routes>
          

          <Route path="/*" element={
            <Fragment>
            

              <Suspense fallback={<IndexPage/>}>
                <Header />
              </Suspense>


               <Routes>


               <Route path="/*" element={<Suspense fallback={<IndexPage/>}>
                  <Main />
                </Suspense>} />

                <Route path="/contacts" element={<Suspense fallback={<IndexPage/>}>
                  <Contacts />
                </Suspense>} />

                <Route path="/profile" element={<Suspense fallback={<IndexPage/>}>
                  <Profile />
                </Suspense>} /> 

                <Route path="/admin" element={<Suspense fallback={<IndexPage/>}>
                  <Admin />
                </Suspense>} /> 

                 <Route path="/adminprofile/:id" element={<Suspense fallback={<IndexPage/>}>
                  <AdminProfile />
                </Suspense>} /> 

                <Route path="/chats" element={<Suspense fallback={<IndexPage/>}>
                  <Chats />
                </Suspense>} /> 

                 <Route path="/chat/:id" element={<Suspense fallback={<IndexPage/>}>
                  <Chat />
                </Suspense>} /> 


              </Routes> 


            </Fragment>
          } />





          <Route path="/forgot" element={
            <Suspense fallback={<IndexPage />}>
              <Forgot />
            </Suspense>
          } />

          <Route path="/login" element={
            <Suspense fallback={<IndexPage />}>
              <Login />
            </Suspense>
          } />

          <Route path="/signup" element={
            <Suspense fallback={<IndexPage />}>
              <Signup />
            </Suspense>
          } />

          </Routes>
    

       
      </BrowserRouter>
    </div>

  );
}

export default App;
