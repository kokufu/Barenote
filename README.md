Barenote is a simple footnote library developed in JavaScript.


## Usage
First of all, prepare the environment according to your usage. How to prepare is described below.

After the preparation,
what you have to do is just insert a tag whose class name is `barenote` to make a footnote as follows.

   ```html
   This is the simplest sample<sup><span class='barenote'>Click me!</span></sup>.<br />
   The number will be incremented automatically<sup><span class='barenote'>Like this</span></sup>.<br />
   ```

   This is shown in browser as follows.
   When you hover the number, the floating note is shown.

   ![](doc/img/sample01.png)

### Basic Preparation
If your page has only one Barenote, you can apply it to `<body>`.

1. Add `barenote.min.js` to your page.
   ```html
   <script src="https://kokufu.github.io/Barenote/dist/barenote.min.js"></script>
   ```

1. Apply Barenote to body element.  
   as follows.
   ```html
   <script type='text/javascript'>
     document.addEventListener("DOMContentLoaded", function(event) {
       const body = document.querySelector('body');
       new Barenote(body);
     });
   </script>
   ```

1. Place `barenote_ref_list` where you want to show the list.
   ```html
   <div class='barenote_ref_list'></div>
   ```

   ![](doc/img/sample01_ref.png)

### Multi-articles Preparation
If your page has tow or more articles which have footnotes,
you can apply it to each article as follows.

1. Add `barenote.min.js` to your page.
   ```html
   <script src="https://kokufu.github.io/Barenote/dist/barenote.min.js"></script>
   ```

1. Apply Barenote to each element
   as follows.
   ```html
   <script type='text/javascript'>
    document.addEventListener("DOMContentLoaded", function(event) {
      for (post_body of document.querySelectorAll('.post-body')) {
        new Barenote(post_body);
      }
    });
   </script>
   ```

1. Place `barenote_ref_list` within the each element where you want to show the list.
   ```html
   <div class=".post-body">
     ...
     <div class='barenote_ref_list'></div>
   </div>
   <div class=".post-body">
     ...
     <div class='barenote_ref_list'></div>
   </div>
   ```

## npm
If you use node.js to build web contents, you can install `barenote` from npm as follows.
```shell
$ npm install barenote
```

```js
import { Barenote } from 'barenote'

document.addEventListener("DOMContentLoaded", function(event) {
  const posts = document.querySelectorAll('article.content')
  for (const post of posts) {
    new Barenote(post)
  }
})
```

## Examples
  - [sample01](https://kokufu.github.io/Barenote/sample/sample01.html)
    The simplest sample. There is only one Barenote.  
  - [sample02](https://kokufu.github.io/Barenote/sample/sample02.html)
    There are more than two Barenote in a page.  
  - [sample03](https://kokufu.github.io/Barenote/sample/sample03.html)
    Another pattern of that there are more than two Barenote in a page.  
  - [sample04](https://kokufu.github.io/Barenote/sample/sample04.html)
    How to modify the floating note display.  


## Build
```console
git clone https://github.com/kokufu/Barenote
cd Barenote
npm install
npm run build
```
Then `barenote.min.js` is made in `dist` dir.
