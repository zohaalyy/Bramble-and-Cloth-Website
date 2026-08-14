function setUpTheme() {

  var button = document.createElement("button");
  var savedTheme = null;
  var currentTheme = "light";

  button.type = "button";
  button.id = "themeToggle";
  button.className = "theme-toggle";
  button.setAttribute("aria-pressed", "false");

  savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    currentTheme = "dark";
  }

  document.body.parentNode.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    button.textContent = "Light mode";
    button.setAttribute("aria-pressed", "true");
  } else {
    button.textContent = "Dark mode";
  }

  var header = document.querySelector(".header-inner");

  if (header) {
    header.appendChild(button);
  }

  button.addEventListener("click", function () {

    if (document.body.parentNode.getAttribute("data-theme") === "dark") {

      document.body.parentNode.setAttribute("data-theme", "light");
      button.textContent = "Dark mode";
      button.setAttribute("aria-pressed", "false");

      localStorage.setItem("theme", "light");

    } else {

      document.body.parentNode.setAttribute("data-theme", "dark");
      button.textContent = "Light mode";
      button.setAttribute("aria-pressed", "true");

      localStorage.setItem("theme", "dark");
    }

  });

  document.addEventListener("keydown", function (event) {

    if (event.altKey && event.shiftKey && event.key.toLowerCase() === "d") {

      event.preventDefault();
      button.click();

    }

  });
}function setUpMenu() {

  var toggleButton = document.getElementById("navToggle");
  var menu = document.getElementById("mainNav");

  if (!toggleButton || !menu) {
    return;
  }

  toggleButton.setAttribute("aria-expanded", "false");

  toggleButton.addEventListener("click", function () {

    if (menu.classList.contains("nav-closed")) {
      menu.classList.remove("nav-closed");
      toggleButton.setAttribute("aria-expanded", "true");
    } else {
      menu.classList.add("nav-closed");
      toggleButton.setAttribute("aria-expanded", "false");
    }

  });

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape" && !menu.classList.contains("nav-closed")) {
      menu.classList.add("nav-closed");
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.focus();
    }

  });
}


function showFieldError(fieldId, message) {

  var field = document.getElementById(fieldId);
  var errorBox = document.getElementById(fieldId + "Error");

  if (errorBox) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  if (field) {
    field.setAttribute("aria-invalid", "true");
  }
}


