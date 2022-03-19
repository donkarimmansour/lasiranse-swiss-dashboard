import React, { useEffect, useState, Fragment, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Field, Formik, Form } from "formik"
import { isAuthentication } from "../../../shared/auth"
import * as yup from 'yup'
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import { getCookie } from "../../../shared/cookie";
import { loader } from "../../../shared/elements";
import { ImageLink } from "../../../shared/funs";
import { getLocalStorage } from "../../../shared/localStorage";
import "../../../styles/profile.css";
import { set_single_image } from "../../../redux/actions/file"
import { createAccount, get_admin, updateAccounts } from "../../../redux/actions/user"
import moment from 'moment';



const AdminProfile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const formikRef = useRef()
    const { admin } = useSelector(state => state.user)

    useEffect(() => {
        dispatch({ type: CLEAR_MESSAGE })

        if (!isAuthentication()) {
            navigate("/login")
        }

        if (params.id == "new") {
            setInitial({
                firstname: "",
                lastname: "",
                email: "",
                rule: "admin",
                password: "",
                startAt: "2022-01-01",
                endAt: "2022-01-01",
                quantity: 0,
                loan: 0,
                isAccountSuspended: "no-su",
                isAccountActivated: "no-ac",
            })
        }
    }, [])

    useEffect(() => {
        dispatch(get_admin({ filter: `{"_id" : "${params.id}"}` }, authorization))
    }, [dispatch])

    useEffect(() => {

        if (params.id !== "new" && admin && admin.startAt) {

            setInitial({
                firstname: admin.firstname || "",
                lastname: admin.lastname || "",
                email: admin.email || "",
                rule: admin.rule || "admin",
                password: "",
                startAt: moment(new Date(admin.startAt)).format('YYYY-MM-DD') || "2022-01-01",
                endAt: moment(new Date(admin.endAt)).format('YYYY-MM-DD') || "2022-01-01",
                quantity: admin.quantity || 0,
                loan: admin.loan || 0,
                isAccountSuspended: admin.isAccountSuspended ? "yes-su" : "no-su" || "no-su",
                isAccountActivated: admin.isAccountActivated ? "yes-ac" : "no-ac" || "no-ac",
            })



        }




    }, [admin])

    const { loading } = useSelector(state => state.loading)
    const { errorMsg, successMsg } = useSelector(state => state.message)


    useEffect(() => {
        if (successMsg === "updated") {
            alert("mise à jour modifie")
            // navigate(-1)
        }
        else if (successMsg === "created") {
            alert("mise à jour créé")
            navigate(-1)
        }
    }, [successMsg])


    //form
    const [initial, setInitial] = useState({
        firstname: "",
        lastname: "",
        email: "",
        rule: "",
        password: "",
        rule: "admin",
        startAt: "2022-01-01",
        endAt: "2022-01-01",
        quantity: 0,
        loan: 0,
        isAccountSuspended: "no-su",
        isAccountActivated: "no-ac",
    })

    const authorization = isAuthentication() ? { "Authorization": `bearer ${getCookie("token")}` } : [{ _id: "" }]
    const user = localStorage.getItem("user") ? getLocalStorage("user") : [{ _id: "" }]

    const onSubmit = values => {
        const { isAccountSuspended, isAccountActivated } = values

        const newVals = {
            ...values, isAccountSuspended: isAccountSuspended == "yes-su" ? true : false
            , isAccountActivated: isAccountActivated == "yes-ac" ? true : false
        }

        if (params.id == "new") {
            dispatch(createAccount(newVals, authorization))
        } else {
            dispatch(updateAccounts(params.id, newVals, authorization))
        }

    }


    const Validator = yup.object().shape({
        firstname: yup.string().required("le champ prénom est obligatoire"),
        lastname: yup.string().required("le champ nom de famille est obligatoire"),
        email: yup.string().required("le champ email est obligatoire").email("l'e-mail doit être un e-mail"),
        rule: yup.string().required("le champ de la règle est obligatoire"),
        isAccountSuspended: yup.string().required("Le champ isAccountSuspended est obligatoire"),
        isAccountActivated: yup.string().required("Le champ isAccountActivated est obligatoire"),

        // password: yup.string()
        //     .test("password", "password field is required"
        //         , function (value) { return value == "" && params.id != "new" }),

        endAt: yup.date()
            .test("endAt", "le champ endAt est obligatoire"
                , function (value) { return value != "" || this.parent.isAccountActivated == "no-ac" }),

        startAt: yup.date()
            .test("startAt", "Le champ startAt est obligatoire"
                , function (value) { return value != "" || this.parent.isAccountActivated == "no-ac" })
            .test("startAt", "La date de début doit être antérieure à la date de fin"
                , function (value) {
                    return (new Date(value) < new Date(this.parent.endAt) || (params.id != "new" && new Date(value)) >= new Date()) || this.parent.isAccountActivated == "no-ac"
                }),

        loan: yup.number().test("loan", "Le prêt doit être Le champ isAccountActivated est obligatoireêtre un nombre valide supérieur à 0"
            , function (value) { return value >= 0 || this.parent.isAccountActivated == "no-ac" }),

        quantity: yup.number().test("quantity", "La quantité doit être un nombre valide supérieur à 1"
            , function (value) { return value > 0 || this.parent.isAccountActivated == "no-ac" }),
    })



    //upload image
    const uploadImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            const img = e.target.files[0];

            //return
            const formData = new FormData();
            formData.append('image', img);

            dispatch(set_single_image(formData, authorization, params.id))
        }
    }

    return (
        <main>
            <div className="pform">

                {loading && loader()}

                <div className="title">Profil</div>


                {params.id != "new" &&
                    <div className="image-profile">
                        <div>
                            <img
                                src={user && user.image && user.image._id && ImageLink(user.image._id)} alt="edit" />
                            <input onChange={(e) => { uploadImage(e) }} type="file" id="image-upload" className="image-upload" accept=".png, .jpg, .jpeg" />
                            <label htmlFor="image-upload"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 32 32" width="20px" height="20px" src="https://ectestone.herokuapp.com/v1/api/file/get-single-image/ws-edit.svg/view" className="svg_img header_svg" alt="edit"><path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path></svg></label>
                        </div>
                    </div>}



                <div className="content">

                    {
                        <Formik
                            initialValues={initial}
                            onSubmit={onSubmit}
                            validationSchema={Validator}
                            enableReinitialize
                            innerRef={formikRef}
                            validateOnMount={true}
                        >

                            {
                                ({ touched, errors, isValid }) => (

                                    <Form>
                                        <div className="user-details">

                                            <div className="input-box">
                                                <span className="details">Prénom</span>
                                                <Field type="text" name="firstname" placeholder="Entrez votre prénom" required="" />
                                                <small className="input-error" style={{ display: errors.firstname ? "block" : "none" }} >{touched.firstname && errors.firstname}</small>
                                            </div>

                                            <div className="input-box">
                                                <span className="details">Nom</span>
                                                <Field type="text" name="lastname" placeholder="Entrez votre nom de famille" required="" />
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
                                                <small className="input-error" style={{ display: errors.password ? "block" : "none" }} >{touched.password && errors.password}</small>
                                            </div>

                                            {formikRef && formikRef.current && formikRef.current.values.rule && formikRef.current.values.rule == "admin" &&

                                                <Fragment>

                                                    <div className="input-box">
                                                        <span className="details">Démarrage Att</span>
                                                        <Field type="date" name="startAt" placeholder="Entrez votre date" required="" />
                                                        <small className="input-error" style={{ display: errors.startAt ? "block" : "none" }} >{touched.startAt && errors.startAt}</small>
                                                    </div>

                                                    <div className="input-box">
                                                        <span className="details">Att de fin</span>
                                                        <Field type="date" name="endAt" placeholder="Entrez votre date" required="" />
                                                        <small className="input-error" style={{ display: errors.endAt ? "block" : "none" }} >{touched.endAt && errors.endAt}</small>
                                                    </div>

                                                    <div className="input-box">
                                                        <span className="details">Quantité</span>
                                                        <Field type="number" name="quantity" placeholder="Entrez votre quantité" required="" />
                                                        <small className="input-error" style={{ display: errors.quantity ? "block" : "none" }} >{touched.quantity && errors.quantity}</small>
                                                    </div>

                                                    <div className="input-box">
                                                        <span className="details">Prêt(e)</span>
                                                        <Field type="number" name="loan" placeholder="Entrez votre prêt(e)" required="" />
                                                        <small className="input-error" style={{ display: errors.loan ? "block" : "none" }} >{touched.loan && errors.loan}</small>
                                                    </div>

                                                </Fragment>
                                            }




                                            <div className="rule-details">
                                                <span className="rule-title">Régner</span>
                                                <div className="rules">
                                                    {
                                                        ["admin", "superAdmin"].map((rule, ri) => {

                                                            return <Fragment key={ri}>
                                                                <Field type="radio" name="rule" id={rule} value={rule} />
                                                                <label htmlFor={rule} >
                                                                    <span className="btn"></span>
                                                                    <span className="rule"  >{rule}</span>
                                                                </label>
                                                            </Fragment>


                                                        })
                                                    }


                                                </div>
                                                <small className="input-error" style={{ display: errors.rule ? "block" : "none" }} >{touched.rule && errors.rule}</small>
                                            </div>

                                            {formikRef && formikRef.current && formikRef.current.values.rule && formikRef.current.values.rule == "admin" &&


                                                <div className="rule-details">
                                                    <span className="rule-title">Activated</span>
                                                    <div className="rules">
                                                        {
                                                            [{ name: "yes-ac", value: "yes" }, { name: "no-ac", value: "no" }].map((Activated, ri) => {

                                                                return <Fragment key={ri}>
                                                                    <Field type="radio" name="isAccountActivated" id={Activated.name} value={Activated.name} />
                                                                    <label htmlFor={Activated.name} >
                                                                        <span className="btn"></span>
                                                                        <span className="rule" >{Activated.value}</span>
                                                                    </label>
                                                                </Fragment>


                                                            })
                                                        }


                                                    </div>
                                                    <small className="input-error" style={{ display: errors.isAccountActivated ? "block" : "none" }} >{touched.isAccountActivated && errors.isAccountActivated}</small>
                                                </div>

                                            }

                                            <div className="rule-details">
                                                <span className="rule-title">Suspended</span>
                                                <div className="rules">
                                                    {[{ name: "yes-su", value: "yes" }, { name: "no-su", value: "no" }].map((Suspended, ri) => {

                                                        return <Fragment key={ri}>
                                                            <Field type="radio" name="isAccountSuspended" id={Suspended.name} value={Suspended.name} />
                                                            <label htmlFor={Suspended.name} >
                                                                <span className="btn"></span>
                                                                <span className="rule" >{Suspended.value}</span>
                                                            </label>
                                                        </Fragment>


                                                    })
                                                    }
                                                </div>
                                                <small className="input-error" style={{ display: errors.isAccountSuspended ? "block" : "none" }} >{touched.isAccountSuspended && errors.isAccountSuspended}</small>
                                            </div>








                                            <div className="form-error">
                                                {errorMsg && <span>{typeof errorMsg == "string" ? errorMsg : errorMsg[0]}</span>}
                                            </div>

                                            <div className="button">
                                                <input disabled={(!isValid || loading)} type="submit" value={params.id == "new" ? "add" : "update"} />
                                            </div>


                                        </div>

                                    </Form>


                                )

                            }</Formik>}

                </div>
            </div>

        </main>


    );
}

export default AdminProfile;
