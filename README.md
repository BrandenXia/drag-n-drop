# drag-n-drop

A minimal screenshot collage maker. Arrange images directly on the canvas, choose an ordering method, adjust row width and height, and export a PNG. Images are processed on your device.

## Use it

Open [drag-n-drop](https://brandenxia.github.io/drag-n-drop/), then add images or drop them onto the canvas.

- Use the sun/moon button in the header to switch between light and dark mode. The app follows your system appearance until you choose a mode, then remembers your choice, including offline.
- Drag images to rearrange them. The ordering control also supports capture time, filename, and file modification time.
- Select an image and press Delete or Backspace to remove it, or drop it outside the canvas. Use **Undo removal** or Cmd/Ctrl+Z to restore the most recently removed image.
- Use Alt+Left/Right to reorder a selected image with the keyboard.
- Adjust the row-width slider or enter an exact width, then export a PNG.
- Save a project to keep its embedded images, layout, and order; open that project to continue later.

## Offline use

Visit the site online once and wait for **Available offline** in the header. The app can then be reopened or reloaded offline at the same address in the same browser. Browsers must allow site storage; clearing site data removes the offline copy.

The offline cache contains only the app files. Save your project before closing or reloading to keep your images and layout.

You can also download the source and open `index.html` directly, without a server or internet connection.

## Local development

No dependencies or build step are required. To test the service worker, serve the directory on localhost:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Service workers require HTTPS or localhost. The worker uses network requests when available and cached app files when offline. If changing the set of cached files, update `APP_FILES` and bump the cache version in `sw.js`.

## Publishing

GitHub Pages serves the root of the `main` branch. Push changes to `main` to publish them. `.nojekyll` keeps the site as plain static files.
