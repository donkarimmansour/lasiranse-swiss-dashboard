import React, { Fragment, lazy, Suspense, useEffect } from "react"
import "../styles/app.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IndexPage from "./indexPage.js"

const Header = lazy(() => import("./dashboard/header"))
const Login = lazy(() => import("./dashboard/user/login"))
const Main = lazy(() => import("./dashboard/main"))
const Profile = lazy(() => import("./dashboard/user/profile"))
const Contacts = lazy(() => import("./dashboard/contact"))
const Forgot = lazy(() => import("./dashboard/user/forgot"))
const Index = lazy(() => import("./index/index"))


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
            <Suspense fallback={<IndexPage/>}>
              <Index />
            </Suspense>
        } />
        
          

          <Route path="/admin/*" element={
            <Fragment>
            

              <Suspense fallback={<IndexPage/>}>
                <Header />
              </Suspense>


               <Routes>


               <Route path="/" element={<Suspense fallback={<IndexPage/>}>
                  <Main />
                </Suspense>} />

                <Route path="/contacts" element={<Suspense fallback={<IndexPage/>}>
                  <Contacts />
                </Suspense>} />

                <Route path="/profile" element={<Suspense fallback={<IndexPage/>}>
                  <Profile />
                </Suspense>} /> 


              </Routes> 


            </Fragment>
          } />





          <Route path="/admin/forgot" element={
            <Suspense fallback={<IndexPage />}>
              <Forgot />
            </Suspense>
          } />

          <Route path="/admin/login" element={
            <Suspense fallback={<IndexPage />}>
              <Login />
            </Suspense>
          } />

          </Routes>
    

       
      </BrowserRouter>
    </div>

  );
}

export default App;
