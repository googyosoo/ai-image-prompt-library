export interface LegoBlock {
  id: string;
  category: 'subject' | 'cameraAngle' | 'lens' | 'lighting' | 'artStyle' | 'mood' | 'details';
  name: string;
  koreanName: string;
  value: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export interface LegoCategoryConfig {
  key: LegoBlock['category'];
  label: string;
  koreanLabel: string;
  iconName: string;
  colorClass: {
    badge: string;
    bg: string;
    border: string;
    text: string;
    active: string;
  };
  singleSelect?: boolean;
}

export const LEGO_CATEGORIES: LegoCategoryConfig[] = [
  {
    key: 'subject',
    label: 'Subject',
    koreanLabel: '피사체 / 주제',
    iconName: 'User',
    colorClass: {
      badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800/80',
      text: 'text-indigo-900 dark:text-indigo-200',
      active: 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20',
    },
    singleSelect: false,
  },
  {
    key: 'cameraAngle',
    label: 'Camera Angle',
    koreanLabel: '카메라 앵글 & 구도',
    iconName: 'Camera',
    colorClass: {
      badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200 dark:border-sky-800/80',
      text: 'text-sky-900 dark:text-sky-200',
      active: 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-500/20',
    },
    singleSelect: true,
  },
  {
    key: 'lens',
    label: 'Lens & Focus',
    koreanLabel: '렌즈 & 초점/심도',
    iconName: 'Aperture',
    colorClass: {
      badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      border: 'border-cyan-200 dark:border-cyan-800/80',
      text: 'text-cyan-900 dark:text-cyan-200',
      active: 'bg-cyan-600 text-white border-cyan-600 shadow-sm shadow-cyan-500/20',
    },
    singleSelect: true,
  },
  {
    key: 'lighting',
    label: 'Lighting',
    koreanLabel: '조명 & 빛 효과',
    iconName: 'Sun',
    colorClass: {
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800/80',
      text: 'text-amber-900 dark:text-amber-200',
      active: 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-500/20',
    },
    singleSelect: false,
  },
  {
    key: 'artStyle',
    label: 'Art Style / Engine',
    koreanLabel: '화풍 & 렌더 엔진',
    iconName: 'Palette',
    colorClass: {
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200 dark:border-purple-800/80',
      text: 'text-purple-900 dark:text-purple-200',
      active: 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20',
    },
    singleSelect: true,
  },
  {
    key: 'mood',
    label: 'Mood & Color',
    koreanLabel: '분위기 & 색감',
    iconName: 'Flame',
    colorClass: {
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800/80',
      text: 'text-rose-900 dark:text-rose-200',
      active: 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/20',
    },
    singleSelect: false,
  },
  {
    key: 'details',
    label: 'Quality & Details',
    koreanLabel: '디테일 & 퀄리티',
    iconName: 'Sparkles',
    colorClass: {
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      text: 'text-emerald-900 dark:text-emerald-200',
      active: 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20',
    },
    singleSelect: false,
  },
];

export const ALL_LEGO_BLOCKS: LegoBlock[] = [
  // 1. SUBJECTS (피사체)
  {
    id: 'sub-cyberpunk-samurai',
    category: 'subject',
    name: 'Cyberpunk Neon Samurai',
    koreanName: '사이버펑크 네온 사무라이',
    value: 'A futuristic cyberpunk cyber-samurai wearing high-tech composite armor with illuminated glowing circuit lines and a holographic katana blade',
    description: '하이테크 복합 방어구와 홀로그램 카타나를 장착한 미래형 사이버 전사',
  },
  {
    id: 'sub-korean-model',
    category: 'subject',
    name: 'High-fashion Korean Model',
    koreanName: '하이패션 한국인 모델',
    value: 'A stunning East Asian fashion model with sleek styled hair, minimalist haute-couture avant-garde attire, elegant pose',
    description: '아방가르드 하이패션 의상을 입은 동양인 패션 모델',
  },
  {
    id: 'sub-pixar-fox',
    category: 'subject',
    name: 'Cute 3D Pixar Baby Fox',
    koreanName: '3D 픽사 스타일 아기 여우',
    value: 'An adorable cute fluffy baby red fox wearing a tiny knit yellow scarf, huge expressive glossy eyes, soft velvet fur',
    description: '작은 노란 니트 목도리를 두른 픽사 풍의 사랑스러운 아기 여우',
  },
  {
    id: 'sub-luxury-perfume',
    category: 'subject',
    name: 'Luxury Crystal Perfume Bottle',
    koreanName: '럭셔리 크리스탈 향수병',
    value: 'A premium faceted geometric crystal perfume bottle with gold metallic cap, resting on a wet dark obsidian podium with rippling clear water drops',
    description: '물방울이 맺힌 흑요석 받침대 위의 고급 크리스탈 향수 보틀',
  },
  {
    id: 'sub-mecha-robot',
    category: 'subject',
    name: 'Titan Heavy Mecha Robot',
    koreanName: '타이탄 중무장 메카닉 로봇',
    value: 'A colossal industrial combat mech robot with heavy dual rail cannons, worn white matte armor plates, heat vent exhaust fumes',
    description: '열기 배출구와 레일건을 탑재한 거대 중무장 전투 로봇',
  },
  {
    id: 'sub-zen-botanical',
    category: 'subject',
    name: 'Victorian Glasshouse Conservatory',
    koreanName: '빅토리아풍 식물원 온실',
    value: 'An ornate Victorian botanical glasshouse greenhouse overflowing with exotic lush tropical ferns, blooming orchids, mist vapor',
    description: '열대 고사리와 난초, 안개가 피어오르는 앤틱 온실 식물원',
  },
  {
    id: 'sub-retro-astronaut',
    category: 'subject',
    name: 'Retro 80s Deep Space Astronaut',
    koreanName: '80년대 레트로 우주비행사',
    value: 'A vintage retro astronaut floating in zero gravity against a glittering cosmic nebula, golden reflective sun visor helmet',
    description: '금빛 바이저 헬멧을 쓰고 무중력 우주를 유영하는 우주비행사',
  },
  {
    id: 'sub-fantasy-potion',
    category: 'subject',
    name: 'Bioluminescent Alchemy Potion',
    koreanName: '발광 연금술 마법 물약',
    value: 'A glowing iridescent glass alchemy flask filled with swirling star-dust liquid, floating botanical leaves, runic engravings',
    description: '룬 문자가 새겨진 영롱한 발광 마법 물약 플라스크',
  },

  // 2. CAMERA ANGLE & SHOT TYPE (카메라 앵글 및 구도)
  {
    id: 'cam-extreme-close-up',
    category: 'cameraAngle',
    name: 'Extreme Macro Close-up',
    koreanName: '초접사 익스트림 클로즈업',
    value: 'Extreme close-up macro framing capturing microscopic texture and intricate eye reflection',
    description: '눈동자 반사와 미세 질감을 극대화하는 극초접사 앵글',
  },
  {
    id: 'cam-portrait-close-up',
    category: 'cameraAngle',
    name: 'Portrait Headshot',
    koreanName: '인물 클로즈업 헤드샷',
    value: 'Tight portrait shot framed from the shoulders up, expressive facial focus',
    description: '어깨 위 상반신 및 인물 표정에 집중하는 헤드샷',
  },
  {
    id: 'cam-medium-shot',
    category: 'cameraAngle',
    name: 'Cinematic Medium Shot',
    koreanName: '시네마틱 미디엄 샷',
    value: 'Cinematic medium shot from the waist up, balanced framing of subject and surrounding environment',
    description: '허리 위 상반신과 주변 배경이 조화를 이루는 미디엄 샷',
  },
  {
    id: 'cam-full-body-wide',
    category: 'cameraAngle',
    name: 'Full Body Wide Shot',
    koreanName: '전신 와이드 샷',
    value: 'Full body wide-angle shot showcasing silhouette, posture, and grand environmental scale',
    description: '인물의 전신 포즈와 거대한 공간 배경을 담아내는 와이드 샷',
  },
  {
    id: 'cam-low-angle',
    category: 'cameraAngle',
    name: 'Heroic Low Angle',
    koreanName: '역동적인 로우 앵글',
    value: 'Dramatic low-angle worm-eye perspective looking upward, emphasizing immense scale, power and grandeur',
    description: '아래에서 올려다보며 웅장함과 위엄을 주는 웜아이 로우 앵글',
  },
  {
    id: 'cam-birds-eye',
    category: 'cameraAngle',
    name: 'Bird’s Eye Top-down',
    koreanName: '버드아이 탑다운 (항공 뷰)',
    value: 'Direct 90-degree overhead bird’s-eye view, geometric architectural layout and top-down perspective',
    description: '직각 90도 상공에서 수직으로 내려다보는 항공 탑다운 구도',
  },
  {
    id: 'cam-isometric',
    category: 'cameraAngle',
    name: 'Isometric 3D Orthographic',
    koreanName: '아이소메트릭 3D 뷰',
    value: 'Isometric orthographic 3D projection view, clean 45-degree angle dioramas',
    description: '45도 각도의 정밀한 디오라마 입체 원근 뷰',
  },
  {
    id: 'cam-dutch-angle',
    category: 'cameraAngle',
    name: 'Dynamic Dutch Tilt Angle',
    koreanName: '다이내믹 더치 틸트 앵글',
    value: 'Dynamic tilted Dutch angle framing creating intense cinematic tension and kinetic energy',
    description: '카메라를 사선으로 기울여 긴장감과 속도감을 부여하는 구도',
  },

  // 3. LENS & FOCUS (렌즈 및 초점)
  {
    id: 'lens-85mm-portrait',
    category: 'lens',
    name: '85mm f/1.4 Creamy Bokeh',
    koreanName: '85mm f/1.4 인물 보케 렌즈',
    value: 'Shot on 85mm f/1.4 prime lens, razor-sharp subject focus with ultra-creamy dreamy background bokeh blur',
    description: '피사체는 칼초점, 배경은 몽환적으로 흐려지는 대표 인물 렌즈',
  },
  {
    id: 'lens-35mm-cinema',
    category: 'lens',
    name: '35mm Street Lens',
    koreanName: '35mm 시네마 다큐멘터리 렌즈',
    value: 'Shot on 35mm lens, natural field of view, cinematic environmental depth of field',
    description: '자연스러운 인간의 시야각과 영화적 배경감을 담는 렌즈',
  },
  {
    id: 'lens-anamorphic',
    category: 'lens',
    name: 'Anamorphic 2.39:1 Cinema Flare',
    koreanName: '아나모픽 시네마 렌즈 플레어',
    value: 'Shot on vintage anamorphic cinema lens, horizontal blue streak lens flares, oval bokeh discs',
    description: '수평 푸른 광선 플레어와 타원형 보케가 돋보이는 영화용 렌즈',
  },
  {
    id: 'lens-macro',
    category: 'lens',
    name: '100mm Macro Close-up',
    koreanName: '100mm 마크로 접사 렌즈',
    value: '100mm f/2.8 Macro lens, extreme microscopic detail, shallow depth of field on minute surface textures',
    description: '미세한 표면 질감과 입자까지 선명하게 포착하는 접사 렌즈',
  },
  {
    id: 'lens-ultra-wide',
    category: 'lens',
    name: '14mm Ultra Wide-angle',
    koreanName: '14mm 초광각 렌즈',
    value: '14mm ultra-wide angle lens, sweeping expansive panoramic perspective with dramatic edge stretch',
    description: '광활한 풍경과 공간을 한눈에 담는 시원한 초광각 왜곡 렌즈',
  },
  {
    id: 'lens-hasselblad',
    category: 'lens',
    name: 'Hasselblad Medium Format',
    koreanName: '핫셀블라드 중형 포맷 카메라',
    value: 'Hasselblad 100MP medium format studio camera sensor, unparalleled tonal range and flawless micro-contrast',
    description: '압도적인 해상력과 풍부한 계조의 상업 사진용 중형 카메라 룩',
  },

  // 4. LIGHTING (조명 & 빛 연출)
  {
    id: 'light-volumetric-godrays',
    category: 'lighting',
    name: 'Volumetric God Rays (Tyndall)',
    koreanName: '틴들 현상 갓레이 빛내림',
    value: 'Dramatic volumetric god rays beaming through atmospheric dust haze, sunbeams crepuscular rays',
    description: '먼지 서린 대기 사이로 쏟아지는 신비로운 햇살 빛줄기',
  },
  {
    id: 'light-golden-hour',
    category: 'lighting',
    name: 'Golden Hour Sunset Warmth',
    koreanName: '골든아워 황금빛 석양광',
    value: 'Warm golden hour late afternoon sunlight, long dramatic soft shadows, rich warm amber highlights',
    description: '해질녘 부드럽고 따스하게 감싸는 황금빛 자연광',
  },
  {
    id: 'light-neon-rim',
    category: 'lighting',
    name: 'Cyberpunk Dual Neon Rim Light',
    koreanName: '사이버펑크 듀얼 네온 림라이트',
    value: 'High-contrast dual neon rim lighting, electric cyan and vibrant magenta backlights sculpting edges',
    description: '피사체의 외곽선을 날카롭게 살려주는 사이언/마젠타 네온 테두리 광원',
  },
  {
    id: 'light-chiaroscuro',
    category: 'lighting',
    name: 'Cinematic Moody Chiaroscuro',
    koreanName: '키아로스쿠로 명암 대비 조명',
    value: 'Dramatic chiaroscuro moody lighting, deep intense shadows, single directional spotlight carving shapes',
    description: '카라바조 유화풍의 극단적 명암 대조로 고전적 무게감을 주는 조명',
  },
  {
    id: 'light-studio-softbox',
    category: 'lighting',
    name: 'Commercial Studio Softbox Diffusion',
    koreanName: '상업 스튜디오 소프트박스 확산광',
    value: 'Professional high-end studio lighting with large diffused octabox key light, gentle fill, clean catchlights',
    description: '잡티 없이 부드러운 하이라이트를 주는 광고 스튜디오 조명',
  },
  {
    id: 'light-bioluminescent',
    category: 'lighting',
    name: 'Ethereal Bioluminescent Glow',
    koreanName: '신비로운 생체 발광 글로우',
    value: 'Soft magical bioluminescent teal and violet glow emanating from glowing spores and crystalline accents',
    description: '자체 발광하는 버섯/수정에서 뿜어져 나오는 몽환적인 자체 발광',
  },

  // 5. ART STYLE & ENGINE (화풍 및 렌더 엔진)
  {
    id: 'style-ue5',
    category: 'artStyle',
    name: 'Unreal Engine 5 (Lumen & Nanite)',
    koreanName: '언리얼 엔진 5 (루멘 렌더)',
    value: 'Rendered in Unreal Engine 5, Lumen global illumination, real-time ray-traced reflections, Nanite geometry',
    description: '차세대 게임 엔진 특유의 실시간 반사광과 고밀도 지오메트리 룩',
  },
  {
    id: 'style-octane',
    category: 'artStyle',
    name: 'Octane 3D Hyper-Render',
    koreanName: '옥테인 3D 하이퍼 렌더링',
    value: 'Octane Render 3D, hyper-realistic physical materials, subsurface scattering, 8k CGI masterpiece',
    description: '완벽한 물리 기반 텍스처와 투명도를 자랑하는 하이엔드 3D 렌더',
  },
  {
    id: 'style-makoto-shinkai',
    category: 'artStyle',
    name: 'Makoto Shinkai Anime Aesthetic',
    koreanName: '신카이 마코토 감성 애니메이션',
    value: 'Makoto Shinkai aesthetic anime art style, vibrant luminous sky with fluffy cumulus clouds, sparkling reflections, emotive anime artwork',
    description: '빛의 마술사 풍의 청량한 하늘, 뭉게구름, 눈부신 반사광 감성',
  },
  {
    id: 'style-ghibli-watercolor',
    category: 'artStyle',
    name: 'Studio Ghibli Hand-painted Watercolor',
    koreanName: '스튜디오 지브리 핸드페인팅 수채화',
    value: 'Classic Studio Ghibli animation aesthetic, hand-painted gouache and watercolor textures, nostalgic wholesome atmosphere',
    description: '따뜻한 감성과 아날로그 수채 과슈 물감 질감의 지브리풍 화풍',
  },
  {
    id: 'style-pixar-3d',
    category: 'artStyle',
    name: 'Pixar / Disney 3D Character Art',
    koreanName: '픽사 & 디즈니 3D 애니메이션',
    value: 'Pixar Animation Studios aesthetic, cute stylized proportions, soft peach fuzz fur, expressive warm character design',
    description: '사랑스러운 비율과 벨벳 솜털 질감의 세계 최고 수준 3D 캐릭터 룩',
  },
  {
    id: 'style-kodak-film',
    category: 'artStyle',
    name: '35mm Kodak Portra 400 Film',
    koreanName: '35mm 코닥 포트라 400 필름 스냅',
    value: 'Vintage 35mm analog photograph shot on Kodak Portra 400, authentic organic film grain, natural skin tones, nostalgic halation',
    description: '필름 특유의 따스한 색감, 자연스러운 입자감과 할레이션',
  },
  {
    id: 'style-minimalist-bauhaus',
    category: 'artStyle',
    name: 'Minimalist Swiss / Bauhaus Graphic',
    koreanName: '미니멀 바우하우스 그래픽 디자인',
    value: 'Minimalist Swiss graphic design poster, clean geometric shapes, Bauhaus color theory, bold negative space',
    description: '절제된 기하학적 도형과 여백의 미학을 살린 그래픽 아트',
  },
  {
    id: 'style-impasto-oil',
    category: 'artStyle',
    name: 'Textured Impasto Oil Painting',
    koreanName: '두터운 임파스토 캔버스 유화',
    value: 'Thick textured impasto oil painting on coarse canvas, visible energetic palette knife strokes, rich color blending',
    description: '나이프 자국이 살아있는 거친 캔버스 위의 유화 물감 질감',
  },

  // 6. MOOD & COLOR (분위기 및 색감)
  {
    id: 'mood-neon-cyan',
    category: 'mood',
    name: 'Electric Neon & Cyber Cyan',
    koreanName: '일렉트릭 네온 & 사이언',
    value: 'High saturation color palette dominated by electric cyan, hot magenta, deep midnight violet',
    description: '미래지향적인 사이버펑크 네온 색조 조합',
  },
  {
    id: 'mood-warm-vintage',
    category: 'mood',
    name: 'Warm Amber & Muted Earthy Tones',
    koreanName: '따스한 앰버 & 어스 톤',
    value: 'Warm earthy color grading with rich terracotta, sepia tones, muted olive and honey amber accents',
    description: '포근하고 빈티지한 브라운, 올리브, 꿀빛 컬러 하모니',
  },
  {
    id: 'mood-dark-noir',
    category: 'mood',
    name: 'Dark Fantasy & Noir Shadow',
    koreanName: '다크 판타지 & 시네마틱 누아르',
    value: 'Dark moody gothic atmosphere, obsidian deep blacks, muted desaturated palette with blood crimson highlight accents',
    description: '어둡고 묵직한 고딕 분위기와 붉은 포인트 하이라이트',
  },
  {
    id: 'mood-pastel-dreamy',
    category: 'mood',
    name: 'Pastel Dreamy Fairy-tale',
    koreanName: '파스텔 드림 몽환 판타지',
    value: 'Soft dreamy pastel palette, lavender mist, mint turquoise, blush pink, ethereal soft glow',
    description: '동화 속 세상 같은 부드러운 라벤더, 민트, 핑크빛 톤',
  },
  {
    id: 'mood-monochrome',
    category: 'mood',
    name: 'High-Contrast Monochrome',
    koreanName: '하이 콘트라스트 모노크롬 (흑백)',
    value: 'Dramatic black and white photography, rich tonal gradation from pure deep obsidian to pure specular white',
    description: '빛과 그림자 본연의 조형미를 극대화하는 깊은 흑백 계조',
  },

  // 7. QUALITY & DETAILS (디테일 부스터)
  {
    id: 'detail-8k-sharp',
    category: 'details',
    name: '8K Ultra Sharp Micro-Details',
    koreanName: '8K 초고해상도 마이크로 디테일',
    value: '8k UHD resolution, pristine sharpness, extremely detailed fine textures on cloth, metal, and skin pores',
    description: '섬유 올, 금속 표면, 피부 모공까지 살아있는 극초고화질',
  },
  {
    id: 'detail-subsurface-skin',
    category: 'details',
    name: 'Subsurface Scattering (SSS)',
    koreanName: '서브서피스 스캐터링 (피부 투광)',
    value: 'Realistic subsurface scattering lighting on translucent skin, ears, and liquid, photorealistic depth',
    description: '빛이 피부나 액체 내부를 통과해 반투명하게 빛나는 실사 광학 효과',
  },
  {
    id: 'detail-dust-particles',
    category: 'details',
    name: 'Floating Ambient Dust Particles',
    koreanName: '공기 중 부유 입자 & 빛망울',
    value: 'Subtle glowing airborne atmospheric dust motes floating in light beams, bokeh sparkle accents',
    description: '빛줄기 속에 흩날리는 미세 먼지 입자와 빛망울 효과',
  },
  {
    id: 'detail-raytracing',
    category: 'details',
    name: 'Full Ray Traced Ambient Occlusion',
    koreanName: '풀 레이트레이싱 앰비언트 오클루전',
    value: 'Hardware ray-traced global illumination, accurate physics-based contact shadows and indirect bounce lighting',
    description: '구석구석 자연스러운 물리 기반 그림자와 반사광 렌더링',
  },
];

export interface LegoBlueprintPreset {
  id: string;
  title: string;
  koreanTitle: string;
  description: string;
  category: string;
  blockIds: string[];
  customSubject?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  targetModel: string;
}

export const LEGO_BLUEPRINT_PRESETS: LegoBlueprintPreset[] = [
  {
    id: 'bp-cyberpunk-samurai',
    title: 'Cinematic Cyberpunk Samurai',
    koreanTitle: '시네마틱 사이버펑크 사무라이',
    description: '네온 림라이트와 아나모픽 렌즈가 결합된 미래형 카타나 전사 샷',
    category: 'Cyberpunk',
    blockIds: [
      'sub-cyberpunk-samurai',
      'cam-low-angle',
      'lens-anamorphic',
      'light-neon-rim',
      'style-octane',
      'mood-neon-cyan',
      'detail-8k-sharp',
    ],
    aspectRatio: '16:9',
    targetModel: 'Midjourney v6',
  },
  {
    id: 'bp-pixar-fox',
    title: 'Cute 3D Pixar Baby Fox',
    koreanTitle: '사랑스러운 3D 픽사 아기 여우',
    description: '부드러운 솜털과 황금빛 자연광이 감도는 픽사 스타일 캐릭터',
    category: '3D Character',
    blockIds: [
      'sub-pixar-fox',
      'cam-portrait-close-up',
      'lens-85mm-portrait',
      'light-golden-hour',
      'style-pixar-3d',
      'mood-warm-vintage',
      'detail-subsurface-skin',
    ],
    aspectRatio: '1:1',
    targetModel: 'Nano Banana (Gemini)',
  },
  {
    id: 'bp-luxury-perfume',
    title: 'High-End Luxury Perfume Commercial',
    koreanTitle: '하이엔드 럭셔리 크리스탈 향수 상업 샷',
    description: '물방울 흑요석 스튜디오 조명과 접사 렌즈로 담아낸 광고 컷',
    category: 'Product',
    blockIds: [
      'sub-luxury-perfume',
      'cam-medium-shot',
      'lens-macro',
      'light-studio-softbox',
      'style-octane',
      'mood-dark-noir',
      'detail-8k-sharp',
    ],
    aspectRatio: '3:4' as any,
    targetModel: 'Flux.1',
  },
  {
    id: 'bp-shinkai-anime',
    title: 'Makoto Shinkai Anime Glasshouse',
    koreanTitle: '신카이 마코토풍 신비로운 온실 풍경',
    description: '청량한 빛내림과 푸른 하늘이 돋보이는 감성 애니메이션 컷',
    category: 'Anime',
    blockIds: [
      'sub-zen-botanical',
      'cam-full-body-wide',
      'lens-35mm-cinema',
      'light-volumetric-godrays',
      'style-makoto-shinkai',
      'mood-pastel-dreamy',
      'detail-dust-particles',
    ],
    aspectRatio: '16:9',
    targetModel: 'Midjourney v6',
  },
  {
    id: 'bp-korean-fashion',
    title: 'Vogue Editorial Fashion Portrait',
    koreanTitle: '보그 에디토리얼 하이패션 인물화',
    description: '중형 카메라와 키아로스쿠로 조명이 빚어낸 프리미엄 패션 스냅',
    category: 'Fashion',
    blockIds: [
      'sub-korean-model',
      'cam-portrait-close-up',
      'lens-hasselblad',
      'light-chiaroscuro',
      'style-kodak-film',
      'mood-monochrome',
      'detail-8k-sharp',
    ],
    aspectRatio: '4:5' as any,
    targetModel: 'Stable Diffusion XL',
  },
];
