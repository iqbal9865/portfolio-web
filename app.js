import { db } from './firebase-app.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    console.log("Form submission initiated");

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".error").forEach(err => err.textContent = "");
    document.querySelectorAll(".error-input").forEach(el => el.classList.remove("error-input"));

    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("text");

    // Helper to set error message
    function setError(element, msg) {
      isValid = false;
      element.classList.add("error-input");
      const errorField = element.nextElementSibling;
      if (errorField) errorField.textContent = msg;
    }

    // Validation
    if (!firstName.value.trim()) setError(firstName, "First name is required");
    if (!lastName.value.trim()) setError(lastName, "Last name is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) setError(email, "Email is required");
    else if (!emailRegex.test(email.value)) setError(email, "Enter a valid email address");

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phone.value.trim()) setError(phone, "Phone number is required");
    else if (!phoneRegex.test(phone.value)) setError(phone, "Phone must contain 7–15 digits");

    if (!message.value.trim() || message.value.trim().length < 10) setError(message, "Message should be at least 10 characters");

    if (!isValid) return;

    // Save to Firestore
    try {
      console.log("Saving message to Firestore...");
      const docRef = await addDoc(collection(db, "messages"), {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        message: message.value.trim(),
        createdAt: serverTimestamp()
      });

      // Optional: send email via Formspree
      await fetch("https://formspree.io/f/xqkjeldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          message: message.value.trim()
        })
      });

      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for contacting me. I will get back to you soon.',
        confirmButtonText: 'Close'
      });

      form.reset();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Unable to send your message. Please try again later.',
        confirmButtonText: 'Close'
      });

    }

  });
});

particlesJS("particles-js", {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 631.3280775270874,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 1,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 500,
      color: "#ffffff",
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 2.5,
      direction: "bottom",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: false,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 0.5,
        },
      },
      bubble: {
        distance: 400,
        size: 4,
        duration: 0.3,
        opacity: 1,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
});
var count_particles, stats, update;
stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);
count_particles = document.querySelector(".js-count-particles");
update = function () {
  stats.begin();
  stats.end();
  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
    count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  }
  requestAnimationFrame(update);
};
requestAnimationFrame(update);
