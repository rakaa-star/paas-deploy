/**
 * PanenTepat — Core JavaScript Module
 * Clean, Vanilla JavaScript for Regional Simulation, Interactive Cultivation Timeline,
 * Dynamic SVG Price Charts, and Planting Decision Simulator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRegionSelector();
  initCropSpotlight();
  initJourneyTimeline();
  initPriceChart();
  initPlantingPlanner();
  initArchipelagoMap();
  initScrollEffects();
  initStatCounters();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('siteHeader');
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  // Scroll header elevation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link highlight on scroll
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      drawer.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer on clicking link
    document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ==========================================================================
   2. SECTION 4: REGION SELECTOR (KONDISI MUSIM)
   ========================================================================== */
const REGION_DATA = {
  jatim: {
    name: 'Jawa Timur',
    season: 'Peralihan (Pancaroba)',
    desc: 'Kondisi peralihan dari kemarau menuju musim hujan awal. Kelembapan tanah mulai mencukupi untuk persiapan lahan sawah dan penyiapan persemaian benih padi umur sedang.',
    rainfall: 128,
    rainfallCategory: 'Kategori: Sedang (100–150 mm)',
    rainfallBarWidth: '54%',
    temp: '28.4',
    tempCategory: 'Optimal untuk fotosintesis',
    tempDotPos: '62%',
    riskText: 'Risiko Sedang',
    riskClass: 'risk-moderate',
    riskFactors: [
      { name: 'Peluang Angin Kencang', percent: 45 },
      { name: 'Fluktuasi Ketersediaan Air', percent: 58 }
    ],
    recommendation: 'Perbaiki saluran irigasi primer dan sekunder sebelum intensitas hujan meningkat. Lakukan pengolahan tanah awal agar bahan organik terdekomposisi sempurna.',
    fitCrops: ['Padi Sawah', 'Jagung Hibrida', 'Kacang Hijau']
  },
  jateng: {
    name: 'Jawa Tengah',
    season: 'Hujan Awal (Rendeng)',
    desc: 'Intensitas hujan mulai meningkat teratur di dataran aluvial dan lereng vulkanik. Pasokan air waduk dan saluran tersier dalam kondisi prima untuk olah tanah serentak.',
    rainfall: 195,
    rainfallCategory: 'Kategori: Cukup Tinggi (180–220 mm)',
    rainfallBarWidth: '78%',
    temp: '27.1',
    tempCategory: 'Suhu sejuk lembap',
    tempDotPos: '52%',
    riskText: 'Risiko Rendah',
    riskClass: 'risk-low',
    riskFactors: [
      { name: 'Genangan Saluran Drainase', percent: 35 },
      { name: 'Kelembapan Daun Tinggi (Jamur)', percent: 48 }
    ],
    recommendation: 'Mulai sebar benih padi varietas tahan rendaman. Terapkan pemupukan dasar berimbang dan atur debit air masuk agar tidak menenggelamkan persemaian muda.',
    fitCrops: ['Padi Inpari 32', 'Bawang Merah', 'Cabai Rawit']
  },
  jabar: {
    name: 'Jawa Barat',
    season: 'Puncak Musim Hujan',
    desc: 'Kawasan barat pulau Jawa menerima curah hujan lebat dengan kelembapan udara di atas 85%. Cocok untuk lahan sawah terasering berteras dan hortikultura dataran tinggi terpilih.',
    rainfall: 260,
    rainfallCategory: 'Kategori: Tinggi (>250 mm)',
    rainfallBarWidth: '92%',
    temp: '25.8',
    tempCategory: 'Sejuk dataran tinggi',
    tempDotPos: '42%',
    riskText: 'Risiko Tinggi (Erosi & Hama)',
    riskClass: 'risk-high',
    riskFactors: [
      { name: 'Risiko Erosi / Longsor Lereng', percent: 75 },
      { name: 'Penyakit Hawar Daun Bakteri', percent: 68 }
    ],
    recommendation: 'Perkuat pematang sawah bertingkat, bersihkan drainase penampung limpasan air hujan, dan hindari penggunaan nitrogen berlebihan pada persemaian.',
    fitCrops: ['Padi Ciherang', 'Kacang Panjang', 'Ubi Jalar']
  },
  sumsel: {
    name: 'Sumatera Selatan',
    season: 'Awal Musim Hujan Lahan Rawa',
    desc: 'Kondisi pasang surut dan lebak mulai tergenang air tawar segar. Periode tepat untuk menanam padi lokal atau varietas toleran asam di kawasan rawa pasang surut.',
    rainfall: 165,
    rainfallCategory: 'Kategori: Sedang–Tinggi',
    rainfallBarWidth: '66%',
    temp: '29.2',
    tempCategory: 'Hangat tropis basah',
    tempDotPos: '70%',
    riskText: 'Risiko Sedang (Keasaman Tanah)',
    riskClass: 'risk-moderate',
    riskFactors: [
      { name: 'Kenaikan Pirit / pH Rendah', percent: 62 },
      { name: 'Fluktuasi Pasang Air Rawa', percent: 50 }
    ],
    recommendation: 'Aplikasi kapur pertanian (dolomit) untuk menetralkan pirit teroksidasi saat air pasang pertama masuk ke petak sawah.',
    fitCrops: ['Padi Inpara', 'Jagung Komposit', 'Kelapa Sawit']
  },
  sulsel: {
    name: 'Sulawesi Selatan',
    season: 'Peralihan Musim Timur ke Barat',
    desc: 'Wilayah sentra pangan timur Indonesia berada pada jeda peralihan monsun. Ketersediaan air waduk Bili-Bili dan Sadang stabil untuk rotasi palawija ke padi gadu.',
    rainfall: 140,
    rainfallCategory: 'Kategori: Sedang (120–160 mm)',
    rainfallBarWidth: '58%',
    temp: '28.9',
    tempCategory: 'Optimal terik cerah',
    tempDotPos: '66%',
    riskText: 'Risiko Rendah',
    riskClass: 'risk-low',
    riskFactors: [
      { name: 'Keterlambatan Hujan Monsun Barat', percent: 40 },
      { name: 'Serangan Penggerek Batang', percent: 45 }
    ],
    recommendation: 'Lakukan tanam serempak dalam hamparan untuk memutus siklus hama wereng dan manfaatkan sisa kelembapan tanah untuk pemupukan awal.',
    fitCrops: ['Padi Mekongga', 'Jagung Kuning', 'Kedelai']
  }
};

