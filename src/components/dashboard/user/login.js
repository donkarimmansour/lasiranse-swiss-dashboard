import React, { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import * as yup from 'yup'
import { Field, Formik, Form } from "formik"
import { isAuthentication } from "../../../shared/auth"
import { loader } from "../../../shared/elements"
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_MESSAGE } from "../../../redux/constans/message"
import "../../../styles/login.css"
import { LoginAuths } from "../../../redux/actions/user";
import background  from "../../../img/backgroundlogin.jpg"
const Login = () => {
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
           navigate("/")
        }
    }, [successMsg])



    const initialValues = {
        email: "",
        password: "",
    }

    const onSubmit = values => {
        dispatch(LoginAuths(values))
    }

    const  LoginValidator = yup.object().shape({
        email: yup.string().required("le champ email est obligatoire").email("l'e-mail doit être un e-mail"),
        password: yup.string().required("le champ mot de passe est obligatoire"),
    })

    const changeType = e => {
        if(e.target.parentElement.querySelector("input").type == "password"){
            e.target.parentElement.querySelector("input").type = "text"
            e.target.className = "fa-solid fa-eye show-hide-pw"
        }else {
            e.target.parentElement.querySelector("input").type = "password"
            e.target.className = "fa-solid fa-eye-slash show-hide-pw"

        }
    }


    return (

      <div className="container login-wrapper" style={{ backgroundImage: `url(${background})` }}>
            <div className="container">
            {loading && loader()}

            {/* <!-- start login form --> */} 
            <div className="form">
                <span className="title">Connexion</span>

                {
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={LoginValidator}>

                        {
                            ({ touched, errors, isValid, dirty }) => (

                                <Form>
                                    <div className="input-field">
                                        <label>Adresse e-mail*</label>
                                        <div>
                                             <Field type="text" name="email" placeholder="Entrer votre Email" required="" />
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.email ? "block" : "none" }} >{touched.email && errors.email}</small>

                                    </div>
                                    <div className="input-field">
                                        <label>le mot de passe*</label>

                                        <div>
                                             <Field type="password" name="password" placeholder="Tapez votre mot de passe" required="" />
                                            <i className="fa-solid fa-lock"></i>
                                            <i className="fa-solid fa-eye-slash show-hide-pw" onClick={ (e)=> {changeType(e)} }></i>
                                        </div>

                                        <small className="input-error" style={{ display: errors.password ? "block" : "none" }} >{touched.password && errors.password}</small>

                                    </div>

                                    <div className="form-error">
                                      {errorMsg && <span>{ typeof errorMsg == "string" ? errorMsg : errorMsg[0]}</span>}
                                    </div>

                                    <div > 
                                        <Link to="/forgot">Mot de passe oublié?</Link>
                                    </div>

                                    <div className="input-field button">
                                        <div>
                                          <input disabled={(!dirty || !isValid || loading)} type="submit" value="login now" />
                                        </div>
                                    </div>

                                    <div className="login-signup">
                                        <span className="text">je suis membre?
                                            <Link to="/signup" className="text login-text">s'inscrire !!</Link>
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

export default Login;