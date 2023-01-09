import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext, UserContextType } from "./ContextProvider";

interface Props {
  component: React.FC;
}

const PrivateRoute: React.FC<Props> = ({ component: Component }) => {
  const { user } = useContext(UserContext) as UserContextType;

  return user ? <Component /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
