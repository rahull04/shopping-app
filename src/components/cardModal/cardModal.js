// @flow
import * as React from 'react';
import './cardModal.scss';
import History from "../history/history";
import DB from '../../DB/db_handler';
import {
    Link
  } from "react-router-dom";

export default class CardModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currSize:'',
            currPrice:'',
            discountedPrice:'',
            addedtoCart:false,
            slug:'',
            isLoggedIn:false,
        }
    }

    componentDidMount(){

        let {sizeData,discount,slug} = this.props;
        let dis_price = sizeData[Object.keys(sizeData)[0]] - (sizeData[Object.keys(sizeData)[0]]) * (discount/100);

        this.setState({
            currSize:Object.keys(sizeData)[0],
            currPrice:sizeData[Object.keys(sizeData)[0]],
            discountedPrice:dis_price
        });
        //Update url
        let URL = window.location.href;
        let sizeURLval = URL.lastIndexOf('&size=');
        let slugURLval = URL.lastIndexOf('?item=');
        let slugVal;

        if(slugURLval != -1){ // URL contains slug reference
            if(sizeURLval!=-1){ // URL contains size reference
                let sizeVal = URL.substring(sizeURLval+6);
                slugVal = URL.substring(slugURLval+6,URL.lastIndexOf('&'));
    
                if(sizeVal in sizeData){ // URL contains CORRECT size
                    this.setState({
                        currSize:sizeVal
                    });
                }else{ //URL contains INCORRECT size
                    let currUrl = '?item=' + slugVal + '&size=' + Object.keys(sizeData)[0];
                    History.push(currUrl);
                }

            }else{ // URL doesnt have size reference
                if(URL.lastIndexOf('&') != -1){ //URL has just slug and & character
                    let slugVal = URL.substring(slugURLval+6,URL.lastIndexOf('&'));
                    let currUrl = '?item=' + slugVal + '&size=' + Object.keys(sizeData)[0];
                    History.push(currUrl);
                }else{ //URL has only slug
                    let slugVal = URL.substring(slugURLval+6);
                    let currUrl = '?item=' + slugVal + '&size=' + Object.keys(sizeData)[0];
                    History.push(currUrl);
                }
                
            }
        } 
        
        //Save slug value to state
        this.setState({
            slug:slug
        })
        // Check if logged in
        this.getCookie('username') != undefined && this.setState({isLoggedIn:true}); 
        
    }
    off() {
        document.getElementById("overlay-div").classList.remove('show');
        document.getElementsByTagName( 'body' )[0].setAttribute("class",'');
    
    }
    toggleSize = (event) => {
        // Hide add btn and response 
        this.state.addedtoCart &&
            this.setState({
                addedtoCart:false
            });
        document.getElementById('add-resp').classList.add('hide');

        let {sizeData,discount} = this.props;
        let id = event.target.id.substr(0, event.target.id.indexOf('_')); 
        let dis_price = sizeData[id] - sizeData[id] * (discount/100);
        this.setState({
          currSize:id,
          currPrice:sizeData[id],
          discountedPrice:dis_price
        });
        //Update url
        let slugURL = window.location.href;
        let slugURLval = window.location.href.lastIndexOf('?item=');
        let slugVal;
        slugVal = slugURL.substring(slugURLval+6,slugURLval+8);
        
        document.getElementsByTagName( 'body' )[0].setAttribute("class",'no-scroll');
          
        let currUrl = '?item=' + slugVal + '&size=' + id;
        History.push(currUrl);
    }

    getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    addToCart = () => {
        let {isLoggedIn} = this.state;
        let {name} = this.props;
        let price = this.state.discountedPrice;
        let size = this.state.currSize;
        let discount = this.props.discount;
        let slug = this.state.slug;
        let uname =this.getCookie('username');
        let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        DB.createDatabase();
        if(isLoggedIn){
            // Get user id
            db.transaction((tx) => {   
                tx.executeSql('select * from USERS where uname = ?', [uname], (tx, results) => { 
                    let u_id = results.rows[0].id;
                    DB.insertData(name,price,size,discount,slug,u_id);

                    console.log('Data added to cart');
                    document.getElementById('add-resp').classList.remove('hide');
                    this.setState({
                        addedtoCart:true
                    });
                },null);
            });
            
        }else{
            if(History.location.pathname!='/'){
                History.push(History.location.pathname+'?login-modal=true&slug='+slug+'&size='+size);
              }else{
                History.push('?login-modal=true&slug='+slug+'&size='+size);
            }
            window.location.reload();
        }
        
    }


    render(){
        let {image,name,description,category,sizeData,closeModal} = this.props;
        let {currSize,currPrice,discountedPrice,addedtoCart} = this.state;
        return (
            <div className='card-modal-container' >
                <div className='close-btn-wrapper'>
                    <button className='close-btn' onClick={()=>closeModal()}>X</button>
                </div>
                <div className='card-modal-item'>
                    <div className='card-modal-img-cont'>
                        <img src={image} height='150' alt='Image' className='card-modal-img' />
                    </div>
                    <div className='card-modal-content'>
                        <p className='card-modal-name' >{name} </p>
                        <p className='card-modal-cat' > {category} <br /> {description} </p>
                        <div className='card-modal-size-cont'>
                        {
                            Object.keys(sizeData).map((key,index)=> {
                                return(
                                <div key={index} id={key+'_'+name} className={'modal-card-size'+(currSize === key ? ' modal-size-active':'')} onClick={(event)=>this.toggleSize(event)} >{key}</div>
                                )   
                            }) 
                        } 
                        </div>
                        <div className='modal-card-price'>
                            <p>Rs {discountedPrice}</p>
                            <div className='og-price-cont'>
                                <p>(<strike>{currPrice}</strike>)</p>
                            </div>
                        </div>
                        <div className='card-modal-add'>
                            {
                                addedtoCart && 
                                    <button className='card-modal-visit-btn' ><Link to="/cart" className='link' onClick={()=>this.off()} >VISIT CART</Link></button>
                                    || <button className='card-modal-add-btn' onClick={this.addToCart} >ADD TO CART</button>
                            }
                            
                        </div>
                        <div className='add-to-cart-resp hide' id='add-resp' >
                            <p className='add-to-cart-resp-txt'>Item added to cart successfully</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}