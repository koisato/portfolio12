(function () {
  const STORAGE_KEYS = {
    users: "hk_users",
    authors: "hk_authors",
    genres: "hk_genres",
    works: "hk_works",
    session: "hk_session_user"
  };

  let seedData = null;
  const memoryStore = {};

  function loadWindowStore() {
    try {
      if (!window.name || !window.name.startsWith("hkstore:")) {
        return {};
      }
      const raw = window.name.slice("hkstore:".length);
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_err) {
      return {};
    }
  }

  function saveWindowStore(store) {
    try {
      window.name = "hkstore:" + JSON.stringify(store);
    } catch (_err) {
      // ignore write failures in restrictive environments
    }
  }

  function storageAvailable() {
    try {
      const testKey = "__hk_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (_err) {
      return false;
    }
  }

  const canUseLocalStorage = storageAvailable();

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function query(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function setStorage(key, value) {
    if (canUseLocalStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
      return;
    }
    const store = loadWindowStore();
    store[key] = JSON.stringify(value);
    memoryStore[key] = store[key];
    saveWindowStore(store);
  }

  function getStorage(key) {
    let raw;
    if (canUseLocalStorage) {
      raw = window.localStorage.getItem(key);
    } else {
      const store = loadWindowStore();
      if (store[key]) {
        memoryStore[key] = store[key];
      }
      raw = memoryStore[key] || null;
    }
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }

  function getUsers() {
    return getStorage(STORAGE_KEYS.users) || seedData.felhasznalok;
  }

  function getAuthors() {
    return getStorage(STORAGE_KEYS.authors) || seedData.szerzok;
  }

  function getGenres() {
    return getStorage(STORAGE_KEYS.genres) || seedData.mufaj;
  }

  function getWorks() {
    return getStorage(STORAGE_KEYS.works) || seedData.muvek;
  }

  function getSessionUser() {
    return getStorage(STORAGE_KEYS.session);
  }

  function requireAdmin() {
    const user = getSessionUser();
    if (!user || user.felhasznalo_jog !== "admin") {
      window.location.href = "alert.html?msg=" + encodeURIComponent("Nincs jogosultsága a hozzáféréshez.");
      return false;
    }
    return true;
  }

  function renderNavbar() {
    const root = document.getElementById("navbar-root");
    if (!root) {
      return;
    }

    const user = getSessionUser();
    const isAdmin = user && user.felhasznalo_jog === "admin";

    root.innerHTML = `
<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="index.html">Szerzok & Muvek</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="collapsibleNavbar">
      <ul class="navbar-nav me-auto">
        <li class="nav-item"><a class="nav-link" href="szerzok_list.html">Szerzok</a></li>
        <li class="nav-item"><a class="nav-link" href="muvek_list.html">Muvek</a></li>
      </ul>
      <ul class="navbar-nav">
        ${
          isAdmin
            ? `<li class="nav-item dropdown">
                 <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Admin</a>
                 <ul class="dropdown-menu">
                   <li><a class="dropdown-item" href="szerzo_felvesz.html">Uj szerzo felvetel</a></li>
                   <li><a class="dropdown-item" href="mu_felvesz.html">Uj mu felvetel</a></li>
                   <li><a class="dropdown-item" href="mufaj_felvesz.html">Uj mufaj felvetel</a></li>
                 </ul>
               </li>`
            : ""
        }
        ${
          user
            ? `<li class="nav-item"><a class="nav-link" href="logout.html">Kijelentkezes</a></li>`
            : `<li class="nav-item"><a class="nav-link" href="login_form.html?return=${encodeURIComponent(
                window.location.pathname.split("/").pop() || "index.html"
              )}">Bejelentkezes</a></li>
               <li class="nav-item"><a class="nav-link" href="register.html">Regisztracio</a></li>`
        }
      </ul>
    </div>
  </div>
</nav>`;
  }

  function sortByName(arr, field) {
    return [...arr].sort((a, b) => String(a[field]).localeCompare(String(b[field]), "hu"));
  }

  function renderIndexPage() {
    const input = document.getElementById("search");
    const container = document.getElementById("authorsAccordion");
    const genres = getGenres();
    const genresById = Object.fromEntries(genres.map((g) => [String(g.mufaj_id), g.mufaj_nev]));

    function build(searchRaw) {
      const search = searchRaw.trim().toLowerCase();
      const authors = sortByName(getAuthors(), "szerzo_nev");
      const works = getWorks();
      const worksByAuthor = new Map();

      works.forEach((work) => {
        const key = String(work.mu_szerzo_id || "");
        if (!worksByAuthor.has(key)) {
          worksByAuthor.set(key, []);
        }
        worksByAuthor.get(key).push(work);
      });

      const html = [];
      let hasAny = false;

      authors.forEach((author) => {
        const authorWorks = sortByName(worksByAuthor.get(String(author.szerzo_id)) || [], "mu_nev");

        const filteredWorks = authorWorks.filter((w) => {
          const haystack = [
            author.szerzo_nev,
            w.mu_nev,
            w.mu_kel_ido,
            genresById[String(w.mu_mufaj)] || ""
          ]
            .join(" ")
            .toLowerCase();
          return search === "" || haystack.includes(search);
        });

        const authorMatch = [
          author.szerzo_nev,
          author.szerzo_szul_hely,
          author.szerzo_hal_hely,
          author.szerzo_szul_ido,
          author.szerzo_hal_ido
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

        if (!authorMatch && filteredWorks.length === 0) {
          return;
        }

        hasAny = true;
        const collapseId = `collapse${author.szerzo_id}`;

        html.push(`
          <div class="accordion-item">
            <h2 class="accordion-header d-flex align-items-center">
              <button class="accordion-button collapsed flex-grow-1" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                ${escapeHtml(author.szerzo_nev)}
              </button>
              <a href="szerzok_list.html?search=${encodeURIComponent(author.szerzo_nev)}" class="btn btn-success btn-sm py-0 px-2 me-2">Tobb a szerzorol</a>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse" data-bs-parent="#authorsAccordion">
              <div class="accordion-body p-0">
                <table class="table table-striped mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Mu</th>
                      <th>Mufaj</th>
                      <th>Muvelet</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      filteredWorks.length === 0
                        ? '<tr><td colspan="3">Nincs talalat.</td></tr>'
                        : filteredWorks
                            .map(
                              (w) => `
                                <tr>
                                  <td>${escapeHtml(w.mu_nev)}</td>
                                  <td>${escapeHtml(genresById[String(w.mu_mufaj)] || "-")}</td>
                                  <td><a href="muvek_list.html?search=${encodeURIComponent(
                                    w.mu_nev
                                  )}" class="btn btn-success btn-sm py-1">Tobb a murol</a></td>
                                </tr>`
                            )
                            .join("")
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>`);
      });

      container.innerHTML = hasAny ? html.join("") : '<div class="alert alert-info">Nincs talalat.</div>';
    }

    input.value = query("search");
    build(input.value);

    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      build(input.value);
    });
  }

  function renderAuthorsPage() {
    const input = document.getElementById("search");
    const body = document.getElementById("authorsBody");

    function build(searchRaw) {
      const search = searchRaw.trim().toLowerCase();
      const authors = sortByName(getAuthors(), "szerzo_nev");
      const filtered = authors.filter((a) =>
        [a.szerzo_nev, a.szerzo_szul_hely, a.szerzo_hal_hely, a.szerzo_szul_ido, a.szerzo_hal_ido]
          .join(" ")
          .toLowerCase()
          .includes(search)
      );

      body.innerHTML =
        filtered.length === 0
          ? '<tr><td colspan="5" class="text-center">Nincs talalat.</td></tr>'
          : filtered
              .map(
                (a) => `
                  <tr>
                    <td>${escapeHtml(a.szerzo_nev)}</td>
                    <td>${escapeHtml(a.szerzo_szul_ido || "")}</td>
                    <td>${escapeHtml(a.szerzo_szul_hely || "")}</td>
                    <td>${escapeHtml(a.szerzo_hal_ido || "")}</td>
                    <td>${escapeHtml(a.szerzo_hal_hely || "")}</td>
                  </tr>`
              )
              .join("");
    }

    input.value = query("search");
    build(input.value);

    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      build(input.value);
    });
  }

  function renderWorksPage() {
    const input = document.getElementById("search");
    const container = document.getElementById("worksAccordion");
    const authorsById = Object.fromEntries(getAuthors().map((a) => [String(a.szerzo_id), a.szerzo_nev]));
    const genresById = Object.fromEntries(getGenres().map((g) => [String(g.mufaj_id), g.mufaj_nev]));

    function build(searchRaw) {
      const search = searchRaw.trim().toLowerCase();
      const works = sortByName(getWorks(), "mu_nev").filter((w) => {
        return [w.mu_nev, w.mu_kel_ido, authorsById[String(w.mu_szerzo_id)] || "", genresById[String(w.mu_mufaj)] || ""]
          .join(" ")
          .toLowerCase()
          .includes(search);
      });

      if (works.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Nincs talalat.</div>';
        return;
      }

      container.innerHTML = works
        .map(
          (w) => `
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#work${w.mu_id}">
                  <div class="row w-100">
                    <div class="col">${escapeHtml(w.mu_nev)}</div>
                    <div class="col">${escapeHtml(authorsById[String(w.mu_szerzo_id)] || "-")}</div>
                    <div class="col">${escapeHtml(w.mu_kel_ido || "-")}</div>
                    <div class="col">${escapeHtml(genresById[String(w.mu_mufaj)] || "-")}</div>
                  </div>
                </button>
              </h2>
              <div id="work${w.mu_id}" class="accordion-collapse collapse" data-bs-parent="#worksAccordion">
                <div class="accordion-body">
                  <div class="content-section">
                    <h5>Reszlet:</h5>
                    <p>${escapeHtml(w.mu_reszlet || "-").replaceAll("\n", "<br>")}</p>
                  </div>
                  ${
                    w.mu_teljes
                      ? `<div class="content-section"><h5>Teljes mu:</h5><p>${escapeHtml(w.mu_teljes).replaceAll(
                          "\\n",
                          "<br>"
                        )}</p></div>`
                      : ""
                  }
                </div>
              </div>
            </div>`
        )
        .join("");
    }

    input.value = query("search");
    build(input.value);

    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      build(input.value);
    });
  }

  function initLoginPage() {
    const error = query("error");
    if (error === "1") {
      document.getElementById("errorBox").innerHTML = '<div class="alert alert-warning">Hibas felhasznalonev vagy jelszo.</div>';
    }

    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("felhasznalo_nev").value.trim();
      const password = document.getElementById("felhasznalo_jelszo").value;
      const users = getUsers();
      const found = users.find(
        (u) => String(u.felhasznalo_nev).toLowerCase() === username.toLowerCase() && String(u.felhasznalo_jelszo) === password
      );

      if (!found) {
        window.location.href = "login_form.html?error=1";
        return;
      }

      setStorage(STORAGE_KEYS.session, found);
      const returnUrl = query("return") || "index.html";
      window.location.href = returnUrl;
    });
  }

  function initRegisterPage() {
    document.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("felhasznalo_email").value.trim();
      const username = document.getElementById("felhasznalo_nev").value.trim();
      const password = document.getElementById("felhasznalo_jelszo").value;
      const box = document.getElementById("messages");

      if (!email || !username || !password) {
        box.innerHTML = '<div class="alert alert-warning">Kerem toltson ki minden mezot.</div>';
        return;
      }

      const users = [...getUsers()];
      const duplicate = users.find(
        (u) => String(u.felhasznalo_nev).toLowerCase() === username.toLowerCase() || String(u.felhasznalo_email).toLowerCase() === email.toLowerCase()
      );

      if (duplicate) {
        box.innerHTML = '<div class="alert alert-warning">A felhasznalo mar letezik.</div>';
        return;
      }

      const nextId = users.reduce((max, u) => Math.max(max, Number(u.felhasznalo_id || 0)), 0) + 1;
      users.push({
        felhasznalo_id: nextId,
        felhasznalo_nev: username,
        felhasznalo_email: email,
        felhasznalo_jelszo: password,
        felhasznalo_nick: username,
        felhasznalo_jog: "user"
      });
      setStorage(STORAGE_KEYS.users, users);
      box.innerHTML = '<div class="alert alert-success">Sikeres regisztracio. Most mar bejelentkezhet.</div>';
    });
  }

  function initAddAuthorPage() {
    if (!requireAdmin()) return;
    document.getElementById("authorForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const box = document.getElementById("messages");
      const name = document.getElementById("szerzo_nev").value.trim();
      const bornYear = document.getElementById("szerzo_szul_ido").value.trim();
      const bornPlace = document.getElementById("szerzo_szul_hely").value.trim();
      const deathYear = document.getElementById("szerzo_hal_ido").value.trim();
      const deathPlace = document.getElementById("szerzo_hal_hely").value.trim();

      if (!name || !bornYear || !bornPlace) {
        box.innerHTML = '<div class="alert alert-warning">Kerem toltson ki minden kotelezo mezot.</div>';
        return;
      }

      const authors = [...getAuthors()];
      const nextId = authors.reduce((max, a) => Math.max(max, Number(a.szerzo_id || 0)), 0) + 1;
      authors.push({
        szerzo_id: nextId,
        szerzo_nev: name,
        szerzo_szul_ido: bornYear,
        szerzo_szul_hely: bornPlace,
        szerzo_hal_ido: deathYear,
        szerzo_hal_hely: deathPlace
      });
      setStorage(STORAGE_KEYS.authors, authors);
      window.location.href = "success.html";
    });
  }

  function initAddGenrePage() {
    if (!requireAdmin()) return;
    document.getElementById("genreForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const box = document.getElementById("messages");
      const name = document.getElementById("mufaj_nev").value.trim();
      if (!name) {
        box.innerHTML = '<div class="alert alert-warning">Kerem adja meg a mufaj nevet.</div>';
        return;
      }
      const genres = [...getGenres()];
      if (genres.some((g) => String(g.mufaj_nev).toLowerCase() === name.toLowerCase())) {
        box.innerHTML = '<div class="alert alert-warning">A mufaj mar letezik.</div>';
        return;
      }
      const nextId = genres.reduce((max, g) => Math.max(max, Number(g.mufaj_id || 0)), 0) + 1;
      genres.push({ mufaj_id: nextId, mufaj_nev: name });
      setStorage(STORAGE_KEYS.genres, genres);
      window.location.href = "success.html";
    });
  }

  function initAddWorkPage() {
    if (!requireAdmin()) return;

    const authors = sortByName(getAuthors(), "szerzo_nev");
    const genres = sortByName(getGenres(), "mufaj_nev");
    document.getElementById("mu_szerzo_id").innerHTML =
      '<option value="">Valassz szerzot</option>' +
      authors.map((a) => `<option value="${a.szerzo_id}">${escapeHtml(a.szerzo_nev)}</option>`).join("");
    document.getElementById("mu_mufaj").innerHTML =
      '<option value="">Valassz mufajt</option>' +
      genres.map((g) => `<option value="${g.mufaj_id}">${escapeHtml(g.mufaj_nev)}</option>`).join("");

    document.getElementById("workForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const box = document.getElementById("messages");
      const name = document.getElementById("mu_nev").value.trim();
      const authorId = document.getElementById("mu_szerzo_id").value;
      const year = document.getElementById("mu_kel_ido").value.trim();
      const genreId = document.getElementById("mu_mufaj").value;
      const excerpt = document.getElementById("mu_reszlet").value;
      const full = document.getElementById("mu_teljes").value;

      if (!name || !authorId || !year || !genreId) {
        box.innerHTML = '<div class="alert alert-warning">Kerem toltson ki minden kotelezo mezot.</div>';
        return;
      }

      const works = [...getWorks()];
      const nextId = works.reduce((max, w) => Math.max(max, Number(w.mu_id || 0)), 0) + 1;
      works.push({
        mu_id: nextId,
        mu_nev: name,
        mu_szerzo_id: Number(authorId),
        mu_kel_ido: year,
        mu_mufaj: Number(genreId),
        mu_reszlet: excerpt,
        mu_teljes: full
      });
      setStorage(STORAGE_KEYS.works, works);
      window.location.href = "success.html";
    });
  }

  function initAlertPage() {
    const msg = query("msg") || "Valamilyen hiba tortent.";
    const box = document.getElementById("alertMessage");
    box.textContent = msg;
  }

  function initSuccessPage() {}

  function initLogoutPage() {
    if (canUseLocalStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.session);
    } else {
      const store = loadWindowStore();
      delete store[STORAGE_KEYS.session];
      saveWindowStore(store);
      delete memoryStore[STORAGE_KEYS.session];
    }
    window.location.href = "index.html";
  }

  async function bootstrap() {
    if (window.PROJECT_DATA) {
      seedData = window.PROJECT_DATA;
    } else {
      const response = await fetch("data.json", { cache: "no-store" });
      seedData = await response.json();
    }

    renderNavbar();

    const page = document.body.getAttribute("data-page") || "";
    if (page === "index") renderIndexPage();
    if (page === "authors") renderAuthorsPage();
    if (page === "works") renderWorksPage();
    if (page === "login") initLoginPage();
    if (page === "register") initRegisterPage();
    if (page === "add-author") initAddAuthorPage();
    if (page === "add-genre") initAddGenrePage();
    if (page === "add-work") initAddWorkPage();
    if (page === "alert") initAlertPage();
    if (page === "success") initSuccessPage();
    if (page === "logout") initLogoutPage();
  }

  window.addEventListener("DOMContentLoaded", () => {
    bootstrap().catch((err) => {
      const root = document.getElementById("app-error") || document.body;
      root.innerHTML = `<div class="alert alert-danger m-3">Betoltesi hiba: ${escapeHtml(err.message)}</div>`;
    });
  });
})();
