import './styles/main.css';

const CLIENTS = [
  { name: '9 Mile Tees', url: 'https://9miletees.com' },
  { name: 'AIRR Engineering', url: 'https://airrengineering.com' },
  { name: 'American Landscape Supply', url: 'https://americanlandscapesupply.com' },
  { name: 'AREF Seniors', url: 'https://arefseniors.org' },
  { name: 'Aronberg Law', url: 'https://aronberglaw.com' },
  { name: 'Astrology Booth', url: 'https://astrologybooth.com' },
  { name: 'Bedside Buddie', url: 'https://bedsidebuddie.com' },
  { name: 'Bella', url: 'https://bellaflower.com' },
  { name: 'Bernini Dental', url: 'https://berninidentalarts.com' },
  { name: 'Best Hot Tub Prices', url: 'https://besthottubprices.com' },
  { name: 'Black Braunvieh', url: 'https://blackbraunvieh.com' },
  { name: 'Blitz Plumbing, Heating & Cooling', url: 'https://blitzplumbing.com' },
  { name: 'Bond Health Staffing', url: 'https://bondhealthstaffing.com' },
  { name: 'Brick Mailbox Plus', url: 'https://dev.simple.biz/brickmailbox' },
  { name: "Buyer's Choice Realty", url: 'https://buyerschoicerealty.com' },
  { name: 'Car Buyer Advocate', url: 'https://production.simple.biz/carbuyersadvocate' },
  { name: 'Crana Homes', url: 'https://cranahomes.com' },
  { name: 'David P. Wilson', url: 'https://davidpwilson.com' },
  { name: 'Dayspring Resources', url: 'https://dayspringresources.com' },
  { name: 'Dr. Dennis Pearne', url: 'https://spiritlifeguidance.com' },
  { name: 'Early Bird College', url: 'https://www.earlybirdcollege.com' },
  { name: 'East Side Synagogue', url: 'https://eastsidesynagogue.org' },
  { name: 'Elite Climbing', url: 'https://eliteclimbing.com' },
  { name: 'Estey Piano', url: 'https://esteypiano.com' },
  { name: 'Expressions of Sympathy', url: 'https://expressionsofsympathy.com' },
  { name: 'Five Star Rentals', url: 'https://fivestarrentals.com' },
  { name: 'Florida Merchant', url: 'https://floridamerchant1.com' },
  { name: 'Georgetown Neuroscience Foundation', url: 'https://georgetownneurosciencefoundation.org' },
  { name: 'Ginamarie Entertainment', url: 'https://ginamarieentertainment.com' },
  { name: 'glAgency', url: 'https://glagency.us' },
  { name: 'Harlem Cigar', url: 'https://wp.simple.biz/harlemcigar' },
  { name: 'Hillcrest Dentistry', url: 'https://hillcrestdentistry.com' },
  { name: 'Hyge', url: 'https://hyge.com' },
  { name: 'Jack Ramsdale Photography', url: 'https://jackramsdalephotography.com' },
  { name: 'LanaFair', url: 'https://lanafaire-us.com' },
  { name: 'Leader Center for Active Life', url: 'https://leaderactivelife.org' },
  { name: 'Long Life Home Care', url: 'https://longlifehomecarellc.com' },
  { name: 'Main Street Nursery', url: 'https://mainstreetnursery.com' },
  { name: 'Marburg Industries', url: 'https://marburgind.com' },
  { name: 'Marcum Ford PC Law Firm', url: 'https://marcumpc.com' },
  { name: 'Modern Shamba', url: 'https://hosting.simple.biz/modernshamba' },
  { name: 'My Squirrel Guard', url: 'https://mysquirrelguard.com' },
  { name: 'Myers Vacuum', url: 'https://myers-vacuum.com' },
  { name: 'NRLN', url: 'https://nrln.org' },
  { name: 'NTxPCC', url: 'https://ntxpcacoalition.org' },
  { name: 'NUPRO', url: 'https://nupro.net' },
  { name: 'Oak Vine Recovery Center', url: 'https://beta.simple.biz/oakvinerecoverycenter' },
  { name: 'One Source Baseball', url: 'https://beta.simple.biz/onesourcebaseball' },
  { name: 'Options Salon', url: 'https://optionssalonspa.com' },
  { name: 'Park Cities Speech', url: 'https://parkcitiesspeech.com' },
  { name: 'Radiant Smiles', url: 'https://wpbuild.simple.biz/radiantsmilesnv' },
  { name: 'Reserve Party Bus', url: 'https://reservepartybus.com' },
  { name: "Rocco's Custom Tailor", url: 'https://roccocustomtailor.com' },
  { name: 'Rocking Horse Eventing', url: 'https://rockinghorseeventing.com' },
  { name: 'RPL Management', url: 'https://rplmanagement.com' },
  { name: 'RWMCVA', url: 'https://rwmcva.com' },
  { name: 'Sail Care', url: 'https://sailcare.com' },
  { name: "San Diego's Implant Specialist", url: 'https://wphost.simple.biz/winplants' },
  { name: 'Scholars Discount Cards', url: 'https://scholars-discount-card.com' },
  { name: 'Screentech Graphics', url: 'https://production.simple.biz/screentechgraphics' },
  { name: 'Settlement Planners', url: 'https://settlementplanners.com' },
  { name: 'SGD — Schifrin, Gagnon & Dickey', url: 'https://sgdinc.com' },
  { name: 'Shermans Inn on Main', url: 'https://shermansinnonmain.com' },
  { name: 'Singleface', url: 'https://singleface.biz' },
  { name: 'Springfield Fireworks', url: 'https://springfieldfireworks.com' },
  { name: 'Stromsburg Evangelical', url: 'https://stromsburgefc.org' },
  { name: 'Swimwear Solution KC', url: 'https://swimwearsolutionkc.com' },
  { name: 'T.Q. Machining', url: 'https://tqmachine.com' },
  { name: 'Tech Systems', url: 'https://tsi4usa.com' },
  { name: 'The Vocal Group Hall of Fame', url: 'https://vocalgroup.org' },
  { name: 'Timberridge MHC', url: 'https://timberridgemhc.com' },
  { name: 'TMI Online', url: 'https://tmionline.biz' },
  { name: 'Tri County Power Wash', url: 'https://tricountypowerwash.com' },
  { name: "Vic's Classic Bikes", url: 'https://vicsclassicbikes.com' },
  { name: 'Virtual Dog Support Services', url: 'https://virtualdogsupportservices.com' },
  { name: 'Water Resources of New Jersey', url: 'https://waterresourcesnj.com' },
  { name: 'Weddings by Gail', url: 'https://weddingsbygail.com' },
  { name: 'William Velie Attorney at Law', url: 'https://velie.us' },
  { name: 'WLAF', url: 'https://1450wlaftn.com' },
  { name: 'Youths For Excellence', url: 'https://youths4excellence.org' },
];

