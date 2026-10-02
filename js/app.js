// patterns
var STUDENT_RE = /^\d{2}-\d{4}-\d{3}$/;
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MOBILE_RE = /^(09|\+639)\d{9}$/;

// pure functions
function isValidStudentNumber(value) {
  if (typeof value !== "string") {
    return false;
  }
  return STUDENT_RE.test(value.trim());
}

function getPasswordProblems(value) {
  var problems = [];
  if (typeof value !== "string") {
    return ["at least 8 characters"];
  }
  if (value.length < 8) {
    problems.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(value)) {
    problems.push("an uppercase letter");
  }
  if (!/\d/.test(value)) {
    problems.push("a digit");
  }
  if (!/[@$!]/.test(value)) {
    problems.push("one of @, $, or !");
  }
  if (/\s/.test(value)) {
    problems.push("no spaces");
  }
  return problems;
}

function isValidPassword(value) {
  return getPasswordProblems(value).length === 0;
}

// field checks (return error text)
function checkName(value) {
  var name = value.trim();
  if (name === "") {
    return "Full name is required.";
  }
  if (name.length < 2) {
    return "Full name must be at least two characters.";
  }
  return "";
}

function checkStudentNumber(value) {
  if (value.trim() === "") {
    return "Student number is required.";
  }
  if (!isValidStudentNumber(value)) {
    return "Enter a student number in the format 24-1234-123.";
  }
  return "";
}

function checkEmail(value) {
  var email = value.trim();
  if (email === "") {
    return "Email address is required.";
  }
  if (!EMAIL_RE.test(email)) {
    return "Enter an email like name@example.com.";
  }
  return "";
}

function checkMobile(value) {
  var mobile = value.trim();
  if (mobile === "") {
    return "Mobile number is required.";
  }
  if (!MOBILE_RE.test(mobile)) {
    return "Enter 09 or +639 followed by nine digits, with no spaces or hyphens.";
  }
  return "";
}

function checkPassword(value) {
  if (value === "") {
    return "Password is required.";
  }
  var problems = getPasswordProblems(value);
  if (problems.length > 0) {
    return "Password needs " + problems.join(", ") + ".";
  }
  return "";
}

function checkConfirm(password, confirm) {
  if (confirm === "") {
    return "Please confirm your password.";
  }
  if (password !== confirm) {
    return "Passwords do not match.";
  }
  return "";
}

function checkCourse(value) {
  if (value !== "BSIT" && value !== "BSCS") {
    return "Select BSIT or BSCS.";
  }
  return "";
}

function checkTerms(checked) {
  if (!checked) {
    return "You must agree to the terms.";
  }
  return "";
}

// browser only
if (typeof document !== "undefined") {
  var byId = function (id) {
    return document.getElementById(id);
  };

  var setError = function (inputId, errorId, message) {
    var input = byId(inputId);
    byId(errorId).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return message === "";
  };

  var validateName = function () {
    return setError("fullName", "fullNameError", checkName(byId("fullName").value));
  };

  var validateStudentNumber = function () {
    return setError("studentNumber", "studentNumberError", checkStudentNumber(byId("studentNumber").value));
  };

  var validateEmail = function () {
    return setError("email", "emailError", checkEmail(byId("email").value));
  };

  var validateMobile = function () {
    return setError("mobileNumber", "mobileNumberError", checkMobile(byId("mobileNumber").value));
  };

  var validatePassword = function () {
    return setError("password", "passwordError", checkPassword(byId("password").value));
  };

  var validateConfirm = function () {
    var msg = checkConfirm(byId("password").value, byId("confirmPassword").value);
    return setError("confirmPassword", "confirmPasswordError", msg);
  };

  var validateCourse = function () {
    return setError("course", "courseError", checkCourse(byId("course").value));
  };

  var validateTerms = function () {
    return setError("terms", "termsError", checkTerms(byId("terms").checked));
  };

  // live feedback
  var showPasswordFeedback = function () {
    var box = byId("passwordFeedback");
    var problems = getPasswordProblems(byId("password").value);
    if (problems.length === 0) {
      box.textContent = "Password meets all requirements.";
      box.className = "feedback ok";
    } else {
      box.textContent = "Password still needs " + problems.join(", ") + ".";
      box.className = "feedback";
    }
  };

  var clearOutput = function () {
    byId("successMessage").textContent = "";
    byId("registrationSummary").hidden = true;
    ["summaryName", "summaryStudentNumber", "summaryEmail", "summaryMobileNumber", "summaryCourse"].forEach(function (id) {
      byId(id).textContent = "";
    });
  };

  var showSummary = function () {
    byId("summaryName").textContent = byId("fullName").value.trim();
    byId("summaryStudentNumber").textContent = byId("studentNumber").value.trim();
    byId("summaryEmail").textContent = byId("email").value.trim();
    byId("summaryMobileNumber").textContent = byId("mobileNumber").value.trim();
    byId("summaryCourse").textContent = byId("course").value;
    byId("successMessage").textContent = "Registration details validated successfully!";
    byId("registrationSummary").hidden = false;
  };

  var handleSubmit = function (event) {
    event.preventDefault();
    clearOutput();

    // run all checks
    var results = [
      validateName(),
      validateStudentNumber(),
      validateEmail(),
      validateMobile(),
      validatePassword(),
      validateConfirm(),
      validateCourse(),
      validateTerms()
    ];
    showPasswordFeedback();

    if (results.every(Boolean)) {
      showSummary();
    }
  };

  var handleReset = function () {
    var errorIds = [
      ["fullName", "fullNameError"],
      ["studentNumber", "studentNumberError"],
      ["email", "emailError"],
      ["mobileNumber", "mobileNumberError"],
      ["password", "passwordError"],
      ["confirmPassword", "confirmPasswordError"],
      ["course", "courseError"],
      ["terms", "termsError"]
    ];
    errorIds.forEach(function (pair) {
      setError(pair[0], pair[1], "");
    });
    byId("passwordFeedback").textContent = "";
    byId("passwordFeedback").className = "feedback";
    clearOutput();
  };

  var init = function () {
    var form = byId("registrationForm");

    form.addEventListener("submit", handleSubmit);
    form.addEventListener("reset", handleReset);

    byId("fullName").addEventListener("blur", validateName);
    byId("password").addEventListener("input", showPasswordFeedback);
    byId("course").addEventListener("change", validateCourse);
    byId("terms").addEventListener("change", validateTerms);

    // recheck on edit
    byId("studentNumber").addEventListener("input", function () {
      if (byId("studentNumberError").textContent) { validateStudentNumber(); }
    });
    byId("email").addEventListener("input", function () {
      if (byId("emailError").textContent) { validateEmail(); }
    });
    byId("mobileNumber").addEventListener("input", function () {
      if (byId("mobileNumberError").textContent) { validateMobile(); }
    });
    byId("password").addEventListener("input", function () {
      if (byId("passwordError").textContent) { validatePassword(); }
      if (byId("confirmPasswordError").textContent) { validateConfirm(); }
    });
    byId("confirmPassword").addEventListener("input", function () {
      if (byId("confirmPasswordError").textContent) { validateConfirm(); }
    });
    byId("fullName").addEventListener("input", function () {
      if (byId("fullNameError").textContent) { validateName(); }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

// node export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidStudentNumber: isValidStudentNumber, isValidPassword: isValidPassword };
}