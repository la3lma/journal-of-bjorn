const PRICE_SNAPSHOT = {
  date: "2026-06-24",
  sources: [
    ["AWS data transfer documentation", "https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html"],
    ["Amazon S3 pricing", "https://aws.amazon.com/s3/pricing/"],
    ["Amazon EC2 On-Demand pricing", "https://aws.amazon.com/ec2/pricing/on-demand/"],
    ["Google Cloud network pricing", "https://cloud.google.com/vpc/network-pricing"],
    ["Google Cloud Storage pricing", "https://cloud.google.com/storage/pricing"],
    ["Google Cloud Compute pricing", "https://cloud.google.com/products/compute/pricing"],
    ["Azure bandwidth pricing", "https://azure.microsoft.com/en-us/pricing/details/bandwidth/"],
    ["Azure Blob Storage pricing", "https://azure.microsoft.com/en-us/pricing/details/storage/blobs/"],
    ["Azure Linux Virtual Machines pricing", "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/"],
    ["Cloudflare R2 pricing", "https://developers.cloudflare.com/r2/pricing/"],
    ["Hetzner Object Storage", "https://www.hetzner.com/storage/object-storage/"],
    ["OVHcloud Public Cloud prices", "https://us.ovhcloud.com/public-cloud/prices/"],
    ["Scaleway Storage pricing", "https://www.scaleway.com/en/pricing/storage/"],
    ["Telenor AI Factory", "https://www.telenoraifactory.no/"]
  ],
  locations: {
    aws_use1: {
      label: "AWS US East",
      short: "AWS",
      provider: "AWS",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.023,
      outputStoragePerGbMonth: 0.023,
      computePerHour: 38,
      capacityHours: 2400,
      defaultEgressPerGb: 0.05
    },
    aws_eu_frankfurt: {
      label: "AWS Europe (Frankfurt)",
      short: "AWS EU",
      provider: "AWS",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.0245,
      outputStoragePerGbMonth: 0.0245,
      computePerHour: 40,
      capacityHours: 2000,
      defaultEgressPerGb: 0.09
    },
    gcp_uscentral1: {
      label: "GCP us-central",
      short: "GCP",
      provider: "Google Cloud",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.020,
      outputStoragePerGbMonth: 0.020,
      computePerHour: 34,
      capacityHours: 2200,
      defaultEgressPerGb: 0.05
    },
    gcp_europe_west: {
      label: "GCP Europe (Belgium)",
      short: "GCP EU",
      provider: "Google Cloud",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.023,
      outputStoragePerGbMonth: 0.023,
      computePerHour: 36,
      capacityHours: 1800,
      defaultEgressPerGb: 0.08
    },
    azure_eastus: {
      label: "Azure East US",
      short: "Azure",
      provider: "Microsoft Azure",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.021,
      outputStoragePerGbMonth: 0.021,
      computePerHour: 31,
      capacityHours: 900,
      defaultEgressPerGb: 0.05
    },
    azure_westeurope: {
      label: "Azure West Europe",
      short: "Azure EU",
      provider: "Microsoft Azure",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.018,
      outputStoragePerGbMonth: 0.018,
      computePerHour: 33,
      capacityHours: 1500,
      defaultEgressPerGb: 0.087
    },
    oracle_usashburn: {
      label: "Oracle Cloud (US East)",
      short: "Oracle",
      provider: "Oracle Cloud",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.018,
      outputStoragePerGbMonth: 0.018,
      computePerHour: 29,
      capacityHours: 700,
      defaultEgressPerGb: 0.04
    },
    cloudflare_r2: {
      label: "Cloudflare R2",
      short: "R2",
      provider: "Cloudflare",
      role: "Object storage, not training compute",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.015,
      outputStoragePerGbMonth: 0.015,
      computePerHour: 0,
      capacityHours: 0,
      defaultEgressPerGb: 0
    },
    hetzner_eu: {
      label: "Hetzner Germany",
      short: "Hetzner",
      provider: "Hetzner",
      role: "European object storage; GPU compute not modeled here",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.0065,
      outputStoragePerGbMonth: 0.0065,
      computePerHour: 0,
      capacityHours: 0,
      defaultEgressPerGb: 0.01
    },
    ovh_eu: {
      label: "OVHcloud Europe",
      short: "OVH",
      provider: "OVHcloud",
      role: "European object storage; GPU compute not modeled here",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.0124,
      outputStoragePerGbMonth: 0.0124,
      computePerHour: 0,
      capacityHours: 0,
      defaultEgressPerGb: 0
    },
    scaleway_paris: {
      label: "Scaleway Paris",
      short: "Scaleway",
      provider: "Scaleway",
      role: "European object storage; GPU pricing exists but is not folded into this demo snapshot",
      ingressPerGb: 0,
      rawStoragePerGbMonth: 0.008,
      outputStoragePerGbMonth: 0.008,
      computePerHour: 0,
      capacityHours: 0,
      defaultEgressPerGb: 0.01
    }
  },
  egressPerGb: {
    aws_use1: { aws_use1: 0, gcp_uscentral1: 0.05, azure_eastus: 0.05, oracle_usashburn: 0.04, cloudflare_r2: 0.05 },
    gcp_uscentral1: { aws_use1: 0.05, gcp_uscentral1: 0, azure_eastus: 0.05, oracle_usashburn: 0.04, cloudflare_r2: 0.05 },
    azure_eastus: { aws_use1: 0.05, gcp_uscentral1: 0.05, azure_eastus: 0, oracle_usashburn: 0.04, cloudflare_r2: 0.05 },
    oracle_usashburn: { aws_use1: 0.04, gcp_uscentral1: 0.04, azure_eastus: 0.04, oracle_usashburn: 0, cloudflare_r2: 0.04 },
    cloudflare_r2: { aws_use1: 0, gcp_uscentral1: 0, azure_eastus: 0, oracle_usashburn: 0, cloudflare_r2: 0 }
  }
};

