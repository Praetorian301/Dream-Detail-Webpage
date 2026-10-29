# Dream Detail

Website for Dream Detail: mobile car detailing across Perth, plus paint correction and ceramic coatings at the Floreat workshop.

It is a static site: plain HTML, CSS and JavaScript, with GSAP for animation. There is no framework and no server code, so it can be hosted for free as a Render static site.

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Intro, detailing packages, before/after slider, paint correction, ceramic coating, cars we've detailed |
| `services.html` | Packages, paint correction with size-based pricing, ceramic coating, restoration extras |
| `gallery.html` | Before/after slider, car galleries with lightbox, packages, reviews and Instagram |
| `area.html` | Google map, suburb/postcode checker, how booking works |
| `faq.html` | Frequently asked questions |
| `book.html` | 4-step quote form with live estimate, plus the services below it |
| `404.html` | Shown for any address that doesn't exist |

## Editing

- **Words and layout:** every section lives once in `src/body.html`. After changing it, rebuild the pages with `python src/build.py`. Don't edit the generated `.html` files directly, because the next build overwrites them.
- **Prices, phone, service area, past jobs:** the config objects at the top of `main.js` (`BUSINESS`, `PRICING`, `PROJECTS`, `CARS`, `PAINT_SHOTS`).
- **Styles:** `styles.css`. Newer changes are appended at the end in numbered blocks.
- **Cache busting:** after changing `styles.css` or `main.js`, bump the `?v=` numbers in `src/build.py` and rebuild, so returning visitors get the new files.

## Hosting on Render

1. Push this folder to a GitHub repository. The site files (`index.html`, `render.yaml` and so on) must be at the top level of the repo.
2. In Render, choose **New > Blueprint** and pick the repository. Render reads `render.yaml` and creates a free static site called `dream-detail`. There is no build step.
   - Or choose **New > Static Site**, pick the repo, leave the build command empty, and set the publish directory to `.`.
3. When it's live, copy the address (for example `https://dream-detail.onrender.com/`) into `SITE_URL` in `src/build.py`, rebuild, and push.
4. Optional: add your own domain under the site's **Settings > Custom Domains** in Render, then put that domain in `SITE_URL` instead.

Every push to the main branch redeploys the site automatically.

## Before launch

1. **Quote form:** with `formEndpoint` empty in `main.js`, sending the form opens a pre-filled text message to Will on the customer's phone. Photos can't go through that way. To receive requests by email with photos, create a free form at formspree.io and paste its URL into `formEndpoint`.
2. **Reviews:** the review cards are labelled samples. Replace them with real Google reviews.
3. **Hours and business email:** still to be added.
4. **Logo:** the header uses a temporary monogram.

## Analytics

Add the GA4 snippet to the `<head>` in `src/build.py`. The events `start_booking`, `submit_enquiry`, `view_service`, `contact_click` and `instagram_click` already fire.
