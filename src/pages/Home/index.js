/* eslint-disable react/static-property-placement */
/* eslint-disable react/state-in-constructor */
import React, { Component } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as CartActions from "../../store/modules/cart/actions";

import api from "../../services/api";
import { formatPrice } from "../../util/format";
import { ProductList } from "./styles";

class Home extends Component {
  static propTypes = {
    addToCart: PropTypes.func.isRequired,
    amount: PropTypes.objectOf(PropTypes.number).isRequired,
  };

  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get("/products");

    const data = response.data.map(product => ({
      ...product,
      formattedPrice: formatPrice(product.price),
    }));

    this.setState({ products: data });
  }

  handleAddProductToCart = product => {
    const { addToCart } = this.props;

    addToCart(product);
  };

  render() {
    const { products } = this.state;
    const { amount } = this.props;

    return (
      <ProductList>
        {products.map(product => (
          <li key={String(product.id)}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.formattedPrice}</span>

            <button
              type="button"
              onClick={() => this.handleAddProductToCart(product)}
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
}

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
