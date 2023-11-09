import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credential, setcredential] = useState({ name:"", email: "", password: "", confirmpassword:"" });
  const Navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password} = credential
    // console.log(credential);
    const response = await fetch("http://localhost:8000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name,email, password }),
    });
    console.log(credential);
    Navigate("/login")
    const json = await response.json();
    
    if(json.success){
   //save the auth token and redirect
        localStorage.setItem('token', json.authtoken);
        Navigate('/login');
        props.showAlert("Account crreated successfully", "success")

    }
    else{
    props.showAlert("Invalid Credentials", "danger")
    }
  };
  const onChange =(e)=>{
    setcredential({...credential, [e.target.name]: e.target.value})
  }
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name"  className="form-label">
            Name
          </label>
          <input type="text" placeholder="Enter your name here"
          className="form-control" 
          id="name"  
          name="name"
          onChange={onChange} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input placeholder="Enter your email here"
            type="email"
            className="form-control"
            name="email"
            id="email"
            onChange={onChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" 
          className="form-label">
            Password
          </label>
          <input type="password" placeholder="Enter your password here"
          className="form-control" 
          id="password"
          name="password" 
          onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" 
          className="form-label">
            Confirm Password
          </label>
          <input placeholder="Enter your confirm password here"
            type="confirmpassword"
            className="form-control"
            id="confirmpassword" 
            name="confirmpassword"
            onChange={onChange} minLength={5} required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <p>Already have an account ? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;
