import * as React from 'react';
import './header.scss';
import logo from '../images/main-logo.png';
import Modal from "../modal/modal";
import cartLogo from '../images/cart.png'
import { Navbar,Button,Nav,NavDropdown,Form,FormControl } from 'react-bootstrap';
import {Link} from "react-router-dom";
import History from '../history/history';

export default class Header extends React.Component {
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.state = {
      modalStatus: false,
      isLoggedIn: false,
      currPath:''
    }
  }

  modalHandler(modalStatus){
    modalStatus ? this.setState({modalStatus:false}) : this.setState({modalStatus:true});
    !modalStatus ? document.getElementsByTagName( 'html' )[0].setAttribute("class",'no-scroll') : document.getElementsByTagName( 'html' )[0].setAttribute("class",'');
    
    if(!modalStatus && History.location.pathname!='/'){
      History.push(History.location.pathname+'?login-modal='+!modalStatus);
    }else{
      History.push('?login-modal='+!modalStatus);
    }
      
    
  //  root.className = 'no-scroll';
  }

  closeModal(){
    this.setState({modalStatus:false});
    document.getElementsByTagName( 'html' )[0].setAttribute("class",'');
    History.push(this.state.currPath);
  }

  modalToggle(){
    
    if(this.state.modalStatus){
      return(
        <Modal closeModal={this.closeModal} modalStatus={this.state.modalStatus} loginHandler={this.loginHandler} switchoffOverlay={this.off} />
      )
    }
  }

  loginHandler(){
    this.state.isLoggedIn ? this.setState({isLoggedIn:false , modalStatus: this.state.modalStatus}) : this.setState({isLoggedIn:true , modalStatus: this.state.modalStatus}) 
  }

  getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }

  componentDidMount(){
    console.log(this.getCookie('username'));
    this.getCookie('username') != undefined && this.setState({isLoggedIn:true}); 
    this.setState({
      currPath:window.location.pathname
    });

    //Check if url contains login-modal
    
    let URL = window.location.href;
    
    if(URL.lastIndexOf('?login-modal=true') > -1){
      this.setState({
        modalStatus:true
      },()=>{
        this.on();
        document.getElementsByTagName( 'html' )[0].setAttribute("class",'no-scroll');
      })
      
    }
      
    
  }

  deleteCookie(){
    document.cookie = 'username=;password=;';
    this.loginHandler();
  }

  //Overlay
  on() {
    document.getElementById("overlay-div").classList.add('show');
  }
  
  off() {
    document.getElementById("overlay-div").classList.remove('show');

  }

  render(){
    let {modalStatus} = this.state;
    let {cardData} = this.props;
    const isLoggedIn = this.state.isLoggedIn;
    let button,cart;
    if (isLoggedIn) {
      button = <a className='link' onClick={()=> this.deleteCookie()}  >Logout</a>;
      cart = <Nav.Link href="#link" className='nav-item'><Link to="/cart" className='link'>Cart</Link></Nav.Link>;
    } else {
      button = <a onClick={()=> {this.modalHandler(this.state.modalStatus)
        this.on()}} className='link' >Login</a>;
    }
    return (
      <div className='header-container' >
        <Navbar bg="light" variant="light" expand="lg">
          <Navbar.Brand>
            <Link to="/" className='appname link'>
                Shopify
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='nav-ham' />
          <Navbar.Collapse id="basic-navbar-nav" inline>
            <Nav className="ml-auto">
              <NavDropdown title="Catalog" id="basic-nav-dropdown" className='dropdown-btn' >
                <NavDropdown.Item className='dropdown-item' ><div><Link to="/catalog/men" className='link' ><div>Men</div></Link></div></NavDropdown.Item>
                <NavDropdown.Item className='dropdown-item' ><Link to="/catalog/women" className='link'><div>Women</div></Link></NavDropdown.Item>
              </NavDropdown>
              <Nav.Link ><Link className='link'>Contact</Link></Nav.Link>
                {cart}
              <Nav.Link>
              {
                !isLoggedIn && button
              }
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="overlay" id='overlay-div'>
            {
              modalStatus && <Modal closeModal={this.closeModal} modalStatus={this.state.modalStatus} cardData={cardData} loginHandler={this.loginHandler} switchoffOverlay={this.off} />
            }
          </div>
          
        </Navbar>
        
      </div>
    );
  }
  
}