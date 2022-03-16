import React, {  useEffect, Fragment } from "react"
import { useNavigate , Link } from "react-router-dom"
import { Field, Formik, Form } from "formik"
import { isAuthentication } from "../../../shared/auth"
import { loader } from "../../../shared/elements"
import * as yup from 'yup'
import { ForgotAuths } from "../../../redux/actions/user";
import { CLEAR_MESSAGE } from "../../../redux/constans/message"
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/login.css"


const Forgot = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch() 

    useEffect(() => {
        if (isAuthentication()) {
            navigate("/") 
        }
        dispatch({ type: CLEAR_MESSAGE })

    }, [])

    const { loading } = useSelector(state => state.loading)
    const { errorMsg , successMsg } = useSelector(state => state.message)

    const initialValues = {
        email: "",
    }

    const onSubmit = values => {
        dispatch(ForgotAuths(values))
    }

    const  ForgotValidator = yup.object().shape({
        email: yup.string().required("email field is required").email("email must be email"),
    
    })

    
    const Done = () => <Fragment>
        <div className="pupup" style={{ display: "block" }}>
            <h5>Done!</h5>
            <p>new Sent password</p>
            <button onClick={() => {
                dispatch({ type: CLEAR_MESSAGE })
                navigate("/login")
            }
            } >OK</button>
        </div></Fragment>
 
 return (
  
    <div className="login-wrapper">
 <div className="container">
        {loading && loader()}
        {successMsg && Done()}

        {/* <!-- start login form --> */}
        <div className="form">
            <span className="title">Forgot Password?</span>

            {
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={ForgotValidator}>

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
              

                                <div className="form-error">
                                  {errorMsg && <span>{ typeof errorMsg == "string" ? errorMsg : errorMsg[0]}</span>}
                                </div>

                                <div > 
                                    <Link to="/admin/login">Login?</Link>
                                </div>

                                <div className="input-field button">
                                    <div>
                                      <input disabled={(!dirty || !isValid || loading)} type="submit" value="Send" />
                                    </div>
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
export default Forgot;
