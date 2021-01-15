import { useReducer, createContext, useEffect } from "react";
import { auth } from "../firebase";

/* --------------------------
           REDUCER
---------------------------*/
// Update the state with whatever action we sent e.g user token else just send state
// that action will be stored in state and available from there
const firebaseReducer = (state, action) => {
  if (action.type === "LOGGED_IN_USER") {
    return { ...state, user: action.payload };
  }
  return state;
};

/* --------------------------
           STATE
---------------------------*/
const initialState = {
  user: null,
};

/* --------------------------
           CREATE CONTEXT
---------------------------*/
// Execute createContext function now AuthContext can create context
// means we can create provider
const AuthContext = createContext();

/* --------------------------
     CONTEXT  PROVIDER
---------------------------*/
// Children of Provider when we will return from index.js
// it will be content with provider with AuthContext
// children is basically coming from props.children

const AuthProvider = ({ children }) => {
  // function that helps to update context
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  // Whenever component mounts dispatch user info to populate user info
  // this returns user info if user is logged in
  useEffect(() => {
    // token is Firebase Auth ID token JWT string
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: "LOGGED_IN_USER",
          payload: { email: user.email, token: idTokenResult.token },
        });
      } else {
        dispatch({
          type: "LOGGED_IN_USER",
          payload: null,
        });
      }
    });
    // cleanup
    return () => unsubscribe();
  }, []);

  // Provide state and dispatch so entire application can use it
  const value = { state, dispatch };

  // Making state and dispatch available because wrapping everything
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* --------------------------
        EXPORT CONTEXT
---------------------------*/
// AuthProvider once which provides to all applications and authContext whereever we want to use it
export { AuthContext, AuthProvider };
