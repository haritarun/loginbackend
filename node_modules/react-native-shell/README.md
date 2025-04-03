# react-native-shell


shell

## Installation

```sh
yarn add react-native-shell
```

## Usage

```js
try {
    var r=await userShellSlice(`whoami`)
    console.log(r)
} catch (e:any) {
    console.log(e.toString())
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
