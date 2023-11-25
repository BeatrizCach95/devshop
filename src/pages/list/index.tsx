// import { Link } from "react-router-dom";
import { useState, useEffect } from 'react'
// import toast from 'react-hot-toast';
import { Timestamp, collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnecton'

interface ItemProps {
    idPedido: string;
    idCliente: string;
    dtCriacao: Timestamp;
    dtPrevEntrega: Timestamp;
    status: number;
    nomeCliente: string;
    enderCliente: string;
    vlrTotal: number;
}

export function List() {

    const [pedidos, setPedidos] = useState<ItemProps[]>([])
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    // const [cid, setCid] = useState('')
    const [admin, setAdmin] = useState(false)
    const [ler, setLer] = useState(0)
    const lista: Array<ItemProps> = [];
    const [alter, setAlter] = useState(0)
    const statusPed = ['Pedido criado', 'Pagamento confirmado', 'Em preparação',
                        'Em transporte', 'Em rota de entrega', 'Pedido entregue', 'Encerrado']

    useEffect(() => {
        if(ler > 0) {
            setPedidos([])
            // setCid('')
            setAdmin(false)

            if(email === 'admin' && senha === 'admin') {
                loadTotalPedidos()
            } else {
                if(email) {
                    loadCliente()
                }
            }
            }
    }, [ler])

    function filtrarLista() {
        setLer(ler + 1)
    }

    async function loadCliente() {
        const docRef = collection(db, 'clientes')
        const q = query(docRef, where("email", "==", email), where("senha", "==", senha))
        const docSnap = await getDocs(q)
        // setCid('')
        docSnap.forEach((doc) => {
            // setCid(doc.id)
            loadPedidos(doc.id)
            setAlter(0)
        })
    }

    async function loadTotalPedidos() {
        const docRef = collection(db, 'pedidos')
        const q = query(docRef, orderBy("dtCriacao", "desc"))

        // setCid('master')
        setAdmin(true)
        
        // if(pedidos.length === 0) {
        const docSnap = await getDocs(q)
        const isCollectionEmpty = docSnap.size === 0;

        if(!isCollectionEmpty) {

            docSnap.forEach((doc) => {
                // if(doc.data().status < 6) {
                    lista.push({
                        idPedido: doc.id,
                        idCliente: doc.data().idCliente,
                        dtCriacao: doc.data().dtCriacao,
                        dtPrevEntrega: doc.data().dtPrevEntrega,
                        status: doc.data().status,
                        nomeCliente: doc.data().nomeCliente,
                        enderCliente: doc.data().enderCliente,
                        vlrTotal: doc.data().vlrTotal
                    })
                // }
            })

            setPedidos(lista)
            }
        // }

    }

    async function loadPedidos(id: string) {
        const docRef = collection(db, 'pedidos')
        const q = query(docRef, where("idCliente", "==", id), orderBy("dtCriacao", "desc"))

        // if(pedidos.length === 0) {
        const docSnap = await getDocs(q)
        const isCollectionEmpty = docSnap.size === 0;

        if(!isCollectionEmpty) {

            docSnap.forEach((doc) => {
                if(doc.data().status < 6) {
                    lista.push({
                        idPedido: doc.id,
                        idCliente: doc.data().idCliente,
                        dtCriacao: doc.data().dtCriacao,
                        dtPrevEntrega: doc.data().dtPrevEntrega,
                        status: doc.data().status,
                        nomeCliente: doc.data().nomeCliente,
                        enderCliente: doc.data().enderCliente,
                        vlrTotal: doc.data().vlrTotal
                    })
                }
            })

            setPedidos(lista)
            }
        // }

    }

    function adicionarPasso(id: string) {
        pedidos.forEach((itm) => {
            if(itm.idPedido === id) {
                if( itm.status < 6) {
                    itm.status += 1
                    setAlter(alter + 1)
                }
            }
        })
    }

    function atualizarStatus() {
        pedidos.forEach((itm) => {
            updateDoc(doc(db, "pedidos", itm.idPedido), {status: itm.status})
        })
        setAlter(0)
    }

    return (
        <div>
            <h1 className="font-medium text-2xl my-4 text-center">Lista de Pedidos de Compra</h1>
            <div className="m-4 flex border-b-2 border-gray-300">
                {/* <div className="w-1/4">
                    <Link 
                        to="/" className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded">
                        Acessar produtos
                    </Link>
                </div> */}
                <div className="flex flex-col w-3/4">
                    <label>
                        <span className="ml-2">E-mail: </span>
                        <input type="email" name="email" placeholder="Endereço um e-mail"
                            className="ml-2 w-2/4"
                            onChange={(e) => setEmail(e.target.value)} value={email} />
                    </label>
                    <label>
                        <span className="ml-2">Senha: </span>
                        <input type="password" name="senha" placeholder="Informe a senha"
                            className="w-2/4 ml-2"
                            onChange={(e) => setSenha(e.target.value)} value={senha} />
                    </label>
                    <button onClick={filtrarLista}
                        className="ml-2 cursor-pointer bg-blue-500 text-white px-1 p-1 rounded-md
                                   mt-1 mb-1 w-1/12">
                        Filtrar
                    </button>
                </div>
                <div>
                    {alter > 0 ? (
                        <button className='bg-blue-600 text-white rounded-full font-medium px-2 p-1 my-2 
                                            flex items-center justify-center mr-2'
                                onClick={atualizarStatus}>
                            Atualizar alterações de status: {alter}
                        </button>
                    ) : (
                        // <button className='bg-blue-600 text-white rounded-full font-medium px-2 p-1 my-2 
                        //                     flex items-center justify-center mr-2'>
                        //     Sem alterações
                        // </button>
                        <span> </span>
                    )}
                </div>
            </div>

            {/* <h1 className="m-4">Lista de pedidos</h1> */}
            {pedidos.length === 0 && (
                <div className="flex flex-col justify-center items-center">
                    <strong>Lista de documentos vazia</strong>
                    <strong>Verifique o email, senha e volte a clicar em FILTRAR</strong>
                </div>
            )}
            {pedidos && (
                pedidos.map( (item) => (
                    <div key={item.idPedido} className="border-b-2 border-gray-300 ml-2">
                        <div className="flex items-center justify-between">
                            <span className="w-1/4">Pedido: {item.idPedido}</span>
                            <span className="w-1/4">Cliente: {item.nomeCliente}</span>
                            <span className="w-1/4">
                                Compra em: {item.dtCriacao.toDate().toLocaleDateString()}
                            </span>
                            <span className="w-1/4">
                                Entrega: {item.dtPrevEntrega.toDate().toLocaleDateString()}
                            </span>
                            <span className="w-1/5">Total: {item.vlrTotal}</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <span>Status: {statusPed[item.status]}</span>
                                {admin && (
                                    <button className='bg-blue-600 text-white rounded-full font-medium px-2 py-1 mt-2 flex items-center
                                            justify-center mr-2'
                                            onClick={() => adicionarPasso(item.idPedido)}>
                                        Simular avanço no processo
                                    </button>
                                )}
                            </div>
                            <span>Endereço: {item.enderCliente}</span>
                        </div>
                    </div>
                ))
            )}

            {/* <div className="m-4">
                <Link 
                    to="/" className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded">
                    Acessar produtos
                </Link>
            </div> */}
        </div>
    )
}