const SCENARIOS = {
  standard: { rawTb: 50, outputTb: 0.75, computeHours: 1200 },
  heavy: { rawTb: 120, outputTb: 1.2, computeHours: 900 },
  checkpoint: { rawTb: 25, outputTb: 18, computeHours: 1800 }
};

const FIXED_ASSUMPTIONS = {
  rawRetention: 1,
  outputRetention: 6
};

function completeEgressMatrix(locations, seedMatrix) {
  const matrix = {};
  for (const sourceKey of Object.keys(locations)) {
    matrix[sourceKey] = {};
    for (const targetKey of Object.keys(locations)) {
      if (sourceKey === targetKey) {
        matrix[sourceKey][targetKey] = 0;
      } else if (seedMatrix[sourceKey]?.[targetKey] !== undefined) {
        matrix[sourceKey][targetKey] = seedMatrix[sourceKey][targetKey];
      } else {
        matrix[sourceKey][targetKey] = locations[sourceKey].defaultEgressPerGb ?? 0.05;
      }
    }
  }
  return matrix;
}

let state = {
  workload: { ...SCENARIOS.standard },
  locations: structuredClone(PRICE_SNAPSHOT.locations),
  egressPerGb: completeEgressMatrix(PRICE_SNAPSHOT.locations, PRICE_SNAPSHOT.egressPerGb),
  activeScenario: "standard",
  selectedStory: "optimizer",
  selectedRouteRank: null,
  customRoute: {
    rawKey: "aws_use1",
    computeKey: "aws_use1",
    outputKey: "aws_use1"
  },
  graphWasNarrow: null
};

const ids = [
  "snapshotDate",
  "workloadSummary",
  "rawTb",
  "rawTbValue",
  "computeHours",
  "computeHoursValue",
  "outputTb",
  "outputTbValue",
  "strategyCards",
  "selectedEyebrow",
  "selectedHeading",
  "selectedTotal",
  "selectedNarrative",
  "flowGraph",
  "costBars",
  "comparisonTable",
  "rankedRouteTable",
  "customRawSelect",
  "customComputeSelect",
  "customOutputSelect",
  "customRouteSummary",
  "insightText",
  "priceEditor",
  "sourceList",
  "feasibleCount"
];

const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 100 ? 2 : 0
  }).format(value);
}

function compactMoney(value) {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return money(value);
}

