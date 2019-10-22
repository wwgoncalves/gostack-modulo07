import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as CartActions from "../../store/modules/cart/actions";

import api from "../../services/api";
import { formatPrice } from "../../util/format";
import { ProductList } from "./styles";

function Home({ amount, addToCartRequest }) {
  const [products, setProducts] = useState([]);

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

          <button type="button" onClick={() => addToCartRequest(product.id)}>
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

Home.propTypes = {
  addToCartRequest: PropTypes.func.isRequired,
  amount: PropTypes.objectOf(PropTypes.number).isRequired,
};

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    // eslint-disable-next-line no-param-reassign
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
