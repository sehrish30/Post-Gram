import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { Switch, Route } from "react-router-dom";

// IMPORT COMPONENTS
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteRegisteration from "./pages/auth/CompleteRegisteration";

//Import Contextnpm install node-sass@4.14.1
import { AuthProvider } from "./context/auth";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT);

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route
          path="/complete-registeration"
          component={CompleteRegisteration}
        />
      </Switch>
    </ApolloProvider>
  );
};

export default App;
