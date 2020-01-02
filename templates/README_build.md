## To build HTML files with inline JS:

```bash
npm run build
```

The above command will combine inline JavaScript code into the relevant HTML code found within the `templates` folder. For example, `templates/form.html` will include `templates/form.js` as inline code because of this line:

```html
<script src="./form.js" inline="inline" ...></script>
```

The "compiled" HTML files will appear in a `dist` folder, like this:

```text
dist
  form.html
  index.html
```