function formatTb(value) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)} TB`;
}

function locationLabel(key) {
  return state.locations[key]?.label ?? key;
}

function locationShort(key) {
  return state.locations[key]?.short ?? locationLabel(key);
}

function workloadGb() {
  return {
    rawGb: state.workload.rawTb * 1024,
    outputGb: state.workload.outputTb * 1024
  };
}

function routeCost(rawKey, computeKey, outputKey) {
  const { rawGb, outputGb } = workloadGb();
  const raw = state.locations[rawKey];
  const compute = state.locations[computeKey];
  const output = state.locations[outputKey];

  if (!raw || !compute || !output) return null;
  if (compute.capacityHours < state.workload.computeHours) return null;

  const ingress = rawGb * raw.ingressPerGb;
  const rawStorage = rawGb * FIXED_ASSUMPTIONS.rawRetention * raw.rawStoragePerGbMonth;
  const rawTransfer = rawGb * state.egressPerGb[rawKey][computeKey];
  const computeCost = state.workload.computeHours * compute.computePerHour;
  const outputTransfer = outputGb * state.egressPerGb[computeKey][outputKey];
  const outputStorage = outputGb * FIXED_ASSUMPTIONS.outputRetention * output.outputStoragePerGbMonth;
  const total = ingress + rawStorage + rawTransfer + computeCost + outputTransfer + outputStorage;

  return {
    rawKey,
    computeKey,
    outputKey,
    ingress,
    rawStorage,
    rawTransfer,
    computeCost,
    outputTransfer,
    outputStorage,
    total
  };
}

function enumerateRoutes() {
  const keys = Object.keys(state.locations);
  const routes = [];
  for (const rawKey of keys) {
    for (const computeKey of keys) {
      for (const outputKey of keys) {
        const route = routeCost(rawKey, computeKey, outputKey);
        if (route) routes.push(route);
      }
    }
  }
  return routes.sort((a, b) => a.total - b.total);
}

function cheapestStorageKey(kind) {
  const field = kind === "raw" ? "rawStoragePerGbMonth" : "outputStoragePerGbMonth";
  return Object.entries(state.locations).sort((a, b) => a[1][field] - b[1][field])[0][0];
}

function cheapestFeasibleComputeKey() {
  return Object.entries(state.locations)
    .filter(([, location]) => location.capacityHours >= state.workload.computeHours)
    .sort((a, b) => a[1].computePerHour - b[1].computePerHour)[0]?.[0];
}

function feasibleComputeKeys() {
  return Object.entries(state.locations)
    .filter(([, location]) => location.capacityHours >= state.workload.computeHours)
    .map(([key]) => key);
}

function ensureCustomRouteFeasible() {
  const keys = Object.keys(state.locations);
  const computeKeys = feasibleComputeKeys();
  if (!keys.includes(state.customRoute.rawKey)) {
    state.customRoute.rawKey = keys[0];
  }
  if (!keys.includes(state.customRoute.outputKey)) {
    state.customRoute.outputKey = keys[0];
  }
  if (!computeKeys.includes(state.customRoute.computeKey)) {
    state.customRoute.computeKey = computeKeys[0] ?? keys[0];
  }
}

function bestSingleProviderRoute(routes) {
  return routes.find((route) => route.rawKey === route.computeKey && route.computeKey === route.outputKey);
}

function samePlacement(a, b) {
  return Boolean(
    a &&
      b &&
      a.rawKey === b.rawKey &&
      a.computeKey === b.computeKey &&
      a.outputKey === b.outputKey
  );
}

function routeRank(routes, route) {
  const index = routes.findIndex((candidate) => samePlacement(candidate, route));
  return index === -1 ? null : index + 1;
}

function withStory(id, title, subtitle, narrative, route, tone = "normal") {
  return { id, title, subtitle, narrative, route, tone };
}

function withRankedRoute(rank, route) {
  return {
    id: `ranked-${rank}`,
    title: `#${rank} ranked route`,
    subtitle: `${locationShort(route.rawKey)} -> ${locationShort(route.computeKey)} -> ${locationShort(route.outputKey)}`,
    narrative:
      "This is one exact feasible route from the full ranked solution space. It may be worse than the optimizer, but it shows how a different placement changes storage, transfer, and compute costs.",
    route,
    tone: "ranked"
  };
}

