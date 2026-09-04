import './styles/main.css';

type Platform = 'web' | 'shopify';
interface Client { name: string; url: string; platform: Platform }

const CLIENTS: Client[] = [
  // ── Web / WordPress / Duda ──────────────────────────────────
  { name: '9 Mile Tees', url: 'https://9miletees.com', platform: 'web' },
  { name: 'AIRR Engineering', url: 'https://airrengineering.com', platform: 'web' },
  { name: 'American Landscape Supply', url: 'https://americanlandscapesupply.com', platform: 'web' },
  { name: 'AREF Seniors', url: 'https://arefseniors.org', platform: 'web' },
  { name: 'Aronberg Law', url: 'https://aronberglaw.com', platform: 'web' },
  { name: 'Astrology Booth', url: 'https://astrologybooth.com', platform: 'web' },
  { name: 'Bedside Buddie', url: 'https://bedsidebuddie.com', platform: 'web' },
  { name: 'Bella', url: 'https://bellaflower.com', platform: 'web' },
  { name: 'Bernini Dental', url: 'https://berninidentalarts.com', platform: 'web' },
  { name: 'Best Hot Tub Prices', url: 'https://besthottubprices.com', platform: 'web' },
  { name: 'Black Braunvieh', url: 'https://blackbraunvieh.com', platform: 'web' },
  { name: 'Blitz Plumbing, Heating & Cooling', url: 'https://blitzplumbing.com', platform: 'web' },
  { name: 'Bond Health Staffing', url: 'https://bondhealthstaffing.com', platform: 'web' },
  { name: 'Brick Mailbox Plus', url: 'https://dev.simple.biz/brickmailbox', platform: 'web' },
  { name: "Buyer's Choice Realty", url: 'https://buyerschoicerealty.com', platform: 'web' },
  { name: 'Car Buyer Advocate', url: 'https://production.simple.biz/carbuyersadvocate', platform: 'web' },
  { name: 'Crana Homes', url: 'https://cranahomes.com', platform: 'web' },
  { name: 'David P. Wilson', url: 'https://davidpwilson.com', platform: 'web' },
  { name: 'Dayspring Resources', url: 'https://dayspringresources.com', platform: 'web' },
  { name: 'Dr. Dennis Pearne', url: 'https://spiritlifeguidance.com', platform: 'web' },
  { name: 'Early Bird College', url: 'https://www.earlybirdcollege.com', platform: 'web' },
  { name: 'East Side Synagogue', url: 'https://eastsidesynagogue.org', platform: 'web' },
  { name: 'Elite Climbing', url: 'https://eliteclimbing.com', platform: 'web' },
  { name: 'Estey Piano', url: 'https://esteypiano.com', platform: 'web' },
  { name: 'Expressions of Sympathy', url: 'https://expressionsofsympathy.com', platform: 'web' },
  { name: 'Five Star Rentals', url: 'https://fivestarrentals.com', platform: 'web' },
  { name: 'Florida Merchant', url: 'https://floridamerchant1.com', platform: 'web' },
  { name: 'Georgetown Neuroscience Foundation', url: 'https://georgetownneurosciencefoundation.org', platform: 'web' },
  { name: 'Ginamarie Entertainment', url: 'https://ginamarieentertainment.com', platform: 'web' },
  { name: 'glAgency', url: 'https://glagency.us', platform: 'web' },
  { name: 'Harlem Cigar', url: 'https://wp.simple.biz/harlemcigar', platform: 'web' },
  { name: 'Hillcrest Dentistry', url: 'https://hillcrestdentistry.com', platform: 'web' },
  { name: 'Hyge', url: 'https://hyge.com', platform: 'web' },
  { name: 'Jack Ramsdale Photography', url: 'https://jackramsdalephotography.com', platform: 'web' },
  { name: 'LanaFair', url: 'https://lanafaire-us.com', platform: 'web' },
  { name: 'Leader Center for Active Life', url: 'https://leaderactivelife.org', platform: 'web' },
  { name: 'Long Life Home Care', url: 'https://longlifehomecarellc.com', platform: 'web' },
  { name: 'Main Street Nursery', url: 'https://mainstreetnursery.com', platform: 'web' },
  { name: 'Marburg Industries', url: 'https://marburgind.com', platform: 'web' },
  { name: 'Marcum Ford PC Law Firm', url: 'https://marcumpc.com', platform: 'web' },
  { name: 'Modern Shamba', url: 'https://hosting.simple.biz/modernshamba', platform: 'web' },
  { name: 'My Squirrel Guard', url: 'https://mysquirrelguard.com', platform: 'web' },
  { name: 'Myers Vacuum', url: 'https://myers-vacuum.com', platform: 'web' },
  { name: 'NRLN', url: 'https://nrln.org', platform: 'web' },
  { name: 'NTxPCC', url: 'https://ntxpcacoalition.org', platform: 'web' },
  { name: 'NUPRO', url: 'https://nupro.net', platform: 'web' },
  { name: 'Oak Vine Recovery Center', url: 'https://beta.simple.biz/oakvinerecoverycenter', platform: 'web' },
  { name: 'One Source Baseball', url: 'https://beta.simple.biz/onesourcebaseball', platform: 'web' },
  { name: 'Options Salon', url: 'https://optionssalonspa.com', platform: 'web' },
  { name: 'Park Cities Speech', url: 'https://parkcitiesspeech.com', platform: 'web' },
  { name: 'Radiant Smiles', url: 'https://wpbuild.simple.biz/radiantsmilesnv', platform: 'web' },
  { name: 'Reserve Party Bus', url: 'https://reservepartybus.com', platform: 'web' },
  { name: "Rocco's Custom Tailor", url: 'https://roccocustomtailor.com', platform: 'web' },
  { name: 'Rocking Horse Eventing', url: 'https://rockinghorseeventing.com', platform: 'web' },
  { name: 'RPL Management', url: 'https://rplmanagement.com', platform: 'web' },
  { name: 'RWMCVA', url: 'https://rwmcva.com', platform: 'web' },
  { name: 'Sail Care', url: 'https://sailcare.com', platform: 'web' },
  { name: "San Diego's Implant Specialist", url: 'https://wphost.simple.biz/winplants', platform: 'web' },
  { name: 'Scholars Discount Cards', url: 'https://scholars-discount-card.com', platform: 'web' },
  { name: 'Screentech Graphics', url: 'https://production.simple.biz/screentechgraphics', platform: 'web' },
  { name: 'Settlement Planners', url: 'https://settlementplanners.com', platform: 'web' },
  { name: 'SGD — Schifrin, Gagnon & Dickey', url: 'https://sgdinc.com', platform: 'web' },
  { name: 'Shermans Inn on Main', url: 'https://shermansinnonmain.com', platform: 'web' },
  { name: 'Singleface', url: 'https://singleface.biz', platform: 'web' },
  { name: 'Springfield Fireworks', url: 'https://springfieldfireworks.com', platform: 'web' },
  { name: 'Stromsburg Evangelical', url: 'https://stromsburgefc.org', platform: 'web' },
  { name: 'Swimwear Solution KC', url: 'https://swimwearsolutionkc.com', platform: 'web' },
  { name: 'T.Q. Machining', url: 'https://tqmachine.com', platform: 'web' },
  { name: 'Tech Systems', url: 'https://tsi4usa.com', platform: 'web' },
  { name: 'The Vocal Group Hall of Fame', url: 'https://vocalgroup.org', platform: 'web' },
  { name: 'Timberridge MHC', url: 'https://timberridgemhc.com', platform: 'web' },
  { name: 'TMI Online', url: 'https://tmionline.biz', platform: 'web' },
  { name: 'Tri County Power Wash', url: 'https://tricountypowerwash.com', platform: 'web' },
  { name: "Vic's Classic Bikes", url: 'https://vicsclassicbikes.com', platform: 'web' },
  { name: 'Virtual Dog Support Services', url: 'https://virtualdogsupportservices.com', platform: 'web' },
  { name: 'Water Resources of New Jersey', url: 'https://waterresourcesnj.com', platform: 'web' },
  { name: 'Weddings by Gail', url: 'https://weddingsbygail.com', platform: 'web' },
  { name: 'William Velie Attorney at Law', url: 'https://velie.us', platform: 'web' },
  { name: 'WLAF', url: 'https://1450wlaftn.com', platform: 'web' },
  { name: 'Youths For Excellence', url: 'https://youths4excellence.org', platform: 'web' },

  // ── Shopify ─────────────────────────────────────────────────
  { name: 'Besttoyst', url: 'https://www.besttoyst.com', platform: 'shopify' },
  { name: 'Mariasch Studios', url: 'https://mariaschstudiosinc.com', platform: 'shopify' },
  { name: 'Airbrush Place', url: 'https://customairbrushbusiness.com', platform: 'shopify' },
  { name: 'Golden Gardens', url: 'https://goldengardens-us.com', platform: 'shopify' },
  { name: 'Tropical Tees', url: 'https://tropicaltees-us.com', platform: 'shopify' },
  { name: "God's Healing Wonders", url: 'https://www.godshealingwondersllc.com', platform: 'shopify' },
  { name: 'Park Avenue Floratique', url: 'https://ahmexh-92.myshopify.com', platform: 'shopify' },
  { name: 'Survival Traders', url: 'https://survival-traders.com', platform: 'shopify' },
  { name: 'Vermont Center Wreaths', url: 'https://vermontcenterwreaths.com', platform: 'shopify' },
  { name: 'American Jewelry Company', url: 'https://americanjewelry-company.com', platform: 'shopify' },
  { name: 'Zerust', url: 'https://zerust-us.com', platform: 'shopify' },
  { name: 'Zamira Bridal USA', url: 'https://zamirabridal-usa.com', platform: 'shopify' },
  { name: 'Zamira Measurements Dev', url: 'https://zamira-measurements-dev.myshopify.com', platform: 'shopify' },
  { name: 'Electro Drop Chews', url: 'https://5amqmb-i7.myshopify.com', platform: 'shopify' },
  { name: 'MedPro Diagnostics', url: 'https://medprodiagnostics.com', platform: 'shopify' },
  { name: 'Davis Mountains Nut Company', url: 'https://allpecans.com', platform: 'shopify' },
  { name: 'Watch Box Depot', url: 'https://watchbox-depot.com', platform: 'shopify' },
  { name: 'Cedar Valley Crafts', url: 'https://cedarvalleycrafts.com', platform: 'shopify' },
  { name: 'Special Addition', url: 'https://maternityandnursing.com', platform: 'shopify' },
  { name: 'Pasttime Signs', url: 'https://pasttimesigns.com', platform: 'shopify' },
  { name: 'High Energy Retail', url: 'https://highenergyretail.com', platform: 'shopify' },
  { name: 'Royal Oil Manufacturing', url: 'https://royaloilmfg.com', platform: 'shopify' },
  { name: 'Original Body Parts', url: 'https://originalbodyparts.com', platform: 'shopify' },
  { name: 'One Stop Kitchen and Bath Designs', url: 'https://onestopkitchenandbathdesigns.com', platform: 'shopify' },
  { name: 'Krazy Kajun Cookware', url: 'https://krazykajuncookware.com', platform: 'shopify' },
  { name: 'Red Light Pro Devices', url: 'https://redlightprodevices-us.com', platform: 'shopify' },
  { name: 'MotoRaw 360', url: 'https://motoraw-360.com', platform: 'shopify' },
  { name: 'Titus Trucks Accessories', url: 'https://titustrucksaccessories.com', platform: 'shopify' },
  { name: 'CSS Publishing Co', url: 'https://csspublishingcoinc.com', platform: 'shopify' },
  { name: 'Tranquil Pillow Case', url: 'https://tranquilpillowcase.net', platform: 'shopify' },
  { name: 'The Comfort Store Online', url: 'https://thecomfortstoreonline.com', platform: 'shopify' },
  { name: "Waters Choice", url: 'https://waters-choice.com', platform: 'shopify' },
  { name: 'Test Store', url: 'https://test-store-9rlzlhhb.myshopify.com', platform: 'shopify' },
  { name: "Grandma's Pot Shop", url: 'https://dzzix6-ji.myshopify.com', platform: 'shopify' },
  { name: 'IPE Wood Outdoor Furniture', url: 'https://ipewoodoutdoorfurniture.com', platform: 'shopify' },
  { name: 'Flightpath Aviation Services', url: 'https://flightpath-aviation.com', platform: 'shopify' },
  { name: 'Toads-N-Tutus', url: 'https://toads-n-tutus.myshopify.com', platform: 'shopify' },
  { name: 'PortablePowerPress', url: 'https://portablepowerpress.com', platform: 'shopify' },
  { name: "Tom's Trains NY", url: 'https://tomstrainsny.com', platform: 'shopify' },
  { name: "Sara Kathryn's", url: 'https://sarakathryns.com', platform: 'shopify' },
  { name: 'Eagle Hardware', url: 'https://eaglehardware-nc.com', platform: 'shopify' },
  { name: 'The Toriumi Diet', url: 'https://toriumi-diet.myshopify.com', platform: 'shopify' },
  { name: 'RC Hobby of Medina', url: 'https://rc-hobbyofmedina.com', platform: 'shopify' },
  { name: "Men's Shop", url: 'https://mensshop-ga.com', platform: 'shopify' },
  { name: 'Fastimes Motorsports', url: 'https://fastimesmotorsports.com', platform: 'shopify' },
  { name: 'Petali Florist', url: 'https://www.petaliflorist.com', platform: 'shopify' },
  { name: 'Elite Custom PC', url: 'https://avgjys-1q.myshopify.com', platform: 'shopify' },
  { name: 'Eazy E Bikez', url: 'https://eazye-bikez.com', platform: 'shopify' },
  { name: 'Direct Designs Printing & Packaging', url: 'https://directdesignsprintingandpackaging.com', platform: 'shopify' },
  { name: 'DND Boutique', url: 'https://dnd-boutique.com', platform: 'shopify' },
  { name: 'Sephlin', url: 'https://sephlin-id.com', platform: 'shopify' },
  { name: 'Glow Skin Science', url: 'https://glowskin-science.com', platform: 'shopify' },
  { name: 'Honeymoon Diamonds & Co.', url: 'https://honeymoondiamondsandco.com', platform: 'shopify' },
  { name: 'Carolyn Beauty X', url: 'https://carolynbeautyx.com', platform: 'shopify' },
  { name: 'Elevation Events & Party Rentals', url: 'https://elevationeventsandpartyrentals.com', platform: 'shopify' },
  { name: 'Spirit Filter City', url: 'https://spiritfilter-city.com', platform: 'shopify' },
  { name: 'Wine Filter City', url: 'https://winefilter-city.com', platform: 'shopify' },
  { name: 'Essenpro', url: 'https://essenproengines.com', platform: 'shopify' },
  { name: 'Ixchel', url: 'https://ixchel-us.com', platform: 'shopify' },
  { name: 'Fantasy Flowers & Balloons', url: 'https://fantasyflowersb.com', platform: 'shopify' },
  { name: 'IML Engraved Designs', url: 'https://imlengraveddesigns.com', platform: 'shopify' },
  { name: 'Subthump', url: 'https://subthump.com', platform: 'shopify' },
  { name: 'Flooring and Above', url: 'https://flooringandabove.com', platform: 'shopify' },
  { name: 'Fortune Customer Wheelchair & Medical Supply', url: 'https://fortunecustomerwheelchairandmedicalsupply.com', platform: 'shopify' },
  { name: 'Custom Health Rx', url: 'https://customhealth-rx.com', platform: 'shopify' },
  { name: 'Plant Spirit Apothecary', url: 'https://plantspiritapothecary.com', platform: 'shopify' },
  { name: 'Industrial Specialties of San Antonio', url: 'https://industrialspecialtiesofsanantonio.com', platform: 'shopify' },
  { name: 'NY Designer Fabric Outlet', url: 'https://nydfo-newyorkdesignerfabricoutlet.com', platform: 'shopify' },
  { name: 'MB Estate Jeweler', url: 'https://mbestate-jeweler.com', platform: 'shopify' },
  { name: 'Sports Med Distributor', url: 'https://sportsmed-distributor.com', platform: 'shopify' },
  { name: 'Damper Doctor', url: 'https://damperdoctor.com', platform: 'shopify' },
  { name: 'H.F. Staples & Co.', url: 'https://hfstaples.com', platform: 'shopify' },
  { name: 'Texas Direct Floors', url: 'https://godirecttexas.com', platform: 'shopify' },
  { name: 'Solar Eyes Online', url: 'https://solareyes.org', platform: 'shopify' },
  { name: 'Products of Nature International', url: 'https://www.pronature.com', platform: 'shopify' },
  { name: 'MTI Racing', url: 'https://mtiracing.com', platform: 'shopify' },
  { name: 'Brite Safety', url: 'https://yqnp4a-mu.myshopify.com', platform: 'shopify' },
  { name: 'Vinyl Supply And More', url: 'https://vinylsupplyandmore.com', platform: 'shopify' },
  { name: 'The St. Raphael Detox Spa', url: 'https://thestraphaeldetoxspa.com', platform: 'shopify' },
  { name: 'Fitters', url: 'https://fitters-ca.com', platform: 'shopify' },
  { name: 'Old Mariner Reel', url: 'https://vzsqcp-cw.myshopify.com', platform: 'shopify' },
  { name: 'EngiTra Engines & Transmissions', url: 'https://f5d0mg-ub.myshopify.com', platform: 'shopify' },
  { name: 'Excess Solutions', url: 'https://www.excesssolutions.com', platform: 'shopify' },
  { name: 'Tuxedo Den', url: 'https://tuxedo-den.com', platform: 'shopify' },
  { name: 'Hyper Green Environmental', url: 'https://hypergreenenvironmental.com', platform: 'shopify' },
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

function buildCard(client: Client, index: number): HTMLAnchorElement {
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
  a.dataset.platform = client.platform;
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

function renderGrid(grid: HTMLElement, list: Client[]) {
  grid.innerHTML = '';
  list.forEach((client, i) => grid.appendChild(buildCard(client, i)));
}

function getVisible(grid: HTMLElement): number {
  return grid.querySelectorAll('.cl-card:not(.cl-card--hidden)').length;
}

function init() {
  const root = document.getElementById('clientsRoot')!;
  const webCount = CLIENTS.filter(c => c.platform === 'web').length;
  const shopifyCount = CLIENTS.filter(c => c.platform === 'shopify').length;

  root.innerHTML = `
    <section class="cl-hero">
      <p class="cl-hero__eyebrow">client work</p>
      <h1 class="cl-hero__count"><span id="clNum">0</span><span class="cl-hero__plus">+</span></h1>
      <p class="cl-hero__sub">websites designed, built, and launched</p>
    </section>

    <div class="cl-filters" id="clFilters">
      <button class="cl-filter cl-filter--active" data-filter="all">All <span class="cl-filter__n">${CLIENTS.length}</span></button>
      <button class="cl-filter" data-filter="web">WordPress / Web <span class="cl-filter__n">${webCount}</span></button>
      <button class="cl-filter" data-filter="shopify">Shopify <span class="cl-filter__n">${shopifyCount}</span></button>
    </div>

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
  let activeFilter: string = 'all';

  renderGrid(grid, order);
  setTimeout(() => countUp(document.getElementById('clNum')!, CLIENTS.length), 200);

  function applyFilters() {
    const q = searchEl.value.trim().toLowerCase();
    let n = 0;
    grid.querySelectorAll<HTMLElement>('.cl-card').forEach(card => {
      const matchSearch = !q || (card.dataset.search || '').includes(q);
      const matchFilter = activeFilter === 'all' || card.dataset.platform === activeFilter;
      const visible = matchSearch && matchFilter;
      card.classList.toggle('cl-card--hidden', !visible);
      if (visible) n++;
    });
    const total = activeFilter === 'all' ? CLIENTS.length
      : activeFilter === 'web' ? webCount : shopifyCount;
    tally.textContent = (q || activeFilter !== 'all') ? `${n} of ${total} sites` : `${total} sites`;
  }

  searchEl.addEventListener('input', applyFilters);

  document.getElementById('clFilters')!.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.cl-filter');
    if (!btn) return;
    document.querySelectorAll('.cl-filter').forEach(b => b.classList.remove('cl-filter--active'));
    btn.classList.add('cl-filter--active');
    activeFilter = btn.dataset.filter || 'all';
    applyFilters();
  });

  shuffleBtn.addEventListener('click', () => {
    grid.style.opacity = '0';
    grid.style.transform = 'scale(0.98)';
    setTimeout(() => {
      order = [...order].sort(() => Math.random() - 0.5);
      renderGrid(grid, order);
      applyFilters();
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
