import axios from "axios";
import Cookies from "js-cookie";
import { Request } from "./typings/Request";

const api = axios.create({
  baseURL: `https://${window.location.hostname}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach CSRF token
api.interceptors.request.use((config) => {
  const csrf = localStorage.getItem("csrfToken");
  if (csrf) {
    config.headers["X-CSRF-Token"] = csrf;
  }
  return config;
});

class Admin {
  private phoneNumber?: string;
  private password?: string;

  constructor(phoneNumber?: string, password?: string) {
    this.phoneNumber = phoneNumber;
    this.password = password;
  }

  // Registration (requests)
  public async register(dto: Request) {
    try {
      await api.post("/requests", dto);

      return {
        success: true,
        message: "Отправлено",
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error data:", error.response.data);
        return error.response.data;
      }
      return {
        success: false,
        message: "Неизвестная ошибка",
      };
    }
  }

  // Login (users/login)
  public async check() {
    try {
      const response = await api.post("/users/login", {
        phoneNumber: this.phoneNumber?.replace("+", ""),
        password: this.password,
      });

      // Save JWT in cookies or localStorage — your choice
      Cookies.set("jwt", response.data.token, {
        expires: 7,
        sameSite: "Lax",
      });

      localStorage.setItem("accessToken", response.data.token);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error data:", error.response.data);
        return error.response.data;
      }
      return {
        success: false,
        message: "Ошибка авторизации",
      };
    }
  }
}

export { api, Admin };
