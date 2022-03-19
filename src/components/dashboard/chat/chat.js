import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Formik, Form } from "formik";
import { isAuthentication } from "../../../shared/auth";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_MESSAGE } from "../../../redux/constans/message";
import { getCookie } from "../../../shared/cookie";
import { loader } from "../../../shared/elements";
import { ImageLink } from "../../../shared/funs";
import { getLocalStorage } from "../../../shared/localStorage";
import "../../../styles/profile.css";
import {
  get_chat,
  ReplyChat as replyChat,
  createChat,
} from "../../../redux/actions/chat";

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { chat } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch({ type: CLEAR_MESSAGE });

    if (!isAuthentication()) {
      navigate("/login");
    }

    if (params.id == "new") {
      setInitial({
        fullname: "",
        message: "",
        email: "",
        replied: false,
        reply_message: "...",
      });
    }
  }, []);

  useEffect(() => {
    dispatch(get_chat({ filter: `{"_id" : "${params.id}"}` }, authorization));
  }, [dispatch]);

  useEffect(() => {
    if (params.id !== "new" && chat && chat.message) {
      setInitial({
        fullname: chat.fullname || "",
        message: chat.message || "",
        email: chat.email || "",
        replied: chat.replied || false,
        reply_message: chat.reply_message || "...",
      });
    }
  }, [chat]);

  const { loading } = useSelector((state) => state.loading);
  const { errorMsg, successMsg } = useSelector((state) => state.message);

  useEffect(() => {
    if (successMsg === "updated") {
      alert("a répondu");
      navigate(-1);
    } else if (successMsg === "created") {
      alert("mise à jour créé");
      navigate(-1);
    }
  }, [successMsg]);

  //form
  const [initial, setInitial] = useState({
    fullname: "",
    message: "",
    email: "",
    replied: false,
    reply_message: "...",
  });

  const authorization = isAuthentication()
    ? { Authorization: `bearer ${getCookie("token")}` }
    : [{ _id: "" }];
  const user = localStorage.getItem("user")
    ? getLocalStorage("user")
    : [{ _id: "" }];

  const onSubmit = (values) => {
    const newVals = { ...values, user_id: user._id };

    if (params.id == "new") {
      dispatch(createChat(newVals, authorization));
    } else {
      dispatch(replyChat(params.id, newVals, authorization));
    }
  };

  const Validator = yup.object().shape({
    fullname: yup.string().required("le champ nom complet est obligatoire"),
    email: yup
      .string()
      .required("le champ email est obligatoire")
      .email("l'e-mail doit être un e-mail"),
    message: yup.string().required("le champ message est obligatoire"),
    reply_message: yup
      .string()
      .test(
        "message de réponse",
        "le champ du message de réponse est obligatoire",
        function (value) {
          return (value != "..." && value.length > 1) || params.id == "new";
        }
      ),
  });

  return (
    <main>
      <div className="pform">
        {loading && loader()}

        <div className="title">Message</div>

        <div className="content">
          {
            <Formik
              initialValues={initial}
              onSubmit={onSubmit}
              validationSchema={Validator}
              enableReinitialize
              validateOnMount={true}
            >
              {({ touched, errors, isValid, values }) => (
                <Form>
                  <div className="user-details">
                    <div className="input-box">
                      <span className="details">nom et prénom</span>
                      <Field
                        type="text"
                        name="fullname"
                        placeholder="Entrez votre nom complet"
                        required=""
                      />
                      <small
                        className="input-error"
                        style={{ display: errors.fullname ? "block" : "none" }}
                      >
                        {touched.fullname && errors.fullname}
                      </small>
                    </div>

                    <div className="input-box">
                      <span className="details">Adresse e-mail</span>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Entrer votre Email"
                        required=""
                      />
                      <small
                        className="input-error"
                        style={{ display: errors.email ? "block" : "none" }}
                      >
                        {touched.email && errors.email}
                      </small>
                    </div>

                    <div className="input-box textarea">
                      <span className="details">Message</span>
                      <Field
                        as="textarea"
                        rows="10"
                        cols="10"
                        name="message"
                        placeholder="entrez votre message"
                        required=""
                      />
                      <small
                        className="input-error"
                        style={{ display: errors.message ? "block" : "none" }}
                      >
                        {touched.message && errors.message}
                      </small>
                    </div>

                    {params && params.id != "new" && (
                      <div className="input-box textarea">
                        <span className="details">message de réponse</span>
                        <Field
                          as="textarea"
                          rows="10"
                          cols="10"
                          name="reply_message"
                          placeholder="Entrez votre message de réponse"
                          required=""
                        />
                        <small
                          className="input-error"
                          style={{
                            display: errors.reply_message ? "block" : "none",
                          }}
                        >
                          {touched.reply_message && errors.reply_message}
                        </small>
                      </div>
                    )}

                    <div className="form-error">
                      {errorMsg && (
                        <span>
                          {typeof errorMsg == "string" ? errorMsg : errorMsg[0]}
                        </span>
                      )}
                    </div>

                    {(params.id == "new" && user.rule != "admin") ||
                      (values && values.replied !== true && (
                        <div className="button">
                          <input
                            disabled={!isValid || loading}
                            type="submit"
                            value={params.id == "new" ? "send" : "reply"}
                          />
                        </div>
                      ))}
                  </div>
                </Form>
              )}
            </Formik>
          }
        </div>
      </div>
    </main>
  );
};

export default Chat;
