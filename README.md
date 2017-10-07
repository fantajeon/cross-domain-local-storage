Cross Domain Local Storage Separately
==========================

1. [Problem](#problem)
2. [Solution](#solution)
3. [Why not use cookies?](#why-not-use-cookies)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API](#api)
8. [Angular Support](#angular-support)
9. [Demo](#demo)
10. [Tests](#tests)
11. [Limitations](#limitations)


## Problem

As for now, standard HTML5 Web Storage (a.k.a Local Storage) doesn't now allow cross domain data sharing.
This may be a big problem in an organization which have a lot of sub domains and wants to share client data between them.

## Solution

xdLocalStorage is a lightweight js library which implements LocalStorage interface and support cross domain storage by using iframe post message communication independently.

## Why not use cookies?

Although cookies can be shared between sub domains, cookies have the overhead of being sent to the server on each request.
They're also have a size limit (4K for all cookies together)

## Installation

Download latest release from [here](https://github.com/fantajeon/cross-domain-local-storage-separately/dist) or use bower/npm (recommended)
```sh
npm install --save xdlocalstorage-separately
or
yarn add xdlocalstorage-separately
```

## Usage

- You have two steps: 
  - write embedded html.
  - write client html.

- Create an empty(embedded) html with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="xdLocalStoragePostMessageApi.min.js"></script>
</head>
<body>
    This is the magical iframe
    <script type="text/javascript">
    window.onload = function() {
      // must call init function
      xdLocalStorageEmbedded.init( "ls1" );
    };
</script>
</body>
</html>
```

- On your client page (the page you will read/store your data from) add:

```html
 <!-- if you use angular continue reading.. there's angular support -->
 <script src="scripts/xdLocalStorage.min.js"></script>
```

- Init xdLocalStorage

```js
    xdLocalStorage.init(
        {
            /* required */
            iframeUrl:'path to your html from step 1',
            nameSpace: "ls-1",    /* required uniquely */
            //an option function to be called right after the iframe was loaded and ready for action
            initCallback: function () {
                console.log('Got iframe ready');
            }
        }
    );
```

## API

```js
    // Store
    xdLocalStorage.setItem("ls1", key, value, function (data) { /* callback */ });

    // Retrieve
    xdLocalStorage.getItem(ls1", key, function (data) { /* callback */ });

    // Remove
    xdLocalStorage.removeItem(ls1", key, function (data) { /* callback */ });

    // Key Name
    xdLocalStorage.key(ls1", index, function (data) { /* callback */ });

    // Clear All
    xdLocalStorage.clear(ls1", function (data) { /* callback */ });
```

## Limitations

Apple has updated the defaults on Safari 7+ both on desktop and mobile to block 3rd party data. The option is now called "Block cookies and other website data" which refers to things like localstorage which are now completely isolated by domain.

This implies that unfortunately this library will not be able to share cross domain information on Safari 7+. 
