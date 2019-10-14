import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from "react-icons/md";
import PropTypes from "prop-types";

import { formatPrice } from "../../util/format";

import * as CartActions from "../../store/modules/cart/actions";

import { Container, ProductTable, Total } from "./styles";

function Cart({ cart, total, removeFromCart, updateAmount }) {
  function increment(product) {
    updateAmount(product.id, product.amount + 1);
  }

  function decrement(product) {
    updateAmount(product.id, product.amount - 1);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="Product image" />
            <th>PRODUCT</th>
            <th>QTY</th>
            <th>SUBTOTAL</th>
            <th aria-label="Remove product" />
          </tr>
        </thead>
        <tbody>
          {cart.map(product => (
            <tr key={String(product.id)}>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.formattedPrice}</span>
              </td>
              <td>
                <div>
                  <button type="button" onClick={() => decrement(product)}>
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button type="button" onClick={() => increment(product)}>
                    <MdAddCircleOutline size={20} color="#7159c1" />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                >
                  <MdDelete size={20} color="#7159c1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>
      <footer>
        <button type="button">PROCEED TO CHECKOUT</button>
        <Total>
          <span>GRAND TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
}

Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      price: PropTypes.number,
      image: PropTypes.string,
      formattedPrice: PropTypes.string,
      amount: PropTypes.number,
      subtotal: PropTypes.string,
    })
  ).isRequired,
  total: PropTypes.string.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateAmount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart.map(product => ({
    ...product,
    subtotal: formatPrice(product.price * product.amount),
  })),
  total: formatPrice(
    state.cart.reduce((total, product) => {
      return total + product.price * product.amount;
    }, 0)
  ),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
