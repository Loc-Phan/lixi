import { BrowserRouter, Routes, Route } from "react-router-dom";
// user
import Home from "./pages/client/home";
import SignIn from "./pages/client/sign-in";
import MyEnvelope from "./pages/client/my-envelope";
// admin
import ContainerWrapper from "./components/admin/ContainerWrapper";
import ClientManagement from "@/pages/admin/client-management";
import OrderManagement from "./pages/admin/order-management";
import EnvelopeManagement from "./pages/admin/envelope-management";
import VoucherManagement from "./pages/admin/voucher-management";
import AdminLogin from "./pages/admin/login";
import "./App.css";
import UserContainerWrapper from "./components/client/UserContainerWrapper";
import AuthProvider from "@/provider/auth";
import NotFound from "@/pages/NotFound";
import SignUp from "./pages/client/sign-up";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserContainerWrapper />}>
            <Route index element={<Home />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="my-envelope" element={<MyEnvelope />} />
          </Route>
          <Route path="/admin/sign-in" element={<AdminLogin />} />
          <Route path="/admin" element={<ContainerWrapper />}>
            <Route index element={<ClientManagement />} />
            <Route path="order-management" element={<OrderManagement />} />
            <Route path="gift-management" element={<EnvelopeManagement />} />
            <Route
              path="gift-management/voucher"
              element={<VoucherManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
