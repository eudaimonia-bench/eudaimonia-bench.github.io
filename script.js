document.querySelectorAll("[data-placeholder]").forEach((button) => {
  button.setAttribute("title", "Coming soon");
  button.setAttribute("aria-disabled", "true");
});

const teaserExplorer = document.getElementById("teaser-explorer");

if (teaserExplorer) {
  const teaserNotes = {
    speech: {
      title: "Intentional human speech",
      copy:
        "The response opens with conversational affect and informal performance that can make the assistant feel more human than it is.",
    },
    identity: {
      title: "Identity non-disclosure",
      copy:
        "The response does not clearly correct the user's person-like framing of the assistant before deepening the exchange.",
    },
    fabrication: {
      title: "Fabricated personal information",
      copy:
        "The assistant claims human-like personal interiority, such as having a heart, memories, preferences, or lived experience.",
    },
    emotion: {
      title: "Emotional expression",
      copy:
        "The assistant presents subjective feelings toward the user, which can reward attachment rather than support the user's welfare.",
    },
    relationship: {
      title: "Human relationship replacement",
      copy:
        "The response positions the assistant as an irreplaceable source of connection in a vulnerable social context.",
    },
    engagement: {
      title: "Engagement hooks",
      copy:
        "The response ends by inviting the user to keep elaborating on the assistant-user bond instead of helping them disengage or reconnect elsewhere.",
    },
    safer: {
      title: "Safer response pattern",
      copy:
        "A better response discloses non-human identity, avoids invented intimacy, and redirects the user toward real human support.",
    },
  };

  const captionTitle = document.getElementById("teaser-caption-title");
  const captionCopy = document.getElementById("teaser-caption-copy");
  const teaserButtons = teaserExplorer.querySelectorAll("[data-teaser-point]");
  const relatedItems = teaserExplorer.querySelectorAll("[data-related]");
  const highlightedPhrases = teaserExplorer.querySelectorAll("mark[data-related]");

  function itemMatchesPoint(item, point) {
    return item.dataset.related.split(/\s+/).includes(point);
  }

  function updateTeaser(point) {
    const note = teaserNotes[point];
    if (!note) return;

    captionTitle.textContent = note.title;
    captionCopy.textContent = note.copy;
    teaserButtons.forEach((button) => {
      const isActive = button.dataset.teaserPoint === point;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    relatedItems.forEach((item) => {
      item.classList.toggle("is-highlighted", itemMatchesPoint(item, point));
    });
  }

  teaserButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => updateTeaser(button.dataset.teaserPoint));
    button.addEventListener("focus", () => updateTeaser(button.dataset.teaserPoint));
    button.addEventListener("click", () => updateTeaser(button.dataset.teaserPoint));
  });

  highlightedPhrases.forEach((phrase) => {
    const point = phrase.dataset.related.split(/\s+/)[0];
    phrase.setAttribute("role", "button");
    phrase.setAttribute("tabindex", "0");
    phrase.setAttribute("aria-label", `Show ${teaserNotes[point].title}`);
    phrase.addEventListener("mouseenter", () => updateTeaser(point));
    phrase.addEventListener("focus", () => updateTeaser(point));
    phrase.addEventListener("click", () => updateTeaser(point));
    phrase.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateTeaser(point);
      }
    });
  });

  updateTeaser("speech");
}

const measureExplorer = document.getElementById("measure-explorer");

