import { useState, useMemo, useContext } from "react";
import { Form, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import classes from "./AuthForm.module.scss";
import { Roles } from "../../constants";
import API from "../../services/api";
import { UserContext, UserContextType } from "../../HOC/ContextProvider";
import { isValidEmail, isValidPassword } from "../../utils/helper";

interface AuthFormProps {
  title?: string;
  isSignup?: boolean;
  handleSideChange: any;
}

const AuthForm = ({
  title = "Login",
  isSignup = false,
  handleSideChange,
}: AuthFormProps) => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    isAdmin: "",
  });
  const [loginButtonClass, setLoginButtonClass] = useState("");
  const { addUser } = useContext(UserContext) as UserContextType;

  const navigate = useNavigate();

  const isLoginFormValid = useMemo(() => {
    if (isValidEmail(loginInfo.email) && isValidPassword(loginInfo.password)) {
      setLoginButtonClass("");
      return true;
    }
    return false;
  }, [loginInfo.email, loginInfo.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleMouseOver = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isLoginFormValid) return setLoginButtonClass("");

    if (!isLoginFormValid) {
      setLoginButtonClass((prev) =>
        prev === classes.MoveRight ? classes.MoveLeft : classes.MoveRight
      );
    }
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: checked ? Roles.Admin : Roles.User,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // submitForm(e.currentTarget, {
    //   action: isSignup ? "/auth/signup" : "",
    //   method: "post",
    // });

    const { email, password, isAdmin } = loginInfo;

    let finalData: { email: string; password: string; role?: string } = {
      email,
      password,
    };

    if (isSignup) {
      finalData["role"] = isAdmin ? Roles.Admin : Roles.User;
    }

    try {
      const { data } = await API.post(
        `/auth/${isSignup ? "signup" : "signin"}`,
        finalData
      );

      addUser(data);
      navigate("/");
    } catch (err: any) {
      if (err.response) {
        return toast(err.response.data.message);
      }
      return toast("Something went wrong");
    }
  };

  return (
    <Form className={classes.Form} onSubmit={handleSubmit}>
      <h2 className={classes.Title}>{title}</h2>

      <div className={classes.Field}>
        <label htmlFor={`${title}-email`}>Email</label>
        <input
          type="email"
          name="email"
          id={`${title}-email`}
          value={loginInfo.email}
          onChange={handleChange}
        />
      </div>

      <div className={classes.Field}>
        <label htmlFor={`${title}-password`}>Password</label>
        <input
          type="password"
          name="password"
          id={`${title}-password`}
          value={loginInfo.password}
          onChange={handleChange}
        />
      </div>

      {isSignup && (
        <div className={classes.Checkbox}>
          <label htmlFor={`${title}-role`}>Admin</label>
          <input
            type="checkbox"
            name="isAdmin"
            id={`${title}-role`}
            checked={loginInfo.isAdmin === Roles.Admin}
            onChange={handleAdminChange}
          />
        </div>
      )}

      <div className={classes.ButtonContainer}>
        <button
          type="submit"
          className={loginButtonClass}
          onMouseOver={handleMouseOver}
        >
          Submit
        </button>
      </div>

      <button
        type="button"
        onClick={handleSideChange}
        name={classes.ShowSignup}
        className={classes.AltLink}
      >
        {isSignup ? "Already have an account?" : "Create new account"}
      </button>
    </Form>
  );
};

export default AuthForm;
