import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import ConvectionPage from "./pages/ConvectionPage.jsx";
import Report from "./pages/Report.jsx";

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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<AdminLayout />}>

          <Route index element={<AdminHome />} loader={dashboardLoader} />
          <Route path="dashboard" id="dashboard" element={<AdminHome />} loader={dashboardLoader} />

          {/* Inventory Routes */}
          <Route>
            <Route 
              path="product" 
              element={<ProductManagementPage />}
              loader={() => productsLoader({ params: { includeVariants: true } })} 
            />
            <Route path="sales">
              <Route index element={<SalesPage />} />
              <Route
                path="create"
                element={<SalesCreatePage />}
              />
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

          {/* Report Routes */}
          <Route 
            path="report" 
            element={<Report />} 
            loader={salesReportLoader}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default App;