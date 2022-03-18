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
import background  from "../../../img/backgroundlogin.jpg";

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
        email: yup.string().required("le champ email est obligatoire").email("l'e-mail doit être un e-mail"),
    
    })

    
    const Done = () => <Fragment>
        <div className="pupup" style={{ display: "block" }}>
            <h5>Terminé !!</h5>
            <p>nouveau mot de passe envoyé</p>
            <button onClick={() => {
                dispatch({ type: CLEAR_MESSAGE })
                navigate("/login")
            }
            } >d'accord</button>
        </div></Fragment>
 
 return (
  
    <div className="login-wrapper" style={{ backgroundImage: `url(${background})` }}>
 <div className="container">
        {loading && loader()}
        {successMsg && Done()}

        {/* <!-- start login form --> */}
        <div className="form">
            <span className="title">Mot de passe oublié?</span>

            {
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={ForgotValidator}>

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
              

                                <div className="form-error">
                                  {errorMsg && <span>{ typeof errorMsg == "string" ? errorMsg : errorMsg[0]}</span>}
                                </div>

                                <div > 
                                    <Link to="/admin/login">Connexion?</Link>
                                </div>

                                <div className="input-field button">
                                    <div>
                                      <input disabled={(!dirty || !isValid || loading)} type="submit" value="Envoyer" />
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