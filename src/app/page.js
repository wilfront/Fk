'use client'
import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import './globals.css'
import { IoDocumentTextOutline } from "react-icons/io5"
import { FaAward, FaTruck } from "react-icons/fa"
import { SiCashapp } from "react-icons/si"

export default function Home() {

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false
  }

  return (
    <>
      <div className="container-home">
        {/* ===== SLIDER ===== */}
        <Slider {...settings} className="slide-home">
          <div>
            <img src="/caneca.jpg" alt="Caneca 1" className="slide-image" />
          </div>
          <div>
            <img src="/caneca-2.jpg" alt="Caneca 2" className="slide-image" />
          </div>
        </Slider>

        {/* ===== FAIXAS ===== */}
        <div className='faixas'>
          <div className='faixa-garantia'>
            <IoDocumentTextOutline className="icone-faixa" />
            <h1>Orçamento Rápido</h1>
            <p>Receba em poucos minutos</p>
          </div>

          <div className='faixa-garantia'>
            <FaAward className="icone-faixa" />
            <h1>Qualidade garantida</h1>
            <p>Excelência para seus brindes</p>
          </div>

          <div className='faixa-garantia'>
            <SiCashapp className="icone-faixa" />
            <h1>Excelentes Preços</h1>
            <p>Preços baixos e qualidade</p>
          </div>

          <div className='faixa-garantia'>
            <FaTruck className="icone-faixa" />
            <h1>Entrega Garantida</h1>
            <p>Enviamos para todo o Brasil</p>
          </div>
        </div>
      </div>

      {/* ===== CARTAZ COPOS ===== */}
      <div className='cartaz-copo'>
        <div className='cartaz'>
          <img src="/img1.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
        <div className='cartaz'>
          <img src="/img2.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
        <div className='cartaz'>
          <img src="/img3.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
        <div className='cartaz'>
          <img src="/img4.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
        <div className='cartaz'>
          <img src="/img5.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
        <div className='cartaz'>
          <img src="/img6.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
        <div className='cartaz'>
          <img src="/img7.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
        <div className='cartaz'>
          <img src="/img8.jpg" alt="Cartaz Copo" className='image-cartaz' />
        </div>
      </div>
    </>
  )
}
