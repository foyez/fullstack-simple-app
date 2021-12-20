import { UserRegisterInput } from "../resolvers/types/user-input";

// validate email address
const isValidEmail = (email: string) => {
  const pattern =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return pattern.test(email);
};

// validate registration inputs
export const validateRegister = (credentials: UserRegisterInput) => {
  const { username, email, password } = credentials;

  if (!isValidEmail(email)) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (username.length < 4) {
    return [
      {
        field: "username",
        message: "length must be at least 4",
      },
    ];
  }

  if (password.length < 3) {
    return [
      {
        field: "password",
        message: "length must be at least 3",
      },
    ];
  }

  return null;
};
