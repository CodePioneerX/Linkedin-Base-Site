import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

const ProfileCard = ({ name, title, about, image }) => {

<<<<<<< Updated upstream
const shortAbout = about.split(".")[0] + '...';
=======
const [profile, setProfile] = useState("");
// console.log(props)
//get the user's profile information using the profile id
const getProfile = async () => {

  const {data} = await axios.get(
    `http://insightwearai.sytes.net:8000/api/profile/${props.user.id}`
  );
  setProfile(data.profile);
  
}

useEffect(() => {
  getProfile(); 
}, []);
>>>>>>> Stashed changes

  return (
    <Card >
      
      <Row>
        <Card.Body className='card_body'>
            <Col>
                <Card.Img className='img_profile' variant="top" src={image} />
            </Col>

            <Col>
                <Card.Title>{name}</Card.Title>
            </Col>

            <Col><Card.Subtitle className="mb-2 text-muted">{title}</Card.Subtitle></Col>
            <Col><Card.Text>{shortAbout}</Card.Text></Col>
            <Col><Button variant="primary">View Profile</Button></Col>
            
            
        </Card.Body>
      </Row>
    </Card>
  );
};

export default ProfileCard;
