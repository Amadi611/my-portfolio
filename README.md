# Alex Mercer — Developer Portfolio 🚀

A modern, fully-responsive personal portfolio website built with **pure HTML, CSS, JavaScript, and PHP** — no frameworks required.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Design** | Dark glassmorphism UI · Purple/cyan gradient theme · DM Mono + Syne fonts |
| **Animations** | Typing animation · Scroll-reveal (IntersectionObserver) · Skill bar fill · Counter roll · Hero parallax |
| **Navigation** | Sticky nav · Active-link highlight · Mobile hamburger overlay · Custom cursor |
| **Projects** | Filterable cards (All / Web / API / ML / Mobile) |
| **Timeline** | Education & Experience tab switcher |
| **Contact** | JS validation · AJAX submit · PHP backend · Honeypot spam trap · Rate limiting |
| **Performance** | No JavaScript frameworks · CSS variables · Optimised animations · Lazy-safe IntersectionObserver |
| **SEO** | Semantic HTML5 · Meta description/keywords · Open Graph tags |

---

## 📂 Project Structure

```
portfolio/
│
├── index.html          ← Main page (all sections)
├── style.css           ← All styles, animations, responsive layout
├── script.js           ← All client-side interactivity
├── contact.php         ← Server-side form handler (email + validation)
│
└── assets/             ← (create this folder manually)
    ├── AlexMercer_CV.pdf   ← Your CV/resume PDF
    └── profile.jpg         ← Optional: replace the avatar URL in index.html
```

---

## 🖥️ Running Locally with XAMPP

### Step 1 — Install XAMPP
Download from **https://www.apachefriends.org** and install for your OS (Windows/Mac/Linux).

### Step 2 — Copy the project
Place the entire `portfolio/` folder inside XAMPP's web root:

| OS | Path |
|---|---|
| Windows | `C:\xampp\htdocs\portfolio\` |
| macOS | `/Applications/XAMPP/htdocs/portfolio/` |
| Linux | `/opt/lampp/htdocs/portfolio/` |

### Step 3 — Start Apache
Open the **XAMPP Control Panel** and click **Start** next to **Apache**.

> PHP's `mail()` also needs an SMTP server on localhost to actually deliver emails.
> For local testing, use **MailHog** or **hMailServer** (Windows), or configure XAMPP's
> `php.ini` `[mail function]` section to point to your SMTP relay.

### Step 4 — Open in your browser
Navigate to:
```
http://localhost/portfolio/
```

---

## ⚙️ Customisation Guide

### 1. Personal Information (`index.html`)
Search for the following strings and replace with your own details:

| Placeholder | What to change |
|---|---|
| `Alex Mercer` | Your name |
| `alex@mercer.dev` | Your email |
| `+1 (415) 555-0123` | Your phone |
| `San Francisco, CA` | Your city |
| `https://github.com/alexmercer` | Your GitHub URL |
| `https://linkedin.com/in/alexmercer` | Your LinkedIn URL |
| DiceBear avatar URL in `<img id="heroAvatar" ...>` | Your own photo |

### 2. Email Recipient (`contact.php`)
Edit the constants at the top of `contact.php`:
```php
define('RECIPIENT_EMAIL', 'your@email.com');
define('RECIPIENT_NAME',  'Your Name');
define('SITE_NAME',       'Your Portfolio');
```

### 3. CV / Resume
Drop your PDF into the `assets/` folder as `AlexMercer_CV.pdf`  
*(or change the filename in the two `<a href="assets/...">` tags in `index.html`).*

### 4. Skills & percentages
In `index.html`, locate `<div class="skill-item" data-level="XX">` and change the `data-level` (0–100) and label text.

### 5. Projects
Each project is an `<article class="project-card" data-category="CATEGORY">`.  
Valid categories: `web` · `api` · `ml` · `mobile`  
Add/remove cards freely — the filter JS auto-discovers them.

### 6. Colour Theme
All colours are CSS variables in `style.css` under `:root { }`.  
Change `--purple-*` and `--cyan-*` values to retheme the entire site instantly.

---

## 🌐 Deploying to Live Hosting (cPanel / Shared Hosting)

1. Compress the `portfolio/` folder to a `.zip`
2. Upload via cPanel → **File Manager** → `public_html/`
3. Extract the zip
4. Ensure PHP 7.4+ is active (most hosts default to 8.x)
5. Confirm `mail()` is enabled (contact your host if emails don't arrive)
6. Update `ALLOWED_ORIGIN` in `contact.php` to your domain

---

## 🔒 Security Notes

- The honeypot field (`input.honeypot`) catches basic bots silently
- Rate limiting is session-based (3 submissions/hour by default — adjust `RATE_LIMIT` in `contact.php`)
- All user input is sanitised with `htmlspecialchars()` and validated server-side
- Email headers are checked for injection characters
- For production, consider adding a CAPTCHA (e.g. hCaptcha) and using an SMTP library (PHPMailer) instead of `mail()`

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, Open Graph meta, accessibility attributes
- **CSS3** — Custom properties, Grid/Flexbox, `backdrop-filter`, `@keyframes`, IntersectionObserver-triggered transitions
- **Vanilla JS (ES6+)** — Modules pattern, async/await, FormData, IntersectionObserver, RAF cursor
- **PHP 7.4+** — `mail()`, session rate limiting, `filter_var`, multipart MIME email

---

## 📄 License

MIT — free to use, modify, and redistribute.  
Attribution appreciated but not required.

---

*Crafted with ❤️ and ☕ by Alex Mercer*
