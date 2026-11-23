(() => {
  "use strict";

  const customFontFamilies = {
    "Arial": "Arial, sans-serif",
    "Georgia": '"Playfair Display", Georgia, serif',
    "Times New Roman": '"Libre Baskerville", "Times New Roman", serif',
    "Verdana": "Montserrat, Verdana, sans-serif",
    "Trebuchet MS": '"Trebuchet MS", sans-serif',
    "Courier New": '"Roboto Mono", "Courier New", monospace',
    "Impact": "Oswald, Impact, sans-serif",
    "Palatino Linotype": '"Cormorant Garamond", "Palatino Linotype", serif',
    "Garamond": '"EB Garamond", Garamond, serif',
    "Century Gothic": '"Montserrat Alternates", "Century Gothic", sans-serif',
    "Lucida Sans Unicode": "Quicksand, sans-serif",
    "Tahoma": '"Roboto Condensed", Tahoma, sans-serif',
    "Calibri": "Roboto, Calibri, sans-serif",
    "Brush Script MT": "Pacifico, cursive",
    "Comic Sans MS": '"Comic Neue", "Comic Sans MS", cursive'
  };

  const mockupPrintAreas = {
    copo: { width: "42%", height: "45%", top: "50%", left: "50%" },
    camiseta: { width: "88%", height: "78%", top: "52%", left: "50%" },
    ecobag: { width: "44%", height: "32%", top: "61%", left: "50%" },
    bone: { width: "38%", height: "18%", top: "52%", left: "50%" }
  };

  const svgArt = (label, color, shape) => {
    const shapes = {
      star: `<path d="M50 8l11 27 29 2-22 19 7 28-25-15-25 15 7-28-22-19 29-2z" fill="${color}"/>`,
      wave: `<path d="M10 56c18-28 35 28 53 0s27-3 27-3v24H10z" fill="${color}"/><circle cx="73" cy="29" r="13" fill="${color}" opacity=".45"/>`,
      flower: `<g fill="${color}"><circle cx="50" cy="25" r="18"/><circle cx="75" cy="50" r="18"/><circle cx="50" cy="75" r="18"/><circle cx="25" cy="50" r="18"/><circle cx="50" cy="50" r="14" fill="#171a25"/></g>`
    };
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>${label}</title>${shapes[shape]}</svg>`)}`;
  };

  const products = [
    { id: "copo", name: "Copo térmico", description: "473 ml · 8,5 × 16 cm", price: 79, type: "copo", mockup: "img/Mockups/copo_termico/copo_termico.png", allowsBack: false, physical: { width: 8.5, height: 16 }, print: { width: 6.5, height: 9 }, colors: ["#e9eef7", "#171a25", "#dc8d7b", "#80a69a"], sizes: ["Único"] },
    { id: "camiseta", name: "Camiseta premium", description: "Algodão · 50 × 70 cm", price: 69, type: "camiseta", mockups: { front: "img/Mockups/camiseta/camiseta_frente.png", back: "img/Mockups/camiseta/camiseta_costas.png" }, allowsBack: true, physical: { width: 50, height: 70 }, print: { width: 28, height: 35 }, colors: ["#f5f5f2", "#252936", "#c9d8ea", "#d99b8e"], sizes: ["P", "M", "G", "GG"] },
    { id: "ecobag", name: "Ecobag", description: "Lona resistente · 35 × 40 cm", price: 49, type: "ecobag", mockup: "img/Mockups/ecobag/ecobag.png", allowsBack: false, physical: { width: 35, height: 40 }, print: { width: 25, height: 28 }, colors: ["#e4d7c4", "#b9c5a7", "#1f252c", "#d9aaa7"], sizes: ["Único"] },
    { id: "bone", name: "Boné bordado", description: "Ajustável · 20 × 12 cm", price: 59, type: "bone", mockup: "img/Mockups/bone/bone.png", allowsBack: false, physical: { width: 20, height: 12 }, print: { width: 9, height: 4.5 }, colors: ["#c3d7dd", "#2e343d", "#c9b58e", "#b9a9c8"], sizes: ["Único"] }
  ];

  const artNumbers = [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43];
  const arts = artNumbers.map((number) => ({
    id: `art-${number}`,
    name: `Estampa ${number}`,
    url: `img/estampas/1 (${number}).png`
  }));

  const state = {
    product: null,
    color: null,
    size: null,
    cart: [],
    art: null,
    artsBySide: { front: null, back: null },
    side: "front",
    payment: null,
    step: "catalog",
    customer: null,
    order: null,
    successTimer: null,
    successAnimation: null,
    artWidthCm: 12,
    artWidthCmBySide: { front: 12, back: 12 },
    artSizeRatiosBySide: {
      front: { width: 0.85, height: 0.85 },
      back: { width: 0.85, height: 0.85 }
    },
    customNameRenderedSizesBySide: { front: 18, back: 18 },
    artListOpen: false,
    selection: {
      art: false,
      text: false
    },
    customName: "",
    customFont: "Arial",
    customNameRotation: 0,
    customNameSize: 18,
    customNamesBySide: { front: "", back: "" },
    customFontsBySide: { front: "Arial", back: "Arial" },
    customNameRotationsBySide: { front: 0, back: 0 },
    customNameSizesBySide: { front: 18, back: 18 },
    artRotations: { front: 0, back: 0 },
    artPositions: {
      front: { x: 0, y: 0 },
      back: { x: 0, y: 0 }
    },
    customNamePositions: {
      front: { x: 0, y: 0 },
      back: { x: 0, y: 0 }
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const artVisibleBoundsCache = new Map();

  function getArtVisibleBounds(art) {
    if (!art?.naturalWidth || !art?.naturalHeight) return null;
    const cached = artVisibleBoundsCache.get(art.currentSrc || art.src);
    if (cached) return cached;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = art.naturalWidth;
      canvas.height = art.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(art, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const columnCounts = new Array(canvas.width).fill(0);
      const rowCounts = new Array(canvas.height).fill(0);

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = pixels[(y * canvas.width + x) * 4 + 3];
          if (alpha > 128) columnCounts[x]++;
          if (alpha > 128) rowCounts[y]++;
        }
      }

      const minimumColumnPixels = Math.max(3, Math.round(canvas.height * 0.015));
      const minimumRowPixels = Math.max(3, Math.round(canvas.width * 0.015));
      const populatedColumns = columnCounts
        .map((count, index) => count >= minimumColumnPixels ? index : -1)
        .filter((index) => index >= 0);
      const populatedRows = rowCounts
        .map((count, index) => count >= minimumRowPixels ? index : -1)
        .filter((index) => index >= 0);

      if (!populatedColumns.length || !populatedRows.length) return null;
      const left = populatedColumns[0];
      const right = populatedColumns[populatedColumns.length - 1] + 1;
      const top = populatedRows[0];
      const bottom = populatedRows[populatedRows.length - 1] + 1;
      if (right < left || bottom < top) return null;
      const bounds = {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top
      };
      artVisibleBoundsCache.set(art.currentSrc || art.src, bounds);
      return bounds;
    } catch {
      return null;
    }
  }

  function getRenderedArtSelection(area, art, bounds) {
    if (!art || !area) return null;
    const rotation = state.artRotations[state.side] || 0;
    const visibleBounds = bounds || getArtVisibleBounds(art);
    const position = state.artPositions[state.side] || { x: 0, y: 0 };

    let width = art.offsetWidth;
    let height = art.offsetHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (visibleBounds && art.naturalWidth && art.naturalHeight) {
      width = visibleBounds.width / art.naturalWidth * art.offsetWidth;
      height = visibleBounds.height / art.naturalHeight * art.offsetHeight;
      const visibleCenterX = visibleBounds.left + visibleBounds.width / 2;
      const visibleCenterY = visibleBounds.top + visibleBounds.height / 2;
      const sourceOffsetX = (visibleCenterX - art.naturalWidth / 2) / art.naturalWidth * art.offsetWidth;
      const sourceOffsetY = (visibleCenterY - art.naturalHeight / 2) / art.naturalHeight * art.offsetHeight;
      const radians = rotation * Math.PI / 180;
      offsetX = sourceOffsetX * Math.cos(radians) - sourceOffsetY * Math.sin(radians);
      offsetY = sourceOffsetX * Math.sin(radians) + sourceOffsetY * Math.cos(radians);
    }

    return {
      width,
      height,
      offsetX,
      offsetY,
      centerX: area.offsetWidth / 2 + position.x + offsetX,
      centerY: area.offsetHeight / 2 + position.y + offsetY
    };
  }

  function setStep(step) {
    state.step = step;
    $$(".step").forEach((section) => section.classList.toggle("active", section.id === step));
    if (step === "cart") renderCartConfirmation();
    $$(".progress-step").forEach((item) => {
      const steps = ["catalog", "editor", "cart", "customer", "checkout"];
      const index = steps.indexOf(item.dataset.stepNav);
      const current = steps.indexOf(step);
      item.classList.toggle("active", index === current);
      item.classList.toggle("done", index < current);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;
    grid.innerHTML = products.map((product) => `
      <button class="product-card" type="button" data-product="${product.id}">
        <div class="product-art"><img class="product-card-model" src="${product.mockup || product.mockups.front}" alt="${product.name}"></div>
        <strong>${product.name}</strong>
        <small>${product.description}</small>
        <span class="price">a partir de ${money(product.price)}</span>
      </button>
    `).join("");
    grid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-product]");
      if (!card) return;
      selectProduct(card.dataset.product);
    });
  }

  function selectProduct(id) {
    state.product = products.find((item) => item.id === id);
    state.color = state.product.colors[0];
    state.size = state.product.sizes.length === 1 ? state.product.sizes[0] : null;
    state.art = null;
    state.artsBySide.front = null;
    state.artsBySide.back = null;
    state.artListOpen = false;
    state.selection.art = false;
    state.selection.text = false;
    state.customName = "";
    state.customFont = "Arial";
    state.customNameRotation = 0;
    state.customNameSize = 18;
    state.customNamesBySide.front = "";
    state.customNamesBySide.back = "";
    state.customFontsBySide.front = "Arial";
    state.customFontsBySide.back = "Arial";
    state.customNameRotationsBySide.front = 0;
    state.customNameRotationsBySide.back = 0;
    state.customNameSizesBySide.front = 18;
    state.customNameSizesBySide.back = 18;
    state.customNameRenderedSizesBySide.front = 18;
    state.customNameRenderedSizesBySide.back = 18;
    state.artRotations.front = 0;
    state.artRotations.back = 0;
    state.artWidthCm = Math.min(state.product.print.width * 0.85, state.product.print.height * 0.85);
    state.artWidthCmBySide.front = state.artWidthCm;
    state.artWidthCmBySide.back = state.artWidthCm;
    state.artSizeRatiosBySide.front = { width: 0.85, height: 0.85 };
    state.artSizeRatiosBySide.back = { width: 0.85, height: 0.85 };
    state.artPositions.front = { x: 0, y: 0 };
    state.artPositions.back = { x: 0, y: 0 };
    state.customNamePositions.front = { x: 0, y: 0 };
    state.customNamePositions.back = { x: 0, y: 0 };
    state.artRotations.front = 0;
    state.artRotations.back = 0;
    state.side = "front";
    $$(".side-button").forEach((button) => button.classList.toggle("active", button.dataset.side === "front"));
    $$(".product-card").forEach((card) => card.classList.toggle("selected", card.dataset.product === id));
    renderEditor();
    setTimeout(() => setStep("editor"), 120);
  }

  function renderEditor() {
    const product = state.product;
    if (!product) return;
    state.customName = state.customNamesBySide[state.side] || "";
    state.customFont = state.customFontsBySide[state.side] || "Arial";
    state.customNameRotation = state.customNameRotationsBySide[state.side] || 0;
    state.customNameSize = state.customNameSizesBySide[state.side] || 18;
    $("#mockupProduct").className = `mockup-product ${product.type}`;
    $("#mockupProduct").style.setProperty("--product-color", state.color);
    const mockupUrl = product.mockups ? product.mockups[state.side] : product.mockup;
    $("#mockupImage").src = mockupUrl;
    state.art = state.artsBySide[state.side] || null;
    state.artWidthCm = state.artWidthCmBySide[state.side] || 12;
    const mockupArt = $("#mockupArt");
    mockupArt.hidden = !state.art;
    mockupArt.style.display = state.art ? "" : "none";
    if (state.art) {
      mockupArt.src = state.art.url;
      mockupArt.onload = applyArtPosition;
    }
    requestAnimationFrame(applyArtPosition);
    const areaStyle = mockupPrintAreas[product.type] || mockupPrintAreas.camiseta;
    const printArea = $(".mockup-print-area");
    Object.entries(areaStyle).forEach(([property, value]) => printArea.style[property] = value);
    $$(".side-button").forEach((button) => {
      button.hidden = !product.allowsBack;
      button.classList.toggle("active", button.dataset.side === state.side);
    });
    $("#colorOptions").innerHTML = product.colors.map((color) =>
      `<button type="button" class="color-button${color === state.color ? " active" : ""}" style="--color:${color}" data-color="${color}" aria-label="Selecionar cor"></button>`
    ).join("");
    $("#sizeOptions").innerHTML = product.sizes.map((size) =>
      `<button type="button" class="size-button${size === state.size ? " active" : ""}" data-size="${size}">${size}</button>`
    ).join("");
    const sizeError = $("#sizeError");
    if (sizeError) sizeError.hidden = !!state.size || product.sizes.length === 1;
    $("#artOptions").innerHTML = `<button type="button" class="remove-art-button${!state.art ? " active" : ""}" data-remove-art="true" aria-label="Remover estampa">Sem estampa</button>` + arts.map((art) =>
      `<button type="button" class="art-button${state.art && art.id === state.art.id ? " active" : ""}" data-art="${art.id}" aria-label="${art.name}"><img src="${art.url}" alt=""></button>`
    ).join("");
    const artToggle = $("#artListToggle");
    const artPanel = $("#artListPanel");
    const customNameInput = $("#customProductName");
    if (customNameInput && document.activeElement !== customNameInput) {
      customNameInput.value = state.customName;
    }
    const customFontSelect = $("#customFont");
    if (customFontSelect) customFontSelect.value = state.customFont;
    const rotationInput = $("#customNameRotation");
    const rotationOutput = $("#customNameRotationValue");
    if (rotationInput) rotationInput.value = String(state.customNameRotation);
    if (rotationOutput) rotationOutput.value = `${state.customNameRotation}°`;
    const sizeInput = $("#customNameSize");
    const sizeOutput = $("#customNameSizeValue");
    if (sizeInput) sizeInput.value = String(state.customNameSize);
    if (sizeOutput) sizeOutput.value = `${state.customNameSize} px`;
    updateCustomNamePreview();
    if (artToggle && artPanel) {
      artToggle.setAttribute("aria-expanded", String(state.artListOpen));
      artPanel.hidden = !state.artListOpen;
      artToggle.querySelector("span:nth-child(2)").textContent = state.art
        ? `Estampa: ${state.art.name}`
        : "Estampa: nenhuma";
    }
    const artSideTitle = $("#artSideTitle");
    if (artSideTitle) {
      artSideTitle.textContent = `Estampas - ${state.side === "front" ? "Frente" : "Costas"}`;
    }
    requestAnimationFrame(applyArtPosition);
  }

  function getMaxArtWidthCm(product, artAspect) {
    if (!product?.print) return 1;
    return Math.min(product.print.width, product.print.height / Math.max(0.1, artAspect));
  }

  function updateCustomNamePreview() {
    const name = $("#mockupCustomName");
    if (!name) return;
    name.textContent = state.customName.trim();
    name.hidden = !state.customName.trim();
    name.style.fontFamily = customFontFamilies[state.customFont] || `"${state.customFont}", sans-serif`;
    name.style.fontSize = `${state.customNameSize}px`;
    name.style.transformOrigin = "center center";
    state.customNameRenderedSizesBySide[state.side] = state.customNameSize;
    requestAnimationFrame(syncDesignSelections);
  }

  function applyArtPosition() {
    const area = $(".mockup-print-area");
    const art = $("#mockupArt");
    if (!area || !art) return;
    const product = state.product;
    if (!product) return;
    if (!state.art) {
      art.style.display = "none";
      updateCustomNamePreview();
      const customName = $("#mockupCustomName");
      if (customName) {
        const namePosition = state.customNamePositions[state.side];
        customName.style.transform =
          `translate(-50%, -50%) translate(${namePosition.x}px, ${namePosition.y}px) rotate(${state.customNameRotationsBySide[state.side]}deg)`;
      }
      return;
    }

    const artAspect = art.naturalWidth && art.naturalHeight ? art.naturalHeight / art.naturalWidth : 1;
    const maxWidthCm = getMaxArtWidthCm(product, artAspect);
    state.artWidthCm = Math.max(1, state.artWidthCm);
    state.artWidthCmBySide[state.side] = state.artWidthCm;
    const slider = $("#artScale");
    if (slider) {
      slider.max = "200";
      slider.value = String(state.artWidthCm);
      $("#artScaleValue").value = `${state.artWidthCm.toFixed(1).replace(".0", "")} cm`;
    }
    let widthCm = state.artWidthCm;
    let heightCm = widthCm * artAspect;
    const widthPx = area.offsetWidth * (widthCm / product.print.width);
    const heightPx = area.offsetHeight * (heightCm / product.print.height);
    art.style.width = `${widthPx}px`;
    art.style.height = `${heightPx}px`;
    state.artSizeRatiosBySide[state.side] = {
      width: widthPx / area.offsetWidth,
      height: heightPx / area.offsetHeight
    };

    const position = state.artPositions[state.side];
    art.style.left = "50%";
    art.style.top = "50%";
    art.style.transform =
      `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) rotate(${state.artRotations[state.side]}deg)`;
    const customName = $("#mockupCustomName");
    if (customName) {
      const namePosition = state.customNamePositions[state.side];
      customName.style.transform =
        `translate(-50%, -50%) translate(${namePosition.x}px, ${namePosition.y}px) rotate(${state.customNameRotationsBySide[state.side]}deg)`;
    }
    syncDesignSelections();
  }

  function syncDesignSelections() {
    const area = $(".mockup-print-area");
    const art = $("#mockupArt");
    const artSelection = $("#artSelection");
    const customName = $("#mockupCustomName");
    const textSelection = $("#textSelection");
    if (!area || !artSelection || !textSelection) return;

    const artPosition = state.artPositions[state.side];
    artSelection.hidden = !state.art || !state.selection.art;
    if (state.art && art.offsetWidth > 0) {
      const selectionMetrics = getRenderedArtSelection(area, art);
      artSelection.style.width = `${selectionMetrics.width}px`;
      artSelection.style.height = `${selectionMetrics.height}px`;
      artSelection.style.border = "0";
      artSelection.style.outline = "1px solid #4876d9";
      artSelection.style.outlineOffset = "-1px";
      artSelection.style.transform =
        `translate(-50%, -50%) translate(${artPosition.x + selectionMetrics.offsetX}px, ${artPosition.y + selectionMetrics.offsetY}px) rotate(${state.artRotations[state.side]}deg)`;
    }

    const namePosition = state.customNamePositions[state.side];
    textSelection.hidden = !state.customName.trim() || !state.selection.text;
    if (customName && state.customName.trim()) {
      textSelection.style.width = `${customName.offsetWidth + 8}px`;
      textSelection.style.height = `${customName.offsetHeight + 8}px`;
      textSelection.style.transform =
        `translate(-50%, -50%) translate(${namePosition.x}px, ${namePosition.y}px) rotate(${state.customNameRotationsBySide[state.side]}deg)`;
    }
  }

  function setupDesignHandles() {
    const area = $(".mockup-print-area");
    if (!area) return;

    area.addEventListener("pointerdown", (event) => {
      const resizeHandle = event.target.closest(".resize-handle");
      const rotateHandle = event.target.closest(".rotation-handle");
      if (!resizeHandle && !rotateHandle) return;
      event.preventDefault();
      event.stopPropagation();

      const artHandle = resizeHandle?.closest("#artSelection") || rotateHandle?.closest("#artSelection");
      const textHandle = resizeHandle?.closest("#textSelection") || rotateHandle?.closest("#textSelection");
      const selection = artHandle || textHandle;
      if (!selection) return;
      selection.setPointerCapture?.(event.pointerId);

      const areaRect = area.getBoundingClientRect();
      const position = artHandle
        ? state.artPositions[state.side]
        : state.customNamePositions[state.side];
      const scaleX = areaRect.width / Math.max(1, area.offsetWidth);
      const scaleY = areaRect.height / Math.max(1, area.offsetHeight);
      let selectionOffsetX = 0;
      let selectionOffsetY = 0;
      if (artHandle) {
        const selectionMetrics = getRenderedArtSelection(area, $("#mockupArt"));
        if (selectionMetrics) {
          selectionOffsetX = selectionMetrics.offsetX;
          selectionOffsetY = selectionMetrics.offsetY;
        }
      }
      const centerX = areaRect.left + areaRect.width / 2 + (position.x + selectionOffsetX) * scaleX;
      const centerY = areaRect.top + areaRect.height / 2 + (position.y + selectionOffsetY) * scaleY;

      if (rotateHandle) {
        const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
        const startRotation = artHandle ? state.artRotations[state.side] : state.customNameRotationsBySide[state.side];
        selection.dataset.rotateDragging = "true";

        const rotate = (moveEvent) => {
          const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI;
          let degrees = Math.round(startRotation + angle - startAngle);
          degrees = (degrees + 360) % 360;
          if (artHandle) {
            state.artRotations[state.side] = degrees;
          } else {
            state.customNameRotation = degrees;
            state.customNameRotationsBySide[state.side] = degrees;
          }
          applyArtPosition();
          updateCustomNamePreview();
        };
        const stopRotation = () => {
          selection.dataset.rotateDragging = "false";
          selection.removeEventListener("pointermove", rotate);
          selection.removeEventListener("pointerup", stopRotation);
          selection.removeEventListener("pointercancel", stopRotation);
        };
        selection.addEventListener("pointermove", rotate);
        selection.addEventListener("pointerup", stopRotation);
        selection.addEventListener("pointercancel", stopRotation);
        return;
      }

      const startDistance = Math.max(1, Math.hypot(event.clientX - centerX, event.clientY - centerY));
      const startArtWidth = state.artWidthCm;
      const startFontSize = state.customNameSizesBySide[state.side];
      selection.dataset.resizeDragging = "true";

      const resize = (moveEvent) => {
        const distance = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
        const scale = distance / startDistance;
        if (artHandle && state.product) {
          state.artWidthCm = Math.min(200, Math.max(1, startArtWidth * scale));
          state.artWidthCmBySide[state.side] = state.artWidthCm;
        } else {
          state.customNameSize = Math.min(200, Math.max(4, Math.round(startFontSize * scale)));
          state.customNameSizesBySide[state.side] = state.customNameSize;
        }
        updateCustomNamePreview();
        applyArtPosition();
      };
      const stopResize = () => {
        selection.dataset.resizeDragging = "false";
        selection.removeEventListener("pointermove", resize);
        selection.removeEventListener("pointerup", stopResize);
        selection.removeEventListener("pointercancel", stopResize);
      };
      selection.addEventListener("pointermove", resize);
      selection.addEventListener("pointerup", stopResize);
      selection.addEventListener("pointercancel", stopResize);
    });
  }

  function setupArtDrag() {
    const area = $(".mockup-print-area");
    const art = $("#mockupArt");
    const selection = $("#artSelection");
    if (!area || !art || !selection) return;

    const startDrag = (event) => {
      if (event.target.closest(".resize-handle, .rotation-handle")) return;
      event.preventDefault();
      state.selection.art = true;
      state.selection.text = false;
      art.setPointerCapture(event.pointerId);
      art.classList.add("dragging");
      art.dataset.dragging = "true";
      art.dataset.lastX = String(event.clientX);
      art.dataset.lastY = String(event.clientY);
      syncDesignSelections();
    };

    art.addEventListener("pointerdown", startDrag);
    selection.addEventListener("pointerdown", startDrag);

    const moveDrag = (event) => {
      if (art.dataset.dragging !== "true") return;
      const areaRect = area.getBoundingRect?.() || area.getBoundingClientRect();
      const correctionX = area.offsetWidth / areaRect.width;
      const correctionY = area.offsetHeight / areaRect.height;
      const deltaX = (event.clientX - Number(art.dataset.lastX)) * correctionX;
      const deltaY = (event.clientY - Number(art.dataset.lastY)) * correctionY;
      const position = state.artPositions[state.side];
      position.x += deltaX;
      position.y += deltaY;
      art.dataset.lastX = String(event.clientX);
      art.dataset.lastY = String(event.clientY);
      art.style.transform =
        `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) rotate(${state.artRotations[state.side]}deg)`;
      syncDesignSelections();
    };

    art.addEventListener("pointermove", moveDrag);
    selection.addEventListener("pointermove", moveDrag);

    const stopDrag = (event) => {
      if (!art.dataset.dragging) return;
      art.dataset.dragging = "false";
      art.classList.remove("dragging");
      if (art.hasPointerCapture?.(event.pointerId)) art.releasePointerCapture(event.pointerId);
    };
    art.addEventListener("pointerup", stopDrag);
    art.addEventListener("pointercancel", stopDrag);
  }

  function setupCustomNameDrag() {
    const area = $(".mockup-print-area");
    const customName = $("#mockupCustomName");
    const selection = $("#textSelection");
    if (!area || !customName || !selection) return;

    const startDrag = (event) => {
      if (event.target.closest(".resize-handle, .rotation-handle")) return;
      if (!state.customName.trim()) return;
      event.preventDefault();
      state.selection.text = true;
      state.selection.art = false;
      const dragTarget = event.currentTarget;
      dragTarget.setPointerCapture?.(event.pointerId);
      customName.classList.add("dragging");
      customName.dataset.dragging = "true";
      customName.dataset.lastX = String(event.clientX);
      customName.dataset.lastY = String(event.clientY);
      syncDesignSelections();
    };

    customName.addEventListener("pointerdown", startDrag);
    selection.addEventListener("pointerdown", startDrag);

    const moveDrag = (event) => {
      if (customName.dataset.dragging !== "true") return;
      event.preventDefault();
      const areaRect = area.getBoundingClientRect();
      const correctionX = area.offsetWidth / areaRect.width;
      const correctionY = area.offsetHeight / areaRect.height;
      const deltaX = (event.clientX - Number(customName.dataset.lastX)) * correctionX;
      const deltaY = (event.clientY - Number(customName.dataset.lastY)) * correctionY;
      const position = state.customNamePositions[state.side];
      position.x += deltaX;
      position.y += deltaY;
      customName.dataset.lastX = String(event.clientX);
      customName.dataset.lastY = String(event.clientY);
      customName.style.transform =
        `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) rotate(${state.customNameRotationsBySide[state.side]}deg)`;
      syncDesignSelections();
    };

    customName.addEventListener("pointermove", moveDrag);
    selection.addEventListener("pointermove", moveDrag);

    const stopDrag = (event) => {
      if (customName.dataset.dragging !== "true") return;
      customName.dataset.dragging = "false";
      customName.classList.remove("dragging");
      if (customName.hasPointerCapture?.(event.pointerId)) customName.releasePointerCapture(event.pointerId);
      if (selection.hasPointerCapture?.(event.pointerId)) selection.releasePointerCapture(event.pointerId);
    };
    customName.addEventListener("pointerup", stopDrag);
    customName.addEventListener("pointercancel", stopDrag);
    selection.addEventListener("pointerup", stopDrag);
    selection.addEventListener("pointercancel", stopDrag);
  }

  function bindEditor() {
    $("#artListToggle")?.addEventListener("click", () => {
      state.artListOpen = !state.artListOpen;
      const toggle = $("#artListToggle");
      const panel = $("#artListPanel");
      toggle?.setAttribute("aria-expanded", String(state.artListOpen));
      if (panel) panel.hidden = !state.artListOpen;
    });
    document.querySelector("[data-close-art-list]")?.addEventListener("click", () => {
      state.artListOpen = false;
      $("#artListToggle")?.setAttribute("aria-expanded", "false");
      $("#artListPanel").hidden = true;
    });
    $("#customProductName")?.addEventListener("input", (event) => {
      state.customName = event.currentTarget.value.trimStart().slice(0, 24);
      state.customNamesBySide[state.side] = state.customName;
      event.currentTarget.value = state.customName;
      state.selection.text = !!state.customName;
      state.selection.art = false;
      updateCustomNamePreview();
      applyArtPosition();
    });
    $("#customFont")?.addEventListener("change", (event) => {
      state.customFont = event.currentTarget.value;
      state.customFontsBySide[state.side] = state.customFont;
      updateCustomNamePreview();
      applyArtPosition();
    });
    $("#resetCustomNamePosition")?.addEventListener("click", () => {
      state.customNamePositions[state.side] = { x: 0, y: 0 };
      applyArtPosition();
    });
    $("#colorOptions")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-color]");
      if (!button) return;
      state.color = button.dataset.color;
      renderEditor();
    });
    $("#sizeOptions")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-size]");
      if (!button) return;
      state.size = button.dataset.size;
      $("#sizeError").hidden = true;
      renderEditor();
    });
    $("#artOptions")?.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-art]");
      if (removeButton) {
        state.art = null;
        state.artsBySide[state.side] = null;
        state.selection.art = false;
        state.artListOpen = false;
        renderEditor();
        return;
      }
      const button = event.target.closest("[data-art]");
      if (!button) return;
      state.art = arts.find((art) => art.id === button.dataset.art);
      state.artsBySide[state.side] = state.art;
      state.selection.art = false;
      state.selection.text = false;
      state.artListOpen = false;
      renderEditor();
    });
    $$(".side-button").forEach((button) => button.addEventListener("click", () => {
      state.side = button.dataset.side;
      state.art = state.artsBySide[state.side] || null;
      state.artWidthCm = state.artWidthCmBySide[state.side] || 12;
      state.selection.art = false;
      state.selection.text = false;
      $$(".side-button").forEach((item) => item.classList.toggle("active", item === button));
      $("#mockupArt").style.opacity = state.side === "back" && !state.product.allowsBack ? ".35" : "1";
      $("#mockupImage").src = state.product.mockups?.[state.side] || state.product.mockup;
      renderEditor();
    }));

    $("#resetArtPosition")?.addEventListener("click", () => {
      state.artPositions[state.side] = { x: 0, y: 0 };
      const art = $("#mockupArt");
      const artAspect = art.naturalWidth && art.naturalHeight
        ? art.naturalHeight / art.naturalWidth
        : 1;
      const maxWidthCm = getMaxArtWidthCm(state.product, artAspect);
      state.artWidthCm = maxWidthCm * 0.85;
      state.artWidthCmBySide[state.side] = state.artWidthCm;
      applyArtPosition();
    });
  }

  function validateCustomer(form) {
    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const phone = String(data.get("phone")).replace(/\D/g, "");
    const email = String(data.get("email")).trim();
    if (name.length < 3) return "Informe seu nome completo.";
    if (phone.length < 10 || phone.length > 11) return "Informe um WhatsApp válido com DDD.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido.";
    return null;
  }

  function snapshotCurrentItem() {
    if (!state.product) return null;
    const editorArea = $(".mockup-print-area");
    const editorAreaWidth = editorArea?.offsetWidth || 1;
    const editorAreaHeight = editorArea?.offsetHeight || 1;
    const renderedName = $("#mockupCustomName");
    const renderedNameSize = renderedName?.textContent
      ? parseFloat(getComputedStyle(renderedName).fontSize) || state.customNameSizesBySide[state.side]
      : state.customNameSizesBySide[state.side];
    const normalizePosition = (position) => ({
      x: Number((position.x / editorAreaWidth).toFixed(6)),
      y: Number((position.y / editorAreaHeight).toFixed(6))
    });
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      product: {
        id: state.product.id,
        name: state.product.name,
        type: state.product.type,
        price: state.product.price,
        physical: state.product.physical,
        print: state.product.print,
        mockup: state.product.mockup || null,
        mockups: state.product.mockups ? { ...state.product.mockups } : null
      },
      color: state.color,
      size: state.size,
      artsBySide: {
        front: state.artsBySide.front ? { ...state.artsBySide.front } : null,
        back: state.artsBySide.back ? { ...state.artsBySide.back } : null
      },
      artPositions: {
        front: { ...state.artPositions.front },
        back: { ...state.artPositions.back }
      },
      customNamePositions: {
        front: { ...state.customNamePositions.front },
        back: { ...state.customNamePositions.back }
      },
      artRotations: { ...state.artRotations },
      artWidthCmBySide: { ...state.artWidthCmBySide },
      artSizeRatiosBySide: {
        front: { ...(state.artSizeRatiosBySide.front || { width: 0.85, height: 0.85 }) },
        back: { ...(state.artSizeRatiosBySide.back || { width: 0.85, height: 0.85 }) }
      },
      editorAreaSize: { width: editorAreaWidth, height: editorAreaHeight },
      artPositionsNormalized: {
        front: normalizePosition(state.artPositions.front),
        back: normalizePosition(state.artPositions.back)
      },
      customNamePositionsNormalized: {
        front: normalizePosition(state.customNamePositions.front),
        back: normalizePosition(state.customNamePositions.back)
      },
      customNameRenderedSizesBySide: {
        front: state.side === "front" ? renderedNameSize : state.customNameRenderedSizesBySide.front,
        back: state.side === "back" ? renderedNameSize : state.customNameRenderedSizesBySide.back
      },
      customNamesBySide: { ...state.customNamesBySide },
      customFontsBySide: { ...state.customFontsBySide },
      customNameSizesBySide: { ...state.customNameSizesBySide },
      customNameRotationsBySide: { ...state.customNameRotationsBySide }
    };
  }

  function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + item.product.price, 0);
  }

  function renderCart() {
    const count = $("#cartCount");
    const items = $("#cartItems");
    const total = $("#cartTotal");
    const finish = $("#finishCart");
    if (count) count.textContent = String(state.cart.length);
    if (total) total.textContent = money(getCartTotal());
    if (finish) finish.disabled = state.cart.length === 0;
    if (!items) return;
    items.innerHTML = state.cart.length ? state.cart.map((item, index) => {
      const art = item.artsBySide.front?.name || item.artsBySide.back?.name || "Sem estampa";
      return `<div class="cart-item">
        <div class="cart-item-thumb">${item.product.type === "camiseta" ? "👕" : item.product.type === "copo" ? "🥤" : item.product.type === "ecobag" ? "🛍️" : "🧢"}</div>
        <div><strong>${item.product.name}</strong><small>${item.size} · ${item.color}</small><small>${art}</small></div>
        <button class="cart-remove" type="button" data-remove-cart="${index}" aria-label="Remover item">×</button>
      </div>`;
    }).join("") : `<p class="cart-empty">Seu carrinho está vazio.</p>`;
  }

  function renderCartConfirmation() {
    const container = $("#cartConfirmItems");
    if (!container) return;
    $("#cartConfirmCount").textContent = String(state.cart.length);
    $("#cartConfirmTotal").textContent = money(getCartTotal());
    $("#confirmCartItems").disabled = state.cart.length === 0;

    if (!state.cart.length) {
      container.innerHTML = `<div class="cart-empty-confirmation"><h2>Seu carrinho está vazio</h2><p>Volte ao catálogo e personalize um produto.</p></div>`;
      return;
    }

    container.innerHTML = state.cart.map((item, index) => {
      const frontName = item.customNamesBySide?.front || "";
      const backName = item.customNamesBySide?.back || "";
      const preview = (side, name) => {
        const mockup = item.product.mockups?.[side] || item.product.mockup || "";
        const art = item.artsBySide[side];
        const mappedArea = mockupPrintAreas[item.product.type] || mockupPrintAreas.camiseta;
        const area = {
          width: parseFloat(mappedArea.width),
          height: parseFloat(mappedArea.height),
          top: parseFloat(mappedArea.top),
          left: parseFloat(mappedArea.left)
        };
        const artPosition = item.artPositionsNormalized?.[side] || { x: 0, y: 0 };
        const namePosition = item.customNamePositionsNormalized?.[side] || { x: 0, y: 0 };
        const editorArea = item.editorAreaSize || { width: 1, height: 1 };
        const artSize = item.artSizeRatiosBySide?.[side] || { width: 0.85, height: 0.85 };
        const artWidthPercent = Math.max(0.5, artSize.width * 100);
        const artHeightPercent = Math.max(0.5, artSize.height * 100);
        const artRotation = item.artRotations?.[side] || 0;
        const nameRotation = item.customNameRotationsBySide?.[side] || 0;
        const nameFont = item.customFontsBySide?.[side] || "Arial";
        const nameSize = item.customNameRenderedSizesBySide?.[side] || item.customNameSizesBySide?.[side] || 18;
        return `<div class="cart-confirm-preview">
          <span class="cart-confirm-preview-label">${side === "front" ? "Frente" : "Costas"}</span>
          <div class="cart-confirm-mockup-wrap">
            ${mockup ? `<img class="cart-confirm-mockup" src="${mockup}" alt="">` : ""}
            <div class="cart-confirm-print-area cart-confirm-print-area-${item.product.type}" style="left:${area.left}%;top:${area.top}%;width:${area.width}%;height:${area.height}%">
              ${art ? `<img class="cart-confirm-art" src="${art.url}" alt="${art.name}" style="width:${artWidthPercent}%;height:${artHeightPercent}%;left:calc(50% + ${artPosition.x * 100}%);top:calc(50% + ${artPosition.y * 100}%);transform:translate(-50%,-50%) rotate(${artRotation}deg)">` : ""}
              ${name ? `<span class="cart-confirm-name" data-editor-height="${editorArea.height}" data-name-size="${nameSize}" data-font-name="${nameFont.replace(/"/g, "&quot;")}" style="left:calc(50% + ${namePosition.x * 100}%);top:calc(50% + ${namePosition.y * 100}%);transform:translate(-50%,-50%) rotate(${nameRotation}deg)">${name.replace(/[<>&"]/g, "")}</span>` : ""}
            </div>
          </div>
        </div>`;
      };
      const frontArt = item.artsBySide.front?.name || "Nenhuma";
      const backArt = item.artsBySide.back?.name || "Nenhuma";
      return `<article class="cart-confirm-card">
        <div class="cart-confirm-previews">
          ${preview("front", frontName)}
          ${item.product.mockups ? preview("back", backName) : ""}
        </div>
        <div class="cart-confirm-info">
          <h3>${item.product.name}</h3>
          <dl>
            <div><dt>Cor</dt><dd>${item.color}</dd></div>
            <div><dt>Tamanho</dt><dd>${item.size}</dd></div>
            <div><dt>Frente</dt><dd>${frontArt}${frontName ? ` · Texto: ${frontName}` : ""}</dd></div>
            <div><dt>Costas</dt><dd>${backArt}${backName ? ` · Texto: ${backName}` : ""}</dd></div>
          </dl>
          <button class="cart-confirm-remove" type="button" data-remove-confirm-cart="${index}">Remover item</button>
        </div>
      </article>`;
    }).join("");
    requestAnimationFrame(() => {
      $$(".cart-confirm-name", container).forEach((nameElement) => {
        const printArea = nameElement.closest(".cart-confirm-print-area");
        if (!printArea || !printArea.offsetHeight) return;
        const editorHeight = Number(nameElement.dataset.editorHeight) || 1;
        const nameSize = Number(nameElement.dataset.nameSize) || 18;
        nameElement.style.fontSize = `${Math.max(1, nameSize * printArea.offsetHeight / editorHeight)}px`;
        const fontName = nameElement.dataset.fontName || "Arial";
        nameElement.style.fontFamily = customFontFamilies[fontName] || `"${fontName}", sans-serif`;
        nameElement.style.fontWeight = "700";
        nameElement.style.lineHeight = "1";
        nameElement.style.textShadow = "0 1px 2px rgba(255,255,255,.7)";
      });
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          $$(".cart-confirm-name", container).forEach((nameElement) => {
            nameElement.style.fontFamily = customFontFamilies[nameElement.dataset.fontName || "Arial"] || "Arial, sans-serif";
          });
        });
      }
    });
  }

  function updateSummary() {
    const items = state.cart.length ? state.cart : [{
      product: state.product,
      color: state.color,
      size: state.size,
      artsBySide: state.artsBySide
    }];
    if (!items[0]?.product) return;
    const total = items.reduce((sum, item) => sum + item.product.price, 0);
    $("#summaryProduct").textContent = items.length === 1 ? items[0].product.name : `${items.length} produtos personalizados`;
    $("#summaryVariation").textContent = items.length === 1
      ? `${items[0].size} · ${items[0].artsBySide.front?.name || items[0].artsBySide.back?.name || "Sem estampa"}`
      : items.map((item) => `${item.product.name} · ${item.size}`).join(" | ");
    $("#summaryBase").textContent = money(total);
    $("#summaryExtra").textContent = money(0);
    $("#summaryTotal").textContent = money(total);
    $("#summaryThumb").style.setProperty("--product-color", items[0].color);
  }

  function bindCustomer() {
    $("#customerForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = validateCustomer(event.currentTarget);
      $("#customerError").textContent = error || "";
      if (error) return;
      const data = new FormData(event.currentTarget);
      state.customer = {
        name: String(data.get("name")).trim(),
        phone: String(data.get("phone")).replace(/\D/g, ""),
        email: String(data.get("email")).trim()
      };
      sessionStorage.setItem("customerDraft", JSON.stringify(state.customer));
      updateSummary();
      setStep("checkout");
    });
  }

  function bindPayment() {
    $$("#paymentOptions .payment-option").forEach((button) => button.addEventListener("click", () => {
      state.payment = button.dataset.payment;
      $$("#paymentOptions .payment-option").forEach((item) => item.classList.toggle("active", item === button));
      $("#confirmOrder").disabled = false;
    }));
  }

  async function createOrder() {
    const now = new Date();
    const sequence = Number(localStorage.getItem("orderSequence") || 1041) + 1;
    localStorage.setItem("orderSequence", String(sequence));
    const payment = state.payment;
    const cartItems = state.cart.length ? state.cart : [{
      id: "current",
      product: {
        id: state.product.id,
        name: state.product.name,
        type: state.product.type,
        price: state.product.price,
        physical: state.product.physical,
        print: state.product.print
      },
      color: state.color,
      size: state.size,
      artsBySide: state.artsBySide,
      customNamesBySide: state.customNamesBySide,
      customFontsBySide: state.customFontsBySide,
      customNameSizesBySide: state.customNameSizesBySide,
      customNameRotationsBySide: state.customNameRotationsBySide,
      customNamePositions: state.customNamePositions,
      artPositions: state.artPositions,
      artRotations: state.artRotations,
      artWidthCmBySide: state.artWidthCmBySide
    }];
    const area = $(".mockup-print-area");
    const artImage = $("#mockupArt");
    const artAspect = state.art && artImage?.naturalWidth && artImage?.naturalHeight
      ? artImage.naturalHeight / artImage.naturalWidth
      : 1;
    let artWidthCm = state.art ? Math.min(state.artWidthCm, state.product.print.width) : 0;
    let artHeightCm = artWidthCm * artAspect;
    const maxArtWidthCm = getMaxArtWidthCm(state.product, artAspect);
    artWidthCm = Math.min(artWidthCm, maxArtWidthCm);
    artHeightCm = artWidthCm * artAspect;
    if (artHeightCm > state.product.print.height) {
      artHeightCm = state.product.print.height;
      artWidthCm = artHeightCm / artAspect;
    }
    const positionToCm = (position) => ({
      x_cm: Number((position.x / Math.max(1, area?.offsetWidth || 1) * state.product.print.width).toFixed(2)),
      y_cm: Number((position.y / Math.max(1, area?.offsetHeight || 1) * state.product.print.height).toFixed(2))
    });
    const order = {
      id: `${now.getTime()}-${sequence}`,
      numero_pedido: `FEIRA-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${String(sequence).padStart(4, "0")}`,
      cliente_nome: state.customer.name,
      cliente_telefone: state.customer.phone,
      cliente_email: state.customer.email,
      produto_id: state.product.id,
      variacao_id: `${state.product.id}-${state.color}-${state.size}`,
      nome_personalizado: state.customName || null,
      fonte_nome_personalizado: state.customName ? state.customFont : null,
      tamanho_fonte_nome_px: state.customName ? state.customNameSize : null,
      orientacao_nome_graus: state.customName ? state.customNameRotation : null,
      nomes_por_lado: {
        frente: state.customNamesBySide.front || null,
        costas: state.customNamesBySide.back || null
      },
      fontes_por_lado: {
        frente: state.customNamesBySide.front ? state.customFontsBySide.front : null,
        costas: state.customNamesBySide.back ? state.customFontsBySide.back : null
      },
      tamanhos_fonte_por_lado_px: {
        frente: state.customNamesBySide.front ? state.customNameSizesBySide.front : null,
        costas: state.customNamesBySide.back ? state.customNameSizesBySide.back : null
      },
      orientacoes_nome_por_lado_graus: {
        frente: state.customNamesBySide.front ? state.customNameRotationsBySide.front : null,
        costas: state.customNamesBySide.back ? state.customNameRotationsBySide.back : null
      },
      estampa_frente_id: state.artsBySide.front?.id || null,
      estampa_costas_id: state.artsBySide.back?.id || null,
      estampas_por_lado: {
        frente: state.artsBySide.front?.id || null,
        costas: state.artsBySide.back?.id || null
      },
      orientacao_estampa_graus: {
        frente: state.artsBySide.front ? state.artRotations.front : null,
        costas: state.artsBySide.back ? state.artRotations.back : null
      },
      estampa_posicao: {
        frente: positionToCm(state.artPositions.front),
        costas: positionToCm(state.artPositions.back),
        nome_texto: {
          frente: positionToCm(state.customNamePositions.front),
          costas: positionToCm(state.customNamePositions.back)
        },
        largura_cm: state.art ? Number(artWidthCm.toFixed(2)) : null,
        altura_cm: state.art ? Number(artHeightCm.toFixed(2)) : null,
        largura_por_lado_cm: {
          frente: state.artsBySide.front ? Number(state.artWidthCmBySide.front.toFixed(2)) : null,
          costas: state.artsBySide.back ? Number(state.artWidthCmBySide.back.toFixed(2)) : null
        },
        unidade: "cm",
        produto_dimensoes_cm: state.product.physical,
        area_estampa_cm: state.product.print
      },
      itens: cartItems.map((item) => ({
        produto_id: item.product.id,
        produto_nome: item.product.name,
        cor: item.color,
        tamanho: item.size,
        estampa_frente_id: item.artsBySide.front?.id || null,
        estampa_costas_id: item.artsBySide.back?.id || null,
        nomes_por_lado: {
          frente: item.customNamesBySide?.front || null,
          costas: item.customNamesBySide?.back || null
        },
        fontes_por_lado: {
          frente: item.customNamesBySide?.front ? item.customFontsBySide?.front : null,
          costas: item.customNamesBySide?.back ? item.customFontsBySide?.back : null
        },
        posicoes_nome_por_lado: item.customNamePositions || null,
        posicoes_estampa_por_lado: item.artPositions || null,
        orientacoes_nome_por_lado_graus: item.customNameRotationsBySide || null,
        orientacoes_estampa_por_lado_graus: item.artRotations || null,
        larguras_estampa_por_lado_cm: item.artWidthCmBySide || null,
        valor: item.product.price
      })),
      quantidade_itens: cartItems.length,
      valor_total: cartItems.reduce((sum, item) => sum + item.product.price, 0),
      metodo_pagamento: payment,
      status_pagamento: payment === "PAGAR_NA_RETIRADA" ? "PENDENTE" : "PAID",
      status_producao: payment === "PAGAR_NA_RETIRADA" ? "AGUARDANDO_PAGAMENTO" : "EM_FILA",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    const localOrders = JSON.parse(localStorage.getItem("studioOrders") || "[]");
    localOrders.unshift(order);
    localStorage.setItem("studioOrders", JSON.stringify(localOrders));
    return order;
  }

  function showSuccess(order) {
    state.order = order;
    $("#orderNumber").textContent = `#${order.numero_pedido.split("-").pop()}`;
    $("#successMessage").textContent = order.metodo_pagamento === "PAGAR_NA_RETIRADA"
      ? "Apresente seu número no balcão para confirmar o pagamento."
      : "Seu pedido já entrou na fila de produção.";
    setStep("success");
    sessionStorage.removeItem("customerDraft");
    startSuccessCountdown();
  }

  function startSuccessCountdown() {
    let seconds = 30;
    if (state.successTimer) clearInterval(state.successTimer);
    state.successAnimation?.cancel?.();
    $("#successProgress").style.animation = "none";
    $("#successProgress").style.transform = "scaleX(1)";
    state.successAnimation = $("#successProgress").animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: 30000, fill: "forwards" }
    );
    state.successTimer = setInterval(() => {
      seconds -= 1;
      $("#successCountdown").textContent = `Voltando em ${seconds} segundos`;
      if (seconds <= 0) {
        clearInterval(state.successTimer);
        state.successTimer = null;
        restartSession();
      }
    }, 1000);
  }

  function restartSession() {
    if (state.successTimer) {
      clearInterval(state.successTimer);
      state.successTimer = null;
    }
    state.successAnimation?.cancel?.();
    state.successAnimation = null;
    $$(".step").forEach((section) => section.classList.remove("active"));
    state.product = null;
    state.customer = null;
    state.payment = null;
    state.cart = [];
    renderCart();
    state.art = null;
    state.artsBySide.front = null;
    state.artsBySide.back = null;
    state.size = null;
    state.artListOpen = false;
    state.selection.art = false;
    state.selection.text = false;
    state.customName = "";
    state.customFont = "Arial";
    state.customNameRotation = 0;
    state.customNameSize = 18;
    state.customNamesBySide.front = "";
    state.customNamesBySide.back = "";
    state.customFontsBySide.front = "Arial";
    state.customFontsBySide.back = "Arial";
    state.customNameRotationsBySide.front = 0;
    state.customNameRotationsBySide.back = 0;
    state.customNameSizesBySide.front = 18;
    state.customNameSizesBySide.back = 18;
    state.customNameRenderedSizesBySide.front = 18;
    state.customNameRenderedSizesBySide.back = 18;
    const customNameInput = $("#customProductName");
    if (customNameInput) customNameInput.value = "";
    const customFontSelect = $("#customFont");
    if (customFontSelect) customFontSelect.value = state.customFont;
    const rotationInput = $("#customNameRotation");
    if (rotationInput) rotationInput.value = "0";
    const rotationOutput = $("#customNameRotationValue");
    if (rotationOutput) rotationOutput.value = "0°";
    const sizeInput = $("#customNameSize");
    if (sizeInput) sizeInput.value = "18";
    const sizeOutput = $("#customNameSizeValue");
    if (sizeOutput) sizeOutput.value = "18 px";
    updateCustomNamePreview();
    state.artPositions.front = { x: 0, y: 0 };
    state.artPositions.back = { x: 0, y: 0 };
    state.customNamePositions.front = { x: 0, y: 0 };
    state.customNamePositions.back = { x: 0, y: 0 };
    state.artWidthCm = state.product?.print
      ? Math.min(state.product.print.width, state.product.print.height) * 0.85
      : 12;
    state.side = "front";
    sessionStorage.removeItem("customerDraft");
    $("#customerForm")?.reset();
    $("#confirmOrder").disabled = true;
    $$("#paymentOptions .payment-option").forEach((item) => item.classList.remove("active"));
    setStep("catalog");
  }

  function setupConnectionStatus() {
    const update = () => {
      const status = $("#connectionStatus");
      if (!status) return;
      status.classList.toggle("offline", !navigator.onLine);
      status.lastElementChild.textContent = navigator.onLine ? "Online" : "Offline";
      if ($("#networkWarning")) $("#networkWarning").hidden = navigator.onLine;
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
  }

  function setupVirtualKeyboard() {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const phone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!coarse || phone) return;
    const keyboard = $("#virtualKeyboard");
    const keys = ["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","⌫","Z","X","C","V","B","N","M","-","."," ","@","✓"];
    $("#keyboardKeys").innerHTML = keys.map((key) => `<button type="button" class="key${key === "⌫" || key === "✓" ? " wide-key" : ""}${key === " " ? " space-key" : ""}" data-key="${key}">${key === " " ? "Espaço" : key}</button>`).join("");
    let activeInput = null;
    document.addEventListener("focusin", (event) => {
      if (event.target.matches("#customerForm input, #customProductName")) {
        activeInput = event.target;
        keyboard.hidden = false;
        event.target.setAttribute("inputmode", event.target.type === "email" ? "email" : event.target.type === "tel" ? "tel" : "text");
      }
    });
    document.addEventListener("focusout", () => setTimeout(() => {
      if (!document.activeElement?.matches("#customerForm input, #customProductName")) keyboard.hidden = true;
    }, 120));
    $("#keyboardKeys").addEventListener("click", (event) => {
      const key = event.target.closest("[data-key]")?.dataset.key;
      if (!key || !activeInput) return;
      if (key === "⌫") activeInput.value = activeInput.value.slice(0, -1);
      else if (key === "✓") { keyboard.hidden = true; activeInput.blur(); }
      else if (key === " ") activeInput.value += " ";
      else if (/^[A-Z]$/.test(key)) activeInput.value += key;
      else activeInput.value += key;
      activeInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  function setupInactivityTimeout() {
    let timeoutId;
    const reset = () => {
      clearTimeout(timeoutId);
      if (state.step !== "success") {
        timeoutId = setTimeout(() => restartSession(), 45000);
      }
    };
    ["touchstart", "click", "keypress"].forEach((eventName) => document.addEventListener(eventName, reset, { passive: true }));
    reset();
  }

  function setupCart() {
    renderCart();
    $("#addToCartButton")?.addEventListener("click", () => {
      if (state.product?.sizes.length > 1 && !state.size) {
        $("#sizeError").hidden = false;
        $("#sizeOptions")?.querySelector(".size-button")?.focus();
        return;
      }
      state.cart.push(snapshotCurrentItem());
      renderCart();
      $("#cartPanel").hidden = true;
      $("#cartButton").setAttribute("aria-expanded", "false");
      updateSummary();
      renderCartConfirmation();
      setStep("cart");
    });
    $("#cartButton")?.addEventListener("click", () => {
      $("#cartPanel").hidden = true;
      $("#cartButton").setAttribute("aria-expanded", "false");
      renderCartConfirmation();
      setStep("cart");
    });
    $("#closeCart")?.addEventListener("click", () => {
      $("#cartPanel").hidden = true;
      $("#cartButton").setAttribute("aria-expanded", "false");
    });
    $("#cartItems")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-cart]");
      if (!button) return;
      state.cart.splice(Number(button.dataset.removeCart), 1);
      renderCart();
      updateSummary();
    });
    $("#cartConfirmItems")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-confirm-cart]");
      if (!button) return;
      state.cart.splice(Number(button.dataset.removeConfirmCart), 1);
      renderCart();
      renderCartConfirmation();
      updateSummary();
    });
    $("#addAnotherProduct")?.addEventListener("click", () => {
      setStep("catalog");
    });
    $("#confirmCartItems")?.addEventListener("click", () => {
      if (!state.cart.length) return;
      updateSummary();
      setStep("customer");
    });
    $("#finishCart")?.addEventListener("click", () => {
      if (!state.cart.length) return;
      $("#cartPanel").hidden = true;
      $("#cartButton").setAttribute("aria-expanded", "false");
      updateSummary();
      setStep("cart");
    });
  }

  function setupCustomerView() {
    renderProducts();
    bindEditor();
    setupArtDrag();
    setupCustomNameDrag();
    setupDesignHandles();
    bindCustomer();
    bindPayment();
    setupCart();
    $("#newOrderButton")?.addEventListener("click", restartSession);
    if ("ResizeObserver" in window) {
      const preview = $(".preview-card");
      if (preview && !preview.dataset.resizeObserved) {
        preview.dataset.resizeObserved = "true";
        new ResizeObserver(() => {
          if (state.product && state.step === "editor") {
            requestAnimationFrame(applyArtPosition);
          }
        }).observe(preview);
      }
    }
    $$("[data-next]").forEach((button) => button.addEventListener("click", () => {
      if (button.closest("#editor") && state.product?.sizes.length > 1 && !state.size) {
        const error = $("#sizeError");
        if (error) {
          error.hidden = false;
          error.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        $("#sizeOptions")?.querySelector(".size-button")?.focus();
        return;
      }
      setStep(button.dataset.next);
    }));
    $$("[data-action='restart']").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); restartSession(); }));
    $$(".progress-step").forEach((button) => button.addEventListener("click", () => {
      if (state.step === "editor" && state.product?.sizes.length > 1 && !state.size && button.dataset.stepNav !== "catalog" && button.dataset.stepNav !== "editor") {
        const error = $("#sizeError");
        if (error) error.hidden = false;
        $("#sizeOptions")?.querySelector(".size-button")?.focus();
        return;
      }
      setStep(button.dataset.stepNav);
    }));
    $("#confirmOrder")?.addEventListener("click", async () => {
      if (!state.payment || !navigator.onLine) {
        $("#networkWarning").hidden = false;
        return;
      }
      $("#confirmOrder").disabled = true;
      $("#confirmOrder").textContent = "Confirmando...";
      const order = await createOrder();
      $("#confirmOrder").textContent = "Confirmar pedido";
      showSuccess(order);
    });
  }

  function setupAdminView() {
    const app = $("#adminApp");
    if (!app) return;
    let orders = JSON.parse(localStorage.getItem("studioOrders") || "[]");
    const seed = [
      { numero_pedido: "1040", cliente_nome: "Ana Silva", produto_id: "camiseta", variacao_id: "camiseta-#252936-M", estampa_frente_id: "star", status_pagamento: "PENDENTE", status_producao: "AGUARDANDO_PAGAMENTO" },
      { numero_pedido: "1041", cliente_nome: "Bruno Lima", produto_id: "copo", variacao_id: "copo-#171a25-Único", estampa_frente_id: "wave", status_pagamento: "PAID", status_producao: "EM_PRODUCAO" }
    ];
    if (!orders.length) {
      orders = seed;
      localStorage.setItem("studioOrders", JSON.stringify(orders));
    }

    const productNames = Object.fromEntries(products.map((product) => [product.id, product.name]));
    const columns = [
      ["AGUARDANDO_PAGAMENTO", "Aguardando pagamento"],
      ["EM_FILA", "Fila de produção"],
      ["EM_PRODUCAO", "Em produção"],
      ["PRONTO_PARA_RETIRADA", "Pronto para retirada"]
    ];
    app.innerHTML = columns.map(([status, title]) => `
      <section class="kanban-column">
        <div class="kanban-heading"><h2>${title}</h2><span>${orders.filter((order) => order.status_producao === status).length}</span></div>
        <div class="kanban-list">${orders.filter((order) => order.status_producao === status).map((order) => `
          <article class="order-card" data-order="${order.id || order.numero_pedido}">
            <div><strong>#${order.numero_pedido.toString().replace(/^.*-/, "")}</strong><small>${order.cliente_nome || "Cliente"}</small></div>
            <p>${productNames[order.produto_id] || order.produto_id || "Produto"}</p>
            <small>${order.variacao_id || ""}</small>
            ${status === "AGUARDANDO_PAGAMENTO" ? `<button class="admin-action" data-status="EM_FILA">Confirmar pagamento</button>` : ""}
            ${status === "EM_FILA" ? `<button class="admin-action secondary" data-status="EM_PRODUCAO">Iniciar produção</button>` : ""}
            ${status === "EM_PRODUCAO" ? `<button class="admin-action secondary" data-status="PRONTO_PARA_RETIRADA">Marcar como pronto</button>` : ""}
            ${status === "PRONTO_PARA_RETIRADA" ? `<span class="notice-sent">SMS + E-mail enviado</span>` : ""}
          </article>
        `).join("")}</div>
      </section>
    `).join("");

    if (!app.dataset.bound) {
      app.dataset.bound = "true";
      app.addEventListener("click", (event) => {
      const button = event.target.closest("[data-status]");
      if (!button) return;
      const card = button.closest("[data-order]");
      const key = card.dataset.order;
      const order = orders.find((item) => (item.id || item.numero_pedido) === key);
      if (!order) return;
      order.status_producao = button.dataset.status;
      if (order.status_producao === "EM_FILA") {
        order.status_pagamento = "PAID";
      }
      localStorage.setItem("studioOrders", JSON.stringify(orders.map((item) => (item.id || item.numero_pedido) === key ? order : item)));
      setupAdminView();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupConnectionStatus();
    setupVirtualKeyboard();
    setupInactivityTimeout();
    setupCustomerView();
    setupAdminView();
  });

  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  });
})();