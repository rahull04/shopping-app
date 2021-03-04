// @flow
import * as React from 'react';
import './carousel-component.scss';
import carouselImage1 from '../images/carousol-1.jpg';
import carouselImage2 from '../images/carousol-2.jpg';
import carouselImage3 from '../images/carousol-3.jpg';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function CarouselComponent(props) {
  return (
    <div className="content">
        <Carousel autoPlay infiniteLoop showThumbs={false}  showArrows={false} className='car-container' dynamicHeight='0' >
            <div>
                <img src={carouselImage1}/>
                <p className='car-label'>Exciting offers</p>
            </div>
            <div>
                <img src={carouselImage2}/>
            </div>
            <div>
                <img src={carouselImage3}/>
            </div>
        </Carousel>       
    </div>
  );
};