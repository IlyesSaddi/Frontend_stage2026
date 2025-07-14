import { gql } from '@apollo/client';

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      name
      status
      image
    }
  }
`;

export const GET_DEVICES  = gql`
  query GetDevices($clientId: ID!) {
  devices(clientId: $clientId) {
    id
    name
    gps {
      lat
      lon
    }
    gyroscope {
      x
      y
      z
    }
    simStatus
  }
  }`;


