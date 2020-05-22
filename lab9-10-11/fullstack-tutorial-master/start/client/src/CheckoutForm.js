import React from 'react'
import StripeCheckout from 'react-stripe-checkout';

import { useMutation } from 'react';
import gql from 'graphql-tag';
import {Mutation} from "react-apollo";

export const STRIPE_PAY = gql`
  mutation PAY($source: String!) {
    pay(source: $source) {
      source
    }
  }
`;

function useToken(token) {
  const [pay] = useMutation(STRIPE_PAY);
  const result = pay({ variables: { token } });
  return result;
}

export default function CheckoutForm() {
  /*const useToken = (token) => {
    const [pay] = useMutation(STRIPE_PAY);
    const result = pay({ variables: { token } });
    console.log(result);
  }*/

  const onToken = (token) => {
    //const result = useToken(token);
    console.log(token);
    localStorage.setItem('to_pay', "false");
    localStorage.setItem('to_pay_trips', "0");
    window.location.reload(false);
  }
 
  return (
      /*<Mutation mutation = {STRIPE_PAY}>
      {(mutate) => (<StripeCheckout
        token={async (token) => {
          const response = mutate({ variables: { token } });
        }}
        stripeKey="pk_test_TYooMQauvdEDq54NiTphI7jx"
      />)}
      </Mutation>*/

      <StripeCheckout
        token={onToken}
        amount={Number(localStorage.getItem('to_pay_trips')) * 10 * 100} // cents
        currency="USD"
        stripeKey="pk_test_TYooMQauvdEDq54NiTphI7jx"
      />
    );
}