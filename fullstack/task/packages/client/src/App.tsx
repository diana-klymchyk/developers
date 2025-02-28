import { ExchangeRates } from './components/ExchangeRates';
import { UpdatedTime } from './components/UpdatedTime';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPH_QL_URL || "http://localhost:4001/graphql",
  cache: new InMemoryCache(),
});

function App() {
    return (
        <>

            <ApolloProvider client={client}>
                <UpdatedTime />
                <ExchangeRates />
           </ApolloProvider>
        </>
    );
}

export default App;
