import * as Yup from "yup";

export type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required.")
    .min(3, "Username must be at least 3 characters long.")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain letters and numbers.",
    ),
  email: Yup.string().required("Email is required.").email("Email is invalid."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 6 characters long."),
  confirmPassword: Yup.string()
    .required("Confirm Password is required.")
    .oneOf([Yup.ref("password"), ""], "Passwords must match."),
});
