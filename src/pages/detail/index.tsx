
import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import { api } from '../../services/api'
// import produtos from '../../repositories/produtos.ts'
import { BsCartPlus } from 'react-icons/bs'
import { ProductProps } from "../home"
import { CartContext } from '../../contexts/CartContext'
import toast from 'react-hot-toast'

import { doc, getDoc} from 'firebase/firestore';

import {db} from '../../services/firebaseConnecton.ts';

export function Detail() {

    const [product, setProduct] = useState<ProductProps>()
    const { id } = useParams()
    const { addCartItem } = useContext(CartContext)
    const navigate = useNavigate();

    useEffect(() => {        
        
        async function loadProdutos(){
            const docRef = doc(db, 'produtos', id!.toString());
            const docSnap = await getDoc(docRef);
            
            const item = {
                id: docSnap.data()!.id,
                title: docSnap.data()!.title,
                description: docSnap.data()!.description,
                price: docSnap.data()!.price,
                cover: docSnap.data()!.cover,
                qtdEstoque: docSnap.data()!.qtdEstoque
            }
            setProduct(item);
      
        }
      
        loadProdutos();

      }, [id])

    function handleAddCartItem (product: ProductProps) {
        toast.success('Produto adicionado ao carrinho', {
            style: {
                    borderRadius: 10,
                    backgroundColor: '#121212',
                    color: '#FFF'
                }
            })

        addCartItem(product)

        navigate("/cart")
    }

    return (
        <div>
            <main className='w-full max-w-7xl px-4 mx-auto my-6'>

            {product && (
                <section className='w-full'>
                    <div className="flex flex-col justify-center lg:flex-row">
                        <img className='flex-1 w-full max-h-72 object-contain mt-20'
                                src={product?.cover}
                                alt={product?.title} />
                        
                        <div className='flex-1 mt-20'>
                            <p className='font-bold text-2xl mt-4 mb-2'>{product?.title}</p>

                            <p className='my-4'>{product?.description}</p>

                            <strong className='text-zinc-700/90 text-xl'>
                                {product.price.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                            </strong>

                            <button className='bg-zinc-900 p-1 rounded ml-3' 
                                    onClick={ () => handleAddCartItem(product)}>
                                <BsCartPlus size={20} color='#FFF' />
                            </button>
                            <p className='my-2'>Disponíveis em estoque: {product?.qtdEstoque} unidades</p>
                        </div>
                    </div>
                </section>
            )}
                
            </main>
        </div>
    )
}