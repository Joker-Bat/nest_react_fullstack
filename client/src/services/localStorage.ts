export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  if (!user) return null;
  return JSON.parse(user);
};

export const setCurrentUser = (user: User) =>
  localStorage.setItem("currentUser", JSON.stringify(user));

export const clearCurrentUser = () => localStorage.removeItem("currentUser");
