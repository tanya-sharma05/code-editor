import {Navigate, Route, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
          position="top-right"
          toastOptions={{
              style: {
                  background: '#000000', 
                  color: '#FFFFFF', 
                  border: '1px solid #FFFFFF',
              },
          }}
      ></Toaster>
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/editor/:documentId" element={<EditorPage />} />
      </Routes>
    </>
  )
}

export default App;
