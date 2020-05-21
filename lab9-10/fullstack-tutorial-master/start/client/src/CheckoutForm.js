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

export async function useToken(token) {
  const [pay] = useMutation(STRIPE_PAY);
  const result = await pay({ variables: { token } });
  //console.log(result);
  //return result;
}

export default function CheckoutForm() {
  /*const useToken = (token) => {
    const [pay] = useMutation(STRIPE_PAY);
    const result = pay({ variables: { token } });
    console.log(result);
  }*/

  // ...

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
        token={useToken}
        stripeKey="pk_test_TYooMQauvdEDq54NiTphI7jx"
      />
    );
}