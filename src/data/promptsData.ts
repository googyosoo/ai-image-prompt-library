import { PromptItem } from '../types';

export const PROMPT_PRESETS: PromptItem[] = [
  // ================= 교과 수업용 특화 프리셋 =================
  {
    id: 'edu-science-water-cycle',
    title: 'Science Textbook 3D Water Cycle Infographic',
    koreanTitle: '과학 교과서 물의 순환 3D 인포그래픽 단면도',
    category: '교과 삽화',
    style: '3D Render / Pixar',
    fullPrompt: 'Educational science textbook illustration cross-section diagram of the Earth water cycle, showing evaporation from shimmering ocean, condensation forming fluffy white clouds, precipitation rain over green mountain range, underground water runoff flowing into river, clean 3D claymation render style, clear visual stages, bright cheerful educational lighting, high resolution, suitable for elementary and middle school textbooks.',
    koreanDescription: '증발, 응결, 강수, 지하수 흐름 등 물의 순환 전 과정을 입체 단면도로 알기 쉽게 표현한 초·중등 과학 교과서 및 수업용 3D 삽화 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'DALL-E 3', 'Midjourney v6', 'Flux.1'],
    recommendedAspectRatio: '16:9',
    tags: ['교과 삽화', '과학', '물의 순환', '인포그래픽', '단면도', '3D 렌더', '수업자료'],
    lighting: 'Bright cheerful daylight with soft diffused educational rim lighting',
    camera: 'Isometric 45-degree angle, sharp focus across entire cross-section',
    copiedCount: 4210,
    featured: true,
    variables: [
      {
        key: 'subject',
        label: '교과 주제',
        placeholder: 'water cycle',
        defaultValue: 'water cycle',
        options: ['water cycle', 'plant photosynthesis and cell structure', 'solar system planetary orbits', 'volcano cross-section and magma chamber']
      },
      {
        key: 'gradeLevel',
        label: '학습 대상 연령',
        placeholder: 'elementary and middle school textbooks',
        defaultValue: 'elementary and middle school textbooks',
        options: ['elementary and middle school textbooks', 'high school earth science inquiry guide', 'early childhood nature exploration']
      }
    ],
    negativePrompt: 'text, watermark, messy lines, scary, dark, realistic photo, blurry, bad anatomy'
  },
  {
    id: 'edu-history-geobukseon',
    title: 'Korean History Joseon Turtle Ship Geobukseon Naval Fleet',
    koreanTitle: '한국사 조선 거북선과 판옥선 해상 진형 삽화',
    category: '교과 삽화',
    style: 'Watercolor / Ink',
    fullPrompt: 'Historical educational textbook illustration of Admiral Yi Sun-sin Joseon naval fleet, majestic iron-clad Geobukseon turtle ship at the center with dragon head emitting smoke, wooden Panokseon warships surrounding in crane-wing formation on dynamic ocean waves, traditional Korean ink wash painting combined with delicate digital watercolor, authentic Joseon flag banners, heroic and historically accurate atmosphere.',
    koreanDescription: '임진왜란 학익진 전술과 거북선·판옥선의 위용을 전통 수묵 담채와 현대적 일러스트 감성으로 재현한 역사 교과서 및 수업 탐구자료용 삽화입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Midjourney v6', 'Nano Banana (Gemini)', 'Flux.1', 'DALL-E 3'],
    recommendedAspectRatio: '16:9',
    tags: ['교과 삽화', '역사', '한국사', '거북선', '임진왜란', '수묵화', '전통'],
    lighting: 'Dramatic morning sea mist with golden sunrays piercing the clouds',
    camera: 'Cinematic wide-angle nautical shot, eye-level heroic composition',
    copiedCount: 3950,
    featured: true,
    variables: [
      {
        key: 'scene',
        label: '역사적 장면',
        placeholder: 'majestic iron-clad Geobukseon turtle ship at the center',
        defaultValue: 'majestic iron-clad Geobukseon turtle ship at the center',
        options: [
          'majestic iron-clad Geobukseon turtle ship at the center',
          'King Sejong creating Hunminjeongeum alphabet in royal palace',
          'ancient Goguryeo equestrian hunters horseback archery mural style',
          'March 1st Movement peaceful independence demonstration with Taegeukgi'
        ]
      }
    ],
    negativePrompt: 'modern buildings, cartoonish, low resolution, inaccurate costume, western armor, blurry'
  },
  {
    id: 'edu-poster-library-reading',
    title: 'School Library Reading Month Warm Emotional Poster',
    koreanTitle: '학교 도서관 온작품 읽기 독서의 달 감성 포스터',
    category: '포스터',
    style: 'Anime / Manga',
    fullPrompt: 'School library reading campaign poster illustration, a student sitting under a giant magical tree made of glowing open books in a sunlit cozy classroom library, colorful paper planes flying into the starlit sky, warm pastel color palette, soft watercolor and Ghibli anime aesthetic, hopeful educational theme, spacious top area suitable for event typography, heartwarming and inspiring.',
    koreanDescription: '도서관 행사, 독서의 달, 아침 독서 주간 게시용 감성적인 포스터 삽화로, 상단에 학교명과 표어를 넣기 좋은 여백을 갖춘 일러스트 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'DALL-E 3', 'Midjourney v6', 'Flux.1'],
    recommendedAspectRatio: '4:5',
    tags: ['포스터', '독서', '학교 도서관', '온작품 읽기', '감성 일러스트', '포스터/표어'],
    lighting: 'Warm golden hour sunlight streaming through library window with dust motes',
    camera: 'Vertical portrait poster framing, clean composition with negative space for text',
    copiedCount: 4680,
    featured: true,
    variables: [
      {
        key: 'theme',
        label: '포스터 주제',
        placeholder: 'reading campaign poster illustration',
        defaultValue: 'reading campaign poster illustration',
        options: [
          'reading campaign poster illustration',
          'anti-bullying friendship and kindness campaign poster',
          'science fair invention and creativity festival poster',
          'school sports day teamwork and passion festival poster'
        ]
      }
    ],
    negativePrompt: 'text, letters, cluttered, dark, gloomy, scary, blurry, distorted hands'
  },
  {
    id: 'edu-poster-carbon-neutral',
    title: 'Eco-Friendly Carbon Neutrality Earth Day School Poster',
    koreanTitle: '친환경 지구의 날 탄소중립 실천 학교 포스터',
    category: '포스터',
    style: 'Minimalism',
    fullPrompt: 'Eco-friendly environmental protection campaign poster, hands gently holding a flourishing miniature green Earth with tiny solar panels, wind turbines, and sprouting tree seedlings, clean minimalist flat design with subtle papercut textures, refreshing emerald green and sky blue palette, clear message of hope and climate action, modern educational poster design with headline space.',
    koreanDescription: '환경의 날, 에너지 절약 주간, 탄소중립 환경교육에 적합한 직관적이고 깔끔한 미니멀 그래픽 스타일의 학교 포스터 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    targetModels: ['DALL-E 3', 'Nano Banana (Gemini)', 'Midjourney v6', 'Stable Diffusion XL'],
    recommendedAspectRatio: '4:5',
    tags: ['포스터', '환경교육', '탄소중립', '지구의 날', '친환경', '미니멀'],
    lighting: 'Clean studio lighting, vibrant eco-friendly natural reflections',
    camera: 'Centered graphic design layout, vertical poster aspect ratio with top breathing room',
    copiedCount: 3820,
    featured: true,
    variables: [
      {
        key: 'ecoTheme',
        label: '환경 실천 주제',
        placeholder: 'solar panels, wind turbines, and sprouting tree seedlings',
        defaultValue: 'solar panels, wind turbines, and sprouting tree seedlings',
        options: [
          'solar panels, wind turbines, and sprouting tree seedlings',
          'clean oceans with sea turtles freed from plastic waste',
          'zero-waste tumblers and eco-friendly school cafeteria',
          'bicycles and electric school bus in green urban park'
        ]
      }
    ],
    negativePrompt: 'smog, pollution, garbage, realistic photo, cluttered, messy typography, dark'
  },
  {
    id: 'edu-worksheet-alphabet-animals',
    title: 'Elementary English Phonics Animal Coloring Line Art Clip Art',
    koreanTitle: '초등 영어 파닉스 동물 라인아트 컬러링 클립아트',
    category: '학습지 그림',
    style: 'Minimalism',
    fullPrompt: 'Cute black and white clean vector line art clip art for children coloring worksheet, friendly baby animals (lion, elephant, giraffe, monkey) reading books together, bold clear outlines, pure white background, no shading or gray tones, high contrast, perfect for kindergarten and elementary school printable worksheets and activities.',
    koreanDescription: '학습지 및 활동지 인쇄에 최적화된 흑백 라인아트 클립아트로, 학생들이 직접 색칠(컬러링)하거나 알파벳·단어 매칭 활동에 바로 쓸 수 있는 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    targetModels: ['DALL-E 3', 'Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1'],
    recommendedAspectRatio: '1:1',
    tags: ['학습지 그림', '클립아트', '라인아트', '컬러링', '초등영어', '활동지'],
    lighting: 'High-key flat lighting, pure monochrome contrast',
    camera: 'Straight-on 2D vector flat icon perspective, centered isolated object',
    copiedCount: 5120,
    featured: true,
    variables: [
      {
        key: 'animals',
        label: '등장 캐릭터/동물',
        placeholder: 'friendly baby animals (lion, elephant, giraffe, monkey) reading books together',
        defaultValue: 'friendly baby animals (lion, elephant, giraffe, monkey) reading books together',
        options: [
          'friendly baby animals (lion, elephant, giraffe, monkey) reading books together',
          'happy school stationeries (smiling pencil, eraser, ruler, backpack)',
          'cheerful fruits and vegetables with cute cartoon faces',
          'friendly space exploration astronauts and friendly alien'
        ]
      }
    ],
    negativePrompt: 'colors, gradients, gray shading, blurry, thin messy lines, realistic fur, dark background'
  },
  {
    id: 'edu-worksheet-math-fraction',
    title: 'Elementary Math Fraction Pizza Division Visual Concept Model',
    koreanTitle: '초등 수학 분수 개념 피자 나누기 시각화 학습지 삽화',
    category: '학습지 그림',
    style: '3D Render / Pixar',
    fullPrompt: 'Educational math visual aid clip art for elementary fractions, a delicious cartoon pizza sliced into equal 8 slices with 3 slices lifted showing 3/8 fraction concept, bright vibrant colors, cute smooth 3D clay aesthetic, isolated on pure white background, clear visual distinction between slices, clean educational asset for worksheet and test paper illustrations.',
    koreanDescription: '분수(단위분수, 진분수)의 덧셈과 뺄셈 개념을 직관적으로 이해할 수 있는 피자 조각 3D 모델링 삽화로, 수학 학습지 및 시험지 문제용 그림입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'DALL-E 3', 'Flux.1', 'Midjourney v6'],
    recommendedAspectRatio: '1:1',
    tags: ['학습지 그림', '수학', '분수', '시각화', '피자', '교재 삽화', '학습지'],
    lighting: 'Bright soft studio lighting, crisp shadows',
    camera: 'Top-down 45-degree angle educational diagram view, isolated on white',
    copiedCount: 3740,
    featured: false,
    variables: [
      {
        key: 'mathConcept',
        label: '수학 개념',
        placeholder: 'pizza sliced into equal 8 slices with 3 slices lifted showing 3/8 fraction',
        defaultValue: 'pizza sliced into equal 8 slices with 3 slices lifted showing 3/8 fraction',
        options: [
          'pizza sliced into equal 8 slices with 3 slices lifted showing 3/8 fraction',
          'colorful wooden geometric blocks (cube, sphere, cylinder, cone) labeled',
          'cute analog clock with colorful hands showing 3:30 time reading',
          'balance scale comparing weights with cute apples and blocks'
        ]
      }
    ],
    negativePrompt: 'messy, realistic photo, dark background, complex text, unproportional slices'
  },
  {
    id: 'edu-character-modi-robot',
    title: 'Friendly Classroom AI Robot Assistant Modi 3D Mascot',
    koreanTitle: '친절한 교실 수업 도우미 AI 로봇 캐릭터 모디',
    category: '캐릭터',
    style: '3D Render / Pixar',
    fullPrompt: 'Full-body character design of a cute friendly AI classroom assistant robot named Modi, round soft white ceramic body with glowing digital emoticon eyes, holding a glowing digital pencil and a tablet, cheerful wave gesture, Pixar 3D animation style, cute rounded proportions, warm welcoming smile, isolated on solid clean background, character mascot sheet suitable for classroom notices and slides.',
    koreanDescription: '학급 안내장, 슬라이드 발표, 수업 자료에 마스코트로 활용할 수 있는 친근하고 귀여운 교실 도우미 AI 로봇 캐릭터 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'DALL-E 3', 'Midjourney v6', 'Flux.1'],
    recommendedAspectRatio: '1:1',
    tags: ['캐릭터', '마스코트', 'AI 로봇', '학급도우미', '픽사 3D', '수업자료'],
    lighting: 'Soft studio key light with gentle warm rim light',
    camera: 'Eye-level full character portrait, clean isolated background',
    copiedCount: 4890,
    featured: true,
    variables: [
      {
        key: 'pose',
        label: '동작 및 표정',
        placeholder: 'holding a glowing digital pencil and a tablet, cheerful wave gesture',
        defaultValue: 'holding a glowing digital pencil and a tablet, cheerful wave gesture',
        options: [
          'holding a glowing digital pencil and a tablet, cheerful wave gesture',
          'wearing graduation cap reading an open thick magical book with glasses',
          'thumbs up pose with twinkling encouraging star eyes',
          'holding a large magnifying glass curiously inspecting a question mark'
        ]
      }
    ],
    negativePrompt: 'scary robot, mechanical wires, sharp metallic edges, dark, gloomy, low poly, bad hands'
  },
  {
    id: 'edu-character-tori-squirrel',
    title: 'School Safety Guardian Squirrel Mascot Tori 3D Character',
    koreanTitle: '학교 안전 지킴이 용감한 다람쥐 마스코트 토리',
    category: '캐릭터',
    style: '3D Render / Pixar',
    fullPrompt: 'Full-body 3D Pixar style character design of an adorable brave red squirrel school safety mascot named Tori, wearing a yellow safety patrol vest and green backpack, smiling proudly with hands on hips, fluffy tail, vibrant expressive eyes, high quality octane 3D render, smooth textures, isolated on bright studio background, mascot for elementary school safety campaign.',
    koreanDescription: '교통안전, 보행안전, 학교폭력 예방 등 학교 안전 캠페인 및 학급 규칙 안내에 딱 맞는 씩씩하고 사랑스러운 다람쥐 마스코트 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3', 'Flux.1'],
    recommendedAspectRatio: '1:1',
    tags: ['캐릭터', '마스코트', '다람쥐', '안전교육', '교통안전', '픽사 3D'],
    lighting: 'Vibrant outdoor morning sunshine with soft warm fill',
    camera: 'Full body character turn-around view, centered on clean backdrop',
    copiedCount: 4150,
    featured: true,
    variables: [
      {
        key: 'role',
        label: '역할 및 소품',
        placeholder: 'wearing a yellow safety patrol vest and green backpack',
        defaultValue: 'wearing a yellow safety patrol vest and green backpack',
        options: [
          'wearing a yellow safety patrol vest and green backpack',
          'holding a bright green crosswalk stop sign',
          'wearing doctor coat and stethoscope holding first aid kit',
          'holding a golden champion trophy cheering enthusiastically'
        ]
      }
    ],
    negativePrompt: 'feral animal, scary, realistic rodents, aggressive, dirty fur, blurry'
  },
  // ================= 기존 프리셋 =================
  {
    id: 'cyberpunk-neon-samurai',
    title: 'Cyberpunk Neon Cyber Samurai',
    koreanTitle: '사이버펑크 네온 사이버 사무라이',
    category: 'Profile / Avatar',
    style: 'Cyberpunk / Sci-Fi',
    fullPrompt: 'Ultra-detailed cinematic portrait of a cybernetic warrior with holographic visor, wearing matte black carbon fiber armor with glowing cyan and magenta LED accents, standing in a rainy Neo-Tokyo alleyway with neon signs reflecting on wet asphalt, volumetric mist, anamorphic lens flare, photorealistic, 8k resolution, shot on Hasselblad 50mm f/1.2.',
    koreanDescription: '비 내리는 네오 도쿄 골목에서 홀로그램 바이저와 카본 아머를 착용한 사이버 전사의 초고화질 시네마틱 아바타 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1', 'DALL-E 3'],
    recommendedAspectRatio: '1:1',
    tags: ['Cyberpunk', 'Samurai', 'Neon', 'Avatar', 'Volumetric Lighting', 'Sci-Fi'],
    lighting: 'Bioluminescent neon cyan & magenta edge lighting, volumetric rim light',
    camera: 'Hasselblad 50mm f/1.2, shallow depth of field',
    copiedCount: 3840,
    featured: true,
    variables: [
      {
        key: 'subject',
        label: '주인공 / 캐릭터',
        placeholder: 'a cybernetic warrior with holographic visor',
        defaultValue: 'a cybernetic warrior with holographic visor',
        options: [
          'a cybernetic warrior with holographic visor',
          'a futuristic cyborg hacker with augmented eyes',
          'a sleek robotic geisha with chrome porcelain face',
          'a rogue bounty hunter in heavy armor'
        ]
      },
      {
        key: 'lightingColor',
        label: '네온 색상 테마',
        placeholder: 'cyan and magenta LED accents',
        defaultValue: 'cyan and magenta LED accents',
        options: ['cyan and magenta LED accents', 'amber and emerald neon glow', 'crimson red and ultraviolet accents', 'pure golden and electric blue glow']
      },
      {
        key: 'environment',
        label: '배경 환경',
        placeholder: 'rainy Neo-Tokyo alleyway with neon signs reflecting on wet asphalt',
        defaultValue: 'rainy Neo-Tokyo alleyway with neon signs reflecting on wet asphalt',
        options: [
          'rainy Neo-Tokyo alleyway with neon signs reflecting on wet asphalt',
          'rooftop overlooking sprawling neon skyscraper skyline',
          'underground cyber bar filled with holographic smoke',
          'high-tech laboratory with floating data screens'
        ]
      }
    ],
    negativePrompt: 'low quality, blurry, distorted face, extra limbs, bad anatomy, cartoonish, oversaturated'
  },
  {
    id: 'minimalist-ceramic-cup',
    title: 'Studio Ceramic Mug Commercial Shot',
    koreanTitle: '스튜디오 세라믹 머그 미니멀 제품컷',
    category: 'E-commerce Main',
    style: 'Minimalism',
    fullPrompt: 'Commercial studio product photography of a handmade organic ceramic coffee mug on a rough travertine stone pedestal, soft warm diffused morning sunlight casting elegant long geometric shadows, neutral beige monochromatic background, architectural minimalism, award winning advertising shot, Hasselblad H6D-100c, 90mm macro lens, ultra crisp texture.',
    koreanDescription: '트래버틴 스톤 받침대 위에 놓인 수제 세라믹 머그잔에 따뜻한 자연광이 드리워지는 프리미엄 미니멀 제품 사진입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1', 'Stable Diffusion XL'],
    recommendedAspectRatio: '4:5',
    tags: ['E-commerce', 'Product', 'Minimalism', 'Studio', 'Travertine', 'Clean'],
    lighting: 'Soft diffused warm morning sun, subtle bounce reflector',
    camera: 'Hasselblad H6D-100c, 90mm macro lens, f/5.6',
    copiedCount: 4210,
    featured: true,
    variables: [
      {
        key: 'product',
        label: '제품 종류',
        placeholder: 'a handmade organic ceramic coffee mug',
        defaultValue: 'a handmade organic ceramic coffee mug',
        options: [
          'a handmade organic ceramic coffee mug',
          'a frosted amber glass skincare serum bottle with dropper',
          'a matte titanium wireless minimalist earbuds case',
          'an artisanal poured soy candle in ribbed concrete jar'
        ]
      },
      {
        key: 'pedestal',
        label: '받침대 / 소품',
        placeholder: 'rough travertine stone pedestal',
        defaultValue: 'rough travertine stone pedestal',
        options: ['rough travertine stone pedestal', 'sculptural terracotta block', 'floating sand-cast glass disc', 'stacked raw white linen podium']
      },
      {
        key: 'colorTone',
        label: '배경 톤',
        placeholder: 'neutral beige monochromatic background',
        defaultValue: 'neutral beige monochromatic background',
        options: ['neutral beige monochromatic background', 'warm taupe and cream gradient', 'muted sage green architectural surface', 'cool porcelain white minimal backdrop']
      }
    ],
    negativePrompt: 'busy background, reflections, dust, plastic, overexposed, low resolution, cheap rendering'
  },
  {
    id: 'isometric-cozy-cafe',
    title: '3D Isometric Cozy Corner Cafe',
    koreanTitle: '3D 아이소메트릭 따스한 감성 카페',
    category: 'Game Asset',
    style: 'Isometric',
    fullPrompt: 'Cute 3D isometric cutaway diorama of a warm cozy Japanese coffee shop and bookstore, miniature plants on wooden shelves, glowing Edison bulbs, espresso machine with steam, tiny cat sleeping on armchair, warm cozy ambient lighting, soft ambient occlusion, Blender 3D render, Octane render engine, clay material and wood textures, 8k cute aesthetic.',
    koreanDescription: '원목 선반, 스팀 커피 머신, 안락의자에서 잠든 고양이가 있는 따스한 일본풍 카페 3D 아이소메트릭 디오라마입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3'],
    recommendedAspectRatio: '1:1',
    tags: ['Isometric', '3D Diorama', 'Cozy', 'Cafe', 'Blender', 'Cute', 'Game Asset'],
    lighting: 'Warm 2700K ambient light, glowing fairy lights, volumetric window light',
    camera: 'Orthographic isometric camera angle, 45 degree tilt',
    copiedCount: 2950,
    featured: true,
    variables: [
      {
        key: 'roomType',
        label: '공간 테마',
        placeholder: 'Japanese coffee shop and bookstore',
        defaultValue: 'Japanese coffee shop and bookstore',
        options: [
          'Japanese coffee shop and bookstore',
          'Cyberpunk hacker bedroom workshop',
          'Botanical greenhouse with rare flowers',
          'Medieval wizard potion alchemist library'
        ]
      },
      {
        key: 'specialItem',
        label: '디테일 포인트',
        placeholder: 'tiny cat sleeping on armchair, espresso machine with steam',
        defaultValue: 'tiny cat sleeping on armchair, espresso machine with steam',
        options: [
          'tiny cat sleeping on armchair, espresso machine with steam',
          'glowing holographic monitors, pizza boxes, floating drone',
          'glass terrariums, hanging ivy, bubbling water fountain',
          'glowing spell books, crystal balls, floating brass telescope'
        ]
      }
    ],
    negativePrompt: 'flat 2d, distorted perspective, blurry, harsh shadows, messy composition'
  },
  {
    id: 'cinematic-noir-detective',
    title: 'Cinematic 35mm Moody Noir Detective',
    koreanTitle: '시네마틱 무디 느와르 탐정 포트레이트',
    category: 'Profile / Avatar',
    style: 'Cinematic / Film',
    fullPrompt: 'Cinematic film still of a brooding detective in a wet trench coat under a street lamp in heavy fog, 1950s Chicago night street, venetian blind shadows, cigarette smoke catching golden rim light, deep cinematic chiaroscuro contrast, 35mm Kodak Tri-X 400 grain, directed by Roger Deakins, award winning cinematography, masterwork.',
    koreanDescription: '안개 자욱한 1950년대 밤거리에서 가로등 불빛 아래 서 있는 트렌치코트 탐정의 35mm 필름 느와르 스틸컷입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1', 'Stable Diffusion XL'],
    recommendedAspectRatio: '16:9',
    tags: ['Cinematic', 'Noir', 'Film Still', '35mm', 'Kodak', 'Moody', 'Lighting'],
    lighting: 'High contrast chiaroscuro, single tungsten streetlamp, rim light on smoke',
    camera: 'Arri Alexa Mini, Zeiss Master Prime 35mm T1.3',
    copiedCount: 1890,
    variables: [
      {
        key: 'character',
        label: '등장인물',
        placeholder: 'a brooding detective in a wet trench coat',
        defaultValue: 'a brooding detective in a wet trench coat',
        options: [
          'a brooding detective in a wet trench coat',
          'a mysterious femme fatale in a velvet fedora',
          'an undercover jazz musician carrying a saxophone case',
          'a tired street journalist with a vintage Leica camera'
        ]
      },
      {
        key: 'filmStock',
        label: '필름 감성 / 색감',
        placeholder: '35mm Kodak Tri-X 400 grain, deep chiaroscuro',
        defaultValue: '35mm Kodak Tri-X 400 grain, deep chiaroscuro',
        options: [
          '35mm Kodak Tri-X 400 grain, deep chiaroscuro',
          'Kodak Vision3 500T, teal and tungsten palette',
          'Fuji Provia 100F vivid vintage cinema tones',
          'CineStill 800T with red halation glow on highlights'
        ]
      }
    ]
  },
  {
    id: 'cute-3d-pixar-fox',
    title: 'Cute 3D Pixar Style Baby Fox Adventurer',
    koreanTitle: '귀여운 3D 픽사 스타일 아기 여우 모험가',
    category: 'Profile / Avatar',
    style: '3D Render / Pixar',
    fullPrompt: 'Adorable baby red fox wearing a tiny explorer backpack and vintage leather aviator goggles, standing on a mossy log in an enchanted magical forest, soft dappled sun rays breaking through canopy, glowing floating pollen, Disney Pixar 3D animation style, fluffy soft fur groom shader, big expressive curious eyes, vibrant cheerful lighting, 8k octane render.',
    koreanDescription: '마법의 숲에서 아기 여우가 고글과 배낭을 메고 서 있는 사랑스러운 디즈니/픽사 스타일 3D 렌더링입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3'],
    recommendedAspectRatio: '1:1',
    tags: ['Pixar', '3D Character', 'Cute', 'Fox', 'Avatar', 'Whimsical'],
    lighting: 'Magical golden dappled sunlight, soft bounce light',
    camera: 'Subsurface scattering on skin, macro lens with creamy bokeh',
    copiedCount: 5120,
    featured: true,
    variables: [
      {
        key: 'animal',
        label: '동물 캐릭터',
        placeholder: 'Adorable baby red fox wearing a tiny explorer backpack',
        defaultValue: 'Adorable baby red fox wearing a tiny explorer backpack',
        options: [
          'Adorable baby red fox wearing a tiny explorer backpack',
          'Fluffy baby red panda wearing a knit scarf and wizard hat',
          'Cute chubby penguin wearing a bright yellow raincoat',
          'Tiny adventurous hedgehog holding an acorn lantern'
        ]
      },
      {
        key: 'scene',
        label: '숲 배경 / 분위기',
        placeholder: 'mossy log in an enchanted magical forest with glowing floating pollen',
        defaultValue: 'mossy log in an enchanted magical forest with glowing floating pollen',
        options: [
          'mossy log in an enchanted magical forest with glowing floating pollen',
          'snowy mountain peak surrounded by sparkling aurora borealis',
          'colorful candy wonderland with lollipop trees and pastel clouds',
          'sunlit cozy attic workshop filled with miniature blueprints'
        ]
      }
    ]
  },
  {
    id: 'glassmorphic-saas-3d-icon',
    title: '3D Glassmorphic Tech UI Icon',
    koreanTitle: '3D 글래스모피즘 테크 앱 UI 아이콘',
    category: '3D Icon & Object',
    style: '3D Render / Pixar',
    fullPrompt: 'Sleek 3D glassmorphic shield icon representing AI security and encryption, frosted translucent frosted glass with iridescent rainbow edges, glowing metallic core with floating glowing particles, minimalist clean modern UI aesthetic for high-end SaaS fintech app, studio lighting on subtle slate gray gradient background, Cinema 4D, Redshift render, pristine quality.',
    koreanDescription: '반투명 프로스테드 글래스와 무지갯빛 반사광, 은은한 메탈릭 코어가 돋보이는 모던 SaaS/앱용 3D 보안 아이콘입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3', 'Flux.1'],
    recommendedAspectRatio: '1:1',
    tags: ['Glassmorphism', '3D Icon', 'SaaS', 'UI Design', 'Futuristic', 'Clean'],
    lighting: 'Three-point studio softbox with iridescent rim highlight',
    camera: 'Front perspective with slight 15-degree tilt',
    copiedCount: 3180,
    variables: [
      {
        key: 'symbol',
        label: '아이콘 상징',
        placeholder: 'shield icon representing AI security and encryption',
        defaultValue: 'shield icon representing AI security and encryption',
        options: [
          'shield icon representing AI security and encryption',
          'interlocking geometric rings representing cloud database synchronization',
          'sparkling faceted diamond representing premium analytics insights',
          'floating rocket ship with glowing plasma exhaust representing startup growth'
        ]
      },
      {
        key: 'material',
        label: '재질 & 색감',
        placeholder: 'frosted translucent frosted glass with iridescent rainbow edges',
        defaultValue: 'frosted translucent frosted glass with iridescent rainbow edges',
        options: [
          'frosted translucent frosted glass with iridescent rainbow edges',
          'liquid chrome mercury metal with deep cobalt blue reflections',
          'matte porcelain ceramic combined with brushed rose gold accents',
          'fluorescent neon acrylic glass with internal fiber optic glow'
        ]
      }
    ]
  },
  {
    id: 'watercolor-japanese-cherry-garden',
    title: 'Ethereal Watercolor Kyoto Spring Garden',
    koreanTitle: '수채화 교토 봄날 벚꽃 정원',
    category: 'Wallpaper & Sci-Fi',
    style: 'Watercolor / Ink',
    fullPrompt: 'Delicate loose watercolor and ink wash painting of a traditional wooden bridge in Kyoto surrounded by blooming pink sakura cherry blossoms, reflection on tranquil koi pond with water lilies, soft wet-on-wet paint bleeding technique, visible cotton paper texture, pastel pink, mint green and pale gold color palette, Japanese Ukiyo-e modern fusion, serene and poetic.',
    koreanDescription: '번짐 기법과 수채화 특유의 텍스처를 살린 봄날 교토 벚꽃 정원과 잉어 연못의 서정적인 수채화 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3', 'Flux.1'],
    recommendedAspectRatio: '16:9',
    tags: ['Watercolor', 'Japan', 'Sakura', 'Traditional', 'Peaceful', 'Ink Wash'],
    lighting: 'Soft diffused morning mist, watercolor translucent glow',
    camera: 'Wide panoramic landscape composition',
    copiedCount: 2470,
    variables: [
      {
        key: 'subject',
        label: '배경 풍경',
        placeholder: 'traditional wooden bridge in Kyoto surrounded by blooming pink sakura cherry blossoms',
        defaultValue: 'traditional wooden bridge in Kyoto surrounded by blooming pink sakura cherry blossoms',
        options: [
          'traditional wooden bridge in Kyoto surrounded by blooming pink sakura cherry blossoms',
          'misty mountain temple pagoda surrounded by autumn crimson maple trees',
          'seaside fishing village with flying seagulls in soft golden sunset',
          'bamboo forest pathway with stone lanterns glowing in evening twilight'
        ]
      },
      {
        key: 'styleTechnique',
        label: '수채화 화풍',
        placeholder: 'wet-on-wet paint bleeding technique, visible cotton paper texture',
        defaultValue: 'wet-on-wet paint bleeding technique, visible cotton paper texture',
        options: [
          'wet-on-wet paint bleeding technique, visible cotton paper texture',
          'traditional sumi-e black ink wash with expressive dry brush strokes',
          'vibrant botanical gouache illustration with delicate gold leaf highlights',
          'loose impressionist watercolor with spontaneous salt texture effects'
        ]
      }
    ]
  },
  {
    id: 'youtube-gaming-thumbnail-action',
    title: 'High-Energy YouTube Gaming Thumbnail',
    koreanTitle: '하이 에너지 유튜브 게이밍 썸네일',
    category: 'YouTube Thumbnail',
    style: 'Cyberpunk / Sci-Fi',
    fullPrompt: 'Ultra high-energy YouTube thumbnail background with dynamic composition, futuristic mech warrior leaping forward with glowing energy sword, dramatic split explosive fire and electric blue lightning background, intense motion blur, bold high-contrast comic lighting, expressive face with glowing eyes, space for text on left side, vibrant 4k render.',
    koreanDescription: '왼쪽에 타이틀 텍스트를 배치하기 좋은 구도와 폭발적인 번개/불꽃 이펙트가 담긴 게이밍 유튜브 썸네일 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1'],
    recommendedAspectRatio: '16:9',
    tags: ['YouTube', 'Thumbnail', 'Gaming', 'Dynamic', 'Action', 'Vibrant'],
    lighting: 'Extreme dual-tone rim light: blazing orange vs cyan lightning',
    camera: 'Low-angle dynamic wide-angle action shot with speed lines',
    copiedCount: 3670,
    variables: [
      {
        key: 'heroAction',
        label: '주요 액션 / 캐릭터',
        placeholder: 'futuristic mech warrior leaping forward with glowing energy sword',
        defaultValue: 'futuristic mech warrior leaping forward with glowing energy sword',
        options: [
          'futuristic mech warrior leaping forward with glowing energy sword',
          'legendary dragon breathing neon plasma over a futuristic metropolis',
          'tactical FPS commando aiming an advanced holographic rifle',
          'speedrunner breaking through a dimensional reality portal'
        ]
      },
      {
        key: 'bgEffects',
        label: '배경 폭발 / 특수효과',
        placeholder: 'dramatic split explosive fire and electric blue lightning background',
        defaultValue: 'dramatic split explosive fire and electric blue lightning background',
        options: [
          'dramatic split explosive fire and electric blue lightning background',
          'purple vortex distortion with swirling cosmic nebula rocks',
          'shattering emerald crystal storm with shockwave ripples',
          'golden supernova explosion with flying embers and sparks'
        ]
      }
    ]
  },
  {
    id: 'luxury-hypercar-commercial',
    title: 'Futuristic Electric Hypercar Night Drive',
    koreanTitle: '미래형 전기 하이퍼카 심야 광고컷',
    category: 'Product Marketing',
    style: 'Photography',
    fullPrompt: 'Automotive advertising photography of a sleek aerodynamic electric hypercar in satin matte obsidian black, driving on a wet coastal mountain highway at dusk, glowing continuous red LED taillight strip drawing a sharp trail, motion blur on asphalt wheels, distant city lights in deep blue haze, shot on Sony A1, 70-200mm f/2.8, hyperrealistic.',
    koreanDescription: '젖은 해안 산악 도로를 질주하는 무광 블랙 전기 하이퍼카의 역동적인 조명과 날카로운 테일램프 궤적이 돋보이는 자동차 광고컷입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1', 'Stable Diffusion XL'],
    recommendedAspectRatio: '16:9',
    tags: ['Automotive', 'Hypercar', 'Commercial', 'Marketing', 'Night Drive', 'Motion'],
    lighting: 'Dusk twilight, sharp LED light ribbon, wet road reflections',
    camera: 'Sony A1 with 70-200mm f/2.8 GM, rig tracking shot',
    copiedCount: 2890,
    variables: [
      {
        key: 'carType',
        label: '차량 모델 / 형태',
        placeholder: 'a sleek aerodynamic electric hypercar in satin matte obsidian black',
        defaultValue: 'a sleek aerodynamic electric hypercar in satin matte obsidian black',
        options: [
          'a sleek aerodynamic electric hypercar in satin matte obsidian black',
          'a vintage 1980s Porsche restomod in liquid silver with gold BBS rims',
          'a futuristic rugged electric overland SUV with roof rack and LED bar',
          'a luxury bespoke grand tourer coupe in British racing green'
        ]
      },
      {
        key: 'location',
        label: '주행 장소 / 날씨',
        placeholder: 'driving on a wet coastal mountain highway at dusk',
        defaultValue: 'driving on a wet coastal mountain highway at dusk',
        options: [
          'driving on a wet coastal mountain highway at dusk',
          'parked under minimalist concrete architectural bridge at sunrise',
          'speeding through illuminated glass tunnel with neon reflections',
          'cruising across sun-baked desert salt flats during golden hour'
        ]
      }
    ]
  },
  {
    id: 'fashion-editorial-35mm-portrait',
    title: 'High Fashion Studio Editorial Portrait',
    koreanTitle: '하이패션 스튜디오 35mm 에디토리얼',
    category: 'Profile / Avatar',
    style: 'Photography',
    fullPrompt: 'High fashion editorial photography of an elegant model wearing sculptural pleated avant-garde silk coat, striking pose in front of a warm terracotta textured backdrop, direct hard flash lighting creating sharp graphic shadows, editorial Vogue magazine cover style, 35mm film grain, Hasselblad shot, flawless natural skin texture, haute couture.',
    koreanDescription: '보그 매거진 커버 스타일의 아방가르드 의상과 직사 플래시 조명으로 샤프한 그림자를 연출한 하이패션 화보 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1', 'Stable Diffusion XL'],
    recommendedAspectRatio: '3:4',
    tags: ['Fashion', 'Portrait', 'Editorial', 'Vogue', '35mm', 'High Couture'],
    lighting: 'Direct on-camera flash with dramatic drop shadow',
    camera: 'Contax 645, 80mm f/2.0 on Kodak Portra 400',
    copiedCount: 3410,
    featured: true,
    variables: [
      {
        key: 'outfit',
        label: '패션 의상',
        placeholder: 'sculptural pleated avant-garde silk coat',
        defaultValue: 'sculptural pleated avant-garde silk coat',
        options: [
          'sculptural pleated avant-garde silk coat',
          'oversized tailored tweed blazer with minimalist chrome jewelry',
          'dramatic metallic foil evening gown with flowing train',
          'structured utilitarian leather jacket with sheer tulle skirt'
        ]
      },
      {
        key: 'backdrop',
        label: '스튜디오 배경 & 색감',
        placeholder: 'warm terracotta textured backdrop, direct hard flash',
        defaultValue: 'warm terracotta textured backdrop, direct hard flash',
        options: [
          'warm terracotta textured backdrop, direct hard flash',
          'deep cobalt blue seamless paper backdrop with soft butterfly light',
          'raw industrial concrete wall with golden hour sunlight slit',
          'monochromatic emerald green velvet curtain backdrop'
        ]
      }
    ]
  },
  {
    id: 'retro-pixel-art-cyber-city',
    title: '16-Bit Nostalgic Pixel Art Cyberpunk City',
    koreanTitle: '16비트 레트로 픽셀 아트 사이버 시티',
    category: 'Game Asset',
    style: 'Pixel Art',
    fullPrompt: 'Nostalgic 16-bit retro pixel art of a bustling cyber city night street, noodle vendor stall with warm glowing lanterns, flying pixel hovercars in distant purple sky, animated rain drop ripples on pavement, limited color palette reminiscent of PC-98 and SNES games, charming isometric pixel sprite aesthetics, crisp pixel perfect detailing.',
    koreanDescription: 'PC-98 및 슈퍼패미컴 감성의 라멘 포장마차와 밤하늘의 호버카가 어우러진 16비트 레트로 픽셀 아트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3'],
    recommendedAspectRatio: '16:9',
    tags: ['Pixel Art', 'Retro', '16-bit', 'PC-98', 'Cyberpunk', 'Nostalgia'],
    lighting: 'Glowing pixel lanterns, neon signs in 32-color palette',
    camera: 'Straight-on side scroller pixel perspective',
    copiedCount: 2780,
    variables: [
      {
        key: 'location',
        label: '픽셀 도시 장소',
        placeholder: 'noodle vendor stall with warm glowing lanterns, flying hovercars',
        defaultValue: 'noodle vendor stall with warm glowing lanterns, flying hovercars',
        options: [
          'noodle vendor stall with warm glowing lanterns, flying hovercars',
          'arcade game center entrance with flashing neon CRT screens',
          'rooftop greenhouse overlooking pixelated train tracks',
          'secluded convenience store glowing on a quiet rainy corner'
        ]
      },
      {
        key: 'paletteStyle',
        label: '픽셀 팔레트 스타일',
        placeholder: 'limited color palette reminiscent of PC-98 and SNES games',
        defaultValue: 'limited color palette reminiscent of PC-98 and SNES games',
        options: [
          'limited color palette reminiscent of PC-98 and SNES games',
          'Game Boy original 4-shade olive green palette',
          'Cyberpunk vaporwave pastel magenta and cyan palette',
          'Warm autumn nostalgic pixel tones with amber lighting'
        ]
      }
    ]
  },
  {
    id: 'claymation-miniature-bakery',
    title: 'Claymation Miniature Warm Bakery',
    koreanTitle: '클레이모션 미니어처 따스한 베이커리',
    category: 'Comic / Storyboard',
    style: 'Claymation',
    fullPrompt: 'Charming stop-motion claymation style miniature French bakery, friendly clay chef bear pulling freshly baked croissants from a clay stone oven, visible clay fingerprint textures and playful plasticine seams, warm yellow studio light, tilt-shift lens effect with shallow depth of field, Wallace & Gromit and Aardman animation style, cozy handmade feel.',
    koreanDescription: '지문 텍스처와 따뜻한 조명이 살아있는 월레스와 그로밋 스타일의 점토 애니메이션 베이커리 프롬프트입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3'],
    recommendedAspectRatio: '4:3',
    tags: ['Claymation', 'Stop Motion', 'Miniature', 'Handmade', 'Bakery', 'Cute'],
    lighting: 'Warm miniature desk lamp, soft clay bounce light',
    camera: 'Tilt-shift macro lens, f/2.8 miniature blur effect',
    copiedCount: 1980,
    variables: [
      {
        key: 'shopTheme',
        label: '클레이 배경 테마',
        placeholder: 'miniature French bakery with fresh baked croissants and baguettes',
        defaultValue: 'miniature French bakery with fresh baked croissants and baguettes',
        options: [
          'miniature French bakery with fresh baked croissants and baguettes',
          'miniature cozy pottery workshop with clay pots on rotating wheel',
          'miniature flower shop with tiny colorful plasticine bouquets',
          'miniature pizza parlor with bubbling clay cheese and toppings'
        ]
      }
    ]
  },
  {
    id: 'swiss-minimalist-poster-design',
    title: 'Swiss International Style Graphic Poster',
    koreanTitle: '스위스 인터내셔널 스타일 그래픽 포스터',
    category: 'Poster / Flyer',
    style: 'Minimalism',
    fullPrompt: 'Minimalist Swiss typography poster design, bold geometric circular abstract shapes in vermilion red and deep black against off-white unbleached paper, strict asymmetric grid layout, clean sans-serif typography elements, Bauhaus and Josef Müller-Brockmann influence, subtle paper embossing and ink grain texture, museum exhibition print.',
    koreanDescription: '바우하우스와 요제프 뮐러 브로크만 스타일의 기하학적 형태와 엄격한 그리드 시스템을 적용한 스위스 그래픽 포스터입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3', 'Flux.1'],
    recommendedAspectRatio: '3:4',
    tags: ['Poster', 'Swiss Style', 'Typography', 'Bauhaus', 'Minimalism', 'Graphic'],
    lighting: 'Flat even graphic museum lighting',
    camera: 'Orthographic flat scan with subtle paper tooth texture',
    copiedCount: 2210,
    variables: [
      {
        key: 'shapesColors',
        label: '도형 & 색상 조합',
        placeholder: 'bold geometric circular abstract shapes in vermilion red and deep black',
        defaultValue: 'bold geometric circular abstract shapes in vermilion red and deep black',
        options: [
          'bold geometric circular abstract shapes in vermilion red and deep black',
          'overlapping translucent squares in ultramarine blue and acid yellow',
          'minimalist wavy monochrome lines representing sound frequencies',
          'dynamic diagonal brutalist typography blocks in safety orange and charcoal'
        ]
      }
    ]
  },
  {
    id: 'shonen-anime-climax-battle',
    title: 'Dramatic Shonen Anime Climax Frame',
    koreanTitle: '드라마틱 소년 애니메이션 결전 씬',
    category: 'Comic / Storyboard',
    style: 'Anime / Manga',
    fullPrompt: 'Cinematic anime keyframe of a determined hero with spiky wind-blown hair charging a swirling azure energy sphere in their hands, dramatic low camera angle, dynamic speed impact lines, sparks and shattered debris flying in air, intense glowing eyes, Makoto Shinkai and Ufotable animation style, rich chromatic aberration, painterly background clouds, 8k anime masterwork.',
    koreanDescription: '유포테이블 및 신카이 마코토 화풍의 에너지 이펙트와 파편, 강렬한 속도선이 담긴 소년 만화 클라이맥스 키프레임입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'DALL-E 3', 'Flux.1'],
    recommendedAspectRatio: '16:9',
    tags: ['Anime', 'Manga', 'Ufotable', 'Shonen', 'Action', 'Keyframe'],
    lighting: 'Intense glowing azure energy glow, cinematic rim lighting on hair',
    camera: 'Extreme dynamic low-angle with wide focal length',
    copiedCount: 4530,
    featured: true,
    variables: [
      {
        key: 'powerElement',
        label: '에너지 & 기술 이펙트',
        placeholder: 'charging a swirling azure energy sphere with flying sparks',
        defaultValue: 'charging a swirling azure energy sphere with flying sparks',
        options: [
          'charging a swirling azure energy sphere with flying sparks',
          'drawing a blazing crimson flame katana surrounded by embers',
          'summoning a gigantic golden lightning bolt from thunderclouds',
          'unleashing an iridescent crystal barrier against dark shadows'
        ]
      }
    ]
  },
  {
    id: 'luxury-perfume-liquid-splash',
    title: 'Luxury Perfume Commercial Splash',
    koreanTitle: '럭셔리 향수 리퀴드 스플래시 광고컷',
    category: 'Product Marketing',
    style: 'Photography',
    fullPrompt: 'Award-winning high-speed advertising photography of a crystal glass luxury perfume bottle with gold atomizer, suspended mid-air surrounded by dynamic splashing droplets of rose water and floating crushed pink peony petals, caustic light reflections, crisp 1/8000s shutter freeze, soft champagne gold gradient background, Broncolor studio lighting, commercial perfection.',
    koreanDescription: '공중에 뜬 크리스탈 향수병 주변으로 튀는 장미수 물방울과 흩날리는 작약 꽃잎을 초고속 셔터로 포착한 럭셔리 광고 사진입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1', 'Stable Diffusion XL'],
    recommendedAspectRatio: '4:5',
    tags: ['Perfume', 'Luxury', 'High Speed', 'Splash', 'Commercial', 'Product'],
    lighting: 'Broncolor strobe caustic backlight, crystalline refraction',
    camera: 'Phase One IQ4 150MP, Schneider 120mm Macro, 1/8000s',
    copiedCount: 3120,
    variables: [
      {
        key: 'scentTheme',
        label: '향수 원료 & 테마',
        placeholder: 'rose water splashes and floating crushed pink peony petals',
        defaultValue: 'rose water splashes and floating crushed pink peony petals',
        options: [
          'rose water splashes and floating crushed pink peony petals',
          'crisp ocean wave splash with floating sea salt crystals and driftwood',
          'warm golden honey droplets with floating toasted vanilla pods and cinnamon',
          'emerald herbal dew splashes with fresh crushed bergamot and mint leaves'
        ]
      }
    ]
  },
  {
    id: 'oil-painting-baroque-still-life',
    title: 'Baroque Masterpiece Oil Painting Still Life',
    koreanTitle: '바로크 거장 유화 정물화',
    category: 'Wallpaper & Sci-Fi',
    style: 'Oil Painting',
    fullPrompt: 'Masterful Dutch Golden Age oil painting in the style of Rembrandt and Caravaggio, dramatic still life with ripe pomegranates, velvet drapery, antique pewter goblets, and blooming dark roses on dark oak table, rich thick impasto oil paint texture with fine craquelure cracks, single candle light illuminating scene, deep dramatic shadow tenebrism, museum masterpiece.',
    koreanDescription: '렘브란트와 카라바조 화풍의 짙은 음영(테네브리즘)과 갈라진 유화 표면(크라클뤼르) 텍스처를 구현한 바로크 정물화입니다.',
    sampleImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    targetModels: ['Nano Banana (Gemini)', 'Midjourney v6', 'Flux.1'],
    recommendedAspectRatio: '4:3',
    tags: ['Oil Painting', 'Baroque', 'Rembrandt', 'Still Life', 'Classic Art', 'Impasto'],
    lighting: 'Single warm candlelight, intense chiaroscuro tenebrism',
    camera: 'Oil on canvas texture with authentic craquelure cracking',
    copiedCount: 1650,
    variables: [
      {
        key: 'objects',
        label: '정물 구성',
        placeholder: 'ripe pomegranates, velvet drapery, antique pewter goblets, and dark roses',
        defaultValue: 'ripe pomegranates, velvet drapery, antique pewter goblets, and dark roses',
        options: [
          'ripe pomegranates, velvet drapery, antique pewter goblets, and dark roses',
          'vintage violin with worn sheet music, brass hourglass, and melted candle',
          'freshly caught glistening fish, brass scale, and crusty bread loaf',
          'collection of ancient leather books, brass skull memento mori, and oil lamp'
        ]
      }
    ]
  }
];

