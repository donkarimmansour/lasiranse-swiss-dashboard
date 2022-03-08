import React, { useEffect } from "react"
import "../styles/indexpage.css"


const setTitle = () => {
  document.title = "Comparer votre prime gratuitement" 
}

const IndexPage = () => {
  useEffect(()=> {
    setTitle()
  },[])
 
  return (

    <div className="index-loader">
          <div className="loader">
              <div className="circle"></div>
              <div className="circle"></div>
          </div>
    </div>

  );
}

export default IndexPage;
