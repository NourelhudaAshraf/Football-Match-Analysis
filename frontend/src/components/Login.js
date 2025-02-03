import React,  { useRef ,useState} from 'react';
import './Login.css'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
function Login () {
  const containerRef = useRef(null);
  const [isSignUpPage, setIsSignUpPage] = useState(false);
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    containerRef.current.classList.add('active');
    setIsSignUpPage(true);
  };

  const handleLoginClick = () => {
    containerRef.current.classList.remove('active');
    setIsSignUpPage(false);
  };
  const [values, setValues] = useState({
    name:"",
    email:"",
    password:""
  })

  const handleChange = (e) => {
    setValues(prev=>( {...prev , [e.target.name]:[e.target.value]}))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email_pattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email_pattern.test(values.email))
    {
      const route = isSignUpPage ? '/signup' : '/login';
      if (isSignUpPage)
      {
        axios.post(`http://localhost:8081${route}` , values).then(res =>{
          if (res.data === "Error")
          {
            toast.error('Incompatible Information!')
          }
          else
          {
            window.location.href = "/login";
          }
          })
        .catch(err => console.log(err));
      }
      else
      {
        axios.defaults.withCredentials=true;
        axios.post(`http://localhost:8081${route}` , values).then(
          res =>{
            if (res.data.message !== "login failed")
            {
              navigate('/', { state: { user: res.data.user} });
            }
            else
            {
              toast.error('User Doesn`t Exist!')
            }
           })
        .catch(err => console.log(err));
      }
    }
    else {
      toast.error("Please Enter a Valid Email Address");
    }
  };
  return (
        <div className="container" id="container" ref={containerRef} >
          <div className="form-container sign-up" >
          <form onSubmit={handleSubmit}>
              <h1>Create Account</h1>
              <input type="text" placeholder="Name" name='name' onChange={handleChange} required/>
              <input type="email" placeholder="Email" name='email' onChange={handleChange} required/>
              <input type="password" placeholder="Password" name='password' onChange={handleChange} required/>
              <button>Sign Up</button>
          </form>
          </div>

          <div className="form-container sign-in">
              <form onSubmit={handleSubmit}>
                  <h1>Login</h1>
                  <input type="email" placeholder="Email" name='email' onChange={handleChange} required/>
                  <input type="password" placeholder="Password" name='password' onChange={handleChange} required/>
                  <button>Login</button>
              </form>
          </div>

          <div className="toggle-container">
              <div className="toggle">
                  <div className="toggle-panel toggle-left">
                      <h1>Welcome Back!</h1>
                      <p>Enter Your Personal Details</p>
                      <button className="hidden" id="login" onClick={handleLoginClick}>Login</button>
                  </div>
                  <div className="toggle-panel toggle-right">
                      <h1>Hello, Friend!</h1>
                      <p>Register With Your Personal Details</p>
                      <button className="hidden" id="register" onClick={handleRegisterClick}>Sign Up</button>
                  </div>
              </div>
          </div>
    </div>

  );
};

export default Login;