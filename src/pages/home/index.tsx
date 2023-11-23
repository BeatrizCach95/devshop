
import { useContext, useEffect, useState } from 'react'

import { BsCartPlus } from 'react-icons/bs'

import { Link } from 'react-router-dom'

import { CartContext } from '../../contexts/CartContext';

import toast from 'react-hot-toast';

import { collection, getDocs, query } from 'firebase/firestore';

import {db} from '../../services/firebaseConnecton.ts';


export interface ProductProps {
    id: string;
    title: string;
    description: string;
    price: number;
    cover: string;
    qtdEstoque: number;
}

const listRef = collection(db, "produtos")

export function Home() {

    const { addCartItem } = useContext(CartContext)

    const [products, setProductos] = useState<ProductProps[]>([])

    useEffect(() => {
        async function loadProdutos(){
          const q = query(listRef);
    
          const querySnapshot = await getDocs(q)
          setProductos([]);
    
        //   await updateState(querySnapshot)
          const isCollectionEmpty = querySnapshot.size === 0;
          if(!isCollectionEmpty) {
            const lista: Array<ProductProps> = [];
      
            querySnapshot.forEach((doc) => {
              lista.push({
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                price: doc.data().price,
                cover: doc.data().cover,
                qtdEstoque: doc.data().qtdEstoque
              })
            })
      
            setProductos(lista)
      
          }
    
        }
    
        loadProdutos();
    
        return () => { }
      }, [])

    function handleAddCartItem (product: ProductProps) {
        addCartItem(product)
        toast.success('Produto adicionado ao carrinho', {
            style: {
                borderRadius: 10,
                backgroundColor: '#121212',
                color: '#FFF'
            }
        })
    }

    return (
        <div>
            <main className="w-full max-w-7xl px-4 mx-auto">
                <h1 className="font-bold text-2xl mb-4 mt-10 text-center">
                    Produtos em alta
                </h1>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5'>
                    {products.map((product) => (
                        <section key={product.id} className="w-full">
                            <Link to={`/product/${product.id}`}>
                                <img className='w-full rounded-lg max-h-70 mb-2'
                                    src={product.cover}
                                    alt={product.title} />

                                <p className='font-medium mt-1 mb-2'>{product.title}</p>
                            </Link>

                            <div className='flex gap-3 items-center'>
                                <strong className='text-zinc-700/90'>
                                    {product.price.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </strong>
                                <button className='bg-zinc-900 p-1 rounded' onClick={ () => handleAddCartItem(product)}>
                                    <BsCartPlus size={20} color='#FFF' />
                                </button>
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    )
}