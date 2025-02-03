// Home.js
import React ,{useState,useEffect}from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import './Home.css';
import avatar from './multimedia.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const handleGameStatisticsButton = (e) => {
      e.preventDefault();
      if (!videoUrl)
      {
        toast.error("Upload Video!")
      }
      else
      {
          toast.info("Processing!", {
            autoClose: 10000
          })
          setIsButtonDisabled(true);
          const formData = new FormData();
          formData.append('video', videoUrl);
          axios.post(`http://localhost:3013/uploadVideo` ,formData ).then(res =>{
           if(res.data.message === "Success")
           {
              navigate('/dashboard', { state: {user:user, clicked:true ,output:res.data.output ,events:res.data.events,home:true}});
           }
          })
         .catch(err => console.log(err));
      }
  }
  const handleFileChange = (event) => {
    const file = event.target.files[event.target.files.length - 1 ];
    if (file) {
      setVideoUrl(file);
    }
  };
  return (
    <div>
      <Navbar user={user} />
          <div className='containerV'>
                {videoUrl? (
                        <div>
                          <video src={URL.createObjectURL(videoUrl)}  loop autoPlay  controls width="400"/>
                        </div>
                      ):
                      (
                        <div >
                                <label htmlFor="file">
                                  <img src={avatar}  alt="file" />
                                </label>
                        </div>
                      )
                }
                <input type="file" id = "file" accept="video/*" onChange={handleFileChange}   />
                <button onClick = {handleGameStatisticsButton} disabled={isButtonDisabled} style={{ backgroundColor: isButtonDisabled ? 'gray' : '#e65151' }}>
                  Generate Game Statistics
                </button>
             
          </div>
    </div>
  );
}

export default Home;