export const CATEGORIES: { id: string; label: string; count: number }[] = [
  { id: 'All', label: '전체 (All)', count: PROMPT_PRESETS.length },
  { id: '교과 삽화', label: '교과 삽화 (교재/교과서)', count: 2 },
  { id: '포스터', label: '포스터 (학교/환경/표어)', count: 2 },
  { id: '학습지 그림', label: '학습지 그림 (활동지/클립아트)', count: 2 },
  { id: '캐릭터', label: '캐릭터 (교육/안내 마스코트)', count: 2 },
  { id: 'Profile / Avatar', label: '프로필 / 아바타', count: 4 },
  { id: 'Product Marketing', label: '제품 마케팅 / 광고', count: 2 },
  { id: 'E-commerce Main', label: '이커머스 제품컷', count: 2 },
  { id: '3D Icon & Object', label: '3D 아이콘 & UI', count: 1 },
  { id: 'YouTube Thumbnail', label: '유튜브 썸네일', count: 1 },
  { id: 'Game Asset', label: '게임 애셋 & 배경', count: 2 },
  { id: 'Comic / Storyboard', label: '만화 / 스토리보드', count: 2 },
  { id: 'Poster / Flyer', label: '포스터 / 그래픽', count: 1 },
  { id: 'Wallpaper & Sci-Fi', label: '배경 & 아트워크', count: 2 },
];

