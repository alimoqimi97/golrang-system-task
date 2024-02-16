import axios from "axios";

const http = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

export default http;