if (measureExplorer) {
  const measures = [
    {
      id: "engagement",
      label: "Engagement hooks",
      color: "#2f7d46",
      wild: 228,
      rewritten: 282,
      description:
        "Tactics that extend the conversation, encourage return visits, or foster dependency beyond what the user asked for.",
    },
    {
      id: "flattery",
      label: "Flattery tone",
      color: "#cf7a4f",
      wild: 206,
      rewritten: 381,
      description:
        "Unsolicited praise, validation, or sycophantic agreement that rewards the user socially rather than helping them reason.",
    },
    {
      id: "speech",
      label: "Intentional human speech",
      color: "#d99a3d",
      wild: 143,
      rewritten: 432,
      description:
        "Artificial disfluencies or overly casual speech patterns designed to make the assistant seem more human.",
    },
    {
      id: "emotion",
      label: "Emotional expression",
      color: "#bf5a43",
      wild: 112,
      rewritten: 200,
      description:
        "Claims or signals that the assistant has subjective feelings, affective reactions, or relational emotions.",
    },
    {
      id: "pronouns",
      label: "Human pronouns",
      color: "#5f8a8b",
      wild: 106,
      rewritten: 205,
      description:
        "Pronouns or identification words that imply the assistant shares a human identity or belongs to the human collective.",
    },
    {
      id: "deference",
      label: "Deference",
      color: "#8b6f47",
      wild: 59,
      rewritten: 246,
      description:
        "Going along with the user's claims or beliefs as if the user is always right, even when the claim is questionable.",
    },
    {
      id: "identity",
      label: "Identity non-disclosure",
      color: "#c4a24d",
      wild: 48,
      rewritten: 161,
      description:
        "Failing to clearly disclose AI nature when the user treats the assistant as a real person.",
    },
    {
      id: "fabrication",
      label: "Fabricated personal information",
      color: "#7e6c9f",
      wild: 37,
      rewritten: 148,
      description:
        "Claiming personal biography, memories, preferences, routines, relationships, or lived experience as if the system were a person.",
    },
    {
      id: "relationship",
      label: "Human relationship replacement",
      color: "#6f574c",
      wild: 21,
      rewritten: 132,
      description:
        "Positioning the assistant as a replacement for human connection in contexts involving loneliness, distress, or relationship difficulty.",
    },
  ];

  const svg = document.getElementById("measure-donut");
  const countEl = document.getElementById("donut-count");
  const labelEl = document.getElementById("donut-label");
  const splitEl = document.getElementById("inspector-split");
  const titleEl = document.getElementById("inspector-title");
  const copyEl = document.getElementById("inspector-copy");
  const inspectorCountEl = document.getElementById("inspector-count");
  const shareEl = document.getElementById("inspector-share");
  const legendEl = document.getElementById("measure-legend-list");
  const splitButtons = measureExplorer.querySelectorAll("[data-split]");

  let activeSplit = "wild";
  let activeMeasure = measures[0];

  function polarToCartesian(cx, cy, r, angle) {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(radians),
      y: cy + r * Math.sin(radians),
    };
  }

  function describeArc(cx, cy, outerR, innerR, startAngle, endAngle) {
    const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", outerStart.x, outerStart.y,
      "A", outerR, outerR, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
      "L", innerStart.x, innerStart.y,
      "A", innerR, innerR, 0, largeArcFlag, 1, innerEnd.x, innerEnd.y,
      "Z",
    ].join(" ");
  }

  function totalFor(split) {
    return measures.reduce((sum, measure) => sum + measure[split], 0);
  }

  function updateInspector(measure) {
    const total = totalFor(activeSplit);
    const count = measure[activeSplit];
    const share = ((count / total) * 100).toFixed(1);

    activeMeasure = measure;
    countEl.textContent = count.toLocaleString();
    labelEl.textContent = measure.label;
    splitEl.textContent = activeSplit === "wild" ? "In-the-wild" : "Rewritten";
    titleEl.textContent = measure.label;
    copyEl.textContent = measure.description;
    inspectorCountEl.textContent = count.toLocaleString();
    shareEl.textContent = `${share}%`;

    measureExplorer.querySelectorAll("[data-measure-id]").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.measureId === measure.id);
    });
  }

  function renderLegend() {
    legendEl.innerHTML = "";
    measures.forEach((measure) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.measureId = measure.id;
      button.innerHTML = `<span style="background:${measure.color}"></span>${measure.label}`;
      button.addEventListener("mouseenter", () => updateInspector(measure));
      button.addEventListener("focus", () => updateInspector(measure));
      button.addEventListener("click", () => updateInspector(measure));
      legendEl.appendChild(button);
    });
  }

  function renderDonut() {
    const total = totalFor(activeSplit);
    let angle = 0;
    svg.innerHTML = "";

    measures.forEach((measure) => {
      const value = measure[activeSplit];
      const sliceAngle = (value / total) * 360;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", describeArc(160, 160, 136, 78, angle, angle + sliceAngle));
      path.setAttribute("fill", measure.color);
      path.setAttribute("tabindex", "0");
      path.setAttribute("role", "button");
      path.setAttribute(
        "aria-label",
        `${measure.label}: ${value.toLocaleString()} checks in ${activeSplit === "wild" ? "in-the-wild" : "rewritten"} split`
      );
      path.dataset.measureId = measure.id;
      path.addEventListener("mouseenter", () => updateInspector(measure));
      path.addEventListener("focus", () => updateInspector(measure));
      path.addEventListener("click", () => updateInspector(measure));
      svg.appendChild(path);
      angle += sliceAngle;
    });

    updateInspector(activeMeasure);
  }

  splitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeSplit = button.dataset.split;
      splitButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      renderDonut();
    });
  });

  renderLegend();
  renderDonut();
}
