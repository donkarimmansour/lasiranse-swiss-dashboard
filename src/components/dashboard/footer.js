import React, { Fragment, useEffect, useRef, useState } from "react";
import { getLocalStorage } from "../../shared/localStorage";
import "../../styles/footer.css";
const Footer = () => {
  const user = localStorage.getItem("user")
    ? getLocalStorage("user")
    : [{ _id: "" }];
  return (
    <Fragment>
      <footer className="container footer">
        <div>
          <p>
            <span className="spanfooter">@ par :</span>
            {user.rule === "admin" && user.isAccountActivated && (
                <>
                <span>les développeurs:</span>
                <a href="mailto:deve.ccm@gmail.com" className="titlefooter">
                &nbsp;<span className="namefooter">Karim mansour</span>
                <span className="spanfooter">&nbsp;&&&nbsp;</span>
                <span className="namefooter">Amine Albouhaji</span>
              </a>
                </>
          
            )}
            {!user.isAccountActivated && 
                <a className="titlefooter">
                  &nbsp;<span className="namefooter">Compare prime</span>
                </a>
              }
                 {user.rule !== "admin" && 
                <a className="titlefooter">
                  &nbsp;<span className="namefooter">Compare prime</span>
                </a>
                 }
          </p>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