function clearFieldError(fieldId) {

  var field = document.getElementById(fieldId);
  var errorBox = document.getElementById(fieldId + "Error");

  if (errorBox) {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  if (field) {
    field.removeAttribute("aria-invalid");
  }
}


function isValidEmail(value) {

  var atPosition = value.indexOf("@");
  var dotPosition = value.lastIndexOf(".");

  if (atPosition < 1) {
    return false;
  }

  if (dotPosition < atPosition + 2) {
    return false;
  }

  if (dotPosition > value.length - 3) {
    return false;
  }

  if (value.indexOf(" ") !== -1) {
    return false;
  }

  return true;
}


function isValidPhone(value) {

  var digits = value.split(" ").join("");
  var i;

  for (i = 0; i < digits.length; i = i + 1) {

    if (digits[i] < "0" || digits[i] > "9") {
      return false;
    }

  }

  return digits.length === 10 || digits.length === 11;
}


function showErrorSummary(errors) {

  var summary = document.getElementById("errorSummary");
  var list = document.getElementById("errorSummaryList");

  var i;
  var item;
  var link;

  if (!summary || !list) {
    return;
  }

  list.textContent = "";

  for (i = 0; i < errors.length; i = i + 1) {

    item = document.createElement("li");
    link = document.createElement("a");

    link.href = "#" + errors[i].id;
    link.textContent = errors[i].message;

    item.appendChild(link);
    list.appendChild(item);
  }

  summary.hidden = false;
  summary.focus();
}


function hideErrorSummary() {

  var summary = document.getElementById("errorSummary");

  if (summary) {
    summary.hidden = true;
  }
}


function showSuccess() {

  var successBox = document.getElementById("successBox");

  if (successBox) {
    successBox.hidden = false;
    successBox.focus();
  }
}


function hideSuccess() {

  var successBox = document.getElementById("successBox");

  if (successBox) {
    successBox.hidden = true;
  }
}


var CM_PER_INCH = 2.54;


function getChartRows() {

  var chart = document.getElementById("sizeChart");
  var rows = [];
  var found;
  var i;

  if (!chart) {
    return rows;
  }

  found = chart.querySelectorAll("tbody tr");

  for (i = 0; i < found.length; i = i + 1) {
    rows.push(found[i]);
  }

  return rows;
}


function findSizeFor(rows, part, valueCm) {

  var i;
  var min;
  var max;

  if (rows.length === 0) {
    return null;
  }

  min = parseFloat(rows[0].getAttribute("data-" + part + "-min"));

  if (valueCm < min) {
    return "below";
  }

  for (i = 0; i < rows.length; i = i + 1) {

    max = parseFloat(rows[i].getAttribute("data-" + part + "-max"));

    if (valueCm <= max) {
      return parseInt(rows[i].getAttribute("data-size"), 10);
    }

  }

  return "above";
}


function readMeasurement(fieldId, unit) {

  var field = document.getElementById(fieldId);
  var typed = field.value.trim();
  var number;

  if (typed === "") {
    return "empty";
  }

  number = Number(typed);

  if (isNaN(number) || number <= 0) {
    return "bad";
  }

  if (unit === "in") {
    number = number * CM_PER_INCH;
  }

  if (number < 50 || number > 200) {
    return "bad";
  }

  return number;
}


function clearChartMarks(rows) {

  var i;
  var marker;

  for (i = 0; i < rows.length; i = i + 1) {

    rows[i].classList.remove("row-match");

    marker = rows[i].querySelector(".row-marker");

    if (marker) {
      marker.parentNode.removeChild(marker);
    }

  }
}


function markChartRow(rows, size) {

  var i;
  var heading;
  var marker;

  for (i = 0; i < rows.length; i = i + 1) {

    if (parseInt(rows[i].getAttribute("data-size"), 10) === size) {

      rows[i].classList.add("row-match");

      heading = rows[i].querySelector("th");

      marker = document.createElement("span");
      marker.className = "row-marker";
      marker.textContent = " (recommended)";

      heading.appendChild(marker);
    }

  }
}


function describePart(part) {

  if (part === "bust") {
    return "Bust";
  }

  if (part === "waist") {
    return "Waist";
  }

  return "Hip";
}


function runSizeFinder() {

  var rows = getChartRows();

  var resultBox = document.getElementById("sizeResult");
  var headline = document.getElementById("resultHeadline");
  var detail = document.getElementById("resultDetail");
  var breakdown = document.getElementById("resultBreakdown");

  var unitInput = document.querySelector("input[name='unit']:checked");
  var unit = unitInput ? unitInput.value : "cm";

  var parts = ["bust", "waist", "hip"];
  var results = [];

  var biggest = 0;
  var anyAbove = false;
  var anyGiven = false;
  var badCount = 0;

  var i;
  var value;
  var size;
  var item;
  var shown;

  clearFieldError("bust");
  clearFieldError("waist");
  clearFieldError("hip");

  clearChartMarks(rows);

  for (i = 0; i < parts.length; i = i + 1) {

    value = readMeasurement(parts[i], unit);

    if (value === "bad") {

      badCount = badCount + 1;

      if (unit === "cm") {

        showFieldError(
          parts[i],
          "Enter a measurement in centimetres, between 50 and 200."
        );

      } else {

        showFieldError(
          parts[i],
          "Enter a measurement in inches, between 20 and 79."
        );
      }

    } else if (value !== "empty") {

      anyGiven = true;

      size = findSizeFor(rows, parts[i], value);

      results.push({
        part: parts[i],
        cm: value,
        size: size
      });

      if (size === "above") {

        anyAbove = true;

      } else if (size !== "below" && size > biggest) {

        biggest = size;
      }
    }
  }

  if (badCount > 0) {
    resultBox.hidden = true;
    return;
  }

  if (!anyGiven) {

    showFieldError(
      "bust",
      "Enter at least one measurement so we can suggest a size."
    );

    resultBox.hidden = true;
    return;
  }

  breakdown.textContent = "";

  for (i = 0; i < results.length; i = i + 1) {

    item = document.createElement("li");

    shown = Math.round(results[i].cm) + " cm";

    if (results[i].size === "above") {

      item.textContent =
        describePart(results[i].part) + " " + shown +
        " is above our largest stocked size.";

    } else if (results[i].size === "below") {

      item.textContent =
        describePart(results[i].part) + " " + shown +
        " is below our smallest stocked size.";

    } else {

      item.textContent =
        describePart(results[i].part) + " " + shown +
        " matches a UK " + results[i].size + ".";
    }

    breakdown.appendChild(item);
  }

  if (anyAbove) {

    headline.textContent = "Made to measure";

    detail.textContent =
      "One of your measurements is above our largest stocked size, " +
      "so the rail sizes will not fit properly. We make the same pieces to measure in the " +
      "same fabrics. Ring 0121 449 0224 or book a fitting and bring these numbers with you.";

  } else if (biggest === 0) {

    headline.textContent = "Smaller than our range";

    detail.textContent =
      "Your measurements sit below our smallest stocked size, which is a " +
      "UK 8. A UK 8 taken in at the waist is usually the answer. Book a fitting and we will " +
      "check it on you rather than guessing.";

  } else {

    headline.textContent = "Your size is a UK " + biggest;

    if (results.length > 1) {

      detail.textContent =
        "Where your measurements fall in different sizes we recommend the " +
        "largest of them, because taking a garment in is straightforward and letting it out " +
        "is not. Both alterations are included in the price. Your size is marked in the chart below.";

    } else {

      detail.textContent =
        "That is based on one measurement. Adding the other two will make " +
        "the recommendation more reliable. Your size is marked in the chart below.";
    }

    markChartRow(rows, biggest);
  }

  resultBox.hidden = false;
  resultBox.focus();
}


function setUpSizeFinder() {

  var form = document.getElementById("sizeForm");

  if (!form) {
    return;
  }

  form.noValidate = true;

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    runSizeFinder();

  });
}


var DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];


function checkBookingForm() {

  var errors = [];

  var name = document.getElementById("bName");
  var email = document.getElementById("bEmail");
  var phone = document.getElementById("bPhone");
  var date = document.getElementById("bDate");
  var time = document.getElementById("bTime");
  var occasion = document.getElementById("bOccasion");
  var consent = document.getElementById("bConsent");

  var chosen;
  var today;
  var day = -1;

  clearFieldError("bName");
  clearFieldError("bEmail");
  clearFieldError("bPhone");
  clearFieldError("bDate");
  clearFieldError("bTime");
  clearFieldError("bOccasion");
  clearFieldError("bConsent");

  if (name.value.trim().length < 2) {

    showFieldError("bName", "Enter your name.");

    errors.push({
      id: "bName",
      message: "Enter your name."
    });
  }

  if (email.value.trim() === "") {

    showFieldError("bEmail", "Enter your email address.");

    errors.push({
      id: "bEmail",
      message: "Enter your email address."
    });

  } else if (!isValidEmail(email.value.trim())) {

    showFieldError(
      "bEmail",
      "Enter an email address in the right format, like sam@example.com"
    );

    errors.push({
      id: "bEmail",
      message: "Enter an email address in the right format."
    });
  }

  if (phone.value.trim() !== "" && !isValidPhone(phone.value.trim())) {

    showFieldError(
      "bPhone",
      "Enter a phone number of 10 or 11 digits, or leave it blank."
    );

    errors.push({
      id: "bPhone",
      message: "Enter a phone number of 10 or 11 digits."
    });
  }

  if (date.value === "") {

    showFieldError(
      "bDate",
      "Choose the date you would like to come."
    );

    errors.push({
      id: "bDate",
      message: "Choose a date."
    });

  } else {

    chosen = new Date(date.value + "T12:00:00");
    today = new Date();

    today.setHours(23, 59, 59, 999);

    if (isNaN(chosen.getTime())) {

      showFieldError(
        "bDate",
        "Enter the date as year, month and day."
      );

      errors.push({
        id: "bDate",
        message: "Enter a real date."
      });

    } else if (chosen <= today) {

      showFieldError(
        "bDate",
        "Choose a date from tomorrow onwards."
      );

      errors.push({
        id: "bDate",
        message: "Choose a date from tomorrow onwards."
      });

    } else {

      day = chosen.getDay();

      if (day === 0 || day === 1) {

        showFieldError(
          "bDate",
          "We are closed on " + DAY_NAMES[day] + "s. Please choose another day."
        );

        errors.push({
          id: "bDate",
          message: "We are closed on " + DAY_NAMES[day] + "s."
        });
      }
    }
  }

  if (time.value === "") {

    showFieldError("bTime", "Choose a time.");

    errors.push({
      id: "bTime",
      message: "Choose a time."
    });

  } else if (time.value === "17:30" && day !== 4 && day !== -1) {

    showFieldError(
      "bTime",
      "The 17:30 slot runs on Thursdays only. Choose an earlier time or a Thursday date."
    );

    errors.push({
      id: "bTime",
      message: "The 17:30 slot runs on Thursdays only."
    });
  }

  if (occasion.value === "") {

    showFieldError(
      "bOccasion",
      "Tell us roughly what you are shopping for."
    );

    errors.push({
      id: "bOccasion",
      message: "Tell us what you are shopping for."
    });
  }

  if (!consent.checked) {

    showFieldError(
      "bConsent",
      "Tick the box so we can email you about the booking."
    );

    errors.push({
      id: "bConsent",
      message: "Tick the box so we can email you."
    });
  }

  return errors;
}


