const mobileToggle = document.querySelector(".mobile-toggle");
const navLinks = document.querySelector(".nav-links");

mobileToggle.addEventListener("click", () => {
  mobileToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileToggle.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// Scroll progress indicator
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(".scroll-progress").style.width = scrollPercent + "%";
}

// Smooth reveal animation for sections
const sections = document.querySelectorAll("section");
const navLinksAll = document.querySelectorAll("nav a");

function revealSections() {
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100 && sectionTop > -sectionHeight + 100) {
      section.classList.add("show");
    }
  });
}

// Update active navigation link
function setActiveLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinksAll.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
}

// Header background change on scroll
const header = document.querySelector("header");
function updateHeader() {
  if (window.pageYOffset > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// Animate skill bars when they come into view
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  skillBars.forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      bar.style.width = bar.style.getPropertyValue("--progress");
    }
  });
}

// Parallax effect for floating shapes
function updateParallax() {
  const scrolled = window.pageYOffset;
  const shapes = document.querySelectorAll(".shape");

  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5;
    shape.style.transform = `translateY(${scrolled * speed}px) rotate(${
      scrolled * 0.1
    }deg)`;
  });
}

// Throttle function for better performance
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Event listeners
window.addEventListener(
  "scroll",
  throttle(() => {
    updateScrollProgress();
    revealSections();
    setActiveLink();
    updateHeader();
    animateSkillBars();
    updateParallax();
  }, 16)
); // ~60fps

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Initial calls
revealSections();
setActiveLink();
animateSkillBars();

// Add some interactive cursor effects
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  if (!cursor) {
    const newCursor = document.createElement("div");
    newCursor.className = "cursor";
    newCursor.style.cssText = `
          position: fixed;
          width: 20px;
          height: 20px;
          background: rgba(102, 126, 234, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: all 0.1s ease;
        `;
    document.body.appendChild(newCursor);
  }

  const cursorElement = document.querySelector(".cursor");
  cursorElement.style.left = e.clientX - 10 + "px";
  cursorElement.style.top = e.clientY - 10 + "px";
});

// Add hover effects for interactive elements
document
  .querySelectorAll("a, button, .project-card, .contact-item")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const cursor = document.querySelector(".cursor");
      if (cursor) {
        cursor.style.transform = "scale(2)";
        cursor.style.background = "rgba(102, 126, 234, 0.8)";
      }
    });

    el.addEventListener("mouseleave", () => {
      const cursor = document.querySelector(".cursor");
      if (cursor) {
        cursor.style.transform = "scale(1)";
        cursor.style.background = "rgba(102, 126, 234, 0.5)";
      }
    });
  });

// Add typing animation to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Trigger typing animation when page loads
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title");
  const originalText = heroTitle.textContent;
  setTimeout(() => {
    typeWriter(heroTitle, originalText, 150);
  }, 1000);
});

// Add intersection observer for more precise animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");

      // Special animations for specific elements
      if (entry.target.classList.contains("project-card")) {
        entry.target.style.animationDelay = Math.random() * 0.5 + "s";
      }

      if (entry.target.classList.contains("skill-category")) {
        const skillBars = entry.target.querySelectorAll(".skill-progress");
        skillBars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.width = bar.style.getPropertyValue("--progress");
          }, index * 200);
        });
      }
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(".project-card, .skill-category, .contact-item, .stat-item")
  .forEach((el) => {
    observer.observe(el);
  });

// Add some Easter eggs for fun
let clickCount = 0;
document.querySelector(".logo").addEventListener("click", () => {
  clickCount++;
  if (clickCount === 5) {
    document.body.style.animation = "rainbow 2s infinite";
    setTimeout(() => {
      document.body.style.animation = "";
      clickCount = 0;
    }, 2000);
  }
});

// Add rainbow animation keyframes
const style = document.createElement("style");
style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
document.head.appendChild(style);
