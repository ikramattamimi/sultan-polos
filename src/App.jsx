import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import Inventory from "./pages/Inventory.jsx";
import Konveksi from "./pages/Konveksi.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import InventoryDetail from "./pages/InventoryDetail.jsx";
import {inventoryDetailLoader, inventoryLoader} from "./loader.js";
import InventoryCreate from "./pages/InventoryCreate.jsx";

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AdminLayout />}>
        {/*<Route path="/" element={<RootLayout />}>*/}

        {/*<Route index element={<GuestLayout/>}>*/}
        {/*  <Route index element={<Home />} />*/}
        {/*</Route>*/}

        <Route index element={<AdminHome/>}/>
        <Route
          path="dashboard"
          id="dashboard"
          element={<AdminHome />} />
        
        <Route path="inventory">
          <Route
            index
            element={<Inventory />}
            loader={inventoryLoader} />
          <Route
            path=":id"
            element={<InventoryDetail />}
            loader={inventoryDetailLoader} />
          <Route
            path="create"
            element={<InventoryCreate />} />
        </Route>
        
        <Route path="konveksi" element={<Konveksi />} />

        {/*<Route path="admin" element={<AdminLayout/>}>*/}
        {/*  <Route path="dashboard" element={<AdminHome />} />*/}
        {/*</Route>*/}

      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
    // <div className="w-screen">
    //   <h1 className="text-center">App Inventory Management</h1>
    // </div>
  )
}

export default App
