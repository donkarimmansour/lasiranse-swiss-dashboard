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
        firstname: yup.string().required("firstname field is required"),
        lastname: yup.string().required("lastname field is required"),
        email: yup.string().required("email field is required").email("email must be email"),
        password: yup.string().required("password field is required"),
        confirmpassword: yup.string().required("confirm password field is required")
            .test("confirmpassword", "confirm password must be the same as password"
                , function (value) {  return this.parent.password == value }), 
    })

    
    
    const Done = () => <Fragment>
        <div className="pupup" style={{ display: "block" }}>
            <h5>Done!</h5>
            <p>please wait for accept your account</p>
            <button onClick={() => {

                dispatch({ type: CLEAR_MESSAGE })
                navigate("/login")

            }} >OK</button>
        </div></Fragment>

    return (

      <div className="login-wrapper">
            <div className="container">

            {loading && loader()}
            {successMsg === "created" && Done()}


            {/* <!-- start login form --> */} 
            <div className="form">
                <span className="title">SignUp</span>

                {
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={SginupValidator}>

                        {
                            ({ touched, errors, isValid, dirty }) => (

                                <Form>

                                   <div className="input-field">
                                        <label>First Name*</label>
                                        <div>
                                             <Field type="text" name="firstname" placeholder="Enter your first name" required="" />
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.firstname ? "block" : "none" }} >{touched.firstname && errors.firstname}</small>

                                    </div>

                                    <div className="input-field">
                                        <label>Last Name*</label>
                                        <div>
                                             <Field type="text" name="lastname" placeholder="Enter your last name" required="" />
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.lastname ? "block" : "none" }} >{touched.lastname && errors.lastname}</small>

                                    </div>


                                    <div className="input-field">
                                        <label>Email Address*</label>
                                        <div>
                                             <Field type="email" name="email" placeholder="Enter your email" required="" />
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                       
                                        <small className="input-error" style={{ display: errors.email ? "block" : "none" }} >{touched.email && errors.email}</small>

                                    </div>
                                    <div className="input-field">
                                        <label>password*</label>

                                        <div>
                                             <Field type="password" name="password" placeholder="Enter your password" required="" />
                                            <i className="fa-solid fa-lock"></i>
                                        </div>

                                        <small className="input-error" style={{ display: errors.password ? "block" : "none" }} >{touched.password && errors.password}</small>

                                    </div>

                                    <div className="input-field">
                                        <label>confirmpassword*</label>

                                        <div>
                                             <Field type="password" name="confirmpassword" placeholder="Enter your confirm password" required="" />
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
                                        <span className="text">not a member?
                                            <Link to="/login" className="text login-text">login new</Link>
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
