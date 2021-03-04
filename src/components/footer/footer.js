// @flow
import * as React from 'react';
import "./footer.scss";
import {useState} from 'react';

export default function Footer(props) {

  const [email,setEmail] = useState('');
  const [msg,setMsg] = useState('');
  const [err,setErr] = useState('');

  const submitHandler = (event) => {
    event.preventDefault();
    if(email != '' && msg != ''){
        fetch('http://demo8978959.mockable.io/contact')
        .then((resp)=>resp.json())
        .then((resp)=>{
          console.log(resp.message);
          document.getElementById('contact-response').classList.remove('hide');
          let contact_form = document.getElementById('contact-us-form');
          contact_form.classList.add('hide');
          document.getElementById('contact-response').innerText = resp.message;
        })
        .catch((err)=>{
          document.getElementById('contact-response').classList.remove('hide');
          document.getElementById('contact-response').innerText = err;
        });
    }else{
        setErr('Invalid input');
    }
    
  }

  const inputHandler = (event) =>{
    event.target.name == 'contact-us-email' ? setEmail(event.target.value) : setMsg(event.target.value);
  }

  const clearErr = () => {
    err != '' && setErr('');
  }

  return (
      <div className='footer-container'>
        <div className='row'>
          <div className='col-lg-9 '>
            <div className='footer-info-container'>
              <h2 className='footer-info-heading' >Shopping App</h2>
              <p className='footer-content' >Shopping App is one of the unique online shopping sites in India where fashion is accessible to all. Check out our new arrivals to
                    view the latest designer clothing, footwear and accessories in the market. You can get your hands on the trendiest style every
                    season in western wear. You can also avail the best of ethnic fashion during all Indian festive occasions.
              </p>
              <p className='footer-content'>
                    Check out our new arrivals to
                    view the latest designer clothing, footwear and accessories in the market. You can get your hands on the trendiest style every
              </p>
            </div>
          </div>
          <div className='col-lg-3 '>
            <div className='contact-us-container'>
              <h2 id='contact-us-title' className='footer-info-heading center' >Contact Us</h2>
              <p id='contact-response' className='contact-resp hide'></p>
              <form onSubmit={(event)=>submitHandler(event)} id='contact-us-form' className='contact-form' >
                  <div className='footer-input-cont'>
                    <div className='form-label'>
                        <label>Email</label>
                    </div>
                    <input type='email' required name='contact-us-email' className='contact-email-input' onKeyPress={()=>clearErr()} onChange={(event)=>inputHandler(event)} />
                    <div className='form-label'>
                        <label>Message</label>
                    </div>
                    <textarea type='text' required name='contact-us-msg' className='contact-msg-input' onKeyPress={()=>clearErr()} onChange={(event)=>inputHandler(event)} />
                  </div> 
                  <p className='contact-valid' >{err}</p>
                  <div className='form-btn' >
                      <button className='contact-btn' >SUBMIT</button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};