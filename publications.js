const publicationsRoot = document.getElementById("publications-root");
const publicationsUrl = "assets/publications.json";
const highlightedAuthor = "Shuwei Song";

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function addPeriod(text) {
  const trimmed = text.trim();
  if (trimmed.endsWith(".") || trimmed.endsWith("?") || trimmed.endsWith("!")) {
    return trimmed;
  }
  return `${trimmed}.`;
}

function formatAuthors(authors) {
  return authors
    .map((name) => {
      const escaped = escapeHtml(name);
      if (name === highlightedAuthor) {
        return `<strong>${escaped}</strong>`;
      }
      return escaped;
    })
    .join(", ");
}

function renderCitation(item) {
  const parts = [
    `${formatAuthors(item.authors)}.`,
    `"${addPeriod(escapeHtml(item.title))}"`,
    `${escapeHtml(item.venue)}, ${item.year}.`,
  ];

  if (item.note) {
    parts.push(`${escapeHtml(item.note)}.`);
  }
  if (item.doi) {
    parts.push(`DOI: ${escapeHtml(item.doi)}.`);
  }
  if (item.ccf) {
    parts.push(`<strong>CCF-${escapeHtml(item.ccf)}</strong>`);
  }

  return `<li>${parts.join(" ")}</li>`;
}

function renderPublications(data) {
  const sections = data.groups
    .map((group) => {
      const items = group.items.map(renderCitation).join("");
      return `
        <h3 class="pub-group-title">${escapeHtml(group.title)}</h3>
        <ol class="pub-list">${items}</ol>
      `;
    })
    .join("");

  publicationsRoot.innerHTML = sections;
}

async function initPublications() {
  if (!publicationsRoot) {
    return;
  }

  try {
    const response = await fetch(publicationsUrl);
    if (!response.ok) {
      throw new Error(`Failed to load publications: ${response.status}`);
    }
    const data = await response.json();
    renderPublications(data);
  } catch (error) {
    publicationsRoot.innerHTML =
      '<p class="load-error">Failed to load publications. Please refresh the page.</p>';
  }
}

initPublications();
