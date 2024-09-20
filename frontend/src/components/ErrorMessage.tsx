import React from "react";

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <span className="text-red-900">{message}</span>;
};

export default ErrorMessage;
