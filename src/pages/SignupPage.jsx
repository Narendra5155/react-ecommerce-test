import { useCallback, useMemo, useState } from "react";
import { useAuthContext } from "../context/authProviders/authUtils";
import {  useNavigate } from "react-router-dom";
import { routes } from "../../constants";

function SignupPage() {
  const { signUp } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isAdmin,setIsAdmin] = useState(false)
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const isDisabled = useMemo(() => {
    return !username.trim() || !password.trim() || !confirmPassword.trim() 
  }, [username, password, confirmPassword]);
  const handleLogin = useCallback(() => {
    if (username.trim().length < 6) {
      setError("Username Invalid");
      return;
    }
    if (password.trim().length < 6) {
      setError("password must be 6 characters");
    }

    if (password.trim() != confirmPassword.trim()) {
      setError("Confirm Password and password does not match")
    }

    try {
      signUp(username,password,isAdmin)
      alert("signup in successfully");

      navigate(routes.login)
      return;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    }
  },[username,password,signUp,navigate,confirmPassword,isAdmin]);
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="flex flex-col items-center justify-center gap-2 p-4 border-2">
        
      {
        error && <p className="text-red-500">{error}</p>
        }
        <label>
          Is Admin
          <input type="checkbox" checked={isAdmin} onChange={(e)=>setIsAdmin(e.target.checked)}/>
        </label>
      <label className="flex  items-center justify-center gap-2">
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
          />
      </label>
      <label className="flex  items-center justify-center gap-2">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
          />
      </label>
      <label className="flex  items-center justify-center gap-2">
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
          />
      </label>
      <button onClick={handleLogin} disabled={isDisabled} className={`bg-blue-500 text-white p-2 rounded-md ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>SignUp</button>
          </div>
    </div>
  );
}

export default SignupPage;
