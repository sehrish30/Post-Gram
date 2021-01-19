import { useContext } from "react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { Switch, Route } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";

// IMPORT COMPONENTS
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegisteration from "./pages/auth/CompleteRegisteration";
import PrivateRoute from "./components/PrivateRoute";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import Post from "./pages/post/Post";
import Profile from "./pages/Profile";
import PasswordForgot from "./pages/auth/PasswordForgot";
import PublicRoute from "./components/PublicRoute";
import Users from "./pages/Users";
import SingleUser from "./pages/SingleUser";

//Import Contextnpm install node-sass@4.14.1
import { AuthContext } from "./context/auth";
import PostUpdate from "./pages/post/PostUpdate";

console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT);

const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
    // // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        authtoken: user ? user.token : "",
      },
    };
  });

  // send req headers as well if any
  // since we are using apollo client we can set context like this
  // now for each req auth token will be sent in headers by link
  // httpLink is the apolloLink
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  /* server can use that header to authenticate the user and attach it to the GraphQL 
     execution context,
     so resolvers can modify their behavior based on a user's role and permissions */

  return (
    <ApolloProvider client={client}>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <PublicRoute exact path="/register" component={Register} />
        <PublicRoute exact path="/login" component={Login} />
        <Route exact path="/password/forgot" component={PasswordForgot} />
        <Route
          path="/complete-registeration"
          component={CompleteRegisteration}
        />
        <PrivateRoute
          exact
          path="/password/update"
          component={PasswordUpdate}
        />
        <PrivateRoute exact path="/post/create" component={Post} />
        <PrivateRoute
          exact
          path="/post/update/:postId"
          component={PostUpdate}
        />
        <PrivateRoute exact path="/profile" component={Profile} />
        <Route exact path="/user/:username" component={SingleUser} />
      </Switch>
    </ApolloProvider>
  );
};

export default App;
