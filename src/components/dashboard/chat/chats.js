import React, { Fragment, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
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
import { delete_chat, get_all_chats, get_chats_Count_pag } from "../../../redux/actions/chat";
import { getLocalStorage } from "../../../shared/localStorage";

const Chats = () => {
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: CLEAR_MESSAGE })

        if (!isAuthentication()) {
            navigate("/login")
        }

    }, [])

    const [Count, setCount] = useState(0)
    const [Pages, setPages] = useState({ pages: ["", "", ""], currentPage: 1 })
    const [Chats, setChats] = useState([])


    const dispatch = useDispatch()

    const { loading } = useSelector(state => state.loading)
    const { count_pag, chats } = useSelector(state => state.chat)

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

        dispatch(get_chats_Count_pag({ filter: JSON.stringify(filter) }, authorization))
        dispatch(get_all_chats({ filter: JSON.stringify(filter), limit, skip, sort: '{"_id" : -1}' }, authorization))
    }, [dispatch, Pages.currentPage])

    useEffect(() => {
        setChats(chats)
        setCount(count_pag)
    }, [count_pag, chats])


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
        convertJsonToExcel("chat", [chat])
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

        List({ filter: JSON.stringify(filter), sort: '{"_id" : -1}' }, authorization).then(({ data }) => {

            if (!data.err) {
                dispatch({ type: STOP_LOADING })
                convertJsonToExcel("chats", data.msg)
            } else {
                console.log("get contacts err ", data.msg);
                alert(data.msg)
                dispatch({ type: STOP_LOADING })
            }

        }).catch(err => {
            console.log("obtenir des erreurs d'api de contacts ", err);
            alert("Une erreur s'est produite. Veuillez réessayer")
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
                    paginations.push(<li className="page-item" key={pageid}><a onClick={() => { setCurrentPags(pageid) }} className={myClassNames("page-link", { "active": pageid == currentPage })} href="#">{pageid}</a></li>)
                    if (pageid == 3) {
                        paginations.push(<li key="next" className="page-item"><a href="#" onClick={() => { setCurrentPags("next") }}>next</a></li>)
                        return
                    }
                }

            }
            else if (pagesLength > 0 && currentPage == pagesLength || currentPage == (pagesLength - 1) || currentPage == (pagesLength - 2)) {
                paginations.push(<li key="prev" className="page-item"><a href="#" onClick={() => { setCurrentPags("prev") }}>Prev</a></li>)

                for (let pageid = (pagesLength - 3); pageid <= pagesLength; pageid++) {
                    if (pageid > 0) {
                        paginations.push(<li key={pageid} className="page-item"><a onClick={() => { setCurrentPags(pageid) }} className={myClassNames("page-link", { "active": pageid == currentPage })} href="#">{pageid}</a></li>)
                    }
                }

            }
            else {
                paginations.push(<li key="prev" className="page-item"><a href="#" onClick={() => { setCurrentPags("prev") }}>Prev</a></li>)

                for (let pageid = (currentPage - 1); pageid <= pagesLength; pageid++) {
                    paginations.push(<li key={pageid} className="page-item"><a onClick={() => { setCurrentPags(pageid) }} className={myClassNames("page-link", { "active": pageid == currentPage })} href="#">{pageid}</a></li>)

                    if (pageid == currentPage + 2) {
                        paginations.push(<li key="next" className="page-item"><a href="#" onClick={() => { setCurrentPags("next") }}>Next</a></li>)

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
                        <button onClick={exportData}>Exporter des données</button>
                    } 
                    
                    {user.rule === "admin" &&
                       <button onClick={addChat}>Ajouter un message</button> }
                   </div> 
                   
                {chats && Chats && Chats.length > 0 &&

                    <div className="table-wrap">
                        <table className="table table-responsive-xl">
                            <thead>
                                <tr>
                                    <th>Nom et prénom</th>
                                    <th>E-mail</th>
                                    <th>Message</th>
                                    <th>A répondu</th>
                                    <th>Répondre</th>
                                    {user.rule === "admin" && <th>Vue</th>}
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
                                                <td>{extractDesk(chat.message, 50)}</td>

                                                <td className="status"><span className={chat.replied ? "active" : "waiting"} >{chat.replied ? "Oui" : "Non"}</span> </td>

                                                <td>{chat.replied ? extractDesk(chat.reply_message, 50) : "..."}</td>
                                              
                                                 {user.rule === "admin" && <td className="status"><span className={chat.viewed == true ? "active" : "waiting" }>Vue</span></td> }

                                              
                                                <td>


                                                    <button type="button" className="edit" onClick={() => { replyChat(chat._id) }}>
                                                        <span aria-hidden="true"><i className="fa-solid fa-comment-dots"></i></span>
                                                    </button>


                                                    <button type="button" className="download" onClick={() => { viewChat(chat) }}>
                                                        <span aria-hidden="true"><i className="fa-solid fa-file-arrow-down"></i></span>

                                                    </button>



                                                    {user.rule != "admin" &&
                                                        <button type="button" className="delete" onClick={() => { deleteChat(chat._id) }}>
                                                            <span aria-hidden="true"><i className="fa-solid fa-trash-can"></i></span>
                                                        </button>
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

                <div >
                    <ul  className="pagination justify-content-center">
                        {paginations}
                    </ul>
                </div>



            </main>
        </Fragment>
    );
}
export default Chats;