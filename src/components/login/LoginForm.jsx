import React from "react";
import * as Yup from "yup";
import { useState } from "react";
import styles from "./LoginForm.module.css";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import LoginInput from "../input/login";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../app/slices/userSlice";
import Card from "../UI/Card/Card";
import FormLoader from "../FormLoader";
import { API_BASE_URL } from '../../config';

const initialloginInfos = {
  email: "",
  password: "",
};

function LoginForm({ setRenderSignUp }) {
  const dispatch = useDispatch();

  const { email, password } = initialloginInfos;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string().required("Password is required").min(6),
  });

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      
      console.log('Attempting login with:', values.email);
      
      const { data } = await axios.post(
        `${API_BASE_URL}/users/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (data.status === 'success') {
        setSuccess('Login successful');
        dispatch(login(data));
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error details:', error.response?.data || error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    submitHandler({
      email: "admin@backbook.com",
      password: "Admin123!@#"
    });
  };
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <img src="../../icons/backbook.svg" alt="" />
        <span>
          Bantah with love! h
        </span>
      </div>
      <div className={styles.login}>
        <Card className={styles.login_wrapper}>
          <Formik
            enableReinitialize
            validationSchema={loginValidation}
            initialValues={{
              email,
              password,
            }}
            onSubmit={(values) => submitHandler(values)}
          >
            {(formik) => (
              <Form className={styles.form} noValidate>
                <FormLoader loading={loading}>
                  <LoginInput
                    type="email"
                    name="email"
                    placeholder="Email address"
                    disabled={loading}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    disabled={loading}
                  />
                </FormLoader>

                {error && <div className={styles.error_text}>{error}</div>}
                {success && (
                  <div className={styles.success_text}>{success}</div>
                )}
                <button type="submit" className="btn_blue" disabled={loading}>
                  Log in
                </button>
                <button
                  style={{ width: "100%", marginTop: "10px" }}
                  className="gray_btn"
                  type="button"
                  disabled={loading}
                  onClick={handleGuestLogin}
                >
                  Login With Guest Account
                </button>
              </Form>
            )}
          </Formik>
          <Link to="/forgot" className={styles.forgot}>
            Forgotten password?
          </Link>
          <div className="line-spliter"></div>
          <button
            className={`btn_blue ${styles.signup_btn}`}
            onClick={() => setRenderSignUp(true)}
          >
            Create New Account
          </button>
        </Card>
        <div className={styles.extra}>
          <span>
            <b>Create a Page</b> for a celebrity, brand or business.
          </span>
        </div>
      </div>
    </main>
  );
}

export default LoginForm;