function initRegionSelector() {
  const regionButtons = document.querySelectorAll('.region-btn');
  const regionTag = document.getElementById('seasonRegionTag');
  const seasonName = document.getElementById('seasonName');
  const seasonDesc = document.getElementById('seasonDescription');
  const rainfallVal = document.getElementById('seasonRainfall');
  const rainfallCategory = document.getElementById('seasonRainfallCategory');
  const rainfallBar = document.getElementById('seasonRainfallBar');
  const tempVal = document.getElementById('seasonTemp');
  const tempCategory = document.getElementById('seasonTempCategory');
  const tempDot = document.getElementById('seasonTempDot');
  const riskText = document.getElementById('seasonRiskText');
  const riskFactorsWrap = document.getElementById('seasonRiskFactors');
  const recommendation = document.getElementById('seasonRecommendation');
  const fitTagsWrap = document.getElementById('seasonFitTags');

  if (!regionButtons.length) return;

  function updateSeasonUI(regionKey) {
    const data = REGION_DATA[regionKey];
    if (!data) return;

    if (regionTag) regionTag.textContent = data.name;
    if (seasonName) seasonName.textContent = data.season;
    if (seasonDesc) seasonDesc.textContent = data.desc;
    if (rainfallVal) rainfallVal.textContent = data.rainfall;
    if (rainfallCategory) rainfallCategory.textContent = data.rainfallCategory;
    if (rainfallBar) rainfallBar.style.width = data.rainfallBarWidth;
    if (tempVal) tempVal.textContent = data.temp;
    if (tempCategory) tempCategory.textContent = data.tempCategory;
    if (tempDot) tempDot.style.left = data.tempDotPos;
    if (riskText) riskText.textContent = data.riskText;
    if (recommendation) recommendation.textContent = data.recommendation;

    // Update risk factors
    if (riskFactorsWrap) {
      riskFactorsWrap.innerHTML = data.riskFactors.map(factor => `
        <div class="factor-item">
          <span class="factor-title">${factor.name}</span>
          <div class="factor-meter">
            <div class="factor-fill" style="width: ${factor.percent}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // Update fit crops tags
    if (fitTagsWrap) {
      fitTagsWrap.innerHTML = data.fitCrops.map(crop => `
        <span class="fit-tag">${crop}</span>
      `).join('');
    }
  }

  regionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      regionButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const regionKey = btn.getAttribute('data-region');
      updateSeasonUI(regionKey);
    });
  });
}

/* ==========================================================================
   3. SECTION 5: CROPS SPOTLIGHT & INTERACTIVE SWITCHER
   ========================================================================== */
const CROPS_SPOTLIGHT_DATA = {
  padi: {
    name: 'Padi Sawah',
    latin: 'Oryza sativa',
    desc: 'Komoditas pokok strategis. Memerlukan tata kelola air yang terjaga sejak persemaian hingga fase bunting. Toleran terhadap genangan namun rentan rebah jika angin kencang pada fase pengisian bulir.',
    duration: '110 – 120 Hari',
    water: 'Tinggi (800-1200 mm)',
    risk: 'Rendah – Sedang',
    harvest: 'Bulan ke-4',
    seasonFit: 'Cocok: Musim Hujan & Peralihan',
    note: 'Varietas rekomendasi: Inpari 32, Ciherang, Situ Bagendit (tahan genangan & rendemen stabil).'
  },
  jagung: {
    name: 'Jagung Hibrida',
    latin: 'Zea mays',
    desc: 'Tanaman pangan dengan toleransi kekeringan moderat dan efisiensi air tinggi. Sangat baik ditanam pada awal kemarau atau musim tanam kedua (MK-1) setelah panen padi.',
    duration: '95 – 105 Hari',
    water: 'Sedang (450-600 mm)',
    risk: 'Rendah',
    harvest: 'Bulan ke-3.5',
    seasonFit: 'Cocok: Pancaroba & Kemarau Basah',
    note: 'Varietas rekomendasi: Pioneer P35, NK212, BISI-18 (tahan bulai dan tongkol terisi rapat).'
  },
  cabai: {
    name: 'Cabai Merah Keriting',
    latin: 'Capsicum annuum',
    desc: 'Komoditas hortikultura bernilai ekonomi tinggi namun membutuhkan penanganan teliti. Sangat sensitif terhadap genangan akar dan serangan cendawan saat curah hujan tinggi.',
    duration: '80 – 90 Hari (Mulai Petik)',
    water: 'Sedang (Drainase Wajib Lancar)',
    risk: 'Tinggi (Sensitif Iklim)',
    harvest: 'Bulan ke-3 hingga 6',
    seasonFit: 'Cocok: Kemarau Terkendali',
    note: 'Varietas rekomendasi: PM999, Lado F1, Kastilo (gunakan mulsa plastik hitam perak).'
  },
  bawang: {
    name: 'Bawang Merah',
    latin: 'Allium cepa var. aggregatum',
    desc: 'Tanaman hortikultura siklus cepat. Membutuhkan sinar matahari penuh minimal 70% dan tanah lempung berpasir gembur tanpa genangan air di zona perakaran.',
    duration: '55 – 70 Hari',
    water: 'Rendah – Sedang',
    risk: 'Sedang',
    harvest: 'Bulan ke-2',
    seasonFit: 'Cocok: Musim Kemarau (Irigasi Pompa)',
    note: 'Varietas rekomendasi: Bauji, Tajuk (Nganjuk), Bima Brebes (tahan layu bakteri).'
  },
  kedelai: {
    name: 'Kedelai Lokal',
    latin: 'Glycine max',
    desc: 'Tanaman legum pemutus siklus hama dan penyubur tanah alami melalui bintil akar pengikat nitrogen. Membutuhkan air cukup hanya pada fase perkecambahan dan pengisian polong.',
    duration: '75 – 85 Hari',
    water: 'Rendah (300-450 mm)',
    risk: 'Rendah',
    harvest: 'Bulan ke-2.5',
    seasonFit: 'Cocok: Jeda Tanam Awal Kemarau',
    note: 'Varietas rekomendasi: Anjasmoro, Grobogan, Dena 1 (toleran naungan & polong tidak mudah pecah).'
  }
};

function initCropSpotlight() {
  const cropCards = document.querySelectorAll('.crop-item-card');
  const spotlightCard = document.getElementById('cropFeaturedCard');
  if (!spotlightCard || !cropCards.length) return;

  const spotlightName = document.getElementById('spotlightName');
  const spotlightLatin = document.getElementById('spotlightLatin');
  const spotlightDesc = document.getElementById('spotlightDesc');
  const spotlightDuration = document.getElementById('spotlightDuration');
  const spotlightWater = document.getElementById('spotlightWater');
  const spotlightRisk = document.getElementById('spotlightRisk');
  const spotlightHarvest = document.getElementById('spotlightHarvest');

  cropCards.forEach(card => {
    card.addEventListener('click', () => {
      const cropKey = card.getAttribute('data-crop');
      const data = CROPS_SPOTLIGHT_DATA[cropKey];
      if (!data) return;

      // Smooth visual update with subtle opacity
      spotlightCard.style.opacity = '0.7';
      spotlightCard.style.transform = 'translateY(4px)';

      setTimeout(() => {
        if (spotlightName) spotlightName.textContent = data.name;
        if (spotlightLatin) spotlightLatin.textContent = data.latin;
        if (spotlightDesc) spotlightDesc.textContent = data.desc;
        if (spotlightDuration) spotlightDuration.textContent = data.duration;
        if (spotlightWater) spotlightWater.textContent = data.water;
        if (spotlightRisk) spotlightRisk.textContent = data.risk;
        if (spotlightHarvest) spotlightHarvest.textContent = data.harvest;

        spotlightCard.style.opacity = '1';
        spotlightCard.style.transform = 'translateY(0)';
      }, 150);
    });
  });
}

/* ==========================================================================
   4. SECTION 6: PETA PERJALANAN TANAM (INTERACTIVE TIMELINE)
   ========================================================================== */
const JOURNEY_STEPS = [
  {
    step: 1,
    numStr: 'TAHAP 01',
    phaseTag: 'Fase Awal Siklus',
    title: 'Persiapan Lahan & Sanitasi Tanah',
    description: 'Bajak lahan sedalam 20–25 cm untuk membalik tanah dan mengekspos bibit hama ke sinar matahari. Campurkan pupuk kandang matang atau kompos organik minimal 2 ton/hektar serta kapur dolomit jika pH tanah berada di bawah 6.0.',
    checklist: [
      'Pembajakan dan penggaruan tanah 2 kali selang 7 hari.',
      'Pembersihan sisa jerami dan gulma gulma inang.',
      'Pengecekan pH tanah dan perataan bidang sawah.'
    ],
    weatherTip: 'Pastikan tanah dalam kondisi lembap saat pembajakan, hindari pengolahan saat tanah tergenang banjir ekstrem agar struktur tanah tidak rusak.',
    riskTip: 'Penyakit layu fusarium, jamur tular tanah, dan pembusukan akar dini akibat sisa organik mentah.'
  },
  {
    step: 2,
    numStr: 'TAHAP 02',
    phaseTag: 'Seleksi & Pembenihan',
    title: 'Pilih Benih Bersertifikat & Perendaman',
    description: 'Pilih varietas unggul bersertifikat dengan daya kecambah di atas 85%. Lakukan uji rendam larutan garam untuk memisahkan benih bernas dari benih hampa, dilanjutkan perlakuan agens hayati sebelum semai.',
    checklist: [
      'Uji apung benih dalam larutan air garam (telur terapung).',
      'Perendaman benih 24 jam dan pemeraman 48 jam hingga berkecambah.',
      'Persiapan bedengan semai dekat sumber air bersih.'
    ],
    weatherTip: 'Lindungi persemaian dari terpaan hujan lebat langsung menggunakan paranet atau mulsa jerami tipis.',
    riskTip: 'Kegagalan tumbuh seragam, benih terkontaminasi virus kerdil hampa dan serangan burung.'
  },
  {
    step: 3,
    numStr: 'TAHAP 03',
    phaseTag: 'Puncak Penanaman',
    title: 'Waktu Tanam & Penataan Jarak Tanam',
    description: 'Tanam bibit muda pada umur 15–18 hari setelah sebar dengan 1–2 bibit per rumpun. Gunakan sistem jajar legowo 2:1 atau 4:1 untuk meningkatkan aerasi dan penerimaan cahaya matahari.',
    checklist: [
      'Penanaman dangkal (kedalaman 1–2 cm) agar anakan cepat terbentuk.',
      'Penerapan pola jajar legowo untuk populasi optimal.',
      'Penyulaman bibit mati maksimal 7 hari setelah tanam.'
    ],
    weatherTip: 'Tanam ketika kondisi tanah cukup lembap dan curah hujan mulai stabil. Hindari periode cuaca ekstrem atau kekeringan mendadak.',
    riskTip: 'Kematian bibit muda akibat terbenam lumpur dalam atau kekeringan mendadak pasca pindah tanam.'
  },
  {
    step: 4,
    numStr: 'TAHAP 04',
    phaseTag: 'Fase Vegetatif & Generatif',
    title: 'Perawatan, Pemupukan & Pengendalian Hama',
    description: 'Beri pupuk susulan pertama pada 10–14 HST dan kedua pada 30–35 HST. Terapkan pengairan berselang (AWD) untuk menghemat air serta memperkuat perakaran agar tidak mudah rebah.',
    checklist: [
      'Pemupukan berimbang N-P-K berdasarkan pengamatan daun.',
      'Penyiangan gulma mekanis sebelum rumpun menutup.',
      'Monitoring rutin populasi wereng coklat dan penggerek batang.'
    ],
    weatherTip: 'Kurangi dosis nitrogen jika cuaca berkabut atau hujan lebat terus-menerus untuk mencegah hawar pelepah.',
    riskTip: 'Serangan wereng coklat, penggerek batang padi, busuk batang, dan persaingan hara dengan gulma liar.'
  },
  {
    step: 5,
    numStr: 'TAHAP 05',
    phaseTag: 'Fase Pematangan',
    title: 'Persiapan Panen & Pengeringan Lahan',
    description: 'Keringkan lahan secara bertahap 10–14 hari sebelum panen untuk mematangkan bulir secara serentak dan mempermudah mobilisasi mesin pemanen atau tenaga kerja.',
    checklist: [
      'Pengeringan air petakan sawah secara menyeluruh.',
      'Pembersihan tempat penjemuran atau persiapan terpal.',
      'Pengecekan kadar kuning bulir (90–95% menguning).'
    ],
    weatherTip: 'Pantau prakiraan cuaca 7 hari ke depan untuk menentukan jadwal panen cerah tanpa hujan mendadak.',
    riskTip: 'Bulir padi tumbuh berkecambah di malai akibat genangan dan bulir pecah akibat terlalu kering di pohon.'
  },
  {
    step: 6,
    numStr: 'TAHAP 06',
    phaseTag: 'Fase Akhir & Pasca-Panen',
    title: 'Panen & Pasca-Panen Terpadu',
    description: 'Lakukan pemotongan malai tepat waktu saat pagi hari yang cerah. Segera lakukan perontokan dan penjemuran gabah hingga mencapai kadar air aman simpan (14%) dalam waktu maksimal 24 jam.',
    checklist: [
      'Pemanenan menggunakan sabit bergerigi atau combine harvester.',
      'Perontokan segera dan penjemuran di atas terpal bersih.',
      'Pengemasan gabah dalam karung bersih berventilasi.'
    ],
    weatherTip: 'Segera tutupi gabah yang dijemur jika awan konvektif tebal pembawa hujan mulai muncul.',
    riskTip: 'Susut panen (losses) tinggi, beras menguning/berjamur akibat penundaan perontokan, dan harga jatuh.'
  }
];

function initJourneyTimeline() {
  const stepNodes = document.querySelectorAll('.step-node');
  const prevBtn = document.getElementById('prevStepBtn');
  const nextBtn = document.getElementById('nextStepBtn');
  const progressText = document.getElementById('stepProgressIndicator');

  const detailStepNum = document.getElementById('detailStepNum');
  const detailPhaseTag = document.getElementById('detailPhaseTag');
  const detailTitle = document.getElementById('detailTitle');
  const detailDescription = document.getElementById('detailDescription');
  const detailChecklist = document.getElementById('detailChecklist');
  const detailWeatherTip = document.getElementById('detailWeatherTip');
  const detailRiskTip = document.getElementById('detailRiskTip');
  const detailCard = document.getElementById('journeyDetailCard');

  let currentStepIndex = 0; // 0 to 5

  function renderStep(index) {
    const data = JOURNEY_STEPS[index];
    if (!data) return;

    // Update active classes on buttons
    stepNodes.forEach((node, i) => {
      const isActive = i === index;
      node.classList.toggle('active', isActive);
      node.setAttribute('aria-selected', isActive);
    });

    // Control buttons state
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === JOURNEY_STEPS.length - 1;
    if (progressText) progressText.textContent = `${index + 1} dari ${JOURNEY_STEPS.length} Tahapan`;

    // Smooth transition
    if (detailCard) {
      detailCard.style.opacity = '0.7';
    }

    setTimeout(() => {
      if (detailStepNum) detailStepNum.textContent = data.numStr;
      if (detailPhaseTag) detailPhaseTag.textContent = data.phaseTag;
      if (detailTitle) detailTitle.textContent = data.title;
      if (detailDescription) detailDescription.textContent = data.description;
      if (detailWeatherTip) detailWeatherTip.textContent = data.weatherTip;
      if (detailRiskTip) detailRiskTip.textContent = data.riskTip;

      if (detailChecklist) {
        detailChecklist.innerHTML = data.checklist.map(item => `
          <div class="check-item">
            <span class="check-icon">✓</span>
            <span>${item}</span>
          </div>
        `).join('');
      }

      if (detailCard) {
        detailCard.style.opacity = '1';
      }
    }, 120);
  }

  stepNodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      currentStepIndex = idx;
      renderStep(currentStepIndex);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        renderStep(currentStepIndex);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStepIndex < JOURNEY_STEPS.length - 1) {
        currentStepIndex++;
        renderStep(currentStepIndex);
      }
    });
  }
}

/* ==========================================================================
   5. SECTION 8: COMMODITY PRICE SIMULATION & DYNAMIC SVG CHART
   ========================================================================== */
const PRICE_TREND_DATA = {
  padi: {
    title: 'Tren Harga: Padi (GKP)',
    insight: 'Padi mengalami kenaikan bertahap mendekati akhir musim gadu seiring turunnya pasokan pasar regional.',
    yLabels: ['8.000', '7.000', '6.000', '5.000'],
    // Coordinates for 6 months (Mei - Okt)
    points: [
      { x: 60, y: 155, val: 'Rp 6.600' },
      { x: 130, y: 145, val: 'Rp 6.800' },
      { x: 200, y: 135, val: 'Rp 6.950' },
      { x: 270, y: 120, val: 'Rp 7.050' },
      { x: 340, y: 105, val: 'Rp 7.120' },
      { x: 410, y: 85, val: 'Rp 7.200' }
    ]
  },
  jagung: {
    title: 'Tren Harga: Jagung Pipil Kering',
    insight: 'Permintaan pabrik pakan ternak konsisten menjaga harga pipil stabil pada kisaran Rp 5.600 – 5.800/kg.',
    yLabels: ['6.500', '5.800', '5.000', '4.200'],
    points: [
      { x: 60, y: 140, val: 'Rp 5.400' },
      { x: 130, y: 125, val: 'Rp 5.550' },
      { x: 200, y: 110, val: 'Rp 5.680' },
      { x: 270, y: 115, val: 'Rp 5.650' },
      { x: 340, y: 95, val: 'Rp 5.750' },
      { x: 410, y: 80, val: 'Rp 5.800' }
    ]
  },
  cabai: {
    title: 'Tren Harga: Cabai Merah Keriting',
    insight: 'Harga cabai mengalami koreksi akibat panen serentak di Jawa Tengah dan Jawa Timur, namun diproyeksikan menguat di akhir tahun.',
    yLabels: ['55.000', '45.000', '35.000', '25.000'],
    points: [
      { x: 60, y: 65, val: 'Rp 52.000' },
      { x: 130, y: 75, val: 'Rp 49.000' },
      { x: 200, y: 90, val: 'Rp 46.500' },
      { x: 270, y: 85, val: 'Rp 47.000' },
      { x: 340, y: 115, val: 'Rp 44.200' },
      { x: 410, y: 135, val: 'Rp 42.000' }
    ]
  },
  bawang: {
    title: 'Tren Harga: Bawang Merah',
    insight: 'Pasokan dari sentra Brebes dan Nganjuk mulai berkurang, memicu tren apresiasi harga mendekati perayaan nasional.',
    yLabels: ['40.000', '32.000', '24.000', '16.000'],
    points: [
      { x: 60, y: 150, val: 'Rp 26.000' },
      { x: 130, y: 138, val: 'Rp 27.500' },
      { x: 200, y: 130, val: 'Rp 28.200' },
      { x: 270, y: 115, val: 'Rp 29.400' },
      { x: 340, y: 100, val: 'Rp 30.200' },
      { x: 410, y: 82, val: 'Rp 31.000' }
    ]
  }
};

function initPriceChart() {
  const priceRows = document.querySelectorAll('.price-row');
  const chartTitle = document.getElementById('chartCropTitle');
  const insightNote = document.getElementById('chartInsightNote');
  const linePath = document.getElementById('chartLinePath');
  const areaPath = document.getElementById('chartAreaPath');
  const nodesGroup = document.getElementById('chartNodesGroup');

  const yMaxLabel = document.getElementById('yMaxLabel');
  const yMidLabel1 = document.getElementById('yMidLabel1');
  const yMidLabel2 = document.getElementById('yMidLabel2');
  const yMinLabel = document.getElementById('yMinLabel');

  if (!priceRows.length || !linePath) return;

  function updateChart(cropKey) {
    const data = PRICE_TREND_DATA[cropKey];
    if (!data) return;

    if (chartTitle) chartTitle.textContent = data.title;
    if (insightNote) insightNote.textContent = data.insight;

    // Update Y Labels
    if (yMaxLabel) yMaxLabel.textContent = data.yLabels[0];
    if (yMidLabel1) yMidLabel1.textContent = data.yLabels[1];
    if (yMidLabel2) yMidLabel2.textContent = data.yLabels[2];
    if (yMinLabel) yMinLabel.textContent = data.yLabels[3];

    // Build SVG path strings
    const pts = data.points;
    const lineD = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const areaD = `${lineD} L ${pts[pts.length - 1].x} 180 L ${pts[0].x} 180 Z`;

    linePath.setAttribute('d', lineD);
    areaPath.setAttribute('d', areaD);

    // Render interactive node circles
    if (nodesGroup) {
      nodesGroup.innerHTML = pts.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" class="chart-node-circle">
          <title>${p.val}</title>
        </circle>
      `).join('');
    }
  }

  // Initial draw
  updateChart('padi');

  priceRows.forEach(row => {
    row.addEventListener('click', () => {
      priceRows.forEach(r => r.classList.remove('active-row'));
      row.classList.add('active-row');
      const cropKey = row.getAttribute('data-crop-price');
      updateChart(cropKey);
    });
  });
}

