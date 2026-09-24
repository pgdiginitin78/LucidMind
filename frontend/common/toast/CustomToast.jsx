import { toast } from "react-toastify";

export const successAlert = (message) => {
  // window.alert("Invalid Credentials");
  console.log("success Alert", message);
  toast.success(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 1,
  });
};
export const deleteAlert = (message) => {
  // window.alert("Invalid Credentials");
  toast.success(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 2,
  });
};
export const errdeleteAlert = (message) => {
  // window.alert("Invalid Credentials");
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 3,
  });
};
export const updateAlert = (message) => {
  // window.alert("Invalid Credentials");
  toast.success(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 4,
  });
};

export const errorAlert = (message) => {
  // window.alert("Invalid Credentials");
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 5,
  });
};

export const errorAlertCustom = (message) => {
  // window.alert("Invalid Credentials");
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 6,
  });
};
export const infoAlert = (message) => {
  // window.alert("Invalid Credentials");
  toast.info(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 7,
  });
};

export const warningAlert = (message) => {
  // window.alert("Invalid Credentials");
  toast.warn(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 8,
  });
};

export const patientNotselecteAlert = () => {
  // window.alert("Invalid Credentials");
  toast.warn("Patient Not Selected", {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    toastId: 9,
  });
};
