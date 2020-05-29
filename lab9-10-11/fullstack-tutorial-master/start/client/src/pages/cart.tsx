import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Header, Loading } from '../components';
import { CartItem, BookTrips } from '../containers';
import { RouteComponentProps } from '@reach/router';
import * as GetCartItemsTypes from './__generated__/GetCartItems';

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_m4yyYqIglZdw6gzTYkwyylYr007BNEV7mI");

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
      {!data || !!data && data.cartItems.length === 0 ? (
        <p data-testid="empty-message">No items in your cart</p>
      ) : (
        <Fragment>
          {!!data && data.cartItems.map((launchId: any) => (
            <CartItem key={launchId} launchId={launchId} />
          ))}
          <h2>Total Price: ${data.cartItems.length * 10.00} $</h2>
          <Elements stripe={stripePromise}>
            <BookTrips cartItems={!!data ? data.cartItems : []}/>
          </Elements>
        </Fragment>
      )}
    </Fragment>
  );
}

export default Cart;