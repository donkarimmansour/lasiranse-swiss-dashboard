import React, { useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { Field, Formik, Form } from "formik"
import { isAuthentication } from "../../../shared/auth"
import * as yup from 'yup'
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import { getCookie } from "../../../shared/cookie";
import { loader } from "../../../shared/elements";
import { ImageLink } from "../../../shared/funs";
import { getLocalStorage } from "../../../shared/localStorage";
import"../../../styles/profile.css";
import { set_single_image } from "../../../redux/actions/file"
import { EditAccounts } from "../../../redux/actions/user"



const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({ type: CLEAR_MESSAGE })

        if (!isAuthentication()) {
            navigate("/login")
        }

        setInitial({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            email: user.email || "",
            rule: user.rule || "admin",
            password: "",
        })


    }, [])

    const { loading } = useSelector(state => state.loading)
    const { errorMsg, successMsg } = useSelector(state => state.message)

    useEffect(() => {
        if (successMsg === "updated") {
            alert("mise à jour modifie")
        }
    }, [successMsg])


      //form
      const [initial, setInitial] = useState({
        firstname: "",
        lastname: "",
        email: "",
        rule: "",
        password: "",
    })

    const authorization = isAuthentication() ? { "Authorization": `bearer ${getCookie("token")}` } : [{ _id: "" }]
    const user = localStorage.getItem("user") ? getLocalStorage("user") : [{ _id: "" }]



    const onSubmit = values => {
       dispatch(EditAccounts(user._id , values , authorization)) 
    }



    const Validator = yup.object().shape({
        firstname: yup.string().required("le champ prénom est obligatoire"),
        lastname: yup.string().required("le champ nom de famille est obligatoire"),
        email: yup.string().required("le champ email est obligatoire").email("l'e-mail doit être un e-mail"),
    })



    //upload image
    const uploadImage = (e) => {
        if ( e.target.files && e.target.files[0]) {
            const img = e.target.files[0];

            //return
            const formData = new FormData();
            formData.append('image', img);

           dispatch(set_single_image(formData, authorization, user._id))

        }
    }


    return (
      <main>
        <div className="pform">

            {loading && loader()}

            <div className="title">Profil</div>

            <div className="image-profile">
                <div>
                    <img 
                        src={user && user.image && user.image._id && ImageLink(user.image._id)} alt="edit" />
                    <input onChange={(e) => {uploadImage(e)}} type="file" id="image-upload" className="image-upload" accept=".png, .jpg, .jpeg" />
                    <label htmlFor="image-upload"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 32 32" width="20px" height="20px" src="https://ectestone.herokuapp.com/v1/api/file/get-single-image/ws-edit.svg/view" className="svg_img header_svg" alt="edit"><path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path></svg></label>
                </div>
            </div>

            <div className="content">

                {
                    <Formik
                        initialValues={initial}
                        onSubmit={onSubmit}
                        validationSchema={Validator}
                        enableReinitialize>

                        {
                            ({ touched, errors, isValid, dirty }) => (

                                <Form>
                                    <div className="user-details">

                                        <div className="input-box">
                                            <span className="details">Prénom</span>
                                            <Field type="text" name="firstname" placeholder="Entrez votre prénom" required="" />
                                            <small className="input-error" style={{ display: errors.firstname ? "block" : "none" }} >{touched.firstname && errors.firstname}</small>
                                        </div>

                                        <div className="input-box">
                                            <span className="details">Nom</span>
                                            <Field type="text" name="lastname" placeholder="Entrez votre nom" required="" />
                                            <small className="input-error" style={{ display: errors.lastname ? "block" : "none" }} >{touched.lastname && errors.lastname}</small>
                                        </div>

                                       <div className="input-box">
                                            <span className="details">Adresse e-mail</span>
                                            <Field type="email" name="email" placeholder="Entrer votre Email" required="" />
                                            <small className="input-error" style={{ display: errors.email ? "block" : "none" }} >{touched.email && errors.email}</small>
                                        </div>

                                        <div className="input-box">
                                            <span className="details">le mot de passe</span>
                                            <Field type="password" name="password" placeholder="Tapez votre mot de passe" required="" />
                                        </div>
                                    


                                    </div>

                                    {/* <div className="rule-details">
                                        <input type="radio" name="rule" id="admin" checked />
                                        <input type="radio" name="rule" id="superAdmin" />
                                        <span className="rule-title">Rule</span>
                                        <div className="rules">
                                            <label htmlFor="admin" >
                                                <span className="btn one"></span>
                                                <span className="rule" >Admin</span>
                                            </label>
                                            <label htmlFor="supadmin">
                                                <span className="btn two"></span>
                                                <span className="rule">Super Admin</span>
                                            </label>
                                        </div>
                                    </div> */}

                                    <div className="form-error">
                                        {errorMsg && <span>{typeof errorMsg == "string" ? errorMsg : errorMsg[0] }</span>}
                                    </div>

                                    <div className="button">
                                        <input disabled={(!isValid || loading)} type="submit" value="modifier" />
                                    </div>

                                </Form>


                            )

                        }</Formik>}

            </div>
        </div>

        </main>


    );
}

export default Profile;