/* ==========================================================================
   6. SECTION 9: CEK RENCANA TANAM (INTERACTIVE PLANNER SIMULATOR)
   ========================================================================== */
function initPlantingPlanner() {
  const analyzeBtn = document.getElementById('btnAnalyzePlan');
  const regionSelect = document.getElementById('planRegion');
  const cropSelect = document.getElementById('planCrop');
  const seasonSelect = document.getElementById('planSeason');

  const resultCard = document.getElementById('plannerResultCard');
  const resultStatusBanner = document.getElementById('resultStatusBanner');
  const resultStatusIcon = document.getElementById('resultStatusIcon');
  const resultStatusTitle = document.getElementById('resultStatusTitle');
  const resultNarrative = document.getElementById('resultNarrative');
  const resultPlantTime = document.getElementById('resultPlantTime');
  const resultRiskLevel = document.getElementById('resultRiskLevel');
  const resultWaterNeed = document.getElementById('resultWaterNeed');
  const resultDuration = document.getElementById('resultDuration');
  const resultKeyPoints = document.getElementById('resultKeyPoints');

  if (!analyzeBtn) return;

  function runSimulation() {
    const region = regionSelect ? regionSelect.value : 'jatim';
    const crop = cropSelect ? cropSelect.value : 'padi';
    const season = seasonSelect ? seasonSelect.value : 'peralihan';

    let statusType = 'recommended'; // 'recommended' | 'moderate' | 'caution'
    let statusIcon = '✓';
    let statusTitle = '';
    let narrative = '';
    let plantTime = '';
    let riskLevel = '';
    let waterNeed = '';
    let duration = '';
    let keyPoints = [];

    // Combinatorial simulation logic
    if (crop === 'padi') {
      if (season === 'peralihan' || season === 'hujan') {
        statusType = 'recommended';
        statusIcon = '✓';
        statusTitle = 'Rencana Tanam Sangat Direkomendasikan';
        narrative = `Kondisi ${season} di wilayah pilihan Anda sangat mendukung pertumbuhan vegetatif awal padi sawah. Ketersediaan air alami memadai dan menurunkan kebutuhan biaya pompa mekanis.`;
        plantTime = '1 – 3 Minggu ke depan (Awal Musim)';
        riskLevel = 'Rendah – Sedang (Mitigasi Gulma & Jamur)';
        waterNeed = 'Tinggi (Pertahankan macak-macak di awal)';
        duration = '110 – 120 Hari (Varietas Unggul)';
        keyPoints = [
          'Gunakan benih berlabel bersertifikasi untuk memastikan daya tumbuh > 85%.',
          'Terapkan sistem tanam jajar legowo untuk mempermudah pemeliharaan.',
          'Siapkan saluran buangan air agar persemaian muda tidak terendam banjir mendadak.'
        ];
      } else { // kemarau
        statusType = 'caution';
        statusIcon = '⚠';
        statusTitle = 'Tinggi Risiko — Perlu Jaminan Irigasi Teknis';
        narrative = `Menanam padi di musim kemarau membutuhkan jaminan pasokan air waduk atau sumur dalam yang handal. Jika pasokan terbatas, pertimbangkan beralih ke komoditas palawija.`;
        plantTime = 'Hanya jika debit saluran primer stabil';
        riskLevel = 'Tinggi (Kekeringan pada fase bunting)';
        waterNeed = 'Tinggi (Kebutuhan pompanisasi meningkat)';
        duration = '105 – 115 Hari (Pilih varietas genjah)';
        keyPoints = [
          'Terapkan pengairan berselang (AWD) untuk menghemat hingga 30% konsumsi air.',
          'Gunakan varietas padi toleran kekeringan seperti Inpari 38 atau Situ Bagendit.',
          'Pastikan koordinasi buka-tutup pintu air dengan kelompok HIPPA desa.'
        ];
      }
    } else if (crop === 'jagung') {
      if (season === 'kemarau' || season === 'peralihan') {
        statusType = 'recommended';
        statusIcon = '✓';
        statusTitle = 'Rencana Tanam Sangat Optimal';
        narrative = `Jagung sangat cocok ditanam pada musim peralihan hingga kemarau. Penyinaran matahari penuh mempercepat pengisian tongkol dan meminimalkan serangan penyakit bulai.`;
        plantTime = '2 Minggu ke depan setelah olah tanah';
        riskLevel = 'Rendah (Ketahanan kekeringan baik)';
        waterNeed = 'Sedang (Cukupi di fase pembungaan)';
        duration = '95 – 105 Hari';
        keyPoints = [
          'Lakukan penjarangan tanaman pada umur 10–12 HST untuk jarak seragam.',
          'Beri pupuk urea dan NPK pada umur 15 HST dan 35 HST.',
          'Waspadai ulat grayak (FAW) pada pucuk daun muda.'
        ];
      } else { // hujan
        statusType = 'moderate';
        statusIcon = 'ℹ';
        statusTitle = 'Cukup Layak dengan Catatan Drainase';
        narrative = `Jagung dapat tumbuh di musim hujan asalkan bedengan dibuat lebih tinggi (30–40 cm) agar akar tidak terendam air yang memicu busuk tongkol dan rebah batang.`;
        plantTime = 'Pilih jeda hari cerah untuk penanaman benih';
        riskLevel = 'Sedang (Busuk batang & penyakit bulai)';
        waterNeed = 'Rendah – Terpenuhi alami oleh hujan';
        duration = '100 Hari';
        keyPoints = [
          'Perdalam parit pembuangan air di sekeliling petak tanaman.',
          'Gunakan benih yang telah diberi fungisida perlakuan benih (seed treatment).',
          'Hindari pemupukan berlebihan yang membuat batang terlalu sukulen.'
        ];
      }
    } else if (crop === 'cabai') {
      if (season === 'kemarau' || season === 'peralihan') {
        statusType = 'recommended';
        statusIcon = '✓';
        statusTitle = 'Rencana Tanam Potensial (Nilai Ekonomi Tinggi)';
        narrative = `Kondisi terik dengan suplai air terkontrol adalah habitat terbaik bagi cabai merah. Kualitas buah lebih cerah, padat, dan bebas bercak patek.`;
        plantTime = 'Awal musim kemarau saat bedengan siap';
        riskLevel = 'Sedang (Kutu kebul & thrips)';
        waterNeed = 'Sedang (Irigasi tetes / kocoran rutin)';
        duration = '80 – 90 Hari (Mulai panen bertahap)';
        keyPoints = [
          'Pasang mulsa plastik perak-hitam untuk menjaga kelembapan dan menekan gulma.',
          'Pasang perangkap kuning berperekat untuk memonitor serangga vektor virus kuning.',
          'Lakukan pemupukan kalsium untuk mencegah busuk pantat buah (blossom end rot).'
        ];
      } else { // hujan
        statusType = 'caution';
        statusIcon = '⚠';
        statusTitle = 'Tinggi Risiko Penyakit Jamur (Antraknosa)';
        narrative = `Menanam cabai di musim hujan membutuhkan investasi fungisida dan atap naungan plastik (rain shelter) untuk mencegah kerontokan bunga massal dan patek buah.`;
        plantTime = 'Disarankan ditunda atau gunakan sungkup plastik';
        riskLevel = 'Sangat Tinggi (Layu bakteri & antraknosa)';
        waterNeed = 'Sensitif terhadap kelebihan genangan';
        duration = '90 Hari';
        keyPoints = [
          'Tinggikan guludan minimal 40 cm dan perlebar jarak tanam menjadi 60x70 cm.',
          'Semprot agens hayati Trichoderma secara preventif setiap 5 hari.',
          'Segera pangkas dan bakar daun atau buah yang terserang busuk patek.'
        ];
      }
    } else if (crop === 'bawang') {
      if (season === 'kemarau') {
        statusType = 'recommended';
        statusIcon = '✓';
        statusTitle = 'Rencana Tanam Sangat Cocok';
        narrative = `Bawang merah menghasilkan umbi padat dan berwarna merah cerah jika mendapat sinar matahari melimpah dengan pengairan siram pagi/sore hari.`;
        plantTime = 'Segera siapkan umbi bibit bertunas 1–2 cm';
        riskLevel = 'Rendah – Sedang (Ulat grayak)';
        waterNeed = 'Sedang (Penyiraman rutin permukaan tanah)';
        duration = '55 – 65 Hari (Siklus cepat)';
        keyPoints = [
          'Gunakan umbi bibit yang telah disimpan 2–3 bulan pasca panen.',
          'Pengolahan tanah dibuat gembur sempurna dan diberi pupuk kandang matang.',
          'Lakukan penyiraman setiap pagi untuk membilas embun beracun.'
        ];
      } else {
        statusType = 'caution';
        statusIcon = '⚠';
        statusTitle = 'Perhatian Khusus — Rawan Penyakit Moler';
        narrative = `Hujan terus menerus membuat daun bawang rapuh dan mudah terserang fusarium (moler). Diperlukan drainase sangat cepat dan fungisida protektif.`;
        plantTime = 'Tunggu masa peralihan dengan curah hujan melandai';
        riskLevel = 'Tinggi (Penyakit moler & busuk umbi)';
        waterNeed = 'Rendah (Sensitif air berlebih)';
        duration = '60 – 70 Hari';
        keyPoints = [
          'Buat parit antar bedengan sedalam 40–50 cm.',
          'Taburkan kapur pertanian dolomit untuk menaikkan pH tanah ke 6.5.',
          'Hindari pupuk daun berkadar nitrogen tinggi.'
        ];
      }
    } else { // kedelai
      statusType = 'recommended';
      statusIcon = '✓';
      statusTitle = 'Rencana Rotasi Tanah Sangat Baik';
      narrative = `Kedelai adalah komoditas ideal untuk mengistirahatkan lahan sawah, memutus siklus hama padi, dan mengembalikan kesuburan biologis tanah tanpa modal tinggi.`;
      plantTime = 'Segera setelah panen padi sawah (tanpa olah tanah)';
      riskLevel = 'Rendah';
      waterNeed = 'Rendah (Memanfaatkan sisa kelembapan tanah)';
      duration = '75 – 85 Hari';
      keyPoints = [
        'Tanam sistem tugal pada jerami sisa panen (TOT - Tanpa Olah Tanah).',
        'Inokulasi benih dengan Rhizobium untuk mempercepat pembentukan bintil akar.',
        'Kendalikan lalat bibit pada 7–10 HST dengan insektisida nabati.'
      ];
    }

    // Apply classes & dynamic HTML
    if (resultStatusBanner) {
      resultStatusBanner.className = `result-status-banner status-${statusType}`;
    }
    if (resultStatusIcon) resultStatusIcon.textContent = statusIcon;
    if (resultStatusTitle) resultStatusTitle.textContent = statusTitle;
    if (resultNarrative) resultNarrative.textContent = narrative;
    if (resultPlantTime) resultPlantTime.textContent = plantTime;
    if (resultRiskLevel) resultRiskLevel.textContent = riskLevel;
    if (resultWaterNeed) resultWaterNeed.textContent = waterNeed;
    if (resultDuration) resultDuration.textContent = duration;

    if (resultKeyPoints) {
      resultKeyPoints.innerHTML = keyPoints.map(point => `<li>${point}</li>`).join('');
    }

    // Smooth feedback animation
    if (resultCard) {
      resultCard.style.transform = 'scale(0.98)';
      setTimeout(() => {
        resultCard.style.transform = 'scale(1)';
      }, 150);
    }
  }

  analyzeBtn.addEventListener('click', runSimulation);
}

