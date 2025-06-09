# Mill

CLI for Tree stream processing.

## Usage

```sh
npm install -g hyoo_mill
some command 2>&1 | hyoo_mill table
```

or

```sh
some comand 2>&1 | npm exec hyoo_mill table
```

## Examples

Example of input stream:

![](https://habrastorage.org/webt/ur/vo/vn/urvovnmwnu4dajfrc8xyl2jay2a.png)

Example of output stream:

![](https://habrastorage.org/webt/eg/oy/bf/egoybfmkvntioztxvkuw3rsva8m.png)

## testing

```sh
npm start hyoo/mill &&  npm start 2>&1 | node hyoo/mill/-/node.js quiet
```
