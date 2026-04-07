import { type AiAsset } from '@/types'

/**
 * Source of truth for all AI-generated images and videos.
 * Run `npm run generate:ai-assets` to generate these via Amazon Bedrock.
 * Images → public/images/ai/<slug>.png
 * Videos → public/videos/<slug>.mp4
 */
export const AI_ASSETS: AiAsset[] = [
  // === IMAGES (Nova Canvas) ===
  {
    type: 'image',
    slug: 'hero-home',
    description: 'Hero image — person peacefully using a simple phone at a kitchen table',
    width: 1440,
    height: 810,
    prompt:
      'A serene morning scene, a middle-aged person sitting at a wooden kitchen table holding a simple yellow-cased smartphone, warm golden light streaming through windows, green houseplants in background, calm and intentional lifestyle, no notifications visible on screen, editorial photography, shallow depth of field, film grain, warm tones',
  },
  {
    type: 'image',
    slug: 'senior-profile',
    description: 'Senior profile — elderly woman smiling while using a phone',
    width: 800,
    height: 800,
    prompt:
      'An elderly woman in her 70s smiling warmly while using a simple smartphone, large text clearly visible on the screen, bright sunny living room, family photographs soft in background, natural window light, approachable and safe feeling, lifestyle photography, warm and inviting',
  },
  {
    type: 'image',
    slug: 'family-profile',
    description: 'Family profile — parent and child with a simple phone outdoors',
    width: 960,
    height: 720,
    prompt:
      'A parent and young child around 8 years old sitting together outdoors in a sunny park, child is holding a simple phone and looking at the parent not the screen, both smiling naturally, green grass and trees in background, warm afternoon light, candid documentary photography, genuine happy moment',
  },
  {
    type: 'image',
    slug: 'balance-profile',
    description: 'Balance profile — professional looking up from phone with calm expression',
    width: 720,
    height: 960,
    prompt:
      'A professional in their early 30s standing on a city street, phone tucked away in pocket, looking up at the sky with a calm satisfied peaceful expression, city skyline softly blurred in background, golden hour sunset light, minimal clean clothing, editorial street photography style',
  },
  {
    type: 'image',
    slug: 'send-phone-hero',
    description: 'Send Your Phone — phone being packaged to mail',
    width: 1440,
    height: 810,
    prompt:
      'A smartphone being carefully placed into a padded yellow envelope on a clean white wooden desk, a small cute dog and bone sticker on the envelope, warm soft light, minimalist flat lay photography, professional product photography style, warm cream and yellow tones',
  },
  {
    type: 'image',
    slug: 'about-hero',
    description: 'About page hero — Samsung Galaxy A12 on a minimalist desk',
    width: 1440,
    height: 810,
    prompt:
      'A Samsung Galaxy A12 smartphone lying on a clean wooden desk next to a small succulent plant, a yellow notebook, and a cup of tea, soft diffused natural light, premium product photography, minimalist composition, cream and yellow tones, no screen content visible',
  },
  {
    type: 'image',
    slug: 'blog-screen-time',
    description: 'Blog cover — child looking at phone in dark room',
    width: 1200,
    height: 630,
    prompt:
      "A young child around 10 years old looking pensively at a bright glowing phone screen in a dimly lit bedroom, parent's silhouette visible in the doorway looking concerned, contrast between warm light from doorway and cold blue screen glow, editorial photography, documentary style, thoughtful mood",
  },
  {
    type: 'image',
    slug: 'blog-senior-phone',
    description: 'Blog cover — elderly hands holding a phone with large text',
    width: 1200,
    height: 630,
    prompt:
      'Close-up of elderly hands gently holding a simple smartphone with large readable text visible on the screen, warm morning light, wooden kitchen table surface, a pair of reading glasses nearby, soft focus background, warm and tender mood, lifestyle photography',
  },
  {
    type: 'image',
    slug: 'blog-digital-detox',
    description: 'Blog cover — person on hilltop without a phone',
    width: 1200,
    height: 630,
    prompt:
      'A person standing on a hilltop at sunrise with arms open wide, vast green landscape stretching to the horizon, no phone in sight, morning mist in valleys below, freedom and liberation feeling, travel photography style, cinematic wide shot, golden hour light',
  },
  {
    type: 'image',
    slug: 'blog-teen-mental-health',
    description: 'Blog cover — teenager alone with phone in school corridor',
    width: 1200,
    height: 630,
    prompt:
      'A teenage girl around 15 sitting alone against a school corridor wall, looking at her phone with a vacant sad expression, other students blurred walking past, moody cool blue lighting, editorial documentary photography, thoughtful and concerned mood',
  },
  {
    type: 'image',
    slug: 'blog-balance',
    description: 'Blog cover — conceptual split between chaotic notifications and peaceful morning',
    width: 1200,
    height: 630,
    prompt:
      'Split composition: left half shows a chaotic smartphone screen covered in social media notifications and red badge counts, right half shows a peaceful sunrise with a simple phone face-down on a windowsill and a cup of tea, conceptual editorial photography, sharp contrast between digital chaos and calm morning peace',
  },

  // === VIDEOS (Nova Reel) ===
  {
    type: 'video',
    slug: 'hero-reel',
    description: 'Hero video — phone placed face-down as person relaxes',
    durationSeconds: 6,
    prompt:
      "Slow motion cinematic video: a simple yellow-cased smartphone is gently placed face-down on a wooden kitchen table next to a steaming cup of tea, a person's relaxed hands visible resting peacefully on the table, natural morning sunlight through windows, peaceful and intentional atmosphere, 4K film quality, warm tones",
  },
  {
    type: 'video',
    slug: 'family-reel',
    description: 'Family video — parent handing phone to child who looks up at the world',
    durationSeconds: 6,
    prompt:
      'Cinematic video: a parent hands a simple phone to a smiling child in a sunny garden, the child glances at the phone then immediately looks up and runs toward a dog playing on the grass, warm golden afternoon light, joyful and free feeling, smooth camera movement, family lifestyle commercial style',
  },
  {
    type: 'video',
    slug: 'senior-reel',
    description: 'Senior video — elderly man making a phone call and smiling',
    durationSeconds: 6,
    prompt:
      'Close-up cinematic video: an elderly man in his 70s holding a simple phone to his ear, breaking into a warm genuine smile as he speaks, bright comfortable home environment visible softly in background, natural light, close-up emotional moment, documentary warmth, slow zoom out',
  },
]

export const getImageAssets = () =>
  AI_ASSETS.filter((a): a is Extract<AiAsset, { type: 'image' }> => a.type === 'image')

export const getVideoAssets = () =>
  AI_ASSETS.filter((a): a is Extract<AiAsset, { type: 'video' }> => a.type === 'video')
