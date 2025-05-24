import { lazy } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import InternalWindow from "../internal-window";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ValidationMessages } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { login } from "../../store/auth";
import { AppDispatch } from "../../store/store";

const Input = lazy(() => import("../input"));
const Button = lazy(() => import("../button"));

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(ValidationMessages.REQUIRED)
      .email(ValidationMessages.EMAIL),
    password: Yup.string()
      .required(ValidationMessages.REQUIRED)
      .min(8, ValidationMessages.PASSWORD),
  });

  interface FormValues {
    email: string;
    password: string;
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (
      values: FormValues,
      formikHelpers: FormikHelpers<FormValues>
    ) => {
      try {
        // ✅ Теперь передаём объект, как ожидает thunk
        await dispatch(login(values));
        navigate({ to: "/" });
        formikHelpers.resetForm();
      } catch (err) {
        console.log("Error", err);
        formikHelpers.setFieldError("password", "Invalid email or password");
      }
    }
  });

  return (
    <InternalWindow title="Log In">
      <form onSubmit={formik.handleSubmit}>
        <Input
          type="email"
          id="email"
          label="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          errorMessage={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""
          }
        />
        <Input
          type="password"
          id="password"
          label="Password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          errorMessage={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""
          }
        />
        <p>
          Need an account? <Link to="/signup">Sign Up</Link>
        </p>
        <Button mod="wide" type="submit">
          Log In
        </Button>
      </form>
    </InternalWindow>
  );
};