import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/main.css";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import {
  delete_admin,
  get_all_admins,
  get_admin_Count_pag,
} from "../../../redux/actions/user";
import { loader } from "../../../shared/elements";
import {
  convertJsonToExcel,
  extractDesk,
  ImageLink,
} from "../../../shared/funs";
import myClassNames from "classnames";
import { getCookie } from "../../../shared/cookie";
import { isAuthentication } from "../../../shared/auth";
import { List } from "../../../services/user";
import { START_LOADING, STOP_LOADING } from "../../../redux/constans/loading";
import moment from "moment";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: CLEAR_MESSAGE });

    if (!isAuthentication()) {
      navigate("/login");
    }
  }, []);

  const [Count, setCount] = useState(0);
  const [Pages, setPages] = useState({ pages: ["", "", ""], currentPage: 1 });
  const [Admins, setAdmins] = useState([]);

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.loading);
  const { count_pag, admins } = useSelector((state) => state.user);

  const authorization = isAuthentication()
    ? { Authorization: `bearer ${getCookie("token")}` }
    : [{ _id: "" }];

  useEffect(() => {
    const skip = Pages.currentPage == 1 ? 0 : (Pages.currentPage - 1) * limit;
    dispatch(
      get_admin_Count_pag(
        { filter: '{"name" : { "$ne": "xxxlxxx" }}' },
        authorization
      )
    );
    dispatch(
      get_all_admins(
        {
          filter: '{"name" : { "$ne": "xxxlxxx" }}',
          limit,
          skip,
          sort: '{"_id" : -1}',
        },
        authorization
      )
    );
  }, [dispatch, Pages.currentPage]);

  useEffect(() => {
    setAdmins(admins);
    setCount(count_pag);
  }, [count_pag, admins]);

  useEffect(() => {
    setPages((Pages) => {
      Pages.pages.length = Math.ceil(Count / limit);
      Pages.pages.fill("page");
      return { ...Pages, pages: Pages.pages };
    });
  }, [Count]);

  const limit = 20;

  const paginations = [];
  const Pagination = () => {
    const currentPage = Pages.currentPage;
    const pagesLength = Pages.pages.length;

    if (pagesLength > 0) {
      if (currentPage == 1) {
        for (let pageid = 1; pageid <= pagesLength; pageid++) {
          paginations.push(
            <li className="page-item" key={pageid}>
              <a
                onClick={() => {
                  setCurrentPags(pageid);
                }}
                className={myClassNames("page-link", "page-link", {
                  active: pageid == currentPage,
                })}
                href="#"
              >
                {pageid}
              </a>
            </li>
          );
          if (pageid == 3) {
            paginations.push(
              <li key="next" className="page-item">
                <a
                  href="#"
                  onClick={() => {
                    setCurrentPags("next");
                  }}
                >
                  next
                </a>
              </li>
            );
            return;
          }
        }
      } else if (
        (pagesLength > 0 && currentPage == pagesLength) ||
        currentPage == pagesLength - 1 ||
        currentPage == pagesLength - 2
      ) {
        paginations.push(
          <li key="prev" className="page-item">
            <a
              href="#"
              onClick={() => {
                setCurrentPags("prev");
              }}
            >
              Prev
            </a>
          </li>
        );

        for (let pageid = pagesLength - 3; pageid <= pagesLength; pageid++) {
          if (pageid > 0) {
            paginations.push(
              <li key={pageid} className="page-item">
                <a
                  onClick={() => {
                    setCurrentPags(pageid);
                  }}
                  className={myClassNames("page-link", {
                    active: pageid == currentPage,
                  })}
                  href="#"
                >
                  {pageid}
                </a>
              </li>
            );
          }
        }
      } else {
        paginations.push(
          <li key="prev" className="page-item">
            <a
              href="#"
              onClick={() => {
                setCurrentPags("prev");
              }}
            >
              Prev
            </a>
          </li>
        );

        for (let pageid = currentPage - 1; pageid <= pagesLength; pageid++) {
          paginations.push(
            <li key={pageid} className="page-item">
              <a
                onClick={() => {
                  setCurrentPags(pageid);
                }}
                className={myClassNames("page-link", {
                  active: pageid == currentPage,
                })}
                href="#"
              >
                {pageid}
              </a>
            </li>
          );

          if (pageid == currentPage + 2) {
            paginations.push(
              <li key="next" className="page-item">
                <a
                  href="#"
                  onClick={() => {
                    setCurrentPags("next");
                  }}
                >
                  Next
                </a>
              </li>
            );

            return;
          }
        }
      }
    } //end if
  }; //end Pagination

  (() => {
    Pagination();
  })();

  const setCurrentPags = (current) => {
    if (current == "prev")
      setPages({ ...Pages, currentPage: Pages.currentPage - 1 });
    else if (current == "next")
      setPages({ ...Pages, currentPage: Pages.currentPage + 1 });
    else setPages({ ...Pages, currentPage: current });
  };

  const addUser = () => {
    navigate(`/adminprofile/new`);
  };

  const editAdmin = (id) => {
    navigate(`/adminprofile/${id}`);
  };

  const viewAdmin = (admin) => {
    convertJsonToExcel("admin", [admin]);
  };

  const deleteAdmin = (id , isAccountSuspended) => {
    const conf = window.confirm("Êtes-vous sûr??");
    if (conf) {
      dispatch(delete_admin(id, authorization , isAccountSuspended));
    }
  };

  const exportData = () => {
    dispatch({ type: START_LOADING });

    List(
      { filter: '{"name" : { "$ne": "xxxlxxx" }}', sort: '{"_id" : -1}' },
      authorization
    )
      .then(({ data }) => {
        if (!data.err) {
          dispatch({ type: STOP_LOADING });
          convertJsonToExcel("admins", data.msg);
        } else {
          console.log("get contacts err ", data.msg);
          alert(data.msg);
          dispatch({ type: STOP_LOADING });
        }
      })
      .catch((err) => {
        console.log("get contacts api err ", err);
        alert("Une erreur s'est produite. Veuillez réessayer");
        dispatch({ type: STOP_LOADING });
      });
  };

  return (
    <Fragment>
      <main>
        {loading && loader()}

        {admins && Admins && Admins.length > 0 && (
          <div className="export-data">
            <button onClick={exportData}>Exporter des données</button>
            <button onClick={addUser}>ajouter un administrateur</button>
          </div>
        )}

        {admins && Admins && Admins.length > 0 && (
          <div className="table-wrap">
            <table className="table table-responsive-xl">
              <thead>
                <tr>
                  <th>Nom complet et email</th>
                  <th>Activé</th>
                  <th>Suspendu(e)</th>
                  <th>Début et fin</th>
                  <th>Quantité et prêt</th>
                  <th>Régner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Admins.map((admin, ci) => {
                  return (
                    <tr key={ci}>
                      <td className="d-flex align-items-center">
                        <div
                          className="img"
                          style={{
                            backgroundImage: `url(${ImageLink(admin.image)})`,
                          }}
                        ></div>
                        <div className="pl-3 email">
                          <span>
                            {admin.firstname} {admin.lastname}
                          </span>
                          <span>{admin.email}</span>
                        </div>
                      </td>

                      <td className="status">
                        <span
                          className={
                            admin.isAccountActivated ? "active" : "waiting"
                          }
                        >
                          {admin.isAccountActivated ? "Active" : "Non"}
                        </span>
                      </td>
                      <td className="status">
                        <span
                          className={
                            admin.isAccountSuspended ? "active" : "waiting"
                          }
                        >
                          {admin.isAccountSuspended ? "Active" : "Non"}
                        </span>
                      </td>

                      <td className="multy">
                        <span>
                          {moment(new Date(admin.startAt)).format("DD-MM-YYYY")}
                        </span>
                        <span>
                          {moment(new Date(admin.endAt)).format("DD-MM-YYYY")}
                        </span>
                      </td>

                      <td className="multy">
                        <span>{admin.quantity}</span>
                        <span>{admin.loan}</span>
                      </td>

                      <td>
                        {admin.rule == "admin"
                          ? "administrateur"
                          : "super administrateur"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="download"
                          onClick={() => {
                            viewAdmin(admin);
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
                            editAdmin(admin._id);
                          }}
                        >
                          <span aria-hidden="true">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </span>
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            deleteAdmin(admin._id, admin.isAccountSuspended);
                          }}
                        >
                          <span aria-hidden="true">
                            <i className="fa-solid fa-trash-can"></i>
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div>
          <ul className="pagination justify-content-center">{paginations}</ul>
        </div>
      </main>
    </Fragment>
  );
};
export default Admin;
