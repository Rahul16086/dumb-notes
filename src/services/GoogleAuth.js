import firebase from "../config/firebase";

const GoogleAuth = (provider) => {
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      localStorage.setItem("username", res.additionalUserInfo.profile.name);
      return res;
    })
    .then((data) => {
      localStorage.setItem("signinmethod", "google");
      return data;
    })
    .catch((err) => {
      return err;
    });
};
export default GoogleAuth;
