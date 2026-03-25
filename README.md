# Custom Guitar Luthier Portfolio Website

A modern, minimalist portfolio website designed to showcase custom guitar builds featuring premium figured woods.

## Features

- **Dark, Gallery-Focused Design** - Clean aesthetic that lets the guitars shine
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Multiple Pages:**
  - Home page with hero section and featured builds
  - Full guitar gallery
  - Individual guitar detail pages with specs and photo carousel
  - About page with philosophy and build process
  - Contact section
- **Modern UI** - Smooth transitions, hover effects, and professional typography
- **No Dependencies** - Pure HTML, CSS, and vanilla JavaScript

## Structure

```
guitar-site/
├── index.html          # Home page with hero and featured guitars
├── guitars.html        # Full gallery of all builds
├── guitar-detail.html  # Template for individual guitar pages
├── about.html          # About page with philosophy and process
├── styles.css          # Main stylesheet
├── detail.css          # Styles specific to detail pages
├── about.css           # Styles specific to about page
├── script.js           # Main JavaScript (navigation, etc.)
├── detail.js           # Gallery functionality for detail pages
└── README.md           # This file
```

## How to Use

### 1. View the Site Locally

Simply open `index.html` in your web browser. No server required!

### 2. Add Your Guitar Photos

Replace the placeholder divs with actual images:

**In the guitar cards:**
```html
<!-- Replace this: -->
<div class="placeholder-image">Guitar 1</div>

<!-- With this: -->
<img src="images/guitar1-main.jpg" alt="Quilted Maple Top">
```

**Recommended image sizes:**
- Guitar card thumbnails: 800x600px (4:3 ratio)
- Hero image: 1600x1000px
- Detail page images: 1200x900px
- About page image: 1000x1000px (square)

### 3. Customize Content

**Update contact information** in `index.html`:
- Change email address
- Add your location
- Add store locations where guitars are consigned

**Update about page** in `about.html`:
- Replace placeholder text with your story
- Update build process details
- Add your workshop photo

**Add more guitars:**
- Copy a guitar card in `guitars.html`
- Update the name, description, and link
- Add corresponding detail page (or use dynamic content)

### 4. Customize Styling

**Colors** - Edit CSS variables in `styles.css`:
```css
:root {
    --bg-dark: #0a0a0a;          /* Main background */
    --bg-card: #1a1a1a;          /* Card backgrounds */
    --text-primary: #e0e0e0;     /* Primary text */
    --text-secondary: #a0a0a0;   /* Secondary text */
    --accent: #d4af37;           /* Gold accent color */
    --accent-hover: #f0c85a;     /* Hover state */
}
```

**Logo/Brand Name** - Update in the navbar:
```html
<div class="logo">YOUR NAME</div>
```

### 5. Deploy Your Site

**Free hosting options:**

1. **Netlify** (Recommended)
   - Drag and drop your folder to netlify.com
   - Automatic HTTPS and custom domain support

2. **GitHub Pages**
   - Push code to GitHub repository
   - Enable Pages in settings
   - Free yourname.github.io URL

3. **Vercel**
   - Connect your GitHub repo
   - Automatic deployments on updates

## Future Enhancements

**When you're ready to expand:**

- Add a JavaScript-based gallery with lightbox for full-screen images
- Implement filtering (by wood type, style, etc.)
- Add a simple CMS for easier content updates
- Include video walkthroughs of guitars
- Add Instagram feed integration
- Implement contact form functionality

## Tips for Great Guitar Photography

1. **Lighting** - Natural light or diffused studio lights work best
2. **Angles** - Capture:
   - Full front view
   - Full back view
   - Headstock detail
   - Figured wood close-up
   - Fretboard/inlays
   - Body edge/binding
3. **Background** - Plain dark or neutral backgrounds
4. **Consistency** - Use same setup for all guitars
5. **High Resolution** - Shoot at highest quality, downsize for web

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Questions?

This is a static site, so it's easy to modify! All styling is in the CSS files, and content is in the HTML files. No build process or complicated tools required.

Enjoy showcasing your beautiful guitar builds!
