import * as React from 'react';
import './home.scss';
import Header from '../../components/header/header';
import Carousel from '../../components/carousel-component/carousel-component';
import Card from "../../components/card2/card2";
import img1 from '../../components/images/tshirt.png';
import Footer from '../../components/footer/footer';
import CardModal from '../../components/cardModal/cardModal';
import History from '../../components/history/history';

export default class home extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      cardData : '',
      dataLoaded: false,
      modal:'',
      clickValue:true,
    }
  }

  closeModal = () =>{
    this.setState({
      clickValue:false
    });
    document.getElementsByTagName( 'body' )[0].setAttribute("class",'');
    History.push('');
    this.off();
  }

  componentDidMount() {

    fetch('http://demo8978959.mockable.io/home')
    .then(res => res.json())
    .then((resp) => {
      this.setState({cardData:resp.data,dataLoaded:true,duplicateData:resp.data});

      //Reload Modal if opened last
      let slugURL = window.location.href;
      if(slugURL.lastIndexOf('login') > -1 && slugURL.lastIndexOf('size') > -1 ){
      //  History.push('');
      }else if(slugURL.lastIndexOf('?login-modal=true') == -1){
        let slugURLval = window.location.href.lastIndexOf('?item=');
        let slugVal;
        let temp = JSON.parse(JSON.stringify(this.state.cardData));
  
        if( slugURLval != -1 ){ // URL has item reference
          slugVal = slugURL.substring(slugURLval+6,slugURLval+8);
          
          if (temp.some(card => card.slug === slugVal)) { // URL has CORRECT item reference
            let lastOpenModal = temp.filter((card)=> card.slug == slugVal );
            this.setState({
              modal:lastOpenModal[0]
            });
            document.getElementsByTagName( 'body' )[0].setAttribute("class",'no-scroll');
          }else{
            History.push(''); // URL has INCORRECT item reference
          }
        }else{
          History.push(''); // URL doesnt have item reference
        }
      }

    })
    .catch(console.log);

  }

   //Overlay
  on() {
    document.getElementById("overlay-div").classList.add('show');
  }
  
  off() {
    document.getElementById("overlay-div").classList.remove('show');

  }

  toggleModalStatus = (slugVal) => {
    let {cardData,modal} = this.state;
    
    let tmpmodal = cardData.filter(card => card.slug == slugVal);
    this.setState({
      modal:tmpmodal[0],
      clickValue:true
    },()=>{

    //  Update url
     let currUrl = '?item=' + slugVal + '&size=' + Object.keys(tmpmodal[0].size)[0];
     History.push(currUrl);
     document.getElementsByTagName( 'body' )[0].setAttribute("class",'no-scroll');
      this.on();
    });
    
  }



  render() {
    let { dataLoaded , cardData , modal , clickValue } = this.state;
    return (
      <div>
        <Header cardData={cardData} />
        <Carousel />
        <div className='card-container'>
          {dataLoaded && 
            cardData.map((card,index)=>{
              return(
                <Card key={index} image={img1} name={card.name} sizeData={card.size} description={card.description} category={card.category}
                 discount={card.discount} slug={card.slug} openCart={this.openCart} toggleModal={this.toggleModalStatus} />
              )
            })
          }  
        </div>
        <div>
        { modal && clickValue && <CardModal image={img1} name={modal.name} description={modal.description} category={modal.category} 
            sizeData={modal.size} discount={modal.discount} slug={modal.slug} closeModal={this.closeModal} />}
        </div>
        <Footer />
      </div>
    );
  };
};