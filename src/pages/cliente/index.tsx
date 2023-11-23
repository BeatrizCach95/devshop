import { FormEvent, useState } from "react";
import { useNavigate } from 'react-router-dom'
// import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { getDocs, collection, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';

import {db} from '../../services/firebaseConnecton.ts';

export function Cliente() {

    const [novo, setNovo] = useState(false)
    const [atualz, setAtualz] = useState(false)
    // const [existe, setExiste] = useState(false)
    // const [cpf, setCpf] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [cep, setCep] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [cid, setCid] = useState('')
    const [senha, setSenha] = useState('')
    const [confSenha, setConfSenha] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        loadCliente()

        // if(cid && senha !== confSenha) {
        //     toast.error('Senha inválida')
        //     setAtualz(false)
        // } else {
        //     setAtualz(true)
            toast.success('Verifique e atualize seus dados', {
                style: {
                    borderRadius: 10,
                    backgroundColor: '#121212',
                    color: '#FFF'
                }
            })
        // }
        
    }
    
    const handleUpAdd = (e: FormEvent) => {
        e.preventDefault()

        if(senha !== confSenha) {
            toast.error('Senha inválida')
            return
        }

        if(novo) {
            handleAddDoc()
        } else {
            handleUpdDoc()
        }
    }

    async function loadCliente(){
        
        const docRef = collection(db, 'clientes')
        const q = query(docRef, where("email", "==", email))

        const docCad = await getDocs(q)
        if(docCad.empty) {
            try {
                setNovo(true)
                // setExiste(true)
                setNome('')
                // setEmail('')
                setPhone('')
                setAddress('')
                setCity('')
                setState('')
                setCep('')
                setCid('')
                setConfSenha('')
                docCad.forEach((doc) => {
                    setNovo(false)
                    setNome(doc.data().name)
                    setEmail(doc.data().email)
                    setPhone(doc.data().phone)
                    setAddress(doc.data().address)
                    setCity(doc.data().city)
                    setState(doc.data().state)
                    setCep(doc.data().cep)
                    setConfSenha(doc.data().senha)
                    setCid(doc.id)
                })
            } catch (error) {
                console.log(error)
            }
            setAtualz(true)
            return
        } else {
        
        try {
            const q = query(docRef, where("email", "==", email), where("senha", "==", senha))
            const docSnap = await getDocs(q)
            setNovo(true)
            // setExiste(true)
            setNome('')
            // setEmail('')
            setPhone('')
            setAddress('')
            setCity('')
            setState('')
            setCep('')
            setCid('')
            setConfSenha('')
            if(docSnap.empty) {
                // setExiste(false)
                setNovo(false)
                setAtualz(false)
                toast.error('Senha inválida')
                return
            }
            docSnap.forEach((doc) => {
                setNovo(false)
                setNome(doc.data().name)
                setEmail(doc.data().email)
                setPhone(doc.data().phone)
                setAddress(doc.data().address)
                setCity(doc.data().city)
                setState(doc.data().state)
                setCep(doc.data().cep)
                setConfSenha(doc.data().senha)
                setCid(doc.id)
            })
        } catch (error) {
            console.log(error)
        }
        setAtualz(true)
    }
  
    }
    // async function loadCliente(){
        
    //     const docRef = collection(db, 'clientes')
    //     const q = query(docRef, where("email", "==", email))
        
    //     try {
    //         const docSnap = await getDocs(q)
    //         setNovo(true)
    //         setExiste(true)
    //         setNome('')
    //         // setEmail('')
    //         setPhone('')
    //         setAddress('')
    //         setCity('')
    //         setState('')
    //         setCep('')
    //         setCid('')
    //         setConfSenha('')
    //         if(docSnap.empty) {
    //             setExiste(false)
    //         }
    //         docSnap.forEach((doc) => {
    //             setNovo(false)
    //             setNome(doc.data().name)
    //             setEmail(doc.data().email)
    //             setPhone(doc.data().phone)
    //             setAddress(doc.data().address)
    //             setCity(doc.data().city)
    //             setState(doc.data().state)
    //             setCep(doc.data().cep)
    //             setConfSenha(doc.data().senha)
    //             setCid(doc.id)
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
  
    // }
    async function handleAddDoc() {
        const docRef = collection(db, 'clientes')

        addDoc(docRef, {
            name: nome,
            email: email,
            phone: phone,
            address: address,
            city: city,
            state: state,
            cep: cep,
            senha: senha
    // const [cid, setCid] = useState('')
        })
        .then(() => {
            loadCliente()
            toast.success('Verifique e atualize seus dados', {
                style: {
                    borderRadius: 10,
                    backgroundColor: '#121212',
                    color: '#FFF'
                }
            })
        })
        .catch((error) => {
            toast.error('Erro ao cadastrar cliente')
            console.log(error)
        })
    }

    async function handleUpdDoc() {
        const docRef = doc(db, 'clientes', cid)

        await updateDoc(docRef, {
            name: nome,
            email: email,
            phone: phone,
            address: address,
            city: city,
            state: state,
            cep: cep,
            senha: senha
        })
        .then(() => {
            toast.success('Dados atualizados')
        })
        .catch((error) => {
            toast.error('Erro ao atualizar cliente')
            console.log(error)
        })
    }

    function finalizarPedido() {
        navigate(`/pedido/${email}`)
    }
    // console.log(novo + '-' + atualz + '-' + existe)
    
    return (
        <div  className="w-full max-w-7xl px-4 mx-auto my-6">
            <h1 className="font-medium text-2xl my-4 text-center">Identificação do cliente</h1>
            <div>
                <form className="w-2/4 m-1 mx-auto flex flex-col" onSubmit={handleSubmit}>
                    <label className="flex flex-row">
                        <span>E-mail: </span>
                        {atualz ?(
                            <input type="email" name="email" placeholder="Endereço de e-mail"
                                className="w-2/4 ml-2" disabled
                                onChange={(e) => setEmail(e.target.value)} value={email} />
                        ) : (
                            <input type="email" name="email" placeholder="Endereço de e-mail"
                                className="w-2/4 ml-2"
                                onChange={(e) => setEmail(e.target.value)} value={email} />
                        )}
                    </label>
                    <label className="flex flex-row">
                        <span>Senha: </span>
                        <input type="password" name="senha" placeholder="Informe sua senha"
                            className="w-2/4 ml-2"
                            onChange={(e) => setSenha(e.target.value)} value={senha} />
                    </label>
                    <input type="submit" value="Verificar cadastro"
                            className="ml-2 cursor-pointer bg-blue-500 text-white px-2 rounded-full" />
                </form>
            </div>
            {atualz && (
                <div>
                    <form className="flex flex-col mx-auto w-2/4 border-4 mt-2 p-2" 
                            onSubmit={handleUpAdd}>
                        {cid && (
                            <span>ID do clliente: {cid}</span>
                        )}
                        <label>
                            <span>Confirmação de senha: </span>
                            <input type="password" name="confSenha" placeholder="Informe sua senha"
                                className="w-2/4"
                                onChange={(e) => setConfSenha(e.target.value)} value={confSenha} />
                        </label>
                    
                        <label>
                            <span>Nome: </span>
                            <input type="text" name="nome" placeholder="Informe seu nome completo"
                                className="w-2/4"
                                onChange={(e) => setNome(e.target.value)} value={nome} />
                        </label>
                        <label>
                            <span>Telefone: </span>
                            <input type="text" name="phone" placeholder="DDD + Número do telefone"
                                className="w-2/4"
                                onChange={(e) => setPhone(e.target.value)} value={phone} />
                        </label>
                        <label>
                            <span>Endereço: </span>
                            <input type="text" name="address" placeholder="Logradouro, número - complemento"
                                className="w-2/4"
                                onChange={(e) => setAddress(e.target.value)} value={address} />
                        </label>
                        <label>
                            <span>CEP: </span>
                            <input type="text" name="cep" placeholder="00000-000"
                                className="w-2/4"
                                onChange={(e) => setCep(e.target.value)} value={cep} />
                        </label>
                        <label>
                            <span>Cidade: </span>
                            <input type="text" name="city" placeholder="Ex. Campinas"
                                className="w-2/4"
                                onChange={(e) => setCity(e.target.value)} value={city} />
                        </label>
                        <label>
                            <span>Estado: </span>
                            <input type="text" name="state" placeholder="Ex. São Paulo"
                                className="w-2/4"
                                onChange={(e) => setState(e.target.value)} value={state} />
                        </label>
                    
                        {novo ? (
                            <input type="submit" value="Cadastrar dados - Novo cliente"
                            className="ml-2 cursor-pointer bg-blue-500 text-white px-2 rounded-full" />
                        ) : (
                            <input type="submit" value="Atualizar cadastro"
                            className="ml-2 cursor-pointer bg-blue-500 text-white px-2 rounded-full" />
                        )}
                        
                    </form>
                    <div className="flex flex-col mx-auto w-2/4 mt-2 p-2" >
                        {!novo && (
                            <button className="ml-2 cursor-pointer bg-blue-500 text-white px-2 
                                                rounded-full"
                                    onClick={finalizarPedido}>
                                Finalizar Pedido
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}