/* ==========================================================================
   7. SECTION 11: ABOUT INDONESIA (ARCHIPELAGO MAP INTERACTION)
   ========================================================================== */
const ARCHIPELAGO_DATA = {
  jatim: {
    tag: 'Wilayah Agro-Klimat: Jawa Timur',
    title: 'Jawa Timur — Lumbung Pangan Monsunal',
    body: 'Memiliki tipe iklim monsunal tegas dengan musim kemarau yang nyata dan musim hujan yang teratur. Pola tanam umum: Padi – Padi – Palawija (Jagung/Kedelai). Irigasi teknis di sepanjang aliran Sungai Brantas dan Bengawan Solo menjadi penopang utama kestabilan panen padi provinsi ini.',
    cropPattern: 'Padi (Rendeng) → Padi (Gadu) → Jagung',
    soil: 'Aluvial, Grumosol & Andosol Subur',
    seasonKey: 'jatim'
  },
  jabar: {
    tag: 'Wilayah Agro-Klimat: Jawa Barat',
    title: 'Jawa Barat — Dataran Lembap Khatulistiwa',
    body: 'Didominasi curah hujan tahunan tinggi dengan bentang alam vulkanik subur dan lembah terasering. Sentra tanaman padi di Pantura (Karawang, Subang, Indramayu) berpadu dengan sentra hortikultura sayuran dataran tinggi di Bandung dan Garut.',
    cropPattern: 'Padi Sawah Intensif → Sayuran Hortikultura',
    soil: 'Latosol, Regosol & Andosol Vulkanik',
    seasonKey: 'jabar'
  },
  sumsel: {
    tag: 'Wilayah Agro-Klimat: Sumatera Selatan',
    title: 'Sumatera Selatan — Ekosistem Rawa & Dataran Rendah',
    body: 'Kawasan lumbung pangan pulau Sumatera dengan kekayaan lahan pasang surut dan rawa lebak terpadu. Pengelolaan tata air mikro (pintu air ayun/flap gate) menjadi kunci keberhasilan budidaya padi sawah pasang surut.',
    cropPattern: 'Padi Rawa Pasang Surut → Kelapa Sawit / Karet',
    soil: 'Organosol (Gambut Dangkal) & Podsolik Merah Kuning',
    seasonKey: 'sumsel'
  },
  sulsel: {
    tag: 'Wilayah Agro-Klimat: Sulawesi Selatan',
    title: 'Sulawesi Selatan — Pilar Ketahanan Pangan Kawasan Timur',
    body: 'Sentra produksi beras dan jagung terbesar di Indonesia Timur. Memiliki dua pola musim berbeda antara Pantai Barat (hujan November–April) dan Pantai Timur (hujan April–Juli), memungkinkan panen raya bergulir sepanjang tahun.',
    cropPattern: 'Padi Sawah Berkelanjutan → Jagung Hibrida',
    soil: 'Aluvial Lembah Sungai & Mediteran',
    seasonKey: 'sulsel'
  }
};

