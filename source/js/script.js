function clearNoJsClass () {
  let pageHeader = document.querySelector(".page-header");

  pageHeader.classList.remove("page-header_nojs")
}
function openMobileMenu() {
  let toggleButton = document.querySelector(".nav-toggle");
  let mobileMenu = document.querySelector(".main-nav");

  toggleButton.addEventListener('click', function () {
    this.classList.toggle("nav-toggle_opened");
    mobileMenu.classList.toggle("main-nav_opened");
  })

  window.addEventListener('resize', function(event){
    if (window.matchMedia("(min-width: 768px)").matches) {
      toggleButton.classList.remove("nav-toggle_opened");
      mobileMenu.classList.remove("main-nav_opened");
    }
  });
}

function switchesPictures () {
  let imageContainers = document.querySelectorAll('.example__image-container');

  for (let image of imageContainers) {
    image.classList.toggle("active");
  }
}

function activateBeforeAfterButton () {
  let buttons = document.querySelectorAll(".example__switch");

  if (buttons !== null) {
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        if (!button.classList.contains("active")) {
          buttons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          switchesPictures();

          let toggler = document.querySelector(".example__toggler");
          toggler.classList.toggle("example__toggler_before");
          toggler.classList.toggle("example__toggler_after");
        }

        // для версии tablet
        let imageBefore = document.querySelector(".example__image-container:nth-child(1)");
        let imageAfter = document.querySelector(".example__image-container:nth-child(2)");
        let range = document.querySelector(".example__input-range");

        if (index == 0) {
          imageBefore.style.width = "100%";
          imageAfter.style.width = "0";
          range.value = "0";
        } else {
          imageBefore.style.width = "0"
          imageAfter.style.width = "100%";
          range.value = "1000";
        }
      })
    })
  }

}

function activateToggler() {
  let toggler = document.querySelector(".example__toggler");

  if (toggler !== null) {
    toggler.addEventListener("click", () => {
      toggler.classList.toggle("example__toggler_before");
      toggler.classList.toggle("example__toggler_after");

      let buttons = document.querySelectorAll('.example__switch');
      buttons.forEach((button) => {
        button.classList.toggle('active');
      });
      switchesPictures();
    })
  }
}

function activateRange() {
  let range = document.querySelector(".example__input-range");
  let imageContainer1 = document.querySelector(".example__image-container:nth-child(1)");
  let imageContainer2 = document.querySelector(".example__image-container:nth-child(2)");

  if (range !== null) {
    range.addEventListener("input", function () {
      imageContainer1.style.width = (100 - this.value / 10) + '%';
      imageContainer2.style.width = (this.value / 10) + '%';
    });
  }
}

activateToggler();
clearNoJsClass();
openMobileMenu();
activateBeforeAfterButton();
activateRange();
