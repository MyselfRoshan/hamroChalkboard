import * as Yup from "yup";

export type LoginFormValues = {
  email_or_username: string;
  password: string;
};
export const loginValidation = Yup.object().shape({
  email_or_username: Yup.string().required("Email or Username is required."),
  password: Yup.string().required("Password is required."),
});
