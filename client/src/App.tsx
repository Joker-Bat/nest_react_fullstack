import { useContext, useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css';
import Index from './routes/Index';
import Auth from './routes/Auth/Auth'; // loginAction, signupAction
import Home from './routes/Home/Home';
import Create from './routes/Create/Create';
import PrivateRoute from './HOC/PrivateRoute';
import { UserContext, UserContextType } from './HOC/ContextProvider';
import API from './services/api';
import List from './routes/List/List';
import GetEstimate from './routes/GetEstimate/GetEstimate'; // action as getEstimateAction,

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Index />,
        errorElement: <h1>Error occured</h1>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'list',
                element: <List />,
            },
            {
                path: 'auth',
                element: <Auth />,
                // action: loginAction,
                // children: [
                //   {
                //     path: "signup",
                //     action: signupAction,
                //   },
                // ],
            },
            {
                path: 'create',
                element: <PrivateRoute component={Create} />,
            },
            {
                path: 'get-estimate',
                element: <PrivateRoute component={GetEstimate} />,
                // loader: getEstimateAction,
            },
        ],
    },
]);

function App() {
    const { addUser, clearUser } = useContext(UserContext) as UserContextType;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const getCurrentUser = async () => {
            try {
                const { data } = await API.get<User>('/auth/whoami', {
                    signal: controller.signal,
                });
                addUser(data);
            } catch (err: any) {
                console.log('🚀 ~ err', err);
                if (err.message !== 'canceled') {
                    clearUser();
                }
            }
            setLoading(false);
        };

        getCurrentUser();

        return () => {
            setLoading(true);
            controller.abort();
        };
    }, []);

    if (loading) return <div></div>;

    return <RouterProvider router={router} />;
}

export default App;
