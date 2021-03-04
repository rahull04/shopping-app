import * as React from 'react';
import './men.scss'
import Header from '../../components/header/header';
import img1 from '../../components/images/tshirt.png';
import Footer from '../../components/footer/footer';
import HeaderImg from './../images/men-heading.jpg';
import ContentHeader from '../../components/content-header/content-header';
import FilterCard from '../../components/filter-card/filter-card';
import CardModal from '../../components/cardModal/cardModal';
import History from '../../components/history/history';

export default class Men extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      cardData : '',
      dataLoaded: false,
      duplicateData:'',
      clickValue:true,
      modal:''
    }
  }


  componentDidMount() {
    this.setState({isLoading:true});
    fetch(this.props.name==='Men' ? 'http://demo8978959.mockable.io/catalog/men':'http://demo8978959.mockable.io/catalog/women')
    .then(res => res.json())
    .then((resp) => {
      this.setState({cardData:resp.data,dataLoaded:true,duplicateData:resp.data});

      //Reload Modal if opened last
      let slugURL = window.location.href;
      if(slugURL.lastIndexOf('login') > -1 && slugURL.lastIndexOf('size') > -1 ){
       // History.push('');
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
            History.push('/catalog/men'); // URL has INCORRECT item reference
            console.log('incor item')
          }
        }else{
          History.push('/catalog/men'); // URL doesnt have item reference
          console.log('no url item')
        }
      }
      

    })
    .catch(console.log);
  }

  closeModal = () =>{
    this.setState({
      clickValue:false
    });
    document.getElementsByTagName( 'body' )[0].setAttribute("class",'');
    History.push('/catalog/men');
    this.off();
  }

  //For Card Modal
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
    let {name} = this.props;
    let {cardData, dataLoaded , modal , clickValue} = this.state;
    
    return (
      <div>
        <Header />
        <h2 className='category-title'>{this.props.name}</h2>   
        <div className='category-content' >
          <ContentHeader HeaderImg={HeaderImg} alt='Category Image' /> 
              
          {
            dataLoaded && <FilterCard cardData={cardData} img={img1} toggleModal={this.toggleModalStatus} />
          }
        </div>
        <div>
        { modal && clickValue && <CardModal image={img1} name={modal.name} description={modal.description} category={modal.category} 
            sizeData={modal.size} discount={modal.discount} slug={modal.slug}  closeModal={this.closeModal} />}
        </div>
        <Footer />
      </div>
    );
  }
}