# Quasar App (nested-list)

The task is to create q-nested-list quasar component with functionality like in the example here. 
There is an existing quasar component to take inspiration from called QList.
Adding of item at the bottom should not be part of the new component.
The component should be generic as much as possible to be published as a quasar extension in the future.
At present it's enough just to create a PR with the component extracted.
Unit tests are out of scope of this exercise.

Basic requirements:
- The root-item property referring to a root of the tree of items, each items contains label, children and expanded properties.
- The drag-color for the drag indicator, should be primary color of the current theme by default
- Written in typescript

More advanced requirements should be proposed by the manufacturer if the time limit allows and be accepted by the requestor before implemented.


## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
