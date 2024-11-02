import axios from "axios";

const api = axios.create({
    baseURL: `http://${window.location.hostname}:8000/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

class Admin {
    private username: string;
    private password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    public async check() {
        try {
            const response = await api.post("/users/admin", {
                username: this.username,
                password: this.password
            });

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
