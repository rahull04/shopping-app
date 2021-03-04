// @flow
import * as React from 'react';
import './filter-card.scss';
import Card from '../card2/card2';
import LoaderCard from '../loader-card/loader-card';

export default class Filtercard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          displayData:'',
          datareceived:false,
          isLoading:false,
          lastfilterbtn:'',
          filterselected:'All',
          sortselected:'',
          categoryList:'',
        }
    
    }


    componentDidMount(){
        let {cardData} = this.props;
        let cat_arr = [...new Set(cardData.map(card => card.category))];

        this.setState({
            displayData:cardData,
            datareceived:true,
            categoryList:cat_arr
        });
        
    }

    sort(type,event){
        let sortedData = type === 0 ? this.state.displayData.sort((a, b) => (a.name > b.name) ? 1 : -1) : this.state.displayData.sort((a, b) => (a.name > b.name) ? -1 : 1); //rewrite with single function call
        this.setState({
            cardData:sortedData,
            sortselected:event.target.tagName=='LI' ? event.target.id : ''
        });  
    }

    toggleLoader(){
        this.setState({isLoading:!this.state.isLoading});
    }
    
    handleFilterClick(val){
        this.setState({filterselected:val});
        if(this.state.lastfilterbtn == '' || this.state.lastfilterbtn != val){
            this.toggleLoader();  
            
            setTimeout(()=>{
                let temp = JSON.parse(JSON.stringify(this.props.cardData)); //Copy of original data
                if(val == 'All'){
                    this.toggleLoader(); 
                    this.setState({
                        lastfilterbtn:val,
                        displayData:this.props.cardData
                    }); 

                }else{
                    let filteredData = temp.filter(card=> card.category== val );
                    if(this.state.lastfilterbtn == '' || this.state.lastfilterbtn != val){
                        this.toggleLoader();    
                    }
                    this.setState({
                        lastfilterbtn:val,
                        displayData:filteredData
                    }); 
                }
            },1000);
        }  
    }

    filterSelect(event,setFilteredData){
        this.setState({displayData:this.props.cardData});
        setFilteredData(event.target.value);
    }



    render() {
        let {displayData,datareceived,isLoading,lastfilterbtn,filterselected,sortselected,categoryList} = this.state;
        let n = Array(4).fill(null);
        return (
        <div className='filter-container' >
            <div className='filters'>
                <div>
                    <div className='sort-list' >
                        <ul id='sort-list-tag' className='filter-list-tags'>
                            <p className='filter-list-head' >Sort</p>
                            <li className={'filtercard-btn' + (sortselected === 'asc-btn' ? ' sort-active right-arrow':'' )} id='asc-btn' onClick={(event)=>{
                                this.sort(0,event)}} data-value={0}>Ascending</li>
                            <li className={'filtercard-btn' + (sortselected === 'desc-btn' ? ' sort-active right-arrow':'' )} id='desc-btn' onClick={(event)=>{
                                this.sort(1,event)}}  data-value={1}>Descending</li>
                        </ul>
                    </div>
                    <div className='filter-list'>
                        <ul id='filter-list-tag' className='filter-list-tags'>
                            <p className='filter-list-head'>Filter</p>
                            {
                                Array.from(categoryList).map((val,index)=>{
                                    return <li className={'filtercard-btn' + (filterselected === val ? ' sort-active right-arrow' :'' )} key={index+'_'+val} onClick={()=>{this.handleFilterClick(val)}} >{val}</li>
                                })
                            }
                            <li className={'filtercard-btn' + (filterselected === 'All' ? ' sort-active right-arrow' :'' )} key='filter_All' onClick={()=>{this.handleFilterClick('All')}} >All</li>
                        </ul>
                    </div>
                </div>
                <div className='mobile-filter-container'>
                    <div className='mobile-sort' >
                        <select onChange={(event)=>this.sort(parseInt(event.target.value),event)} className='filter-mobile-select' >
                            <option hidden>Sort</option>
                            <option value='0' >Ascending</option>
                            <option value='1' >Descending</option>
                        </select>
                    </div>
                    <div className='mobile-filter' >
                        <select onChange={(event)=>this.handleFilterClick(event.target.value)} className='filter-mobile-select' value={filterselected} >
                            <option hidden>Filter</option>
                            {
                                Array.from(categoryList).map((val,index)=>{
                                    return <option key={index} value={val} >{val}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className='filtercard-container'>
                {   
                    <div className='filtercard-container' id='og-card-container' >
                    {
                        datareceived && !isLoading && displayData.map((card,index)=>{
                            return(
                                <Card key={index} image={this.props.img} name={card.name} description={card.description} category={card.category} 
                                discount={card.discount} sizeData={card.size} slug={card.slug} toggleModal={this.props.toggleModal}/>
                            )
                        })
                    }
                    </div>
                }

                {
                    isLoading && n.map((value,index)=>{
                    return <LoaderCard key={index} />
                    })
                }
            </div>
        </div>
        );
    };
};