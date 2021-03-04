// @flow
import * as React from 'react';
import './cart-total.scss';
import History from '../history/history';

export default class Carttotal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      totalAmt:'',
      grandAmt:'',
      totalDiscount:''
    }
  }
  logOut = () => {
    document.cookie = 'username=;password=;';
    History.push('/');
    window.location.reload();
  }

  componentDidMount(){
    let {data} = this.props;
    let amt = 0;
    let gamt = 0;
    let disc = 0;
    
    data.map((data)=>{
      amt += parseInt(data.price) * parseInt(data.quantity);
      gamt += (parseInt(data.price) * parseInt(data.quantity)) - ( (parseInt(data.price) * parseInt(data.quantity)) * (parseInt(data.discount)/100));
      disc += ( (parseInt(data.price) * parseInt(data.quantity)) * (parseInt(data.discount)/100) );
    });

    this.setState({
      totalAmt:amt,
      grandAmt:gamt,
      totalDiscount:disc
    })
  }


  render() {
    let {totalAmt,grandAmt,totalDiscount} = this.state;
    // console.log(totalAmt,grandAmt);
    return (
      <div className='cart-total-cont'>
        <div className='cart-total-header'>
          Price Details
        </div>
        <div className='cart-total-mrp-wrapper'>
          <div>Total MRP</div> <div>&#8377;{ totalAmt!='' && totalAmt.toFixed(0)}</div>
        </div>
        <div className='cart-total-dis-wrapper'>
          <div>Total Discount</div> <div>&#8377;{totalDiscount!='' && totalDiscount.toFixed(0)}</div>
        </div>
        <hr />
        <div className='cart-total-amt-wrapper dark'>
            <div>Grand Total </div> <div>&#8377;{grandAmt!='' && grandAmt.toFixed(0)}</div>
        </div>
        <div className='cart-total-disc-txt'>
          You save &#8377;{totalDiscount!='' && totalDiscount.toFixed(0)} on this product
        </div>
        <div className='cart-place-order'>
            <button className='place-order-btn'>PLACE ORDER</button>
        </div>
        <div className='cart-log-out'>
            <button className='cart-log-out-btn' onClick={this.logOut}>Log Out</button>
        </div>
      </div>
    );
  };
};