import axios from "axios";

// 封装axios
export function request(config) {

    const instance = axios.create({
        baseURL: "http://localhost:8081",
        timeout: 5000
    })

    return instance(config);
}
