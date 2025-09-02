import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import AdminLayout from "./components/layouts/AdminLayout.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import ConvectionPage from "./pages/ConvectionPage.jsx";
import Report from "./pages/Report.jsx";
import IncomeStatementPage from "./pages/IncomeStatementPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";

import {
  productsLoader,
  dashboardLoader,
  convectionsLoader,
  convectionLoader,
  salesReportLoader,
  masterDataLoader,
} from "./loader.js";

import ConvectionDetailPage from "./pages/ConvectionDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProductManagementPage from "./pages/ProductManagementPage.jsx";
import ConvectionCreatePage from "./pages/ConvectionCreatePage.jsx";
import SalesPage from "./pages/SalesPage.jsx";
import SalesCreatePage from "./pages/SalesCreatePage.jsx";
import FormComponentsDemo from "./pages/FormComponentsDemo.jsx";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import AuthService from "./services/AuthService.js";
import { UserContext } from "./contexts/UserContext.js";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";

function App() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = await AuthService.checkUser();
        // console.log("Check user:", loggedUser);
        setUser(loggedUser || {});
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user is authenticated (you might need to adjust this condition)
  const isAuthenticated = user && Object.keys(user).length > 0;

  const routes = (
    <>
      {/* Protected Routes - only accessible when authenticated */}
      {isAuthenticated ? (
        <>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="sales" replace />} />
            <Route
              path="dashboard"
              id="dashboard"
              element={<AdminHome />}
              loader={dashboardLoader}
            />

            {/* Inventory Routes */}
            <Route>
              <Route
                path="product"
                element={<ProductManagementPage />}
                loader={() =>
                  productsLoader({ params: { includeVariants: true } })
                }
              />
              <Route path="sales">
                <Route index element={<SalesPage />} />
                <Route path="create" element={<SalesCreatePage />} />
              </Route>
            </Route>

            {/* Convection Routes */}
            <Route path="convection">
              <Route
                index
                element={<ConvectionPage />}
                loader={convectionsLoader}
              />
              <Route
                path=":id"
                element={<ConvectionDetailPage />}
                loader={convectionLoader}
              />
              <Route
                path="create"
                element={<ConvectionCreatePage />}
                loader={masterDataLoader}
              />
            </Route>

            {/* Finance Routes */}
            <Route path="income-statement">
              <Route index element={<IncomeStatementPage />} />
            </Route>

            <Route path="expenses">
              <Route index element={<ExpensesPage />} />
            </Route>

            {/* Report Routes */}
            <Route
              path="report"
              element={<Report />}
              loader={salesReportLoader}
            />

            {/* Components */}
            <Route path="components">
              <Route path="forms" element={<FormComponentsDemo />} />
            </Route>

            {/* Change Password */}
          </Route>
          <Route path="change-password" element={<ChangePasswordPage />} />
        </>
      ) : (
        // Redirect all protected routes to login when not authenticated
        <Route path="/*" element={<Navigate to="/login" replace />} />
      )}

      {/* Public Routes */}
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
  );

  const router = createBrowserRouter(createRoutesFromElements(routes));

  return (
    <UserContext.Provider value={user}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