function buildStories(routes) {
  const best = routes[0];
  const worst = routes[routes.length - 1];
  const cheapestStorage = cheapestStorageKey("raw");
  const cheapestOutputStorage = cheapestStorageKey("output");
  const cheapestCompute = cheapestFeasibleComputeKey();
  const singleProvider = bestSingleProviderRoute(routes);
  const customRoute = routeCost(
    state.customRoute.rawKey,
    state.customRoute.computeKey,
    state.customRoute.outputKey
  );

  const stories = [
    withStory(
      "natural",
      "Natural home",
      "Keep the whole workflow in AWS.",
      "This is the default instinct: avoid complexity by keeping raw logs, compute, and artifacts in one familiar cloud.",
      routeCost("aws_use1", "aws_use1", "aws_use1")
    ),
    withStory(
      "cheap_storage",
      "Chase cheap storage",
      "Put assets in the cheapest object store.",
      "This follows the storage price alone. It can win when egress is friendly, but it only works if compute can still reach the data cheaply.",
      routeCost(cheapestStorage, "aws_use1", cheapestOutputStorage)
    ),
    withStory(
      "cheap_compute",
      "Chase cheap compute",
      "Keep assets in AWS, move the GPU job.",
      "This follows the compute price alone. It exposes the trap: a cheap GPU can still lose if raw data transfer is too expensive.",
      cheapestCompute ? routeCost("aws_use1", cheapestCompute, "aws_use1") : null
    ),
    withStory(
      "single_cloud",
      "Tidy single cloud",
      "Best one-provider answer.",
      "This allows the provider to change, but still refuses to split the workflow. It is operationally simple and sometimes close enough.",
      singleProvider
    ),
    withStory(
      "custom",
      "Custom route",
      `${locationShort(state.customRoute.rawKey)} -> ${locationShort(state.customRoute.computeKey)} -> ${locationShort(state.customRoute.outputKey)}`,
      "This is the route you assembled by choosing where raw data lives, where GPU compute runs, and where artifacts are retained. Its rank is computed against the same full route list as the preset stories.",
      customRoute
    ),
    withStory(
      "worst",
      "Worst available",
      "The most expensive feasible route.",
      "This is the deliberately bad baseline: every placement is still feasible, but the full storage, transfer, and compute chain is as expensive as this snapshot can make it.",
      worst,
      "worst"
    ),
    withStory(
      "optimizer",
      "Optimized route",
      "Let the model place each stage.",
      "The optimizer looks at the whole chain: raw storage, raw transfer, compute, output transfer, and retained artifacts.",
      best,
      "winner"
    )
  ];

  return stories
    .filter((story) => story.route)
    .map((story) => ({ ...story, rank: routeRank(routes, story.route), routeCount: routes.length }));
}

function setWorkloadInputs() {
  el.rawTb.value = state.workload.rawTb;
  el.computeHours.value = state.workload.computeHours;
  el.outputTb.value = state.workload.outputTb;
}

function updateWorkloadFromInputs() {
  state.workload = {
    rawTb: Number(el.rawTb.value),
    computeHours: Number(el.computeHours.value),
    outputTb: Number(el.outputTb.value)
  };
}

function renderWorkloadSummary() {
  el.rawTbValue.textContent = formatTb(state.workload.rawTb);
  el.computeHoursValue.textContent = new Intl.NumberFormat("en-US").format(state.workload.computeHours);
  el.outputTbValue.textContent = formatTb(state.workload.outputTb);
  el.workloadSummary.innerHTML = `
    <div><span>Raw telemetry</span><strong>${formatTb(state.workload.rawTb)}</strong></div>
    <div><span>GPU work</span><strong>${new Intl.NumberFormat("en-US").format(state.workload.computeHours)} h</strong></div>
    <div><span>Artifacts</span><strong>${formatTb(state.workload.outputTb)}</strong></div>
  `;
}

function renderStrategyCards(stories) {
  const bestTotal = Math.min(...stories.map((story) => story.route.total));
  el.strategyCards.innerHTML = stories
    .map((story) => {
      const active = state.selectedRouteRank === null && story.id === state.selectedStory ? " active" : "";
      const delta = story.route.total - bestTotal;
      const deltaText = delta < 1 ? "best" : `+${compactMoney(delta)}`;
      const rankText = story.rank ? `rank #${story.rank}` : "unranked";
      return `
        <button type="button" class="strategy-card${active} ${story.tone}" data-story="${story.id}">
          <span>${story.title}</span>
          <strong>${compactMoney(story.route.total)}</strong>
          <b>${rankText}</b>
          <em>${deltaText}</em>
          <small>${story.subtitle}</small>
        </button>
      `;
    })
    .join("");

  el.strategyCards.querySelectorAll("button[data-story]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedStory = button.dataset.story;
      state.selectedRouteRank = null;
      render();
    });
  });
}

