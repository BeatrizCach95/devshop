import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CartContext } from '../../contexts/CartContext'
import toast from 'react-hot-toast';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnecton'

export function Pedido() {

    const { email } = useParams()
    const navigate = useNavigate()
    const { cart, total, removeAllCart } = useContext(CartContext)

    const [nome, setNome] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [cep, setCep] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [cid, setCid] = useState('')

    useEffect(() => {
        // toast.error('Módulo de Pagamento não desenvolvido', {
        //     style: {
        //         borderRadius: 10,
        //         backgroundColor: '#121212',
        //         color: '#FFF'
        //     }
        // })
        loadCliente()
    })

    async function loadCliente() {
        
        const docRef = collection(db, 'clientes')
        const q = query(docRef, where("email", "==", email))

        try {
            const docSnap = await getDocs(q)
            setNome('')
            setCid('')
            setPhone('')
            setAddress('')
            setCity('')
            setState('')
            setCep('')

            docSnap.forEach((doc) => {
                setNome(doc.data().name)
                setAddress(doc.data().address)
                setCity(doc.data().city)
                setState(doc.data().state)
                setCep(doc.data().cep)
                setCid(doc.id)
                setPhone(doc.data().phone)
            })
        } catch (error) {
            console.log(error)
        }

    }

    async function encerrarProc() {
        
        const prev = new Date()
        prev.setDate(prev.getDate() + 8)

        const data = {
            idCliente: cid,
            dtCriacao: new Date(),
            dtPrevEntrega: prev, 
            status: 0,
            vlrTotal: total,
            nomeCliente: nome,
            enderCliente: address + ' - ' + city + ' - ' + state + ' - CEP ' + cep
        }
        const docRef = collection(db, 'pedidos')
        await addDoc(docRef, data)
            .then((resp) => {
                cart.map((item) => {
                    const docPed = collection(db, 'itemPedido')
                    addDoc(docPed, {
                        idPedido: resp.id,
                        idProduto: item.id,
                        quantity: item.amount,
                        price: item.price,
                        nomeProduto: item.title,
                        vlrITem: item.total
                    })
                    .catch((error) => {
                        toast.error('Erro ao cadastrar itens do pedido')
                        console.log(error)
                    })
                })
                toast.success('Pedido cadastrado com sucesso', {duration: 5000})
            })
            .catch((error) => {
                toast.error('Erro ao cadastrar pedido')
                console.log(error)
            })
        
        removeAllCart()
        navigate('/')
    }

    return (
        <div>
            <h1 className="font-medium text-2xl my-4 text-center">Verifique os dados do seu pedido</h1>

            <div className='flex flex-col border-2 border-gray-300 mx-4 p-2'>
                <span><strong>ID do cliente:</strong> {cid}</span>
                <span><strong>Nome:</strong> {nome}</span>
                <span><strong>Endereço:</strong> {address} - {city} - {state}</span>
                <span><strong>CEP:</strong> {cep}</span>
                <span><strong>E-mail:</strong> {email}  <strong>  Telefone:</strong> {phone}</span>
            </div>
            <br /> <p className='ml-4'>Item(ns) do pedido</p>

            {cart.map( (item) => (
                <section    key={item.id}
                            className="flex items-center justify-between border-b-2 border-gray-300 mx-4">

                    <img className='w-28' src={item.cover} alt={item.title}  />

                    <strong className='text-zinc-700/90'>
                        Preço: {item.price.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                    </strong>

                    <div className="flex items-center justify-center gap-3">
                        {item.amount}
                    </div>

                    <strong className="float-right">
                        SubTotal: {item.total.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                    </strong>
                </section>
            ))}

            <div className='flex justify-between mt-4 mx-4'>
                {cart.length !== 0 && (
                    <button className='bg-blue-600 text-white rounded-full font-medium px-2 py-1 mt-2 
                        flex items-center justify-center' onClick={encerrarProc}>
                        Criar Pedido
                    </button>
                )}
                
                {cart.length !== 0 && <p className="font-bold mt-4">Total do pedido: {total}</p> }
                
            </div>
        </div>
    )
}