import { useQuery, useMutation, gql } from "@apollo/client";
import { USER_INFO } from "./fragments";

// Use Graphql mutation in client side to update profile
export const USER_UPDATE = gql`
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;
