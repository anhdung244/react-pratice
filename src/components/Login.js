import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../services/UserService";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";

const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, loginContext } = useContext(UserContext);
  const handleLoginUser = async (u, p) => {
    if (!email || !password) {
      toast.error("Email/password is required");
    }
    setLoading(true);
    let res = await loginUser(u, p);
    console.log(res);
    if (res && res.token) {
      // localStorage.setItem("token", res.token);
      loginContext(email, res.token);
      navigate("/");
    } else {
      //error
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoading(false);
  };

  //Tạo useEffect để khi người dùng đã đăng nhập có token rồi thì sẽ ko thể trở về trang login
  // // và user đã logout thì không thể quay lại trang Home
  // useEffect(() => {
  //   let token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/");
  //   }
  // }, []);

  //Handle GO Back
  const handleGoBack = () => {};

  return (
    <>
      <div className="login-container col-12 col-sm-4">
        <div className="title">Log in</div>
        <div className="text">Email or Username ( eve.holt@reqres.in )</div>
        <input
          type="text"
          placeholder="Email or Username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="input-password">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <i
            className={
              isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          ></i>
        </div>

        <button
          className={email && password ? "active" : ""}
          disabled={email && password ? false : true}
          onClick={() => handleLoginUser(email, password)}
        >
          {loading && <i className="fa-solid fa-sync fa-spin"></i>}
          &nbsp; Login
        </button>
        <div className="back">
          <i className="fa-solid fa-angles-left"></i>
          <span
            onClick={() => {
              handleGoBack();
            }}
          >
            &nbsp; Go back
          </span>{" "}
        </div>
      </div>
    </>
  );
};

export default Login;
