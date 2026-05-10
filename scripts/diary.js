const entryList = document.querySelector("#entryList");
const tagFilter = document.querySelector("#tagFilter");

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

const formatTags = (tags) =>
  tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");

const renderScreenshots = (screenshots) => {
  if (!screenshots || screenshots.length === 0) {
    return "";
  }

  return `
    <div class="entry-shots">
      ${screenshots.map((shot) => {
        const caption = escapeHtml(shot.caption || "脱敏截图");
        if (!shot.src) {
          return `
            <figure class="entry-shot">
              <div class="shot-placeholder small">${caption}</div>
              <figcaption>${caption}</figcaption>
            </figure>
          `;
        }

        return `
          <figure class="entry-shot">
            <img src="${escapeHtml(shot.src)}" alt="${caption}" loading="lazy" />
            <figcaption>${caption}</figcaption>
          </figure>
        `;
      }).join("")}
    </div>
  `;
};

const renderEntries = (entries, selectedTag = "all") => {
  const visibleEntries = selectedTag === "all"
    ? entries
    : entries.filter((entry) => entry.tags.includes(selectedTag));

  if (visibleEntries.length === 0) {
    entryList.innerHTML = `
      <div class="card">
        <h3>没有匹配的日记</h3>
        <p>换一个标签试试。</p>
      </div>
    `;
    return;
  }

  entryList.innerHTML = visibleEntries.map((entry) => `
    <article id="${escapeHtml(entry.id)}" class="entry">
      <div class="entry-meta">
        <time datetime="${escapeHtml(entry.date)}">${escapeHtml(entry.date)}</time>
        <span>${escapeHtml(entry.type)}</span>
      </div>
      <div class="entry-content">
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.summary)}</p>
        <div class="tag-row">${formatTags(entry.tags)}</div>
        <ul>
          ${entry.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
        </ul>
        ${renderScreenshots(entry.screenshots)}
      </div>
    </article>
  `).join("");
};

const hydrateFilters = (entries) => {
  const tags = [...new Set(entries.flatMap((entry) => entry.tags))].sort();
  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });

  tagFilter.addEventListener("change", () => renderEntries(entries, tagFilter.value));
};

fetch("./data/diary.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then((entries) => {
    hydrateFilters(entries);
    renderEntries(entries);
  })
  .catch((error) => {
    entryList.innerHTML = `
      <div class="card">
        <h3>日记加载失败</h3>
        <p>${escapeHtml(error.message)}。请确认 data/diary.json 存在，或用本地 HTTP 服务预览。</p>
      </div>
    `;
  });
