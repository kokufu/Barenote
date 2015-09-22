# Barenote
A simple footnote library with JavaScript.

## Install
Download `barenote.min.js` from [Release page](https://github.com/kokufu/Barenote/releases) and place it on your server.

## Dependences
This library is dependent on `jQuery`.

## How to use
1. Link to the `barenote.js` in your web page.
   This must be after jQuery inclusion.

   ```html
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
   <script src="barenote.min.js"></script>
   ```

1. Apply barenote to tags.  
   If your web page has only one barenote, it's the simplest way applying to `body` tag like below.

   ```html
   <script type='text/javascript'>
   //<![CDATA[
     $(document).ready(function() {
        Barenote.apply($('body'));
     });
   //]]>
   </script>
   ```

1. Insert a tag whose class name is `barenote` to make a footnote like below.

   ```html
   This is the simplest sample<sup><span class='barenote'>Click me!</span></sup>.<br />
   The number will be incremented automatically<sup><span class='barenote'>Like this</span></sup>.<br />
   ```

   This is shown in browser like below.  
   ![](doc/img/sample01.png)  
   When you hover the number, the floating note is shown.

1. Place `barenote_ref_list` where you want to show the list.

   ```html
   <div class='barenote_ref_list'></div>
   ```

   ![](doc/img/sample01_ref.png)

1. See the samples  
   [sample01](sample/sample01.html)
     The simplest sample. There is only one barenote.  
   [sample02](sample/sample02.html)
     There are more than two barenote in a page.  
   [sample03](sample/sample03.html)
     Another pattern of that there are more than two barenote in a page.  
   [sample04](sample/sample04.html)
     How to modify the floating note display.  