function initArchipelagoMap() {
  const mapPins = document.querySelectorAll('.map-pin');
  const tagEl = document.getElementById('mapFeatureTag');
  const titleEl = document.getElementById('mapFeatureTitle');
  const bodyEl = document.getElementById('mapFeatureBody');
  const cropPatternEl = document.getElementById('mapFeatureCropPattern');
  const soilEl = document.getElementById('mapFeatureSoil');
  const syncLink = document.getElementById('mapSyncSeasonLink');

  if (!mapPins.length) return;

  function setFeature(pinKey) {
    const data = ARCHIPELAGO_DATA[pinKey];
    if (!data) return;

    mapPins.forEach(p => {
      const isSelected = p.getAttribute('data-pin') === pinKey;
      p.classList.toggle('active-pin', isSelected);
      const pulse = p.querySelector('.pin-pulse');
      const core = p.querySelector('.pin-core');
      if (pulse && core) {
        pulse.setAttribute('fill', isSelected ? '#C25E3E' : '#19382B');
        pulse.setAttribute('opacity', isSelected ? '0.28' : '0.15');
        core.setAttribute('fill', isSelected ? '#C25E3E' : '#19382B');
      }
    });

    if (tagEl) tagEl.textContent = data.tag;
    if (titleEl) titleEl.textContent = data.title;
    if (bodyEl) bodyEl.textContent = data.body;
    if (cropPatternEl) cropPatternEl.textContent = data.cropPattern;
    if (soilEl) soilEl.textContent = data.soil;
  }

  mapPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const pinKey = pin.getAttribute('data-pin');
      setFeature(pinKey);
    });

    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const pinKey = pin.getAttribute('data-pin');
        setFeature(pinKey);
      }
    });
  });

  if (syncLink) {
    syncLink.addEventListener('click', (e) => {
      const activePin = document.querySelector('.map-pin.active-pin');
      if (activePin) {
        const pinKey = activePin.getAttribute('data-pin');
        const seasonBtn = document.querySelector(`.region-btn[data-region="${pinKey}"]`);
        if (seasonBtn) {
          seasonBtn.click();
        }
      }
    });
  }
}

