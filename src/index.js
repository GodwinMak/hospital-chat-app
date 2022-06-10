import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import store from "./store"

const persistedStore = persistStore(store);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//         <Provider store={store}>
//             <PersistGate loading={null} persistor={persistedStore}>
//                 <App />
//             </PersistGate>
//         </Provider>
//     </React.StrictMode>
// );
ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistedStore}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)