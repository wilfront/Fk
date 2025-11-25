'use client'
import React, { useState, useEffect } from 'react'
import './Header.css'
import { CiSearch } from "react-icons/ci"
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md"
import { FaRegCircleUser } from "react-icons/fa6"
import { TiShoppingCart } from "react-icons/ti"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false) // novo estado
  const router = useRouter()
  const { totalItems } = useCart()

  useEffect(() => {
    setMounted(true) // só depois da montagem
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      setScrolled(scrollTop > 80)
      if (isMobile && scrollTop <= 80) {
        setOpen(false)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  const toggleMenu = () => setOpen(prev => !prev)
  const handleEntrar = () => {
    router.push('/login?modo=login')
    setOpen(false)
  }
  const handleCadastrar = () => {
    router.push('/login?modo=cadastro')
    setOpen(false)
  }

  const showWhiteMenu = !isMobile && (!scrolled || open)
  const showBurger = isMobile || (scrolled && !open)

  // 🚨 só renderiza depois de montado
  if (!mounted) return null

  return (
    <>
      <header className="header">
        <div className='logo'>
          <a href="/"><h1>Canecas Fk</h1></a>
        </div>

        {showBurger && (
          <div className={`burger-wrapper ${open ? 'active-burger' : ''}`} onClick={toggleMenu}>
            <div className='hamburguer' />
          </div>
        )}

        {!isMobile && (
          <>
            <div className='search-box'>
              <input type="text" placeholder='Digite o que você procura...' />
              <CiSearch className='search-icon' />
            </div>
            <div className='atendimento'>
              <MdOutlineMarkUnreadChatAlt className='chat-icon' />
              <h1>Central de <span><strong>Atendimento</strong></span></h1>
            </div>
            <div className='bem-vindo'>
              <FaRegCircleUser className='user-icon' />
              <h1>Bem-vindo(a)
                <span>
                  <strong onClick={handleEntrar}>Entrar</strong> ou <strong onClick={handleCadastrar}>Cadastrar</strong>
                </span>
              </h1>
            </div>
          </>
        )}

        <Link href="/cart" className='carrinho-compras'>
          <TiShoppingCart className='cart-icon' />
          {totalItems > 0 && <span className='cart-badge'>{totalItems}</span>}
        </Link>
      </header>

      {/* Menu Desktop */}
      {!isMobile && (
        <div className={`menu ${showWhiteMenu ? 'menu-visible' : 'menu-hidden'}`}>
          <nav>
            <ul className='menu-list'>
              <li><Link href='/'>Home</Link></li>
              <li><Link href='/personalize'>Personalize</Link></li>
              <li><Link href='/dia-das-criancas'>Dia das Crianças</Link></li>
              <li><Link href='/dia-dos-professores'>Dia dos Professores</Link></li>
              <li><Link href='/datas-comemorativas'>Datas Comemorativas</Link></li>
              <li><Link href='/canecas-tematicas'>Canecas Temáticas</Link></li>
              <li><Link href='/pronta-entrega'>Pronta Entrega</Link></li>
            </ul>
          </nav>
        </div>
      )}

      {/* Menu Mobile */}
      {isMobile && open && (
        <div className="mobile-menu">
          <nav>
            <ul className="mobile-menu-list">
              <li><Link href="/" onClick={() => setOpen(false)}>Página Inicial</Link></li>
              <li><Link href="/personalize" onClick={() => setOpen(false)}>Personalize</Link></li>
              <li><Link href="/dia-das-criancas" onClick={() => setOpen(false)}>Dia das Crianças</Link></li>
              <li><Link href="/dia-dos-professores" onClick={() => setOpen(false)}>Dia dos Professores</Link></li>
              <li><Link href="/datas-comemorativas" onClick={() => setOpen(false)}>Datas Comemorativas</Link></li>
              <li><Link href="/canecas-tematicas" onClick={() => setOpen(false)}>Canecas Temáticas</Link></li>
              <li><Link href="/pronta-entrega" onClick={() => setOpen(false)}>Pronta Entrega</Link></li>
            </ul>
          </nav>

          <div className="mobile-extra">
            <div className='mobile-atendimento'>
              <MdOutlineMarkUnreadChatAlt className='chat-icon' />
              <span>Central de Atendimento</span>
            </div>
            <div className='mobile-conta'>
              <FaRegCircleUser className='user-icon' />
              <span>
                <strong onClick={handleEntrar}>Entrar</strong> ou <strong onClick={handleCadastrar}>Cadastrar</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
