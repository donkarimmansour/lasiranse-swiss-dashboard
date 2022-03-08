import React, { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';
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
            navigate("/admin")
        }

    }, [])

    const { t } = useTranslation();
    const { loading } = useSelector(state => state.loading)
    const { errorMsg , successMsg } = useSelector(state => state.message)


    useEffect(() => {
        if (successMsg === "okey") {
           navigate("/admin")
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
        email: yup.string().required(t("email field is required")).email("email must be email"),
        password: yup.string().required(t("password field is required")),
    })


    return (

      <div className="login-wrapper">
            <div className="container">
            {loading && loader()}

            {/* <!-- start login form --> */} 
            <div className="form">
                <span className="title">{t("Login")}</span>

                {
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={LoginValidator}>

                        {
                            ({ touched, errors, isValid, dirty }) => (

                                <Form>
                                    <div className="input-field">
                                        <label>{t("Email Address")}*</label>
                                        <div>
                                             <Field type="text" name="email" placeholder={t("Enter your email")} required="" />
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.email ? "block" : "none" }} >{touched.email && errors.email}</small>

                                    </div>
                                    <div className="input-field">
                                        <label>{t("password")}*</label>

                                        <div>
                                             <Field type="password" name="password" placeholder={t("Enter your password")} required="" />
                                            <i className="fa-solid fa-lock"></i>
                                            <i className="fa-solid fa-eye-slash show-hide-pw"></i>
                                        </div>

                                        <small className="input-error" style={{ display: errors.password ? "block" : "none" }} >{touched.password && errors.password}</small>

                                    </div>

                                    <div className="form-error">
                                      {errorMsg && <span>{ typeof errorMsg == "string" ? t(errorMsg) : t(errorMsg[0])}</span>}
                                    </div>

                                    <div > 
                                        <Link to="/admin/forgot">{t("Forgot Password?")}</Link>
                                    </div>

                                    <div className="input-field button">
                                        <input disabled={(!dirty || !isValid || loading)} type="submit" value="login now" />
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
