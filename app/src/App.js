import logo from './logo.svg'
import './App.css'
import { Table, Form, Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useQuery, gql } from '@apollo/client'
import React, { useState } from 'react';

const PRODUCTS = gql`
  query Products {
    products {
      id
      name
      price
      description
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(PRODUCTS)
  const [cart, setCart] = useState([]);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

    const addToCart = (product) => {
      let alreadyExist = false
      for(const c of cart){
        if(product.id === c.id){
          alreadyExist = true
          c.quantity++
        }
      }

      if(alreadyExist){
        setCart([...cart])
      }else{
        let p = {
          ...product,
          quantity: 1
        }
        setCart([...cart, p])
      }
    }

    const removeFromCart = (product) => {
      for(const index in cart){
        if(product.id === cart[index].id){
          cart.splice(index, 1);
        }
      }
      setCart([...cart])
    }

  return (
    <div className="container my-5">
      {data.products.map((product) => (
        <Card style={{ width: '18rem' }} key={product.id}>
          <Card.Img variant="top" src="https://via.placeholder.com/150x100" />
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Button onClick={() => addToCart(product)} variant="primary">Ajouter au panier ({product.price}€)</Button>
          </Card.Body>
        </Card>
      ))}

      <h2>Mon panier</h2>
      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Nom du produit</th>
      <th>Prix</th>
      <th>Quantité</th>
      <th>Total</th>
      <th>Supprimer</th>
      <th>Option</th>
    </tr>
  </thead>
  <tbody>
        {cart.map((product) => (

    <tr key={product.id}>
          {console.log(product)}

      <td>{product.name}</td>
      <td>{product.price}€</td>
      <td>{product.quantity}</td>
      <td>{product.quantity*product.price}€</td>
      <td><Button onClick={() => removeFromCart(product)} variant="danger">Supprimer</Button></td>
      <td>Option 1 / option 2</td>
    </tr>
      ))}
  </tbody>
</Table>
      <Button onClick={() => setCart([])} variant="warning">Vider mon panier</Button>
      <Button variant="success">Acheter</Button>

    </div>
  )
}

export default App
