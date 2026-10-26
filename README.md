<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563eb,100:f97316&height=170&section=header&text=Random%20Password%20Generator&fontSize=38&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Abhishek%20Jadhav%20%7C%20Veda%20Technology%20Internship%20Day%2017&descAlignY=62&descSize=17" alt="Random Password Generator header" />

  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1000&color=2563eb&center=true&vCenter=true&width=760&lines=Veda+Technology+Internship+%E2%80%A2+Day+17;HTML5+%E2%80%A2+CSS3+%E2%80%A2+Vanilla+JavaScript;Secure+Randomness+%E2%80%A2+crypto.getRandomValues()" alt="Typing introduction" />

  <p><b>Light Theme &#183; Blue &amp; Orange Accents &#183; Responsive &#183; Accessible</b></p>

  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)
  ![Crypto](https://img.shields.io/badge/crypto.getRandomValues-2563eb?style=for-the-badge)
  ![No Build Step](https://img.shields.io/badge/No_Build_Step-16a34a?style=for-the-badge)

</div>

---

## Features

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=1000&color=f97316&center=true&vCenter=true&width=760&lines=Secure+Generation+%E2%80%A2+crypto.getRandomValues();Length+4-64+%E2%80%A2+4+Character+Types;Strength+Meter+%E2%80%A2+Copy+%E2%80%A2+Show%2FHide" alt="Features animation" />
</div>

- **Secure randomness** &mdash; uses `crypto.getRandomValues()` with rejection sampling and Fisher-Yates shuffle. No `Math.random()`.
- **Password length** &mdash; slider range 4–64 plus a synchronized editable numeric input.
- **Character types** &mdash; independent checkboxes for uppercase, lowercase, numbers, and symbols; any combination.
- **Guaranteed categories** &mdash; every selected type appears at least once when length permits.
- **Validation** &mdash; clear messages for empty selection or invalid length; no invalid password generated.
- **Show / hide** &mdash; toggle password visibility.
- **Copy to clipboard** &mdash; Clipboard API with success/error feedback and a fallback.
- **Regenerate** &mdash; dedicated button plus the main Generate button.
- **Strength indicator** &mdash; Weak / Fair / Strong / Very Strong with a visual meter and an estimate disclaimer.
- **Settings summary** &mdash; shows the currently selected character types.
- **Reset settings** &mdash; restore defaults with one click.
- **Subtle animation** &mdash; new passwords pop in; respects `prefers-reduced-motion`.
- **Accessible** &mdash; semantic HTML, labels, ARIA live regions, visible focus states, keyboard support.
- **Responsive** &mdash; works on mobile, tablet, and desktop.

## Technologies

| Technology | Use |
|------------|-----|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Semantic structure, form controls, fieldset (`index.html`) |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Custom properties, Grid/Flexbox, animations, media queries, reduced motion (`style.css`) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000000) | Secure RNG, generation, validation, clipboard, strength (`script.js`) |
| ![Web Crypto](https://img.shields.io/badge/Web_Crypto_API-2563eb?style=flat-square) | `crypto.getRandomValues()` for unbiased random selection |
| ![No Frameworks](https://img.shields.io/badge/No_Frameworks-2563eb?style=flat-square) | Zero dependencies |

## Secure Random Generation

Passwords are generated using `crypto.getRandomValues()` (Web Crypto API) rather than `Math.random()`:

- `secureRandomIndex(max)` uses rejection sampling to avoid modulo bias.
- Each selected character pool contributes at least one character (when length permits).
- Remaining positions are filled from the combined pool.
- The result is shuffled with a secure Fisher-Yates shuffle.
- Passwords are never logged to the console or stored unnecessarily.

## Strength Estimation

The strength label (Weak / Fair / Strong / Very Strong) and meter are based on both **length** and **character variety**. A password is never labeled secure solely because it contains many character types — minimum length gates the higher ratings. The indicator is an estimate, not a guarantee of security.

## Project Structure

```text
internship-task-17/
+-- index.html
+-- style.css
+-- script.js
+-- README.md
+-- assets/
    +-- favicon.svg
```

## How to Run

1. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. No build step, no server, no dependencies.
3. Resize the window or use DevTools device mode to test desktop, tablet, and mobile widths.
