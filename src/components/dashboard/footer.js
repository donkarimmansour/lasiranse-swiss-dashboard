import { Field, Form, Formik } from "formik";
import React, { Fragment, useEffect, useRef, useState } from "react"
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { set_subscribe } from "../redux/actions/subscribe";
import { loader } from "../shared/elements";
import * as yup from "yup";
import { get_count, get_random_product } from "../redux/actions/products";
import { ImageLink } from "../shared/funs";
import myClassname from "classnames"; 
import { CLEAR_MESSAGE } from "../redux/constans/message"
import { Link } from "react-router-dom"

const Footer = () => {
    const { t } = useTranslation();



    return (
        <Fragment>

        </Fragment>

    );
}

export default Footer;
