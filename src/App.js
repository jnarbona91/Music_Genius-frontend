import React from 'react';
import Genius from './components/Genius';
// import Login from './components/Login';
// import styled from "styled-components";
import './App.css';
import {
    Navbar,
    NavbarBrand,
    Jumbotron,
    NavItem,
    Nav,
    NavLink,
    Container 
} from 'reactstrap';

function App() {

// const [token, setToken] = useState('');
// const [isModalOpen, setIsModalOpen] = useState(true);

// const userLogin = (tok) => {
//   setToken(tok);
//   console.log(tok)
//   setIsModalOpen(false);
// }


return (
   <React.Fragment>
     <Navbar>
       <NavbarBrand>Music Genius</NavbarBrand>
       <Nav>
         <NavItem>
           <NavLink href="http://localhost:8888">Login</NavLink>
         </NavItem>
         <NavItem>
           <NavLink>Sign Up</NavLink>
         </NavItem>
       </Nav>
     </Navbar>
   <Jumbotron>
     <Container>
       <Genius />
     </Container>
   </Jumbotron>
   {/* <Root>
    {isModalOpen && (
        <Overlay className="modal">
          <Dialog>
            <Login userLogin={userLogin} token={token} href="http://localhost:8888" />
            <br />
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </Dialog>
        </Overlay>
    )} */}
    <center><p>&copy; EMOTIV Interns - San Diego</p></center>
  {/* </Root> */}
  </React.Fragment>
);
}

// const Root = styled.div`
// font-family: sans-serif;
// text-align: center;
// position: relative;
// `;
// const Overlay = styled.div`
// position: fixed;
// top: 0;
// left: 0;
// bottom: 0;
// right: 0;
// background: rgba(0, 0, 0, 0.3);
// `;
// const Dialog = styled.div`
// background: white;
// border-radius: 5px;
// padding: 20px;
// position: absolute;
// top: 50%;
// left: 50%;
// transform: translate(-50%, -50%);
// z-index: 1;
// `;

export default App;
