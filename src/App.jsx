import { Guitar } from './components/Guitar'
import { Header } from './components/Header'
import './index.css'
import { db } from './data/db'
import { useEffect, useState } from 'react';

function App() {

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  const [data, setData] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const [errorMessage, setErrorMessage] = useState('');
 

  const addToCart = (item) => {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    if (itemExists >= 0) { //existe, entonces...
      if (cart[itemExists].cantidad >= MAX_ITEMS) {
        return;
      }
      const copiaCart = [...cart];
      copiaCart[itemExists].cantidad++;
      setCart(copiaCart);
    } else {
      console.log(itemExists);
      item.cantidad = 1;
      setCart([...cart, item]);
    }
  }

  const removeFromCart = (item) => { 
    const newCart = cart.filter((producto) => producto.id !== item.id );
    setCart(newCart);
  }
  

  const handleAdd = (item) => {
    const copyCart = [...cart];
    copyCart.map((producto) => {
      if (producto.id === item.id && producto.cantidad < MAX_ITEMS) { // solo se pueden agregar 5 guitarras
        producto.cantidad++;
      }
    });
    setCart(copyCart);
  };

  const handleDelete = (item) => {
    const copyCart = [...cart];
    copyCart.map((producto) => {
      if (producto.id === item.id && producto.cantidad > MIN_ITEMS) {
        producto.cantidad--;
      }
      if (producto.id === item.id && producto.cantidad === MIN_ITEMS) {
        setErrorMessage('No puedes tener menos de 1 guitarra en el carrito');
      }
    });
    setCart(copyCart);
  };

  const clearCart = () => {
    const copyCart = [];
    setCart(copyCart);
  }



  /// useEffects ///

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <>
      <Header 
        cart={cart}
        setCart={setCart}
        removeFromCart={removeFromCart}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        errorMessage={errorMessage}
        clearCart={clearCart}
        
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {
            data.map((guitar) => (
              <Guitar
                key={guitar.id}
                guitar={guitar}
                addToCart={addToCart}
                
              />
            ))}


        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App
