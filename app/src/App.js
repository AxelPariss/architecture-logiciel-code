import logo from './logo.svg'
import './App.css'
import { Table, Form, Button, Card, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useQuery, useMutation, gql } from '@apollo/client'
import React, { useState } from 'react'

const PRODUCTS = gql`
  query Products {
    products {
      id
      name
      price
      options
      description
    }
  }
`

const SAVE_CARD = gql`
mutation($products: [ID]!, $products_options: JSON!){
  createCart(input: {data: {products: $products, products_options: $products_options}}){
    cart{
      id
    }
  }
}
`
const DELETE_CARD = gql`
mutation($card_id: ID!){
  deleteCartPayload(cart: {id: $card_id}){
    cart{
      id
    }
  }
}
`


function App() {
  const [show, setShow] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)

  const handleClose = () => setShow(false)
  const handleCloseUpsell = () => setShowUpsell(false)
  const handleShow = () => setShow(true)
  const handleShowUpsell = () => setShowUpsell(true)

  const [saveCart, { data_cart }] = useMutation(SAVE_CARD);
  const { loading, error, data } = useQuery(PRODUCTS)
  const [cart, setCart] = useState([])
  const [currentProduct, setCurrentProduct] = useState({})
  const [upsellProduct, setUpsellProduct] = useState({})

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const personalize = (product) => {
    setCurrentProduct(product)
    handleShow()
  }

  const addToCart = (product) => {
    let alreadyExist = false
    for (const c of cart) {
      if (product.id === c.id) {
        alreadyExist = true
        c.quantity++
      }
    }
  
    if (alreadyExist) {
      setCart([...cart])
    } else {
      let p = {
        ...product,
        quantity: 1,
      }
      setCart([...cart, p])
    }
    
    for(let i = 0; i < data.products.length; i++){
      if(data.products[i].id !== product.id){
        setUpsellProduct(data.products[i])
      }
    }

    let cart_ids = []
    for(let i = 0; i < cart.length; i++){
      cart_ids.push(cart[i].id)
    }
    saveCart({ variables: { products: cart_ids, products_options: "" } });

    // Si ce n'est pas un upsell
    if(showUpsell === false){
      handleClose()
      handleShowUpsell()
    }else{
      handleCloseUpsell()
    }
  }

  const removeFromCart = (product) => {
    for (const index in cart) {
      if (product.id === cart[index].id) {
        cart.splice(index, 1)
      }
    }
    setCart([...cart])
  }

  return (
    <div className="container my-5">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Personnalisation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {currentProduct && currentProduct.options && Object.keys(currentProduct.options).map((option) => (
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Label>{option}</Form.Label>
                <Form.Control as="select" custom>
                  {currentProduct.options[option].map((name) => (
                  <option>{name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            ))}
            {currentProduct && !currentProduct.options ? ('Pas de personnalisation pour ce produit') : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => addToCart(currentProduct)}>
            Ajouter au panier
          </Button>
        </Modal.Footer>
      </Modal>

            <Modal show={showUpsell} onHide={handleCloseUpsell}>
        <Modal.Header closeButton>
          <Modal.Title>Upsell</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h4>Voulez vous un : <b>{upsellProduct.name}</b> en plus ?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpsell}>
            Non
          </Button>
          <Button variant="primary" onClick={() => addToCart(upsellProduct)}>
            Oui (ajouter au panier)
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="card-group">
        {data.products.map((product) => (
          <Card style={{ width: '18rem' }} key={product.id}>
            <Card.Img variant="top" src="https://via.placeholder.com/150x100" />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <Button onClick={() => personalize(product)} variant="primary">
                Ajouter au panier ({product.price}€)
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <h2 className="mt-5">Mon panier</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom du produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => (
            <tr key={product.id}>
              {console.log(product)}

              <td>{product.name}</td>
              <td>{product.price}€</td>
              <td>{product.quantity}</td>
              <td>{product.quantity * product.price}€</td>
              <td>
                <Button
                  onClick={() => removeFromCart(product)}
                  variant="danger"
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => setCart([])} variant="warning" className="mr-2">
        Vider mon panier
      </Button>
      <Button variant="success">Acheter</Button>
    </div>
  )
}

export default App
