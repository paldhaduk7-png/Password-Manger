import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./design/Layout";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UpdateData from "./pages/Update";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./pages/Profile";
import SavedPasswords from "./pages/SavedPasswords";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { Toaster } from "sonner";
import { useTheme } from "./ContextAPI/context";

function App() {
  const { theme } = useTheme();
  const passwordRouter = createBrowserRouter([
    // Public general pages (accessible by anyone)
    {
      path: "/",
      element: (
        <Layout>
          <LandingPage />
        </Layout>
      ),
    },
    {
      path: "/about",
      element: (
        <Layout>
          <About />
        </Layout>
      ),
    },
    {
      path: "/contact",
      element: (
        <Layout>
          <Contact />
        </Layout>
      ),
    },

    // Guest routes (accessible ONLY when logged out; redirects logged-in users to /)
    {
      element: (
        <Layout>
          <GuestRoute />
        </Layout>
      ),
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/register",
          element: <Signup />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password/:token",
          element: <ResetPassword />,
        },
      ],
    },

    // Protected routes (accessible ONLY when logged in; redirects logged-out users to /login)
    {
      element: (
        <Layout>
          <ProtectedRoute />
        </Layout>
      ),
      children: [
        {
          path: "/dashboard",
          element: <Home />,
        },
        {
          path: "/saved-passwords",
          element: <SavedPasswords />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/update",
          element: <UpdateData />,
        },
        {
          path: "/update/:id",
          element: <UpdateData />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={passwordRouter} />
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          style:
            theme === "light"
              ? {
                  background: "rgba(255, 255, 255, 0.96)",
                  border: "1px solid rgba(203, 213, 225, 0.8)",
                  color: "#0f172a",
                  backdropFilter: "blur(12px)",
                }
              : {
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#f8fafc",
                  backdropFilter: "blur(12px)",
                },
        }}
      />
    </>
  );
}

export default App;
