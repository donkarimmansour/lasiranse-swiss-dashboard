import React, { Fragment, useEffect, useState } from "react"
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthentication} from '../../shared/auth';
import { useDispatch, useSelector } from "react-redux";
import "../../styles/main.css";
import { CLEAR_MESSAGE } from "../../redux/constans/message";
import { delete_contact, get_contact, get_contact_Count, view_contact } from "../../redux/actions/contact";
import { getCookie } from "../../shared/cookie";
import { loader } from "../../shared/elements";
import { extractDesk } from "../../shared/funs";


const Main = () => {
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: CLEAR_MESSAGE })

    }, [])


    const [Contacts , setContacts] = useState(0)
    const [ContactN , setContactN] = useState(0)
    const [showDel , setshowDel] = useState(false)
    const [Contact , setContact] = useState({})

    const dispatch = useDispatch() 
    const { t } = useTranslation();
    
    const { loading } = useSelector(state => state.loading)
    const { count : contactN , contacts } = useSelector(state => state.contact)

   const authorization = isAuthentication() ? { "Authorization": `bearer ${getCookie("token")}` } : [{ _id: "" }]


    useEffect(() => {
        dispatch(get_contact_Count( { filter : '{"name" : { "$ne": "xxxlxxx" }}' } , authorization))       
        dispatch(get_contact( { filter : '{"name" : { "$ne": "xxxlxxx" }}' , limit : 10 , sort : '{"_id" : -1}'} , authorization))   
    }, [dispatch])

    useEffect(() => {
       setContactN(contactN)
       setContacts(contacts)
    }, [ contactN , contacts])

 
   const viewContact = (id, contact) => {
      dispatch(view_contact(id , authorization))  

      setContact(contact)
      setshowDel(true)
   }

   const deleteContact = (id ) => {
       const conf = window.confirm(t("Are you sure"))
        if(conf){
            dispatch(delete_contact(id , authorization))
        }
   }

     const View = () => 
     
     Contact && Contact.fullname && <Fragment>
        
        <div className="confirmed" style={{ display: "block" }} id="confirmed">
            <h5>Contact</h5>
            <p style={{padding : "3px 0"}}>fullname : {Contact.fullname}</p>
            <p style={{padding : "3px 0"}}>email : {Contact.email}</p>
            <p style={{padding : "3px 0"}}>phone : {Contact.phone}</p>
            <p style={{padding : "3px 0"}}>naissance : {Contact.naissance}</p>
            <p style={{padding : "3px 0"}}>franchise : {Contact.franchise}</p>
            <p style={{padding : "3px 0"}}>fullname : {Contact.fullname}</p>
            <p style={{padding : "3px 0"}}>npa : {Contact.npa}</p> 
            <button onClick={() => {
                setshowDel(false)
            }
            } >{t("OK")}</button>
        </div></Fragment>


    return (

        <Fragment> 
            <main>

            {loading && loader()}
            {showDel && View()}

                <div className="cardbox">

                   {ContactN && contactN &&
                        <Link to="/admin/contacts">
                            <div className="card">
                                <div>
                                    <span>{ContactN}</span>
                                    <p>Contacts</p>
                                </div>
                                <div className="icon">
                                    <i className="fa-solid fa-file-signature"></i>

                                </div>
                            </div>
                        </Link>
                        
                    }
                </div>


                {contacts && Contacts  &&

                    <div className="table" style={{ overflowX : "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fullname</th>
                                    <th>Email</th>
                                    <th>phone</th>
                                    <th>Naissance</th>
                                    <th>Franchise</th>
                                    <th>NPA</th>
                                    <th>viewed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                            {
                                Contacts.map((contact, ci) => {
                                    return (
                                        <tr key={ci}>
                                            <td>{extractDesk(contact.fullname , 10)}</td>
                                            <td>{extractDesk(contact.email , 10)}</td>
                                            <td>{extractDesk(contact.phone , 10)}</td>
                                            <td>{extractDesk(contact.naissance , 10)}</td>
                                            <td>{extractDesk(contact.franchise , 10)}</td>
                                            <td>{extractDesk(contact.npa , 10)}</td>
                                            <td>{extractDesk(contact.viewed ? "yes" : "no" , 10)}</td>
                                            <td><button className="view" href="" onClick={() => {viewContact(contact._id , contact)}}  >view</button>
                                             <button className="delete" href=""  onClick={() => {deleteContact(contact._id)}}  >delete</button></td>
                                        </tr>
                                    )
                                })
                            }
                               
                             
                        
                           </tbody>
                        </table>

                    </div>

                }




            </main>
        </Fragment>
    );
}
export default Main;