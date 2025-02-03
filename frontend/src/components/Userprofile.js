import React , { useState ,useEffect }  from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import './Userprofile.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatar from './profile.png'
import { useFormik } from 'formik';
import Navbar from './Navbar';

function Userprofile() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [file, setFile] = useState('');
    const [changeImage,setChangeImage] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisible(prevVisible => !prevVisible);
    };
    function handleImage(e){
        setChangeImage(true);
        setFile(e.target.files[0])
    }
    const [currentUser, setCurrentUser] = useState({});
    axios.defaults.withCredentials=true;
    useEffect(() => {
        axios.get('http://localhost:8081').then(response => {
            if (response.data.valid) {
                setCurrentUser(response.data.user);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        },[]);
    });
   const formik = useFormik({
    initialValues : {
      name : currentUser?.name || '',
      email: currentUser?.email || '',
      password:currentUser?.password || '',
      image: currentUser && currentUser.imageUrl ? currentUser.imageUrl : avatar
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if(changeImage)
      {
        const formdata = new FormData();
        formdata.append('file' , file);
        axios.post("http://localhost:8081/uploadImage",formdata).then(response => {
           console.log(response.data);
           setChangeImage(false);
        })
        .catch(error => {
            console.error('Error:', error);
      })}
      axios.post(`http://localhost:8081/updateData` , values).then(res =>{
        if (res.data === "Error")
        {
          toast.error('Incompatible Information!')
        }
        else {
          toast.success("Updated!")
        }
        })
      .catch(err => console.log(err));
    },
   })

  const location = useLocation();
  const user = location.state?.user;
return (
  <div>
     <Navbar user={user}/>
     <div className='container'>
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="profile">
                <img src={formik.values.image}  alt="profile" />
            </label>
            <input type="file" id='profile' name='profile' onChange={handleImage} />
           <input name='name' value={formik.values.name} type="text" placeholder='Name' onChange={formik.handleChange} required/>
           <input  name='email' value={formik.values.email} type="email" placeholder='email' onChange={formik.handleChange} required/>
           <div class="password-container">
                    <input value={formik.values.password} name='password' type={passwordVisible ? 'text' : 'password'} id="password" placeholder="Password" onChange={formik.handleChange} required/>
                    <i className={passwordVisible ? "toggle-password fas fa-eye-slash" : "toggle-password fas fa-eye"}
                     onClick={togglePasswordVisibility}></i>
            </div>
           <button>Update</button>
        </form>
      </div>
  </div>
);
}

export default Userprofile