/* ==========================================================================
   8. SCROLL REVEAL & FLOATING CTA VISIBILITY
   ========================================================================== */
function initScrollEffects() {
  const sections = document.querySelectorAll('.section, .hero-section');
  const floatingCta = document.getElementById('floatingCta');

  // Add reveal class to cards and elements
  document.querySelectorAll('.season-card, .crop-spotlight-card, .crop-item-card, .journey-detail-card, .risk-card, .price-table-wrapper, .price-chart-card, .planner-form-card, .planner-result-card, .pillar-card, .map-visual-container, .map-region-editorial').forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

  // Toggle floating CTA button when scrolling past hero
  window.addEventListener('scroll', () => {
    if (floatingCta) {
      if (window.scrollY > 600) {
        floatingCta.style.opacity = '1';
        floatingCta.style.pointerEvents = 'auto';
        floatingCta.style.transform = 'translateY(0)';
      } else {
        floatingCta.style.opacity = '0';
        floatingCta.style.pointerEvents = 'none';
        floatingCta.style.transform = 'translateY(16px)';
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   9. NUMBER COUNTER ANIMATION FOR HERO STATS
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetEl = entry.target;
        const targetValue = parseInt(targetEl.getAttribute('data-target'), 10) || 0;
        const suffix = targetEl.getAttribute('data-suffix') || '';
        const duration = 1400; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * targetValue);

          targetEl.textContent = `${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            targetEl.textContent = `${targetValue}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(targetEl);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => counterObserver.observe(stat));
}
