import { useEffect, useState } from "react";
import { db } from "../data/db";

export const useCart = () => {
    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }

    const [data] = useState(db);
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
        const newCart = cart.filter((producto) => producto.id !== item.id);
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


    return {
        data, cart, addToCart, handleAdd, removeFromCart, handleDelete, clearCart, errorMessage

    }

}
