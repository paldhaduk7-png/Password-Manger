import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./design/Layout";
import Home from "./pages/Home";
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

function App() {
  const passwordRouter = createBrowserRouter([
    // Public general pages (accessible by anyone)
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
          path: "/",
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
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
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
