// auth.js - run on every protected page

(function () {
  const publicPages = ["login.html", "register.html"];
  const currentPage = window.location.pathname.split("/").pop();
  const token = localStorage.getItem("token");

  if (!token && !publicPages.includes(currentPage)) {
    const redirectParam = encodeURIComponent(window.location.pathname);
    window.location.href = `login.html?redirect=${redirectParam}`;
  }
})();
