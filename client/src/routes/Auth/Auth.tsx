import React, { useState } from "react";
// import { redirect } from "react-router-dom";

import classes from "./Auth.module.scss";
// import API from "../../services/api";
import AuthForm from "../../components/AuthForm/AuthForm";
// import { Roles } from "../../constants";

// const action =
//   (isSignup = false) =>
//   async ({ request, params }: any) => {
//     const formData = await request.formData();
//     const { email, password, isAdmin } = Object.fromEntries(formData);

//     let finalData: { email: string; password: string; role?: string } = {
//       email,
//       password,
//     };

//     if (isSignup) {
//       finalData["role"] = isAdmin ? Roles.Admin : Roles.User;
//     }

//     try {
//       await API.post(`/auth/${isSignup ? "signup" : "signin"}`, finalData);

//       return redirect("/");
//     } catch (err: any) {
//       return redirect("/auth");
//     }
//   };

// export const loginAction = action();

// export const signupAction = action(true);

const Auth = () => {
  const [cubeClass, setCubeClass] = useState(classes.ShowSignin);

  const handleFormChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setCubeClass((prev) =>
      prev === classes.ShowSignin ? classes.ShowSignup : classes.ShowSignin
    );
  };

  return (
    <div className={classes.Container}>
      <div className={`${classes.Cube} ${cubeClass}`}>
        <div className={`${classes.Card} ${classes.Front}`}>
          <AuthForm handleSideChange={handleFormChange} />
        </div>

        <div className={`${classes.Card} ${classes.Right}`}>
          <AuthForm
            isSignup
            handleSideChange={handleFormChange}
            title="Signup"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
