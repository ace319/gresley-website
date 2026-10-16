"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("pageContent");
  const sectionNames = document.body.dataset.sections?.split(" ") || [];

  if (!target || sectionNames.length === 0) {
    return;
  }

  try {
    const response = await fetch("index.html");

    if (!response.ok) {
      throw new Error(`Unable to load page content (${response.status})`);
    }

    const source = new DOMParser().parseFromString(
      await response.text(),
      "text/html"
    );

    sectionNames.forEach((sectionName) => {
      const section = source.getElementById(sectionName);

      if (section) {
        target.append(section.cloneNode(true));
      }
    });

    target.removeAttribute("aria-busy");

    const siteScript = document.createElement("script");
    siteScript.src = "js/script.js";
    document.body.append(siteScript);
  } catch (error) {
    target.removeAttribute("aria-busy");
    target.innerHTML = `
      <section class="section page-load-error">
        <div class="container">
          <p class="eyebrow">Content unavailable</p>
          <h1>Please refresh the page</h1>
          <p>${error.message}</p>
        </div>
      </section>
    `;
  }
});
