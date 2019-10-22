import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";

import { addToCartRequest } from "../../store/modules/cart/actions";

import api from "../../services/api";
import { formatPrice } from "../../util/format";
import { ProductList } from "./styles";

export default function Home() {
  const [products, setProducts] = useState([]);
  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      // eslint-disable-next-line no-param-reassign
      sumAmount[product.id] = product.amount;

      return sumAmount;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get("/products");

      const data = response.data.map(product => ({
        ...product,
        formattedPrice: formatPrice(product.price),
      }));

      setProducts(data);
    }
    loadProducts();
  }, []);

  return (
    <ProductList>
      {products.map(product => (
        <li key={String(product.id)}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.formattedPrice}</span>

          <button
            type="button"
            onClick={() => dispatch(addToCartRequest(product.id))}
          >
            <div>
              <MdAddShoppingCart size={16} color="#fff" />{" "}
              {amount[product.id] || 0}
            </div>

            <span>ADD TO CART</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
