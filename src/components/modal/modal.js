// @flow
import * as React from 'react';
import './modal.scss';
import History from '../history/history';
import DB from '../../DB/db_handler';

export default class Modal extends React.Component{
  constructor(props){
    super(props);
    this.handleKeepLoggedIn = this.handleKeepLoggedIn.bind(this);
    this.clearErr = this.clearErr.bind(this);
    this.state = {
      uname: '',
      pass: '',
      err:'',
      keepLoggedIn:false,
    }
  }

  dataInsert = new Promise((resolve,reject)=>{
    
  })

  submitHandler(event){
    event.preventDefault();
    let {uname,pass} = this.state;
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction((tx) => {   
      tx.executeSql('select * from USERS where uname = ? and pass = ?', [uname,pass], (tx, results) => { 
        
        if(parseInt(results.rows.length) == 1){
          document.cookie = 'username='+this.state.uname+';password='+this.state.pass+';max-age=172800';
          console.log('Logged In');
    
          //Check if url contains slug and size (If user had clicked on add to cart before logging in)
          let URL = window.location.search;
          let slugPresent = false;
        //  console.log(URL);
          if(URL.lastIndexOf('?login-modal=true&') > -1 && URL.lastIndexOf('&slug=') > -1 && URL.lastIndexOf('&size=') > -1) {
            const insertData = async () => {
              let slug = URL.substring(URL.lastIndexOf('&slug=')+6,URL.lastIndexOf('&'));
              let size = URL.substring(URL.lastIndexOf('&size=')+6);
              let {cardData} = this.props;
              let data = cardData.filter((card) => (card.slug==slug) );
              let uname = this.state.uname;
              console.log(uname);
              if(size in data[0].size){
              //  console.log('Data correct',data[0].name,data[0].size[size],data[0].discount);
                DB.insertData(data[0].name,data[0].size[size],size,data[0].discount,slug,uname);
                slugPresent = true;
              }
            }
            insertData();
          }
          this.props.loginHandler();
          this.props.closeModal();
          this.props.switchoffOverlay();
          if(slugPresent){
            History.push('/cart');
          }
        }else{
          this.setState({uname:this.state.uname,pass:this.state.pass,err:'Invalid username/password'});
        }
      },null);     
    });
  }

  unameHandler(event){
    let {error,pass} = this.state;
    this.setState({
      uname:event.target.value,
      pass:pass,
      error:error
    });
  }
  passHandler(event){
    this.setState({uname:this.state.uname,pass:event.target.value,error:this.state.error});
  }

  handleKeepLoggedIn(){
    this.state.keepLoggedIn ? this.setState({uname:this.state.uname,pass:this.state.pass,err:this.state.err,keepLoggedIn:false}) : this.setState({uname:this.state.uname,pass:this.state.pass,err:this.state.err,keepLoggedIn:true});
  }
  clearErr(){
    this.state.err != '' && this.setState({err:''});
  }
  getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }

  render() {
    let {cardData} = this.props;
    return (
      <div className='modal-container' >
        <div className='close-btn-wrapper'>
          <button className='close-btn' onClick={()=> {this.props.closeModal()
            this.props.switchoffOverlay()}}>X</button>
        </div>
        <div className='modal-header'><h1>Login</h1></div>
        <form onSubmit={(event)=>this.submitHandler(event)} className='modal-form'>
            <input name='uname' onKeyPress={this.clearErr} className='text-input' placeholder='Username' onChange={(event) => this.unameHandler(event)} />
            <input name='pass' className='text-input' placeholder='Password' onChange={(event) => this.passHandler(event)} />
            <div className='checkbox-cont'>
              <div className ='check-items'>
                <input type="checkbox" className='keep-checkbox' onClick={this.handleKeepLoggedIn} />
                <label className='keep-label' > Keep me logged in</label>
              </div>
            </div>
            <p className='err-p'>{this.state.err}</p>
            <button name='submit' type='submit' >SUBMIT</button>
        </form>
      </div>
    );
  }

}