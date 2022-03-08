
const Host = {
  ROOT: "http://localhost:3000",
  //BACKEND: "http://localhost:3001",
  BACKEND: "https://apigit .compareprime.com",
  PREFIX: "/v1/api", 
};

const ApiEndpoints = {

  UserEndpoints: {
    route: `${Host.PREFIX}/user`,
    list: `/list`,
    login: `/login`,
    create: `/create`,  
    me: `/me`,  
    edit: `/edit`,
    image: `/image`,
    suspension: `/suspension`,
    forgotPassword: `/forgot-password`,
    count: `/count`,

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
  },
 
};
 
export {ApiEndpoints , Host}