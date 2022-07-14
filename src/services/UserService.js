import axios from "./customize-axios"; //axios = instance trong file cusstom

const fetchAllUser = (page) => {
  return axios.get(`/api/users?page=${page}`);
};

const postCreateUser = (name, job) => {
  return axios.post("/api/users", { name: name, job: job });
};

const putUpdateUser = (name, job) => {
  return axios.put("/api/users/2", { name: name, job: job });
};

const deleteUser = (id) => {
  return axios.delete(`/api/users/${id}`);
};

const loginUser = (email, password) => {
  return axios.post("/api/login", { email, password });
};

export { fetchAllUser, postCreateUser, putUpdateUser, deleteUser, loginUser };
