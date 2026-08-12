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
import ProtectedRoute from './components/ProtectedRoute';
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
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
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
          <ProtectedRoute>
            <UpdateData />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/update/:id",
      element: (
        <Layout>
          <ProtectedRoute>
            <UpdateData />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/profile",
      element: (
        <Layout>
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/saved-passwords",
      element: (
        <Layout>
          <ProtectedRoute>
            <SavedPasswords />
          </ProtectedRoute>
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
