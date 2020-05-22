import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Header, Loading } from '../components';
import { CartItem, BookTrips } from '../containers';
import { RouteComponentProps } from '@reach/router';
import * as GetCartItemsTypes from './__generated__/GetCartItems';

import CheckoutForm from '../CheckoutForm';

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

interface CartProps extends RouteComponentProps {}

const Cart: React.FC<CartProps> = () => {
  const { data, loading, error } = useQuery<
    GetCartItemsTypes.GetCartItems
  >(GET_CART_ITEMS);
  
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header>My Cart</Header>
      // eslint-disable-next-line
      {localStorage.getItem('to_pay') === "true" ? (
        <div>
        <h2>Total: ${Number(localStorage.getItem('to_pay_trips')) * 10}</h2>
        <CheckoutForm />
        </div>
      ) :
        !data || !!data && data.cartItems.length === 0 ? (
        <p data-testid="empty-message">No items in your cart</p>
      ) : (
        <Fragment>
          {!!data && data.cartItems.map((launchId: any) => (
            <CartItem key={launchId} launchId={launchId} />
          ))}
          <BookTrips cartItems={!!data ? data.cartItems : []} to_pay={!!data ? data.to_pay : false} />
        </Fragment>
      )}
    </Fragment>
  );
}

export default Cart;