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
        email: yup.string().required("email field is required").email("email must be email"),
        password: yup.string().required("password field is required"),
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

      <div className="login-wrapper">
            <div className="container">
            {loading && loader()}

            {/* <!-- start login form --> */} 
            <div className="form">
                <span className="title">Login</span>

                {
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={LoginValidator}>

                        {
                            ({ touched, errors, isValid, dirty }) => (

                                <Form>
                                    <div className="input-field">
                                        <label>Email Address*</label>
                                        <div>
                                             <Field type="text" name="email" placeholder="Enter your email" required="" />
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.email ? "block" : "none" }} >{touched.email && errors.email}</small>

                                    </div>
                                    <div className="input-field">
                                        <label>password*</label>

                                        <div>
                                             <Field type="password" name="password" placeholder="Enter your password" required="" />
                                            <i className="fa-solid fa-lock"></i>
                                            <i className="fa-solid fa-eye-slash show-hide-pw" onClick={ (e)=> {changeType(e)} }></i>
                                        </div>

                                        <small className="input-error" style={{ display: errors.password ? "block" : "none" }} >{touched.password && errors.password}</small>

                                    </div>

                                    <div className="form-error">
                                      {errorMsg && <span>{ typeof errorMsg == "string" ? errorMsg : errorMsg[0]}</span>}
                                    </div>

                                    <div > 
                                        <Link to="/forgot">Forgot Password?"</Link>
                                    </div>

                                    <div className="input-field button">
                                        <div>
                                          <input disabled={(!dirty || !isValid || loading)} type="submit" value="login now" />
                                        </div>
                                    </div>

                                    <div className="login-signup">
                                        <span className="text">i'm a member?
                                            <Link to="/signup" className="text login-text">signup new</Link>
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
