import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Button from '../components/button';
import { GET_LAUNCH } from './cart-item';
import * as GetCartItemsTypes from '../pages/__generated__/GetCartItems';
import * as BookTripsTypes from './__generated__/BookTrips';

import TakeMoney from '../CheckoutForm';

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface BookTripsProps extends GetCartItemsTypes.GetCartItems {}

const BookTrips: React.FC<BookTripsProps> = ({ cartItems, to_pay }) => {
  const [bookTrips, { data }] = useMutation<BookTripsTypes.BookTrips, BookTripsTypes.BookTripsVariables>(
    BOOK_TRIPS,
    {
      variables: { launchIds: cartItems },
      refetchQueries: cartItems.map(launchId => ({
        query: GET_LAUNCH,
        variables: { launchId },
      })),
      update(cache) {
        localStorage.setItem('to_pay', "true");
        localStorage.setItem('to_pay_trips', cartItems.length.toString());
        cache.writeData({ data: { cartItems: [], to_pay: true } });
      },
    }
  );

  return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">{data.bookTrips.message}</p>
    : (
      <Button 
        onClick={() => {bookTrips()}} 
        data-testid="book-button">
        Book All
      </Button>
    );
}

export default BookTrips;