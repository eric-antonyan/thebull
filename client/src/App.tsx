import React, { useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddTask from "./pages/AddTask";
import { NextUIProvider } from "@nextui-org/react";
import Task from "./pages/Task";
import EditTask from "./pages/EditTask";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Table from "./pages/Table";
import Settings from "./pages/Settings";
import axios from "axios";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

const App: React.FC = () => {
  useEffect(() => {
    const loadCsrf = async () => {
      try {
        const res = await axios.get(
          `http://${window.location.hostname}:8000/api/csrf-token`,
          { withCredentials: true }
        );

        if (res.data?.csrfToken) {
          localStorage.setItem("csrfToken", res.data.csrfToken);
        }
      } catch (e) {
        console.error("CSRF load error:", e);
      }
    };

    loadCsrf();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <NextUIProvider>
            <BrowserRouter>
              <Routes>
                <Route path={""} element={<Login />} />
                <Route path={"auth"}>
                  <Route path={"login"} />
                </Route>
                <Route path={"tasks"}>
                  <Route path={""} element={<Home />} />
                  <Route path={"new"} element={<AddTask />} />
                  <Route path={":taskId"}>
                    <Route path={""} element={<Task />} />
                    <Route path={"update"} element={<EditTask />} />
                  </Route>
                </Route>
                <Route path={"requests"} element={<Table />} />
                <Route path="register" element={<Register />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </BrowserRouter>
          </NextUIProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
