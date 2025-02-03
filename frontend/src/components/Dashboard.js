import React ,{useState}from 'react'
import Navbar from './Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css'
import axios from 'axios'
import VideoPlayer from './VideoPlayer/VideoPlayer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Grid, Paper} from '@mui/material';
import { HiOutlineSaveAs } from "react-icons/hi";
import { useLocation } from 'react-router-dom';
import PopUP from './Popup/PopUP';
function Dashboard() {
  const location = useLocation();
  const user = location.state?.user;
  const buttonClicked = location.state?.clicked;
  const check = location.state?.home;
  const events = location.state?.events;
  const gameStatistics = location.state?.output;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  var data;
  var team1Stats={} , team2Stats={};
  if(gameStatistics)
  {
    team1Stats= gameStatistics["team 0"];
    team2Stats = gameStatistics["team 1"];
    data = [
      { team: "Team 1", Possession: team1Stats["Ball Possession"]*100 },
      { team: "Team 2", Possession: team2Stats["Ball Possession"] *100}
    ];
  }
  const handleSave = (name) => {
    const formData = new FormData();
      formData.append('json', JSON.stringify( gameStatistics));
      const data = {
        "team1" : team1Stats["Ball Possession"]*100,
        "team2" : team2Stats["Ball Possession"]*100
      }
      formData.append('ballPossession', JSON.stringify(data));
      formData.append('userId', user.id);
      formData.append('match', name);
      axios.post('http://localhost:8081/uploadStatistics', formData).then(res =>{
        if(res.data === "Success")
        {
          toast.success("Saved")
        }
        else
        {
          toast.error("Failed!")
        }
       })
      .catch(err => console.log(err));
   }
  const handleClick = () => {
    if(!user)
    {
      toast.error("Login To Save Statistics");
    }
    else
    {
      setIsButtonDisabled(true);
      handleShow();
    }
  }
  const classes = [
        "Foul",
        "Clearance",
        "Corner",
        "Throw-in",
        "Yellow card",
        "Red card",
        "Kick-off",
        "Passes",
        "Ball out of play",
        "Shots"
  ];

  return (
    <div>
        <Navbar user={user}/>
        {buttonClicked?
           <Container>
             <Container style={{ marginTop: `800px`}}>
              {/* {videoUrl&& <video
                      src={videoUrl}
                      loop
                      controls
                      className='videoContainer'
                      autoPlay
                      style={{  width: "880px",
                        height: "400px",
                        borderRadius: "30px"}}
                    />} */}
                   {check &&(<VideoPlayer list={events}/>)}
             </Container>
             <div>
                <div className='bar'>
                    <ResponsiveContainer width={400} height={400} >
                    <BarChart
                      data={data}>
                      <XAxis dataKey="team" type="category" stroke=' #1b2430'/>
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Possession" fill="#1b2430" stroke="#e65151"  radius={[10, 10, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{marginLeft:"10px" , marginTop:"20px" ,width:"900px"}}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6} lg={4}>
                      <Typography variant="h5" gutterBottom align='center' style={{ color: ' #e65151', background:'#1b2430' }}>Team 1</Typography>
                        <Paper elevation={3} style={{ padding: 20, borderRadius: '10px', background: '#1b2430' }}>
                          {classes.map((className, index) => {
                            const statValue = className == "Shots"? team1Stats["Shots on target"] || 0 +team1Stats["Shots off target"] || 0 : team1Stats[className] ;
                            return (
                              <Typography
                                key={index}
                                variant="h6"
                                align="center"
                                style={{ color: 'white', marginBottom: index !== 0 ? '7.5px' : '0' }}
                              >
                                {`${statValue}`}
                              </Typography>
                            );
                          })}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6} lg ={4}>
                        <Paper elevation={3} style={{ padding: 20 , marginTop:"45px" ,backgroundColor: 'rgba(255, 255, 255,0)' ,borderRadius:'10px'}}>
                              {classes.map((className, index) => {
                                return (
                                  <Typography key={index} variant="h6" gutterBottom align='center' style={{ color: ' #e65151' }}>{className}</Typography>
                                )
                            })}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6} lg ={4}>
                        <Typography variant="h5" gutterBottom align='center' style={{ color: ' #e65151', background:'#1b2430' }}>Team 2</Typography>
                        <Paper elevation={3} style={{ padding: 20, borderRadius: '10px', background: '#1b2430' }}>
                          {classes.map((className, index) => {
                             const statValue = className == "Shots"? team2Stats["Shots on target"] +team2Stats["Shots off target"] : team2Stats[className] ;
                            return (
                              <Typography
                                key={index}
                                variant="h6"
                                align="center"
                                style={{ color: 'white', marginBottom: index !== 0 ? '7.5px' : '0' }}
                              >
                                {`${statValue}`}
                              </Typography>
                            );
                          })}
                        </Paper>
                      </Grid>
                    </Grid>
                   {check&&( <div  className='save-button' onClick={handleClick}>
                        <HiOutlineSaveAs className="icon" />
                      </div>)}
                      {isButtonDisabled && <PopUP show = {show} onHide={handleClose}  handleSave={handleSave}/>
                    }
                  </div>
             </div>
             
           </Container>
        :
        <div>Go back to Home to Upload Video</div>
      }
    </div>
  )
}


export default Dashboard