function getDomain(url: string): string {
  try {
    const full = url.startsWith('http') ? url : 'https://' + url;
    return new URL(full).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function countUp(el: HTMLElement, target: number, duration = 1000) {
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(ease * target));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function buildCard(client: typeof CLIENTS[number], index: number): HTMLAnchorElement {
  const domain = getDomain(client.url);
  const href = client.url.startsWith('http') ? client.url : 'https://' + client.url;
  const faviconSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const initial = client.name[0].toUpperCase();

  const a = document.createElement('a');
  a.className = 'cl-card';
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.dataset.search = (client.name + ' ' + domain).toLowerCase();
  a.style.setProperty('--i', String(Math.min(index, 20)));

  a.innerHTML = `
    <span class="cl-card__fav">
      <img src="${faviconSrc}" alt="" width="28" height="28" loading="lazy">
      <span class="cl-card__init">${initial}</span>
    </span>
    <span class="cl-card__info">
      <span class="cl-card__name">${client.name}</span>
      <span class="cl-card__domain">${domain}</span>
    </span>
    <span class="cl-card__arrow" aria-hidden="true">↗</span>
  `;

  const img = a.querySelector('img')!;
  img.addEventListener('load', () => { img.style.opacity = '1'; });
  img.addEventListener('error', () => {
    img.style.display = 'none';
    (a.querySelector('.cl-card__init') as HTMLElement).style.display = 'grid';
  });

  return a;
}

function renderGrid(grid: HTMLElement, list: typeof CLIENTS) {
  grid.innerHTML = '';
  list.forEach((client, i) => grid.appendChild(buildCard(client, i)));
}

function init() {
  const root = document.getElementById('clientsRoot')!;

  root.innerHTML = `
    <section class="cl-hero">
      <p class="cl-hero__eyebrow">client work</p>
      <h1 class="cl-hero__count"><span id="clNum">0</span><span class="cl-hero__plus">+</span></h1>
      <p class="cl-hero__sub">websites designed, built, and launched</p>
    </section>

    <div class="cl-bar">
      <label class="cl-search-wrap">
        <svg class="cl-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="clSearch" type="search" class="cl-search" placeholder="Search clients…" autocomplete="off" spellcheck="false" />
        <span class="cl-tally" id="clTally">${CLIENTS.length} sites</span>
      </label>
      <button class="cl-shuffle" id="clShuffle" title="Shuffle order">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
        shuffle
      </button>
    </div>

    <div class="cl-grid" id="clGrid"></div>
  `;

  const grid = document.getElementById('clGrid')!;
  const searchEl = document.getElementById('clSearch') as HTMLInputElement;
  const tally = document.getElementById('clTally')!;
  const shuffleBtn = document.getElementById('clShuffle')!;

  let order = [...CLIENTS];
  renderGrid(grid, order);

  setTimeout(() => countUp(document.getElementById('clNum')!, CLIENTS.length), 200);

  searchEl.addEventListener('input', () => {
    const q = searchEl.value.trim().toLowerCase();
    let n = 0;
    grid.querySelectorAll<HTMLElement>('.cl-card').forEach(card => {
      const match = !q || (card.dataset.search || '').includes(q);
      card.classList.toggle('cl-card--hidden', !match);
      if (match) n++;
    });
    tally.textContent = q ? `${n} of ${CLIENTS.length} sites` : `${CLIENTS.length} sites`;
  });

  shuffleBtn.addEventListener('click', () => {
    grid.style.opacity = '0';
    grid.style.transform = 'scale(0.98)';
    setTimeout(() => {
      order = [...order].sort(() => Math.random() - 0.5);
      renderGrid(grid, order);
      grid.style.opacity = '';
      grid.style.transform = '';
    }, 120);
  });

  const footYear = document.getElementById('footYear');
  if (footYear) footYear.textContent = String(new Date().getFullYear());

  const navBurger = document.getElementById('navBurger');
  const mm = document.getElementById('mm');
  navBurger?.addEventListener('click', () => {
    const open = mm?.classList.toggle('mm--open');
    navBurger.classList.toggle('nav__burger--open', !!open);
  });

  const navCmd = document.getElementById('navCmd');
  navCmd?.addEventListener('click', () => {
    const palette = document.getElementById('palette');
    if (!palette) return;
    palette.hidden = false;
    (document.getElementById('paletteInput') as HTMLInputElement)?.focus();
  });
  document.getElementById('paletteBack')?.addEventListener('click', () => {
    const palette = document.getElementById('palette');
    if (palette) palette.hidden = true;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const palette = document.getElementById('palette');
      if (palette && !palette.hidden) palette.hidden = true;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const palette = document.getElementById('palette');
      if (!palette) return;
      palette.hidden = !palette.hidden;
      if (!palette.hidden) (document.getElementById('paletteInput') as HTMLInputElement)?.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
