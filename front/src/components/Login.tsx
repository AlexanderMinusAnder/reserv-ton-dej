import '../css/Login.css'
import { useState } from "react";

function Login() {

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    fetch("http://localhost:5050/api/user/signin", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form)
    }).then(
      async (response) => {
        const data = await response.json();

        localStorage.setItem("accessToken", data.accessToken);
        window.location.href = "/reservation"
      }
    );
  };

  const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <>
    <form onSubmit={(e) => {handleSubmit(e)}}>
      <div id="login">
        <div className="input">
          <label htmlFor="email">Email</label>
          <input type="text" className="textInput" id="email" value={form.email} onChange={handleChange} required></input>
        </div>

        <div className="input">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" className="textInput" id="password" value={form.password} onChange={handleChange} required></input>
        </div>

        <input type="submit" value="Se connecter" id="button"></input>
      </div>
    </form>
    </>
  );
}

export default Login;