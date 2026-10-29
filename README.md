# 🚘 Dream Detail

## 🚀 Live Site: [https://dreamdetail.onrender.com](https://dreamdetail.onrender.com)


**Professional Mobile Car Detailing | Paint Correction | Ceramic Coatings**

A responsive, multi-page website developed for **Dream Detail**, a professional car detailing business operating across **Perth, Western Australia**.

The website showcases mobile detailing packages, paint correction, ceramic coatings, vehicle transformations and an interactive booking system. Paint correction and specialist services are performed at the **Floreat workshop**.

Built with **HTML, CSS and JavaScript**, with **GSAP animations**, the project uses a lightweight, framework-free architecture designed for fast loading, responsive layouts and straightforward maintenance.

### 🌐 Live Website

**[Visit Dream Detail](https://dreamdetail.onrender.com)** 

---

## ⚙️ Technology Stack

| Technology | Implementation |
|---|---|
| **HTML5** | Semantic markup and page structure |
| **CSS3** | Responsive layouts, styling and animations |
| **JavaScript** | Dynamic pricing, booking interactions and galleries |
| **GSAP** | Scroll animations and visual transitions |
| **Google Maps** | Service area mapping and suburb lookup |
| **Python 3** | Static page generation using `src/build.py` |
| **Render** | Static website hosting and GitHub deployments |
| **Google Analytics 4** | Custom event tracking support |

**Architecture:** Static website, with no frontend framework, database or server-side application.

---

## 🌟 Features

* 📱 **Responsive Design:** Optimised layouts for desktop, tablet and mobile devices.
* 🚗 **Service Packages:** Mobile detailing, paint correction, ceramic coatings and restoration services.
* 💰 **Dynamic Pricing:** Vehicle size-based pricing and interactive service estimates.
* 🖼️ **Before & After Comparisons:** Interactive sliders showcasing real vehicle transformations.
* 📸 **Photo Galleries:** Vehicle galleries with lightbox functionality and project images.
* 📍 **Service Area Checker:** Google Maps integration with suburb and postcode lookup.
* 📋 **Booking System:** Four-step quote form with live pricing estimates.
* ✨ **GSAP Animations:** Smooth transitions and scroll-based visual effects.
* 📊 **Analytics Events:** Booking, service viewing and contact interaction tracking.
* 🔎 **SEO Support:** Generated static pages with configurable canonical site URLs.

---

## 📄 Website Pages

| Page | Description |
|---|---|
| 🏠 **Home** `index.html` | Business introduction, service packages, before and after comparisons, paint correction, ceramic coatings and featured vehicles |
| 🚗 **Services** `services.html` | Detailing packages, vehicle size-based paint correction pricing, ceramic coatings and restoration extras |
| 📸 **Gallery** `gallery.html` | Interactive before and after sliders, vehicle galleries, lightbox, customer reviews and Instagram |
| 📍 **Service Area** `area.html` | Google Maps, suburb and postcode checker, and booking information |
| ❓ **FAQ** `faq.html` | Frequently asked questions about detailing and services |
| 📅 **Booking** `book.html` | Four-step quote request form with live estimates and service information |
| 🔍 **404** `404.html` | Custom error page for invalid URLs |

---

## 🛠️ Development & Configuration

The website uses a simple static build system. Page content is maintained centrally and generated into individual HTML files.

### 1. Editing Website Content

All website sections are maintained in:

`src/body.html`

After making changes, rebuild the website:

```bash
python src/build.py
```

**Important:** Do not edit the generated HTML pages directly. The next build will overwrite those changes.

### 2. Business Information & Pricing

Business configuration and dynamic website data are stored in `main.js`.

| Configuration | Purpose |
|---|---|
| `BUSINESS` | Business details and contact information |
| `PRICING` | Detailing packages and service pricing |
| `PROJECTS` | Completed detailing projects |
| `CARS` | Vehicle gallery information |
| `PAINT_SHOTS` | Paint correction photography and comparisons |

### 3. Styling & Animations

Website styling is maintained in:

`styles.css`

Newer styling changes are grouped into numbered sections towards the end of the stylesheet.

### 4. Cache Management

After editing `styles.css` or `main.js`, update the `?v=` version numbers in `src/build.py`, then regenerate the website.

This ensures returning visitors receive the latest CSS and JavaScript files.

---

## 🚀 Hosting & Deployment

Dream Detail is deployed as a **static website on Render**, with GitHub integration for automatic deployment.

### Option 1. Render Blueprint

1. Push the project to a GitHub repository.
2. Open [Render](https://render.com/) and select **New > Blueprint**.
3. Connect the GitHub repository.
4. Render reads `render.yaml` and configures the static website.
5. Deploy the website.

The generated HTML files, `render.yaml` and other static assets must be located at the repository's top level.

### Option 2. Manual Static Site

Alternatively, create a static website manually:

| Setting | Value |
|---|---|
| **Service Type** | Static Site |
| **Repository** | Dream Detail GitHub repository |
| **Build Command** | Leave empty |
| **Publish Directory** | `.` |
| **Deployment** | Automatic on push |

### Custom Domain Configuration

Once deployed, update the `SITE_URL` value inside `src/build.py` to match your production domain.

Then rebuild:

```bash
python src/build.py
```

Push the generated changes to GitHub.

Custom domains can be configured under **Render > Settings > Custom Domains**.

**Automatic Deployment:** Every push to the configured `main` branch triggers a new deployment.

---

## 📋 Before Launch

The following items require final configuration or verification before the website is considered fully production-ready.

- [ ] **Booking Form:** Configure a Formspree endpoint to receive email enquiries and photo attachments.
- [ ] **Customer Reviews:** Replace sample review cards with genuine Google reviews.
- [ ] **Business Hours:** Add confirmed opening hours.
- [ ] **Business Email:** Add the official contact email.
- [ ] **Branding:** Replace the temporary header monogram with the final logo.
- [ ] **Analytics:** Add the Google Analytics 4 tracking configuration.
- [ ] **Production URL:** Confirm `SITE_URL` matches the deployed website.

### Booking Form Behaviour

By default, the booking form uses a prefilled SMS message when `formEndpoint` is empty in `main.js`.

This allows customers to send an enquiry through their phone's messaging application.

**Limitation:** Photo attachments cannot be submitted through this fallback.

To receive booking enquiries by email with photographs, configure a [Formspree](https://formspree.io/) endpoint in `main.js`.

---

## 📊 Analytics & Event Tracking

The project includes support for **Google Analytics 4**.

Add your GA4 tracking snippet to the HTML `<head>` generated through `src/build.py`.

The following custom events are already implemented:

| Event | Trigger |
|---|---|
| `start_booking` | Customer begins the booking process |
| `submit_enquiry` | Customer submits an enquiry |
| `view_service` | Customer views a service |
| `contact_click` | Customer selects a contact option |
| `instagram_click` | Customer opens Instagram |

These events can be used to monitor website engagement, booking enquiries and customer conversion activity once GA4 is configured.

---

## 👨‍💻 Development & Credits

**Developed for:** Dream Detail, Perth, Western Australia

**Developer:** [@Praetorian301](https://github.com/Praetorian301)

**Live Website:** [dreamdetail.onrender.com](https://dreamdetail.onrender.com)

**Technologies:** HTML5, CSS3, JavaScript, Python, GSAP and Render.

---

**© Dream Detail. All rights reserved.**
