document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".single-content");
  if (!container) return;

  const headingSelector = "h1, h2, h3, h4, h5, h6";
  const root = document.createDocumentFragment();
  const stack = [{ level: 0, container: root }];
  const children = Array.from(container.childNodes);

  children.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.matches(headingSelector)) {
      const level = parseInt(node.tagName[1], 10);

      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const details = document.createElement("details");
      details.className = "fold-heading fold-h" + level;
      details.open = true;

      const summary = document.createElement("summary");
      summary.appendChild(node);
      details.appendChild(summary);

      stack[stack.length - 1].container.appendChild(details);
      stack.push({ level: level, container: details });
    } else {
      stack[stack.length - 1].container.appendChild(node);
    }
  });

  container.appendChild(root);
});