export const STYLES: { id: string; label: string }[] = [
  { id: 'All', label: '전체 스타일' },
  { id: 'Photography', label: '실사 사진 (Photography)' },
  { id: 'Cinematic / Film', label: '시네마틱 (Cinematic)' },
  { id: '3D Render / Pixar', label: '3D 렌더 / 픽사' },
  { id: 'Cyberpunk / Sci-Fi', label: '사이버펑크 / SF' },
  { id: 'Anime / Manga', label: '애니메이션 / 만화' },
  { id: 'Pixel Art', label: '픽셀 아트 (Pixel Art)' },
  { id: 'Watercolor / Ink', label: '수채화 / 수묵화' },
  { id: 'Oil Painting', label: '유화 (Oil Painting)' },
  { id: 'Isometric', label: '아이소메트릭 (Isometric)' },
  { id: 'Minimalism', label: '미니멀리즘 (Minimalism)' },
  { id: 'Claymation', label: '클레이모션 (Claymation)' },
];

export const AI_MODELS: { id: string; label: string; badge: string }[] = [
  { id: 'All', label: '전체 모델', badge: 'All Models' },
  { id: 'Nano Banana (Gemini)', label: 'Nano Banana (Gemini)', badge: 'Gemini' },
  { id: 'Midjourney v6', label: 'Midjourney v6', badge: 'Midjourney' },
  { id: 'Flux.1', label: 'Flux.1 Pro/Dev', badge: 'Flux' },
  { id: 'DALL-E 3', label: 'DALL-E 3', badge: 'OpenAI' },
  { id: 'Stable Diffusion XL', label: 'Stable Diffusion XL', badge: 'SDXL' },
];
