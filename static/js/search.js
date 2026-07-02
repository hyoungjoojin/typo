document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search-input");
  if (!input) return;

  const resultsBox = document.getElementById("search-results");
  const indexUrl = input.getAttribute("data-search-index");

  let pages = null;
  let activeIndex = -1;

  async function loadIndex() {
    if (pages !== null) return Promise.resolve(pages);
    return fetch(indexUrl)
      .then((res) => res.json())
      .then((data) => {
        pages = data;
        return pages;
      });
  }

  function closeResults() {
    resultsBox.innerHTML = "";
    resultsBox.classList.remove("active");
    activeIndex = -1;
  }

  function renderResults(matches) {
    resultsBox.innerHTML = "";
    activeIndex = -1;

    if (matches.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-result-empty";
      empty.textContent = "No results";
      resultsBox.appendChild(empty);
      resultsBox.classList.add("active");
      return;
    }

    matches.slice(0, 20).forEach((page) => {
      const link = document.createElement("a");
      link.href = page.permalink;
      link.className = "search-result";

      const title = document.createElement("div");
      title.className = "search-result-title";
      title.innerHTML = page.title;
      link.appendChild(title);

      if (page.section && page.section !== page.title) {
        const section = document.createElement("div");
        section.className = "search-result-section";
        section.innerHTML = page.section;
        link.appendChild(section);
      }

      resultsBox.appendChild(link);
    });

    resultsBox.classList.add("active");
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      closeResults();
      return;
    }

    loadIndex().then((data) => {
      const matches = data.filter((page) => {
        return (
          page.title.toLowerCase().includes(q) ||
          (page.content && page.content.toLowerCase().includes(q))
        );
      });
      renderResults(matches, q);
    });
  }

  input.addEventListener("input", function () {
    search(input.value);
  });

  input.addEventListener("focus", async function () {
    await loadIndex();
    if (input.value.trim().length > 0) {
      search(input.value);
    }
  });

  input.addEventListener("keydown", function (event) {
    const items = resultsBox.querySelectorAll(".search-result");
    if (items.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
    } else if (event.key === "Enter") {
      if (activeIndex >= 0) {
        window.location.href = items[activeIndex].href;
      }
      return;
    } else if (event.key === "Escape") {
      closeResults();
      input.blur();
      return;
    } else {
      return;
    }

    items.forEach((item, i) => {
      item.classList.toggle("active", i === activeIndex);
    });
    items[activeIndex].scrollIntoView({ block: "nearest" });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest("#search")) {
      closeResults();
    }
  });
});
