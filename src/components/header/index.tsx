
import { Link } from 'react-router-dom'
import { FiList, FiShoppingCart } from 'react-icons/fi'
import { useContext } from 'react'
import { CartContext } from '../../contexts/CartContext'


export function Header() {

    const { cartAmount } = useContext(CartContext)

    return (
        <header className='w-full px-1 bg-slate-200'>
            <nav className='w-full max-w-7xl h-14 flex items-center justify-between px-5 mx-auto'>
                <Link to='/' className='font-bold text-2xl'>
                    Loja do Desenvolvedor
                </Link>

                <Link to='/list' className='flex'>
                    <FiList size={24} color='#121212' />
                    <span>Lista de pedidos</span>
                </Link>

                <Link to='/cart' className='relative'>
                    <FiShoppingCart size={24} color='#121212' />
                    {cartAmount > 0 && (
                        <span className='absolute -right-3 -top-3
                                        px-2.5 bg-sky-500 rounded-full w-6 h-6 
                                        flex items-center justify-center text-white text-xs'>
                            {cartAmount}
                        </span>
                    )}
                </Link>
            </nav>
        </header>
    )
}