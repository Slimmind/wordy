import { lazy } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import InternalWindow from "../internal-window";
import { useAuth } from "../../contexts/auth.context";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ValidationMessages } from "../../utils/constants";

const Input = lazy(() => import("../input"));
const Button = lazy(() => import("../button"));

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(ValidationMessages.REQUIRED)
      .email(ValidationMessages.EMAIL),
    password: Yup.string()
      .required(ValidationMessages.REQUIRED)
      .min(8, ValidationMessages.PASSWORD),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  interface FormValues {
    email: string;
    password: string;
  }

  async function handleFormSubmit(
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) {
    console.log("FORM_DATA: ", values);

    try {
      await login(values.email, values.password);
      navigate({ to: "/" });
      formikHelpers.resetForm();
    } catch (err) {
      console.log("Error", err);
    }
  }

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
