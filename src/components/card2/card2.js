// @flow
import * as React from 'react';
import './card2.scss';
import CardModal from '../cardModal/cardModal';
import History from '../history/history';

export default class Card extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      size:'',
      price:'',
      clickValue:false
    }
  }

  
  componentDidMount(){
    let {sizeData,cardData} = this.props;
    this.setState({
      size:Object.keys(sizeData)[0],
      price:this.props.sizeData[Object.keys(sizeData)[0]]
    });
  }


  toggleSize = (event) => {
    event.stopPropagation();
    let id = event.target.id.substr(0, event.target.id.indexOf('_')); 
    this.setState({
      size:id,
      price:this.props.sizeData[id]
    })
  }

  // toggleCardModal = () => {
  //   let {slug,sizeData} = this.props;
  //   this.setState({
  //     clickValue:true
  //   });
  //   //Update url
  //   let currUrl = '?item=' + slug + '&size=' + Object.keys(sizeData)[0];
  //   History.push(currUrl);
  //   document.getElementsByTagName( 'body' )[0].setAttribute("class",'no-scroll');
  //  // this.on();
  // }




  
  render(){
    let {image,name,description,category,discount,slug,sizeData} = this.props;
    let {size,price,clickValue} = this.state;

    return (
        <div className='card'>
            <div className='card-img-cont'>
                <img src={image} height='130' className='card-img' alt='Image' />
            </div>
            <div className='card-name-cont'>
                {name}
            </div>
            <div className='card-size-cont'>
                {
                    Object.keys(sizeData).map((key,index)=> {
                        return(
                        <div key={index} id={key+'_'+name} className={'card-size'+(size === key ? ' active':'')} onClick={(event)=>this.toggleSize(event)} >{key}</div>
                        )   
                    })                      
                }
            </div>
            <div className='card-price-cont'>
                <b>Price  </b>: Rs {price}
            </div>
            <div className='card-btn-cont'>
                <button className='card-buy-now'  onClick={()=>this.props.toggleModal(slug)} >BUY NOW</button>
            </div>
        </div>
    );
  }


}