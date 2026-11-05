# The Grand Shekhawati — Churu · website demo

A responsive, static HTML/CSS/JavaScript hotel website. **No build tools or package installation required.**

## Run

Open `website/index.html` in Chrome/Firefox, or from the `website` directory:

```bash
python3 -m http.server 8080
```

Then browse http://localhost:8080/.

## Files

- `index.html` — accessible landing page with real-property photo previews and official-named YouTube video links
- `style.css` — responsive editorial design (charcoal, copper and alabaster)
- `script.js` — navigation, gallery filters/lightbox, video dialog, enquiry builder, image-error fallbacks
- `assets/images/mark.svg` — original brand monogram
- `assets/images/photo-unavailable.svg` — original fallback graphic
- `MEDIA_SOURCES.md` — exact third-party image/video provenance and publication notes

## What is and is not live

- Maps and phone links work as normal.
- **Video:** video player embeds YouTube recordings from a channel named The Grand Shekhawati Resort. Requires internet; content and embed settings are managed by the uploader.
- **Photos:** preview direct URLs from public hotel travel listings; they require internet and may be blocked by image hosts. They are not bundled for redistribution. Obtain owner-provided photo originals and replace sources before deploying commercially.
- **Enquiry:** creates a message the guest can copy and provides click-to-call. **No reservation is submitted or confirmed.**
- Review hotel policies, available facilities, phone number, and all content with property management before publishing.
