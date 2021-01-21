import { gql } from "@apollo/client";
import { POST_DATA } from "./fragments";

export const POST_ADDED = gql`
  subscription {
    postAdded {
      ...postData
    }
  }
  ${POST_DATA}
`;
