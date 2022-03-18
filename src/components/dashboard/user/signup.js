import React, { Fragment, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import * as yup from 'yup'
import { Field, Formik, Form } from "formik"
import { isAuthentication } from "../../../shared/auth"
import { loader } from "../../../shared/elements"
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_MESSAGE } from "../../../redux/constans/message"
import "../../../styles/login.css"
import { SignupAuths } from "../../../redux/actions/user";
import background  from "../../../img/backgroundlogin.jpg"
const Signup = () => {
    const navigate = useNavigate() 
    const dispatch = useDispatch() 

    useEffect(() => {
        dispatch({ type: CLEAR_MESSAGE })

        if (isAuthentication()) {
            navigate("/")
        }

    }, [])

    const { loading } = useSelector(state => state.loading)
    const { errorMsg , successMsg } = useSelector(state => state.message)


    useEffect(() => {
        if (successMsg === "okey") {
           navigate("/admin")
        }
    }, [successMsg])



    const changeType = e => {
        if(e.target.parentElement.querySelector("input").type == "password"){
            e.target.parentElement.querySelector("input").type = "text"
            e.target.className = "fa-solid fa-eye show-hide-pw"
        }else {
            e.target.parentElement.querySelector("input").type = "password"
            e.target.className = "fa-solid fa-eye-slash show-hide-pw"

        }
    }



    const initialValues = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
    }

    const onSubmit = values => {
        dispatch(SignupAuths(values))
       
    }

    
    const  SginupValidator = yup.object().shape({
        firstname: yup.string().required("le champ prénom est obligatoire"),
        lastname: yup.string().required("le champ nom de famille est obligatoire"),
        email: yup.string().required("le champ email est obligatoire").email("l'e-mail doit être un e-mail"),
        password: yup.string().required("le champ mot de passe est obligatoire"),
        confirmpassword: yup.string().required("le champ de confirmation du mot de passe est obligatoire")
            .test("Confirmez le mot de passe", "confirmer le mot de passe doit être le même que le mot de passe"
                , function (value) {  return this.parent.password == value }), 
    })

    
    
    const Done = () => <Fragment>
        <div className="pupup" style={{ display: "block" }}>
            <h5>Terminé !!</h5>
            <p>veuillez patienter pour accepter votre compte</p>
            <button onClick={() => {

                dispatch({ type: CLEAR_MESSAGE })
                navigate("/login")

            }} >OK</button>
        </div></Fragment>

    return (

      <div className="login-wrapper " style={{ backgroundImage: `url(${background})` }}>
            <div className="container">

            {loading && loader()}
            {successMsg === "created" && Done()}


            {/* <!-- start login form --> */} 
            <div className="form">
                <span className="title">S'inscrire</span>

                {
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={SginupValidator}>

                        {
                            ({ touched, errors, isValid, dirty }) => (

                                <Form>

                                   <div className="input-field">
                                        <label>Prénom*</label>
                                        <div>
                                             <Field type="text" name="firstname" placeholder="Entrez votre prénom" required="" />
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.firstname ? "block" : "none" }} >{touched.firstname && errors.firstname}</small>

                                    </div>

                                    <div className="input-field">
                                        <label>Nom de famille*</label>
                                        <div>
                                             <Field type="text" name="lastname" placeholder="Entrez votre nom de famille" required="" />
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.lastname ? "block" : "none" }} >{touched.lastname && errors.lastname}</small>

                                    </div>


                                    <div className="input-field">
                                        <label>Adresse e-mail*</label>
                                        <div>
                                             <Field type="email" name="email" placeholder="Entrer votre Email" required="" />
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.email ? "block" : "none" }} >{touched.email && errors.email}</small>

                                    </div>
                                    <div className="input-field">
                                        <label>le mot de passe*</label>

                                        <div>
                                             <Field type="password" name="password" placeholder="Tapez votre mot de passe" required="" />
                                            <i className="fa-solid fa-lock"></i>
                                        </div>

                                        <small className="input-error" style={{ display: errors.password ? "block" : "none" }} >{touched.password && errors.password}</small>

                                    </div>

                                    <div className="input-field">
                                        <label>Confirmez le mot de passe*</label>

                                        <div>
                                             <Field type="password" name="confirmpassword" placeholder="Entrez votre mot de passe de confirmation" required="" />
                                            <i className="fa-solid fa-lock"></i>
                                            <i className="fa-solid fa-eye-slash show-hide-pw" onClick={ (e)=> {changeType(e)} }></i>
                                        </div>

                                        <small className="input-error" style={{ display: errors.confirmpassword ? "block" : "none" }} >{touched.confirmpassword && errors.confirmpassword}</small>

                                    </div>

                                    <div className="form-error">
                                      {errorMsg && <span>{ typeof errorMsg == "string" ? errorMsg : errorMsg[0] }</span>}
                                    </div>

                            
                                    <div className="input-field button">
                                        <div>
                                          <input disabled={(!dirty || !isValid || loading)} type="submit" value="signup now" />
                                        </div>
                                    </div>

                                    <div className="login-signup">
                                        <span className="text">pas un membre?
                                            <Link to="/login" className="text login-text">se connecter nouveau!!</Link>
                                        </span>
                                    </div>

                                </Form>


                            )

                        }</Formik>}
            </div>
            {/* <!-- end login form --> */}



        </div>

      </div>
    );
}

export default Signup;