import '../css/Login.css'
import { useState } from "react";
import axios from 'axios';

function Login() {

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await axios.post("http://localhost:5050/api/user/signin", {
      email: form.email,
      password: form.password
    }, {withCredentials: true})
    .then(() => {
      window.location.href = "/reservation"
    })
    .catch((err: any) => {
      console.log(err)
    })
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