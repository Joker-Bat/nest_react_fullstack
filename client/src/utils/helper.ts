export const isValidYear = (year: string) => {
  return year && +year > 1930 && +year <= new Date().getFullYear();
};

export const isValidMileageOrPrice = (mileage: string) => {
  return mileage && +mileage > 0 && +mileage <= 1000000000;
};

export const isValidLocation = (loc: string) => loc.length > 0 && +loc;

export const currencyFormatter = (value: string | number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(+value);

export const isValidEmail = (email: string) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string) => password.length >= 6;
