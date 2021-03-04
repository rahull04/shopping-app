// @flow
import * as React from 'react';
import './cart.scss';
import DB from '../../DB/db_handler';
import CartItem from '../../components/cart-item/cart-item';
import CartTotal from '../../components/cart-total/cart-total';
import {Link} from "react-router-dom";
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import History from '../../components/history/history';

export default class cart extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      cartItems:[],
      dataLoaded:false
    }
  }

  componentDidMount(){
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    let uname = this.getCookie('username');
    db.transaction((tx) => {   
      tx.executeSql('select * from USERS where uname = ?', [uname], (tx, results) => { 
          let u_id = results.rows[0].id;
          
          db.transaction((tx) => {   
            tx.executeSql('select * from CART_ITEMS where u_id = ?', [u_id], (tx, results) => { 
              let data = [];
              for(let i=0;i<results.rows.length;i++){
                data.push({
                  id:results.rows.item(i).id,
                  name:results.rows.item(i).name,
                  price:results.rows.item(i).price,
                  size:results.rows.item(i).size,
                  discount:results.rows.item(i).discount,
                  slug:results.rows.item(i).slug,
                  quantity:results.rows.item(i).quantity,
                })
              }
      
              this.setState({
                cartItems:data,
                dataLoaded:true
              });
             },null);     
      
          });
      },null);
  });
    
  }

  DisplayData = () => {
    let {cartItems} = this.state;

    cartItems.map((cart)=>{
      console.log(cart);
      return <CartItem key={cart.id} name={cart.name} price={cart.price} size={cart.size} discount={cart.discount} />
    });
  }

  logOut = () => {
    document.cookie = 'username=;password=;';
    History.push('/');
    window.location.reload();
  }
  getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }
  render() {
    let {cartItems,dataLoaded} = this.state;
    let dataSize = cartItems.length;
    return (
      <div>
        <Header />
        <div className='cart-main'>
          
          {
            dataSize == 0 && //Cart is empty
              <div className='empty-cart-div'>
                <h2 className='empty-cart-head' >Cart is Empty</h2>
                <div className='empty-cart-btn-div'>
                  <button className='empty-cart-btn'><Link to="/" className='link' ><div>HOME</div></Link></button>
                </div>
                <div className='cart-log-out'>
                    <button className='cart-log-out-btn' onClick={this.logOut}>Log Out</button>
                </div>
              </div>
              || //Cart not empty
              <div className='cart-container'>
                <div className='cart-items-div'>
                  
                  {
                  cartItems.length > 0 && 
                    cartItems.map((cart)=>{
                      console.log(cart);
                      return <CartItem  name={cart.name} price={cart.price} size={cart.size} discount={cart.discount} slug={cart.slug} quantity={cart.quantity} />
                    })
                  }
                </div>
                <div className='cart-total-div'>
                  {
                    cartItems.length > 0 && <CartTotal data={cartItems} />
                  }
                </div>
              </div>
          }
          
        </div>
        <Footer />
      </div>
    );
  };
};