import axios from "axios";
import Cookies from "js-cookie";
import {Request} from "./typings/Request";

const api = axios.create({
    baseURL: `http://${window.location.hostname}:8000/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

class Admin {
    private phoneNumber?: string;

    constructor(phoneNumber?: string) {
        this.phoneNumber = phoneNumber;
    }

    public async register(dto: Request) {
        try {
            const response = await api.post("/requests", dto);

            return {
                success: true,
                message: "Отправлено"
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    return error.response.data
                }
            } else {
                console.error("Unexpected error:", error);
            }
            return null;
        }
    }

    public async check() {
        try {
            const response = await api.post("/users", {
                phoneNumber: this.phoneNumber
            });

            Cookies.set("jwt", response.data.token)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    return error.response.data
                }
            } else {
                console.error("Unexpected error:", error);
            }
            return null;
        }
    }
}

export { api, Admin };
