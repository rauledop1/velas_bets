import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const localData = localStorage.getItem('tellcandles_cart');
            return localData ? JSON.parse(localData) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('tellcandles_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, selectedOptions = {}) => {
        setCart(prevCart => {
            // Check if item with same ID and OPTIONS exists
            const existingItemIndex = prevCart.findIndex(item =>
                item.id === product.id &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prevCart, { ...product, quantity, selectedOptions }];
            }
        });
    };

    const removeFromCart = (id, selectedOptions) => {
        setCart(prevCart => prevCart.filter(item =>
            !(item.id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
        ));
    };

    const updateQuantity = (id, selectedOptions, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)) {
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price);
            const discount = parseFloat(item.discount || 0);
            const finalPrice = discount > 0 ? price - (price * (discount / 100)) : price;
            return total + (finalPrice * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
