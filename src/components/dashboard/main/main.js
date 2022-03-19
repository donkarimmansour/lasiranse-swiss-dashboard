import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthentication } from "../../../shared/auth";
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/main.css";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import {
  delete_contact,
  get_contact,
  get_contact_Count,
  update_contact,
  view_contact,
} from "../../../redux/actions/contact";
import { getCookie } from "../../../shared/cookie";
import { loader } from "../../../shared/elements";
import { convertJsonToExcel, extractDesk } from "../../../shared/funs";
import { get_admin_Count } from "../../../redux/actions/user";
import { get_chats_Count } from "../../../redux/actions/chat";
import { getLocalStorage } from "../../../shared/localStorage";

const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: CLEAR_MESSAGE });
    if (user.rule == "admin" && user.isAccountActivated) {
      dispatch(update_contact(user._id, authorization));
    }
  }, []);

  const [Contacts, setContacts] = useState(0);
  const [ContactN, setContactN] = useState(0);
  const [ChatN, setChatN] = useState(0);
  const [UserN, setUserN] = useState(0);
  const [showDel, setshowDel] = useState(false);
  const [Contact, setContact] = useState({});

  const { loading } = useSelector((state) => state.loading);
  const { count: contactN, contacts } = useSelector((state) => state.contact);
  const { count: userN } = useSelector((state) => state.user);
  const { count: chatN } = useSelector((state) => state.chat);

  const authorization = isAuthentication()
    ? { Authorization: `bearer ${getCookie("token")}` }
    : [{ _id: "" }];
  const user = localStorage.getItem("user")
    ? getLocalStorage("user")
    : [{ _id: "" }];

  useEffect(() => {
    if (user.rule == "superAdmin") {
      dispatch(
        get_contact_Count(
          { filter: '{"name" : { "$ne": "xxxlxxx" }}' },
          authorization
        )
      );
      dispatch(
        get_admin_Count(
          { filter: '{"name" : { "$ne": "xxxlxxx" }}' },
          authorization
        )
      );
      dispatch(
        get_chats_Count(
          { filter: '{"name" : { "$ne": "xxxlxxx" }}' },
          authorization
        )
      );
      dispatch(
        get_contact(
          {
            filter: '{"name" : { "$ne": "xxxlxxx" }}',
            limit: 10,
            sort: '{"_id" : -1}',
          },
          authorization
        )
      );
    } else if (user.rule == "admin") {
      dispatch(
        get_contact_Count(
          {
            filter: JSON.stringify({
              $or: [
                { type: "demo" },
                { $and: [{ used: true, user_id: user._id }] },
              ],
            }),
          },
          authorization
        )
      );
      dispatch(
        get_chats_Count(
          { filter: JSON.stringify({ user_id: user._id }) },
          authorization
        )
      );
      dispatch(
        get_contact(
          {
            filter: JSON.stringify({
              $or: [
                { type: "demo" },
                { $and: [{ used: true, user_id: user._id }] },
              ],
            }),
            limit: 10,
            sort: '{"_id" : -1}',
          },
          authorization
        )
      );
    }
  }, [dispatch]);

  useEffect(() => {
    setContactN(contactN);
    setContacts(contacts);
  }, [contactN, contacts]);

  useEffect(() => {
    setUserN(userN);
    setChatN(chatN);
  }, [userN, chatN]);

  const viewContact = (id, contact) => {
    dispatch(view_contact(id, authorization));

    setContact(contact);
    setshowDel(true);
  };

  const downloadContact = (id, contact) => {
    dispatch(view_contact(id, authorization));

    convertJsonToExcel("contact", [contact]);
  };

  const deleteContact = (id) => {
    const conf = window.confirm("Are you sure");
    if (conf) {
      dispatch(delete_contact(id, authorization));
    }
  };

  const View = () =>
    Contact &&
    Contact.fullname && (
      <Fragment>
        <div className="pupup" style={{ display: "block" }}>
          <h5>Contact</h5>
          <p>Nom et prénom : {Contact.fullname}</p>
          <p>E-mail : {Contact.email}</p>
          <p>Téléphoner : {Contact.phone}</p>
          <p>Naissance : {Contact.naissance}</p>
          <p>Franchise : {Contact.franchise}</p>
          {/* <p>Nom et prénom : {Contact.fullname}</p> */}
          <p>Npa : {Contact.npa}</p>
          <button
            onClick={() => {
              setshowDel(false);
            }}
          >
            Bien
          </button>
        </div>
      </Fragment>
    );

  return (
    <Fragment>
      <main>
        {loading && loader()}
        {showDel && View()}

        <div
          className="cardbox"
          style={{
            gridTemplateColumns: `repeat(${
              user.rule !== "admin" ? 3 : 2
            } , minmax(100px , 1fr))`,
          }}
        >
          {user.rule !== "admin" && UserN && contactN && (
            <Link to="/admin">
              <div className="card">
                <div>
                  <span>{UserN}</span>
                  <p>Utilisateurs</p>
                </div>
                <div className="icon">
                  <i className="fa-solid fa-users"></i>
                </div>
              </div>
            </Link>
          )}

          {ContactN && contactN && (
            <Link to="/contacts">
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
          )}

          {ChatN && chatN && (
            <Link to="/chats">
              <div className="card">
                <div>
                  <span>{ChatN}</span>
                  <p>Message</p>
                </div>
                <div className="icon">
                  <i className="fa-solid fa-comment"></i>
                </div>
              </div>
            </Link>
          )}
        </div>

        {contacts && Contacts && (
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
                {Contacts.map((contact, ci) => {
                  return (
                    <tr key={ci}>
                      <td className="d-flex align-items-center">
                        <div className="pl-3 email">
                          <span>{contact.fullname}</span>
                          <span style={{ marginTop: "5px" }}>
                            {contact.email}
                          </span>
                        </div>
                      </td>

                      <td>{extractDesk(contact.phone, 10)}</td>
                      <td>{extractDesk(contact.naissance, 10)}</td>
                      <td>{extractDesk(contact.franchise, 10)}</td>
                      <td>{extractDesk(contact.npa, 10)}</td>

                      <td className="status">
                        <span
                          className={
                            user.rule == "admin"
                              ? contact.viewed
                                ? "active"
                                : "waiting"
                              : contact.used
                              ? "active"
                              : "waiting"
                          }
                        >
                          {user.rule == "admin"
                            ? contact.viewed
                              ? "Active"
                              : "Non"
                            : contact.used
                            ? "Active"
                            : "Non"}
                        </span>
                      </td>

                      {user.rule !== "admin" && (
                        <td>
                          {contact.used && (
                            <Link to={`/adminprofile/${contact.user_id._id}`}>
                              {`${contact.user_id.firstname} ${contact.user_id.lastname}`}
                            </Link>
                          )}
                          {!contact.used && "..."}
                        </td>
                      )}

                      <td>{contact.type === "demo" ? "démo" : "production"}</td>

                      <td>
                        <button
                          type="button"
                          className="download"
                          onClick={() => {
                            downloadContact(contact._id, contact);
                          }}
                        >
                          <span aria-hidden="true">
                            <i className="fa-solid fa-file-arrow-down"></i>
                          </span>
                        </button>

                        <button
                          type="button"
                          className="edit"
                          onClick={() => {
                            viewContact(contact._id, contact);
                          }}
                        >
                          <span aria-hidden="true">
                            <i className="fa-solid fa-eye"></i>
                          </span>
                        </button>

                        {user.rule != "admin" && (
                          <button
                            type="button"
                            className="delete"
                            onClick={() => {
                              deleteContact(contact._id);
                            }}
                          >
                            <span aria-hidden="true">
                              <i className="fa-solid fa-trash-can"></i>
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Fragment>
  );
};
export default Main;
