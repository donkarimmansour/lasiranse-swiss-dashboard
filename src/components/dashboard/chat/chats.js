import React, { Fragment, useEffect, useState } from "react"
import {  useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/main.css";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import { loader } from "../../../shared/elements";
import myClassNames from 'classnames';
import { getCookie } from "../../../shared/cookie";
import { isAuthentication } from "../../../shared/auth";
import { convertJsonToExcel, extractDesk } from "../../../shared/funs";
import { List } from "../../../services/chat";
import { START_LOADING, STOP_LOADING } from "../../../redux/constans/loading";
import { delete_chat, get_all_chats, get_chats_Count_pag  } from "../../../redux/actions/chat";
import { getLocalStorage } from "../../../shared/localStorage";

const Chats = () => {
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: CLEAR_MESSAGE })

        if (!isAuthentication()) {
            navigate("/login")
        }

    }, [])

    const [Count , setCount] = useState(0)
    const [Pages, setPages] = useState({ pages: ["", "", ""], currentPage: 1 })
    const [Chats , setChats] = useState([])


    const dispatch = useDispatch() 
    
    const { loading } = useSelector(state => state.loading)
    const { count_pag , chats } = useSelector(state => state.chat)

    const authorization = isAuthentication() ? { "Authorization": `bearer ${getCookie("token")}` } : [{ _id: "" }]
    const user = localStorage.getItem("user") ? getLocalStorage("user") : [{ _id: "" }]

    useEffect(() => {
        const skip = Pages.currentPage == 1 ? 0 : ((Pages.currentPage - 1) * limit)

        
        let filter = {}

        if (user.rule === "superAdmin") {
            filter = { name: { $ne: "xxxlxxx" } }
        } else {
            filter = { "user_id": user._id }

        }

        dispatch(get_chats_Count_pag({ filter : JSON.stringify(filter) }  , authorization))
        dispatch(get_all_chats({ filter: JSON.stringify(filter)  , limit  , skip , sort : '{"_id" : -1}'}  , authorization))
    }, [dispatch , Pages.currentPage])

    useEffect(() => {
              setChats(chats)
              setCount(count_pag)
    }, [ count_pag , chats])

 
    useEffect(() => {

        setPages((Pages) => {
            Pages.pages.length = Math.ceil(Count / limit)
            Pages.pages.fill("page")
            return { ...Pages, pages: Pages.pages }
        })
    }, [Count])


   
    

    const addChat = () => {
        navigate(`/chat/new`)
    }

    const replyChat = (id) => {
        navigate(`/chat/${id}`)
    }

    const viewChat = (chat) => {
        convertJsonToExcel( "chat" ,[chat])
    }

    const deleteChat = (id) => {
        const conf = window.confirm("Are you sure")
        if (conf) {
            dispatch(delete_chat(id, authorization))
        }
    }
  

   const exportData = () => {
    dispatch({ type: START_LOADING })

       let filter = {}
       if (user.rule == "admin") {
           filter = { "user_id": user._id }
       } else if (user.rule == "superAdmin") {
           filter = { name: { $ne: "xxxlxxx" } }

       }

    List({ filter : JSON.stringify(filter) , sort : '{"_id" : -1}' } , authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            convertJsonToExcel("chats" , data.msg)
        } else {
            console.log("get contacts err ", data.msg);
            alert(data.msg)
            dispatch({ type: STOP_LOADING })
        }

    }).catch(err => {
        console.log("get contacts api err ", err);
        alert("something went wrong please try again")
        dispatch({ type: STOP_LOADING })
    })
   }


   

   
   const limit = 20
 

   const paginations = []
   const Pagination = () => {


       const currentPage = Pages.currentPage
       const pagesLength = Pages.pages.length

       if (pagesLength > 0) {

           if (currentPage == 1) {

               for (let pageid = 1; pageid <= pagesLength; pageid++) {
                   paginations.push(<li key={pageid}><a onClick={() => { setCurrentPags(pageid) }} className={myClassNames({ "active": pageid == currentPage })} href="#">{pageid}</a></li>)
                   if (pageid == 3) {
                       paginations.push(<li key="next"><a href="#" onClick={() => { setCurrentPags("next") }}>next</a></li>)
                       return
                   }
               }

           }
           else if (pagesLength > 0 && currentPage == pagesLength || currentPage == (pagesLength - 1) || currentPage == (pagesLength - 2)) {
               paginations.push(<li key="prev"><a href="#" onClick={() => { setCurrentPags("prev") }}>Prev</a></li>)

               for (let pageid = (pagesLength - 3); pageid <= pagesLength; pageid++) {
                   if (pageid > 0) {
                       paginations.push(<li key={pageid}><a onClick={() => { setCurrentPags(pageid) }} className={myClassNames({ "active": pageid == currentPage })} href="#">{pageid}</a></li>)
                   }
               }

           }
           else {
               paginations.push(<li key="prev"><a href="#" onClick={() => { setCurrentPags("prev") }}>Prev</a></li>)

               for (let pageid = (currentPage - 1); pageid <= pagesLength; pageid++) {
                   paginations.push(<li key={pageid}><a onClick={() => { setCurrentPags(pageid) }} className={myClassNames({ "active": pageid == currentPage })} href="#">{pageid}</a></li>)

                   if (pageid == currentPage + 2) {
                       paginations.push(<li key="next"><a href="#" onClick={() => { setCurrentPags("next") }}>Next</a></li>)

                       return
                   }
               }
           }
       }//end if


   }//end Pagination

   (() => {
       Pagination()
   })()

   const setCurrentPags = (current) => {
       if (current == "prev") setPages({ ...Pages, currentPage: Pages.currentPage - 1 })
       else if (current == "next") setPages({ ...Pages, currentPage: Pages.currentPage + 1 })
       else setPages({ ...Pages, currentPage: current })
   }


    return (

        <Fragment> 
            <main>

            {loading && loader()}
            <div className="export-data">

            {chats && Chats && Chats.length > 0 &&
                  <button onClick={exportData}>Export Data</button>
            } <button onClick={addChat}>add message</button></div>

                {chats && Chats && Chats.length > 0 &&

                    <div className="table">
                        <table> 
                            <thead>
                                <tr>
                                    <th>Fullname</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Replied</th>
                                    <th>Reply</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                            {
                                Chats.map((chat, ci) => {
                                    return (
                                        <tr key={ci}>
                                            <td>{`${chat.fullname}`}</td>
                                            <td>{chat.email}</td>
                                            <td>{extractDesk(chat.message , 50)}</td>             
                                            <td>{chat.replied ? "yes" : "no"}</td>
                                            <td>{chat.replied ? extractDesk(chat.reply_message , 50) : "..."}</td>             
                                            <td>

                                              
                                                <button className="edit"  onClick={() => {replyChat(chat._id )}} >{ user.rule != "admin" ? chat.replied ? "open" : "reply" : chat.replied ? "open" : "waiting" }</button>

                                              <button className="view"  onClick={() => {viewChat( chat)}}  >view</button>

                                                {user.rule != "admin" &&
                                                    <button className="delete" onClick={() => { deleteChat(chat._id) }}>delete</button>
                                                }
                                              
                                             </td>
                                        </tr>
                                    )
                                })
                            } 
                               
                             
                        
                           </tbody>
                        </table>

                    </div>

                }
               
                <div className="pagination">
                    <ul>
                       {paginations}
                    </ul>
                </div>



            </main>
        </Fragment>
    );
}
export default Chats;