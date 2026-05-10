const entryList = document.querySelector("#entryList");
const tagFilter = document.querySelector("#tagFilter");
const statsCounter = document.querySelector("#statsCounter");

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

const renderEvidence = (screenshots = []) => {
  if (!screenshots.length) {
    return "";
  }

  const visibleShots = screenshots.slice(0, 3);
  const remaining = screenshots.length - visibleShots.length;

  return `
    <div class="entry-evidence-grid">
      ${visibleShots.map((shot) => {
        const caption = escapeHtml(shot.caption || "脱敏截图");
        if (!shot.src) {
          return `<div class="evidence-placeholder">${caption}</div>`;
        }
        return `<img src="${escapeHtml(shot.src)}" alt="${caption}" loading="lazy" />`;
      }).join("")}
      ${remaining > 0 ? `<div class="evidence-more">+${remaining}</div>` : ""}
    </div>
  `;
};

const renderEntries = (entries, selectedTag = "all") => {
  const visibleEntries = selectedTag === "all"
    ? entries
    : entries.filter((entry) => entry.tags.includes(selectedTag));

  statsCounter.textContent = `ARCHIVE_SIZE: ${visibleEntries.length} ENTRIES`;

  if (visibleEntries.length === 0) {
    entryList.innerHTML = `
      <div class="card archive-loading">
        <h3 class="mono">NO MATCHING RECORDS</h3>
        <p>换一个标签，或稍后继续追加日记。</p>
      </div>
    `;
    return;
  }

  entryList.innerHTML = visibleEntries.map((entry) => {
    const shotCount = entry.screenshots ? entry.screenshots.length : 0;

    return `
      <article id="${escapeHtml(entry.id)}" class="entry-card">
        <div class="entry-top">
          <span class="entry-date">${escapeHtml(entry.date)}</span>
          <span class="entry-type">${escapeHtml(entry.type)}</span>
        </div>
        <div class="entry-main">
          <h3>${escapeHtml(entry.title)}</h3>
          <p>${escapeHtml(entry.summary)}</p>
          <ul class="entry-notes">
            ${entry.notes.slice(0, 3).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
            ${entry.notes.length > 3 ? `<li class="entry-more-note">还有 ${entry.notes.length - 3} 个复盘点</li>` : ''}
          </ul>
          <div class="tag-row">${formatTags(entry.tags)}</div>
          ${renderEvidence(entry.screenshots)}
        </div>
        <div class="entry-footer">
          <span class="entry-shots-count mono">${shotCount} EVIDENCE_SHOTS</span>
          <a href="#${escapeHtml(entry.id)}" class="entry-anchor mono">ANCHOR</a>
        </div>
      </article>
    `;
  }).join("");
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
    // Sort entries by date descending
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    hydrateFilters(entries);
    renderEntries(entries);
  })
  .catch((error) => {
    entryList.innerHTML = `
      <div class="card archive-loading">
        <h3 class="accent-red">ARCHIVE_ACCESS_DENIED</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  });
