import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './design/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import UpdateData from './pages/Update';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Profile from './pages/Profile';
import SavedPasswords from './pages/SavedPasswords';
import { Toaster } from "sonner";

function App() {
  const passwordRouter = createBrowserRouter([
    {
      path: "/signup",
      element: (
        <Layout>
          <Signup />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: (
        <Layout>
          <Login />
        </Layout>
      ),
    },
    {
      path: "/",
      element: (
        <Layout>
          <Home />
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
    {
      path: "/update",
      element: (
        <Layout>
          <UpdateData />
        </Layout>
      ),
    },
    {
      path: "/profile",
      element: (
        <Layout>
          <Profile />
        </Layout>
      ),
    },
    {
      path: "/saved-passwords",
      element: (
        <Layout>
          <SavedPasswords />
        </Layout>
      ),
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
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f8fafc',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </>
  );
}

export default App;
