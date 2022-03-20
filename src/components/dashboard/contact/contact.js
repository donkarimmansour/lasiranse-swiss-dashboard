import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/main.css";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import { delete_all_contact, get_all_contacts, get_contact_Count_pag, update_contact, view_all_contact } from "../../../redux/actions/contact";
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
        setshowDel(true)


    }

    const downloadContact = (id, contact) => {
        dispatch(view_all_contact(id, authorization))

        convertJsonToExcel("contact", [contact])
    }

    const deleteContact = (id) => {
        const conf = window.confirm("Êtes-vous sûr")
        if (conf) {
            dispatch(delete_all_contact(id, authorization))
        }
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
                convertJsonToExcel("contacts", data.msg)
            } else {
                console.log("get contacts err ", data.msg);
                alert(data.msg)
                dispatch({ type: STOP_LOADING })
            }

        }).catch(err => {
            console.log("get contacts api err ", err);
            alert("Une erreur s'est produite. Veuillez réessayer")
            dispatch({ type: STOP_LOADING })
        })
    }




    const View = () =>

        Contact && Contact.fullname && <Fragment>

            <div className="pupup" style={{ display: "block" }} >
                <h5>Contact</h5>
                <p>Nom et prénom : {Contact.fullname}</p>
                <p>E-mail : {Contact.email}</p>
                <p>Téléphoner : {Contact.phone}</p>
                <p>Naissance : {Contact.naissance}</p>
                <p>Franchise : {Contact.franchise}</p>
                {/* <p>Nom et prénom : {Contact.fullname}</p> */}
                <p>Npa : {Contact.npa}</p>
                <button onClick={() => {
                    setshowDel(false)
                }
                } >Bien</button>
            </div>
            </Fragment>




    const limit = 20


    const paginations = []
    const Pagination = () => {


        const currentPage = Pages.currentPage
        const pagesLength = Pages.pages.length

      
        if (pagesLength > 0) {

            if (currentPage == 1) {

                for (let pageid = 1; pageid <= pagesLength; pageid++) {
                    paginations.push(<li className="page-item" key={pageid}><a onClick={() => { setCurrentPags(pageid) }} className={myClassNames("page-link", "page-link", { "active": pageid == currentPage })} href="#">{pageid}</a></li>)
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
                {showDel && View()}

                {all_contacts && Contacts && Contacts.length > 0 &&
                    <div className="export-data">
                        <button onClick={exportData}>Exporter des données</button>

                    </div>
                }

                {all_contacts && Contacts && Contacts.length > 0 &&

                    <div className="table-wrap">
                        <table className="table table-responsive-xl">
                            <thead>
                                <tr>
                                    <th>Nom complet et e-mail</th>
                                    <th>téléphoner</th>
                                    <th>Naissance</th>
                                    <th>Franchise</th>
                                    <th>Npa</th>
                                    <th>{user.rule === "admin" ? "Vue" : "Utilisée"}</th>
                                    {user.rule !== "admin" && <th>utilisateur</th>}
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    Contacts.map((contact, ci) => {
                                        return (
                                            <tr key={ci}>


                                                <td className="d-flex align-items-center">
                                                    <div className="pl-3 email">
                                                        <span>{contact.fullname}</span>
                                                        <span style={{ marginTop: "5px" }}>{contact.email}</span>
                                                    </div>
                                                </td>

                                                <td>{extractDesk(contact.phone, 10)}</td>
                                                <td>{extractDesk(contact.naissance, 10)}</td>
                                                <td>{extractDesk(contact.franchise, 10)}</td>
                                                <td>{extractDesk(contact.npa, 10)}</td>

                                                <td className="status"><span className={user.rule == "admin" ? contact.viewed ? "active" : "waiting" : contact.used ? "active" : "waiting"}>{user.rule == "admin" ? contact.viewed ? "Active" : "Non" : contact.used ? "Active" : "Non"}</span></td>


                                                {user.rule !== "admin" && (
                                                    <td>
                                                    {contact.used && (
                                                        <Link to={contact.user_id ? `/adminprofile/${contact.user_id._id}` : "#"}>
                                                        {contact.user_id ? `${contact.user_id.firstname} ${contact.user_id.lastname}` : "del"}
                                                        </Link>
                                                    )}
                                                    {!contact.used && "..."}
                                                    </td>
                                                )}

                                                <td>{contact.type === "demo" ? "démo" : "production"}</td>

                                                <td>

                                                    <button type="button" className="download" onClick={() => { downloadContact(contact._id, contact) }}>
                                                        <span aria-hidden="true"><i className="fa-solid fa-file-arrow-down"></i></span>

                                                    </button>

                                                    <button type="button" className="edit" onClick={() => { viewContact(contact._id, contact) }}>
                                                        <span aria-hidden="true"><i className="fa-solid fa-eye"></i></span>
                                                    </button>

                                                    {user.rule != "admin" &&
                                                        <button type="button" className="delete" onClick={() => { deleteContact(contact._id) }}>
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
                    <ul className="pagination justify-content-center">
                        {paginations}
                    </ul>
                </div>



            </main>
        </Fragment>
    );
}
export default Contacts;