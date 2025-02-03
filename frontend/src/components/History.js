import React ,{ useState,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Typography, Grid, Paper,Button} from '@mui/material';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function History() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const [historyList , setHistoryList] = useState([]) ;
    //const [check , setCheck] = useState(false) ;
    const [currentUser, setCurrentUser] = useState({});
    axios.defaults.withCredentials=true;
    useEffect(() => {
        axios.get('http://localhost:8081').then(response => {
            if (response.data.valid) {
                setCurrentUser(response.data.user);
                setHistoryList(response.data.user.history);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        },[]);
    });
  return (
    <div>
       <Navbar user={user}/>
          {(historyList.length>0)? 
          <Container style={{  paddingTop: "250px"  }}>
             <Grid item xs={12} >
             {historyList.map((item, index) => {
                    const handleClickButton = () => {
                      navigate('/dashboard', { state: {user:currentUser, clicked:true, home:false, output: JSON.parse(JSON.parse(item.game)) , ballPossession:JSON.parse(JSON.parse(item.possession))}});
                    };
                    const handleDeleteButton =()=>{
                      const id = item.game_id;
                      axios.post('http://localhost:8081/deleteGameStats' ,{id}).then(response => {
                        toast.success("Deleted")
                      })
                      .catch(error => {
                          console.error('Error:', error);
                      },[]);
                    }
                    return (
                            <Paper elevation={3} style={{ padding: 20,paddingBottom:'10px', borderRadius: '10px', width: '420px', height: "180px", marginBottom: "20px", display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#1b2430' }} key={index}>
                                <Typography variant="h6" align='left' style={{ color: 'white' }}> 
                                    {item.name}
                                    <Typography paddingLeft={'10px'} color={'gray'}>
                                         {new Date(item.time).toLocaleDateString()}
                                    </Typography> 
                                </Typography>
                                <Button variant="contained" style={{ color: 'white', background: '#e65151' , marginTop:"10px"}} onClick={handleClickButton}>
                                    Show Game Statistics
                                </Button>
                                <Button variant="contained" style={{ color: 'white', background: '#e65151' , marginTop:"10px" }} onClick={handleDeleteButton}>
                                    Delete
                                </Button>
                            </Paper>
                        );
                  })}
             </Grid>
           </Container>
          :
          <div>No Saved Items</div>}
    </div>
  );
}

export default History;