function checkMessageForm() {

  var errors = [];

  var name = document.getElementById("mName");
  var email = document.getElementById("mEmail");
  var topic = document.getElementById("mTopic");
  var message = document.getElementById("mMessage");

  clearFieldError("mName");
  clearFieldError("mEmail");
  clearFieldError("mTopic");
  clearFieldError("mMessage");

  if (name.value.trim().length < 2) {

    showFieldError("mName", "Enter your name.");

    errors.push({
      id: "mName",
      message: "Enter your name."
    });
  }

  if (email.value.trim() === "") {

    showFieldError("mEmail", "Enter your email address.");

    errors.push({
      id: "mEmail",
      message: "Enter your email address."
    });

  } else if (!isValidEmail(email.value.trim())) {

    showFieldError(
      "mEmail",
      "Enter an email address in the right format, like sam@example.com"
    );

    errors.push({
      id: "mEmail",
      message: "Enter an email address in the right format."
    });
  }

  if (topic.value === "") {

    showFieldError(
      "mTopic",
      "Choose what your message is about."
    );

    errors.push({
      id: "mTopic",
      message: "Choose what your message is about."
    });
  }

  if (message.value.trim().length < 10) {

    showFieldError(
      "mMessage",
      "Write at least 10 characters so we know how to help."
    );

    errors.push({
      id: "mMessage",
      message: "Write at least 10 characters in your message."
    });
  }

  return errors;
}


function setUpForm(formId, checkFunction) {

  var form = document.getElementById(formId);

  if (!form) {
    return;
  }

  form.noValidate = true;

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    var errors = checkFunction();

    if (errors.length > 0) {

      hideSuccess();
      showErrorSummary(errors);

    } else {

      hideErrorSummary();
      showSuccess();
      form.reset();
    }

  });
}


setUpMenu();
setUpTheme();
setUpSizeFinder();
setUpForm("bookingForm", checkBookingForm);
setUpForm("messageForm", checkMessageForm);
