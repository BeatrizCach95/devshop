import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../../contexts/CartContext'

export function Cart() {

    const { cart, total, addCartItem, removeCartItem } = useContext(CartContext)

    const navigate = useNavigate()

    function handleReset() {
        
        // removeAllCart()
        navigate('/cliente')
        
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <h1 className="font-medium text-2xl my-4 text-center">Meu carrinho</h1>

            {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                    <p className="font-medium">Ops seu carrinho está vazio...</p>
                    <Link 
                        to="/"
                        className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded"
                    >
                        Acessar produtos
                    </Link>
                </div>
            )}

            {cart.map( (item) => (
                <section    key={item.id}
                            className="flex items-center justify-between border-b-2 border-gray-300">

                    <img className='w-28' src={item.cover} alt={item.title}  />

                    <strong className='text-zinc-700/90'>
                        Preço: {item.price.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                    </strong>

                    <div className="flex items-center justify-center gap-3">
                        <button className="bg-slate-600 text-white rounded font-medium flex items-center
                                            justify-center px-2"
                                onClick={() => removeCartItem(item)}>
                            -
                        </button>
                        {item.amount}
                        <button className="bg-slate-600 text-white rounded font-medium flex items-center
                                            justify-center px-2"
                                onClick={() => addCartItem(item)}>
                            +
                        </button>
                    </div>

                    <strong className="float-right">
                        SubTotal: {item.total.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                    </strong>
                </section>
            ))}

            
            <div className='flex justify-between'>
                {cart.length !== 0 && (
                    <button className='bg-blue-600 text-white rounded-full font-medium px-2 py-1 mt-2 flex items-center
                    justify-center'
                    onClick={handleReset}>
                        Identificar Cliente
                    </button>
                )}
                {cart.length !== 0 && <p className="font-bold mt-4">Total do pedido: {total}</p> }
            </div>

        </div>
    )
}