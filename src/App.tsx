import { createBrowserRouter } from "react-router-dom"

import { Home } from "./pages/home"
import { Cart } from "./pages/cart"
import { Cliente } from "./pages/cliente"

import { Layout } from "./components/layout"
import { Detail } from "./pages/detail"
import { Pedido } from "./pages/pedido"
import { List } from './pages/list'

const router = createBrowserRouter([

  { element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/product/:id', element: <Detail /> },
      { path: '/cart', element: <Cart /> },
      { path: '/cliente', element: <Cliente />},
      { path: '/pedido/:email', element: <Pedido />},
      { path: '/list', element: <List />}
    ]
  }

])

export { router }