function optionMarkup(keys, selectedKey) {
  return keys
    .map((key) => `<option value="${key}"${key === selectedKey ? " selected" : ""}>${locationLabel(key)}</option>`)
    .join("");
}

function renderCustomRouteBuilder(stories) {
  ensureCustomRouteFeasible();
  const locationKeys = Object.keys(state.locations);
  const computeKeys = feasibleComputeKeys();
  const customStory = stories.find((story) => story.id === "custom");

  el.customRawSelect.innerHTML = optionMarkup(locationKeys, state.customRoute.rawKey);
  el.customComputeSelect.innerHTML = optionMarkup(computeKeys, state.customRoute.computeKey);
  el.customOutputSelect.innerHTML = optionMarkup(locationKeys, state.customRoute.outputKey);

  if (customStory) {
    const rank = customStory.rank ? `rank #${customStory.rank} of ${customStory.routeCount}` : "not ranked";
    el.customRouteSummary.textContent = `${rank}; ${money(customStory.route.total)} total for ${locationShort(customStory.route.rawKey)} -> ${locationShort(customStory.route.computeKey)} -> ${locationShort(customStory.route.outputKey)}.`;
  } else {
    el.customRouteSummary.textContent = "Choose a feasible compute location to rank this route.";
  }
}

function renderCostBars(route) {
  const terms = [
    ["Raw storage", route.rawStorage, "storage"],
    ["Raw transfer", route.rawTransfer, "transfer"],
    ["Compute", route.computeCost, "compute"],
    ["Output transfer", route.outputTransfer, "transfer"],
    ["Output storage", route.outputStorage, "storage"]
  ];
  const maxTerm = Math.max(...terms.map((term) => term[1]), 1);
  el.costBars.innerHTML = terms
    .map(([label, value, kind]) => {
      const width = Math.max(1, (value / maxTerm) * 100);
      return `
        <div class="bar-row">
          <span>${label}</span>
          <div class="bar-track"><div class="bar-fill ${kind}" style="width:${width}%"></div></div>
          <strong>${money(value)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderFlowGraph(story) {
  const route = story.route;
  const rawTb = state.workload.rawTb;
  const outputTb = state.workload.outputTb;
  const computeHours = state.workload.computeHours;
  const rawStroke = Math.max(5, Math.min(22, 5 + rawTb / 7));
  const outputStroke = Math.max(4, Math.min(18, 4 + outputTb / 2));
  const narrow = el.flowGraph.clientWidth > 0 && el.flowGraph.clientWidth < 560;
  state.graphWasNarrow = narrow;

  if (narrow) {
    el.flowGraph.innerHTML = `
    <svg viewBox="0 0 420 760" role="img" aria-labelledby="flowTitle flowDesc">
      <title id="flowTitle">${story.title} flow graph</title>
      <desc id="flowDesc">Raw data storage, compute placement, output storage, transfer volumes, and cost terms.</desc>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z"></path>
        </marker>
      </defs>

      <g class="flow-svg-node">
        <rect x="35" y="32" width="350" height="142" rx="8"></rect>
        <text x="58" y="68" class="node-kind">Raw data</text>
        <text x="58" y="101" class="node-provider">${locationShort(route.rawKey)}</text>
        <text x="58" y="134">${formatTb(rawTb)} stored</text>
        <text x="235" y="134" class="node-cost">${money(route.rawStorage)}</text>
      </g>

      <line x1="210" y1="190" x2="210" y2="255" class="flow-svg-edge raw" stroke-width="${rawStroke}" marker-end="url(#arrow)"></line>
      <g class="flow-svg-node">
        <rect x="35" y="275" width="350" height="142" rx="8"></rect>
        <text x="58" y="311" class="node-kind">GPU compute</text>
        <text x="58" y="344" class="node-provider">${locationShort(route.computeKey)}</text>
        <text x="58" y="377">${computeHours.toLocaleString("en-US")} GPU-hours</text>
        <text x="235" y="377" class="node-cost">${money(route.computeCost)}</text>
      </g>

      <line x1="210" y1="433" x2="210" y2="498" class="flow-svg-edge output" stroke-width="${outputStroke}" marker-end="url(#arrow)"></line>
      <g class="flow-svg-node">
        <rect x="35" y="518" width="350" height="142" rx="8"></rect>
        <text x="58" y="554" class="node-kind">Artifacts</text>
        <text x="58" y="587" class="node-provider">${locationShort(route.outputKey)}</text>
        <text x="58" y="620">${formatTb(outputTb)} stored</text>
        <text x="235" y="620" class="node-cost">${money(route.outputStorage)}</text>
      </g>

      <g class="edge-label">
        <rect x="242" y="194" width="116" height="58" rx="6"></rect>
        <text x="256" y="218">${formatTb(rawTb)}</text>
        <text x="256" y="240">${money(route.rawTransfer)}</text>
      </g>

      <g class="edge-label">
        <rect x="242" y="437" width="116" height="58" rx="6"></rect>
        <text x="256" y="461">${formatTb(outputTb)}</text>
        <text x="256" y="483">${money(route.outputTransfer)}</text>
      </g>

      <text x="35" y="710" class="graph-footnote">
        Consumption: ${formatTb(rawTb)} raw input, ${computeHours.toLocaleString("en-US")} GPU-hours, ${formatTb(outputTb)} output; retained for ${FIXED_ASSUMPTIONS.rawRetention} and ${FIXED_ASSUMPTIONS.outputRetention} months.
      </text>
    </svg>
  `;
    return;
  }

  el.flowGraph.innerHTML = `
    <svg viewBox="0 0 1120 460" role="img" aria-labelledby="flowTitle flowDesc">
      <title id="flowTitle">${story.title} flow graph</title>
      <desc id="flowDesc">Raw data storage, compute placement, output storage, transfer volumes, and cost terms.</desc>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z"></path>
        </marker>
      </defs>

      <line x1="296" y1="150" x2="420" y2="150" class="flow-svg-edge raw" stroke-width="${rawStroke}" marker-end="url(#arrow)"></line>
      <line x1="700" y1="150" x2="824" y2="150" class="flow-svg-edge output" stroke-width="${outputStroke}" marker-end="url(#arrow)"></line>

      <g class="flow-svg-node">
        <rect x="30" y="72" width="250" height="156" rx="8"></rect>
        <text x="56" y="109" class="node-kind">Raw data</text>
        <text x="56" y="143" class="node-provider">${locationShort(route.rawKey)}</text>
        <text x="56" y="179">${formatTb(rawTb)} stored</text>
        <text x="56" y="207">${money(route.rawStorage)}</text>
      </g>

      <g class="flow-svg-node">
        <rect x="435" y="72" width="250" height="156" rx="8"></rect>
        <text x="461" y="109" class="node-kind">GPU compute</text>
        <text x="461" y="143" class="node-provider">${locationShort(route.computeKey)}</text>
        <text x="461" y="179">${computeHours.toLocaleString("en-US")} GPU-hours</text>
        <text x="461" y="207">${money(route.computeCost)}</text>
      </g>

      <g class="flow-svg-node">
        <rect x="840" y="72" width="250" height="156" rx="8"></rect>
        <text x="866" y="109" class="node-kind">Artifacts</text>
        <text x="866" y="143" class="node-provider">${locationShort(route.outputKey)}</text>
        <text x="866" y="179">${formatTb(outputTb)} stored</text>
        <text x="866" y="207">${money(route.outputStorage)}</text>
      </g>

      <g class="edge-label">
        <rect x="308" y="256" width="118" height="66" rx="6"></rect>
        <text x="323" y="282">${formatTb(rawTb)}</text>
        <text x="323" y="306">${money(route.rawTransfer)}</text>
      </g>

      <g class="edge-label">
        <rect x="713" y="256" width="118" height="66" rx="6"></rect>
        <text x="728" y="282">${formatTb(outputTb)}</text>
        <text x="728" y="306">${money(route.outputTransfer)}</text>
      </g>

      <text x="30" y="372" class="graph-footnote">
        Consumption: ${formatTb(rawTb)} raw input, ${computeHours.toLocaleString("en-US")} GPU-hours, ${formatTb(outputTb)} output; retained for ${FIXED_ASSUMPTIONS.rawRetention} and ${FIXED_ASSUMPTIONS.outputRetention} months.
      </text>
    </svg>
  `;
}

function renderComparison(stories) {
  const bestTotal = Math.min(...stories.map((story) => story.route.total));
  el.comparisonTable.innerHTML = stories
    .map((story) => {
      const route = story.route;
      const delta = route.total - bestTotal;
      const deltaText = delta < 1 ? "best" : `+${money(delta)}`;
      const active = state.selectedRouteRank === null && story.id === state.selectedStory ? " class=\"selected-row\"" : "";
      return `
        <tr${active}>
          <td>${story.title}</td>
          <td>${locationShort(route.rawKey)}</td>
          <td>${locationShort(route.computeKey)}</td>
          <td>${locationShort(route.outputKey)}</td>
          <td><strong>${money(route.total)}</strong></td>
          <td>${deltaText}</td>
        </tr>
      `;
    })
    .join("");
}

function renderRankedRoutes(routes) {
  const bestTotal = routes[0]?.total ?? 0;
  el.rankedRouteTable.innerHTML = routes
    .map((route, index) => {
      const rank = index + 1;
      const delta = route.total - bestTotal;
      const active = state.selectedRouteRank === rank ? " selected-row" : "";
      return `
        <tr class="ranked-route${active}" data-rank="${rank}">
          <td>#${rank}</td>
          <td>${locationShort(route.rawKey)}</td>
          <td>${locationShort(route.computeKey)}</td>
          <td>${locationShort(route.outputKey)}</td>
          <td>
            <strong>${money(route.total)}</strong>
            <span>${delta < 1 ? "best" : `+${money(delta)}`}</span>
          </td>
        </tr>
      `;
    })
    .join("");

  el.rankedRouteTable.querySelectorAll("tr[data-rank]").forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedRouteRank = Number(row.dataset.rank);
      state.selectedStory = null;
      render();
    });
  });
}

function renderInsight(stories) {
  const best = stories.find((story) => story.route.total === Math.min(...stories.map((item) => item.route.total)));
  const natural = stories.find((story) => story.id === "natural");
  const cheapCompute = stories.find((story) => story.id === "cheap_compute");
  const naturalDelta = natural ? natural.route.total - best.route.total : 0;
  const cheapComputeDelta = cheapCompute ? cheapCompute.route.total - best.route.total : 0;

  el.insightText.innerHTML = `
    The cheapest full workflow is <strong>${best.title.toLowerCase()}</strong>: raw in
    <strong>${locationLabel(best.route.rawKey)}</strong>, compute in
    <strong>${locationLabel(best.route.computeKey)}</strong>, output in
    <strong>${locationLabel(best.route.outputKey)}</strong>. In this scenario, the natural all-in-one
    plan costs <strong>${money(naturalDelta)}</strong> more than the best plan, and the
    cheap-compute instinct costs <strong>${money(Math.max(0, cheapComputeDelta))}</strong> more.
  `;
}

function renderPriceEditor() {
  const locationCards = Object.entries(state.locations)
    .map(([key, location]) => {
      return `
        <div class="price-card">
          <h3>${location.label}</h3>
          ${location.role ? `<p class="price-role">${location.role}</p>` : ""}
          <div class="price-grid">
            <label>
              Raw storage $/GB-mo
              <input data-price="${key}.rawStoragePerGbMonth" type="number" min="0" step="0.001" value="${location.rawStoragePerGbMonth}">
            </label>
            <label>
              Output storage $/GB-mo
              <input data-price="${key}.outputStoragePerGbMonth" type="number" min="0" step="0.001" value="${location.outputStoragePerGbMonth}">
            </label>
            <label>
              Compute $/hour
              <input data-price="${key}.computePerHour" type="number" min="0" step="0.1" value="${location.computePerHour}">
            </label>
            <label>
              Capacity hours
              <input data-price="${key}.capacityHours" type="number" min="0" step="1" value="${location.capacityHours}">
            </label>
          </div>
        </div>
      `;
    })
    .join("");

  const keys = Object.keys(state.locations);
  const egressGroups = keys
    .map((sourceKey) => {
      const rows = keys
        .map((targetKey) => {
          const disabled = sourceKey === targetKey ? "disabled" : "";
          return `
            <label class="egress-row">
              <span>${locationLabel(targetKey)}</span>
              <input
                aria-label="Egress from ${locationLabel(sourceKey)} to ${locationLabel(targetKey)}"
                data-egress="${sourceKey}.${targetKey}"
                type="number"
                min="0"
                step="0.001"
                value="${state.egressPerGb[sourceKey][targetKey]}"
                ${disabled}
              >
            </label>
          `;
        })
        .join("");
      return `
        <div class="egress-group">
          <h4>From ${locationLabel(sourceKey)}</h4>
          <div class="egress-rows">${rows}</div>
        </div>
      `;
    })
    .join("");

  el.priceEditor.innerHTML = `
    ${locationCards}
    <div class="price-card egress-card">
      <h3>Egress $/GB Matrix</h3>
      <div class="egress-list">${egressGroups}</div>
    </div>
  `;
}

function attachPriceEditorEvents() {
  el.priceEditor.querySelectorAll("input[data-price]").forEach((input) => {
    input.addEventListener("input", () => {
      const [locationKey, field] = input.dataset.price.split(".");
      state.locations[locationKey][field] = Number(input.value);
      render();
    });
  });
  el.priceEditor.querySelectorAll("input[data-egress]").forEach((input) => {
    input.addEventListener("input", () => {
      const [sourceKey, targetKey] = input.dataset.egress.split(".");
      state.egressPerGb[sourceKey][targetKey] = Number(input.value);
      render();
    });
  });
}

function renderSources() {
  el.sourceList.innerHTML = PRICE_SNAPSHOT.sources
    .map(([label, href]) => `<li><a href="${href}">${label}</a></li>`)
    .join("");
}

function setScenario(name) {
  state.activeScenario = name;
  state.workload = { ...SCENARIOS[name] };
  state.selectedStory = "optimizer";
  state.selectedRouteRank = null;
  document.querySelectorAll(".scenario").forEach((button) => {
    button.classList.toggle("active", button.dataset.size === name);
  });
  setWorkloadInputs();
  render();
}

function render() {
  updateWorkloadFromInputs();
  renderWorkloadSummary();
  ensureCustomRouteFeasible();

  const routes = enumerateRoutes();
  const stories = buildStories(routes);
  el.feasibleCount.textContent = `${routes.length} feasible routes`;

  if (state.selectedRouteRank !== null && (state.selectedRouteRank < 1 || state.selectedRouteRank > routes.length)) {
    state.selectedRouteRank = 1;
  }
  if (state.selectedRouteRank === null && !stories.find((story) => story.id === state.selectedStory)) {
    state.selectedStory = "optimizer";
  }
  const selected =
    state.selectedRouteRank !== null
      ? withRankedRoute(state.selectedRouteRank, routes[state.selectedRouteRank - 1])
      : stories.find((story) => story.id === state.selectedStory) ?? stories[0];

  renderStrategyCards(stories);
  renderCustomRouteBuilder(stories);
  el.selectedEyebrow.textContent = state.selectedRouteRank !== null ? "Ranked route" : "Step 3";
  el.selectedHeading.textContent =
    state.selectedRouteRank !== null || !selected.rank
      ? selected.title
      : `${selected.title}: rank #${selected.rank} of ${selected.routeCount}`;
  el.selectedTotal.textContent = money(selected.route.total);
  el.selectedNarrative.innerHTML = `<strong>${selected.title}:</strong> ${selected.narrative}`;
  renderFlowGraph(selected);
  renderCostBars(selected.route);
  renderComparison(stories);
  renderRankedRoutes(routes);
  renderInsight(stories);
}

function init() {
  el.snapshotDate.textContent = PRICE_SNAPSHOT.date;
  setWorkloadInputs();
  renderPriceEditor();
  attachPriceEditorEvents();
  renderSources();

  ["rawTb", "computeHours", "outputTb"].forEach((key) => {
    el[key].addEventListener("input", () => {
      state.activeScenario = "custom";
      state.selectedRouteRank = null;
      state.selectedStory = "optimizer";
      document.querySelectorAll(".scenario").forEach((button) => button.classList.remove("active"));
      render();
    });
  });

  document.querySelectorAll(".scenario").forEach((button) => {
    button.addEventListener("click", () => setScenario(button.dataset.size));
  });

  [
    ["customRawSelect", "rawKey"],
    ["customComputeSelect", "computeKey"],
    ["customOutputSelect", "outputKey"]
  ].forEach(([id, key]) => {
    el[id].addEventListener("change", () => {
      state.customRoute[key] = el[id].value;
      state.selectedStory = "custom";
      state.selectedRouteRank = null;
      render();
    });
  });

  window.addEventListener("resize", () => {
    const graphIsNarrow = el.flowGraph.clientWidth > 0 && el.flowGraph.clientWidth < 560;
    if (graphIsNarrow !== state.graphWasNarrow) {
      render();
    }
  });

  render();
}

init();
