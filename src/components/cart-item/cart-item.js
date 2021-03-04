// @flow
import * as React from 'react';
import "./cart-item.scss";
import DB from '../../DB/db_handler';
import img from '../images/tshirt.png'
import dustbin from '../images/dustbin.png';

export default class Cartitem extends React.Component{

    removeItem = () => {
        let {slug,size} = this.props;
        let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        let uname = this.getCookie('username');
        db.transaction((tx) => {   
            tx.executeSql('select * from USERS where uname = ?', [uname], (tx, results) => { 
                let u_id = results.rows[0].id;
                db.transaction((tx) => {   
                    tx.executeSql('delete from CART_ITEMS where slug = ? and size = ? and u_id = ?', [slug,size,u_id], (tx, results) => { 
                        console.log(results);
                        window.location.reload();
                    })
                })

            },null);
        });
        
    }

    getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    render() {
        let {name,size,discount,price,quantity} = this.props;
        let grandTotal = ((parseInt(price) * parseInt(quantity)) - ( (parseInt(price) * parseInt(quantity)) * (parseInt(discount)/100))).toFixed(2);
        let singlePrice = ((parseInt(price)) - ( (parseInt(price)) * (parseInt(discount)/100))).toFixed(2);
        return (
        <div className='cart-item-container'>
            <div className='cart-item-data-cont'>
                <div className='cart-item-img-cont'>
                    <img src={img} alt='cart-img' width='100' height='100' className='cart-item-img' />
                </div>
                <div className='cart-item-content-cont'>
                    <div><b>{name}</b></div>
                    <div>{size}</div>
                    <div className='cart-item-discount' >&#8377;{singlePrice} <div className='cart-item-dis-price' > {price}</div><div className='cart-item-dis'>({parseInt(discount)}% OFF)</div></div>
                    <div>Quantity : {parseInt(quantity)}</div>
                </div>
            </div>
            <div className='cart-item-footer'>
                <div className='cartitem-footer-btn-cont' >
                    <button className='cart-item-btn-delete' onClick={this.removeItem} >REMOVE</button>
                </div>
                <div className='cart-price-wrapper'>&#8377;{grandTotal}</div>
            </div>
            
        </div>
        );
    };
};