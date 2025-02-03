import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function PopUP(props) {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [name, setName] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSaveChanges = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      //props.handleSave(team1, team2);
      props.handleSave(name);
      props.onHide();
    }
  };

  const body = (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 220,
        bgcolor: '#ffffff',
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <h2 id="modal-title">Match Title</h2>
      <form onSubmit={handleSaveChanges}>
      <TextField
          id="name"
          label="Title"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          autoFocus
          margin="normal"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#e65151', 
                color:"#e65151",
              }},
            
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#e65151', 
              }}}
        />
        {/* <TextField
          id="team1"
          label="Team 1"
          type="text"
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
          fullWidth
          required
          autoFocus
          margin="normal"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#e65151', 
                color:"#e65151",
              }}
          }}
        />
        <TextField
          id="team2"
          label="Team 2"
          type="text"
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
          fullWidth
          required
          margin="normal"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#e65151', 
                color:"#e65151",
              }}
          }}
        /> */}
         <Box sx={{ mt: 2  , textAlign: 'right'}} >
            <Button type="submit" variant="contained" color="primary"  style={{backgroundColor:"#e65151"}}>
              Save Changes
            </Button>
            <Button onClick={props.onHide} sx={{ ml: 2 }}style={{color:"gray"}} >
              Close
            </Button>
        </Box>
       
      </form>
    </Box>
  );

  return (
    <Modal
      open={props.show}
      onClose={props.onHide}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {body}
    </Modal>
  );
}

export default PopUP;




// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import Modal from 'react-bootstrap/Modal';
// import './PopUP.css'
// function PopUP({ handleSave, onHide, ...props }) {
//   const [team1, setTeam1] = useState('');
//   const [team2, setTeam2] = useState('');
//   const [validated, setValidated] = useState(false);

//   const handleSaveChanges = (event) => {
//     event.preventDefault();
//     const form = event.currentTarget;

//     if (form.checkValidity() === false) {
//       event.stopPropagation();
//       setValidated(true);
//     } else {
//       setValidated(false);
//       handleSave(team1, team2); // Pass the team1 and team2 values to the callback
//       onHide(); // Hide the modal
//     }
//   };

//   return (
//     <Modal 
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Match Teams
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form noValidate validated={validated} onSubmit={handleSaveChanges}>
//           <Form.Group className="mb-3" controlId="team1">
//             <Form.Label>Team 1</Form.Label>
//             <Form.Control
//               type="text"
//               value={team1}
//               onChange={(e) => setTeam1(e.target.value)}
//               required
//               autoFocus
//             />
//             <Form.Control.Feedback type="invalid">
//               Please enter a name for Team 1.
//             </Form.Control.Feedback>
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="team2">
//             <Form.Label>Team 2</Form.Label>
//             <Form.Control
//               type="text"
//               value={team2}
//               onChange={(e) => setTeam2(e.target.value)}
//               required
//             />
//             <Form.Control.Feedback type="invalid">
//               Please enter a name for Team 2.
//             </Form.Control.Feedback>
//           </Form.Group>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={onHide} style={{ backgroundColor: 'gray' }}>
//               Close
//             </Button>
//             <Button variant="primary" type="submit" style={{ backgroundColor: '#e65151' }}>
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// }

// export default PopUP;
