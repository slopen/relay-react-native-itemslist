# Relay / React Native / Graphql Connections/Mutations Boilerplate

RANGE_ADD / RANGE_DELETE / NODE_DELETE / FIELDS_CHANGE examples

[react-native-relay-example](https://github.com/sibelius/react-native-relay-example) - example integration React Native / Relay
[react-router-native](https://github.com/jmurzy/react-router-native) - react router replacement
[react-relay-network-layer](https://github.com/nodkz/react-relay-network-layer) - batch Relay queries


## Init

Check [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html)

```
git clone https://github.com/slopen/relay-react-native-itemslist
cd relay-react-native-itemslist
npm i
adb reverse tcp:8081 tcp:8081
```

## Start GraphQL server

Uses backend mock from any of:

[relay-boilerplate-itemslist](https://github.com/slopen/relay-boilerplate-itemslist)
[relay-boilerplate-itemslist-isomorphic](https://github.com/slopen/relay-boilerplate-itemslist-isomorphic)

```
npm run server
```

http://localhost:9000


## Deploy Android

```
npm run android
```


## Deploy iOS

```
npm run ios
```