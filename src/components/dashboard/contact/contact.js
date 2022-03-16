import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/main.css";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import { delete_contact, get_all_contacts, get_contact_Count_pag, update_contact, view_all_contact } from "../../../redux/actions/contact";
import { loader } from "../../../shared/elements";
import { convertJsonToExcel, extractDesk } from "../../../shared/funs";
import myClassNames from 'classnames';
import { getCookie } from "../../../shared/cookie";
import { isAuthentication } from "../../../shared/auth";
import { List } from "../../../services/contact";
import { START_LOADING, STOP_LOADING } from "../../../redux/constans/loading";
import { getLocalStorage } from "../../../shared/localStorage";

const Contacts = () => {
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: CLEAR_MESSAGE })

        if (!isAuthentication()) {
            navigate("/login")
        }

    }, [])

    const [Count, setCount] = useState(0)
    const [Pages, setPages] = useState({ pages: ["", "", ""], currentPage: 1 })
    const [Contacts, setContacts] = useState([])
    const [showDel, setshowDel] = useState(false)
    const [Contact, setContact] = useState({})

    const dispatch = useDispatch()

    const { loading } = useSelector(state => state.loading)
    const { count_pag, all_contacts } = useSelector(state => state.contact)

    const authorization = isAuthentication() ? { "Authorization": `bearer ${getCookie("token")}` } : [{ _id: "" }]
    const user = localStorage.getItem("user") ? getLocalStorage("user") : [{ _id: "" }]

    useEffect(() => {
        if (user.rule == "admin" && user.isAccountActivated) {
            dispatch(update_contact(user._id, authorization))
        }
    }, [dispatch])


    useEffect(() => {
        const skip = Pages.currentPage == 1 ? 0 : ((Pages.currentPage - 1) * limit)


        let filter = {}

        if (user.rule === "superAdmin") {
            filter = { name: { $ne: "xxxlxxx" } }
        } else {
            filter = { $or: [{ type: "demo" }, { $and: [{ used: true, user_id: user._id }] }] }
        }
        dispatch(get_contact_Count_pag({ filter: JSON.stringify(filter) }, authorization))
        dispatch(get_all_contacts({ filter: JSON.stringify(filter), limit, skip, sort: '{"_id" : -1}' }, authorization))

    }, [dispatch, Pages.currentPage])


    useEffect(() => {
        setContacts(all_contacts)
        setCount(count_pag)
        console.log(all_contacts);
    }, [count_pag, all_contacts])


    useEffect(() => {

        setPages((Pages) => {
            Pages.pages.length = Math.ceil(Count / limit)
            Pages.pages.fill("page")
            return { ...Pages, pages: Pages.pages }
        })
    }, [Count])


    const viewContact = (id, contact) => {
        dispatch(view_all_contact(id, authorization))

        setContact(contact)
        convertJsonToExcel("contact", [contact])
        setshowDel(true)


    }

    const exportData = () => {
        dispatch({ type: START_LOADING })

        let filter = {}


        if (user.rule == "admin") {
            filter = { "user_id": user._id, used: true }
        } else if (user.rule == "superAdmin") {
            filter = { name: { $ne: "xxxlxxx" } }

        }

        List({ filter: JSON.stringify(filter), sort: '{"_id" : -1}' }, authorization).then(({ data }) => {

            if (!data.err) {
                dispatch({ type: STOP_LOADING })
                convertJsonToExcel("contacts" , data.msg)
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


    const deleteContact = (id) => {
        const conf = window.confirm("Are you sure")
        if (conf) {
            dispatch(delete_contact(id, authorization))
        }
    }

    const View = () =>

        Contact && Contact.fullname && <Fragment>

            <div className="pupup" style={{ display: "block" }} >
                <h5>Contact</h5>
                <p>fullname : {Contact.fullname}</p>
                <p>email : {Contact.email}</p>
                <p>phone : {Contact.phone}</p>
                <p>naissance : {Contact.naissance}</p>
                <p>franchise : {Contact.franchise}</p>
                <p>fullname : {Contact.fullname}</p>
                <p>npa : {Contact.npa}</p>
                <button onClick={() => {
                    setshowDel(false)
                }
                } >OK</button>
            </div></Fragment>




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
                {showDel && View()}

                {all_contacts && Contacts && Contacts.length > 0 &&
                    <div className="export-data">
                        <button onClick={exportData}>Export Data</button>

                    </div>
                }

                {all_contacts && Contacts && Contacts.length > 0 &&

                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fullname</th>
                                    <th>Email</th>
                                    <th>phone</th>
                                    <th>Naissance</th>
                                    <th>Franchise</th>
                                    <th>NPA</th>
                                    <th>{user.rule === "admin" ? "viewed" : "Used"}</th>
                                    {user.rule !== "admin" && <th>user</th>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    Contacts.map((contact, ci) => {
                                        return (
                                            <tr key={ci}>
                                                <td>{extractDesk(contact.fullname, 10)}</td>
                                                <td>{extractDesk(contact.email, 10)}</td>
                                                <td>{extractDesk(contact.phone, 10)}</td>
                                                <td>{extractDesk(contact.naissance, 10)}</td>
                                                <td>{extractDesk(contact.franchise, 10)}</td>
                                                <td>{extractDesk(contact.npa, 10)}</td>

                                                <td>{user.rule == "admin" ? contact.viewed ? "yes" : "no" : contact.used ? "yes" : "no"}</td>

                                                {user.rule !== "admin" && <td>
                                                    {contact.used && <Link to={`/adminprofile/${contact.user_id._id}`}>
                                                        {`${contact.user_id.firstname} ${contact.user_id.lastname}`}</Link>}
                                                    {!contact.used && "..."}
                                                </td>}


                                                <td><button className="view" href="" onClick={() => { viewContact(contact._id, contact) }}  >view</button>
                                                    {user.rule != "admin" &&
                                                        <button className="delete" href="" onClick={() => { deleteContact(contact._id) }}  >delete</button>}

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
export default Contacts;