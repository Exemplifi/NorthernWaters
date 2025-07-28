document.addEventListener("DOMContentLoaded", function () {
  const linksRows = document.querySelectorAll(".links-row");

  linksRows.forEach((row) => {
    const allWraps = row.querySelectorAll(".links-listing-wrap");
    if (allWraps.length > 0) {
      // Get the last wrap element
      const lastWrap = allWraps[allWraps.length - 1];
      // Add the class for last element styling
      lastWrap.classList.add("links-listing-wrap-last");
    }
  });
});
