
const Host = {
  ROOT: "http://localhost:3000",
  BACKEND: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "http://localhost:3001" : "https://api.compareprime.com" ,
  PREFIX: "/v1/api", 
};


const ApiEndpoints = {

  UserEndpoints: {
    route: `${Host.PREFIX}/user`,
    list: `/list`,
    login: `/login`,
    create: `/create`,  
    delete: `/delete`,  
    me: `/me`,  
    edit: `/edit`,
    update: `/update`,
    image: `/image`,
    forgotPassword: `/forgot-password`,
    count: `/count`,
    signup: `/signup`,

  },
  ChatEndpoints: {
    route: `${Host.PREFIX}/chat`,
    list: `/list`,
    create: `/create`,  
    delete: `/delete`,  
    reply: `/reply`,
    count: `/count`,
    view: `/view`,
  },
  FileEndpoints: {
    route: `${Host.PREFIX}/file`,
    getSingleImageView: `/get-single-image`,
    getSingleImageDownload: `/get-single-image`,
    createSingleImage: `/create-single-image`,
  },
  contactEndpoints: {
    route: `${Host.PREFIX}/contact`,
    list: `/list`,
    create: `/create`,
    delete: `/delete`,
    count: `/count`,
    view: `/view`,
    update: `/update`,
  },
 
};
 
export {ApiEndpoints , Host}