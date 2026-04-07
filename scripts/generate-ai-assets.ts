/**
 * Dog and Bone — AI Asset Generation Script
 *
 * Generates lifestyle images and videos via Amazon Bedrock.
 * Uses the default AWS profile from ~/.aws/credentials.
 *
 * Usage:
 *   npm run generate:ai-assets
 *
 * Outputs:
 *   public/images/ai/<slug>.png  (Nova Canvas)
 *   public/videos/<slug>.mp4    (Nova Reel — async, polls until complete)
 *
 * Cost estimates (us-east-1, 2025 pricing):
 *   Images: ~$0.06 per 1024x1024 image
 *   Videos: ~$0.40 per 6-second clip
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  StartAsyncInvokeCommand,
  GetAsyncInvokeCommand,
} from '@aws-sdk/client-bedrock-runtime'
import * as fs from 'fs'
import * as path from 'path'

// ---------------------------------------------------------------------------
// Asset definitions (must match src/data/aiAssets.ts)
// ---------------------------------------------------------------------------

interface ImageAsset {
  type: 'image'
  slug: string
  prompt: string
  width: number
  height: number
}

interface VideoAsset {
  type: 'video'
  slug: string
  prompt: string
  durationSeconds: number
}

type Asset = ImageAsset | VideoAsset

const ASSETS: Asset[] = [
  {
    type: 'image',
    slug: 'hero-home',
    width: 1408,
    height: 768,
    prompt:
      'A serene morning scene, a middle-aged person sitting at a wooden kitchen table holding a simple yellow-cased smartphone, warm golden light streaming through windows, green houseplants in background, calm and intentional lifestyle, no notifications visible on screen, editorial photography, shallow depth of field, film grain, warm tones',
  },
  {
    type: 'image',
    slug: 'senior-profile',
    width: 768,
    height: 768,
    prompt:
      'An elderly woman in her 70s smiling warmly while using a simple smartphone, large text clearly visible on the screen, bright sunny living room, family photographs soft in background, natural window light, approachable and safe feeling, lifestyle photography, warm and inviting',
  },
  {
    type: 'image',
    slug: 'family-profile',
    width: 960,
    height: 720,
    prompt:
      'A parent and young child around 8 years old sitting together outdoors in a sunny park, child is holding a simple phone and looking at the parent not the screen, both smiling naturally, green grass and trees in background, warm afternoon light, candid documentary photography, genuine happy moment',
  },
  {
    type: 'image',
    slug: 'balance-profile',
    width: 720,
    height: 960,
    prompt:
      'A professional in their early 30s standing on a city street, phone tucked away in pocket, looking up at the sky with a calm satisfied peaceful expression, city skyline softly blurred in background, golden hour sunset light, minimal clean clothing, editorial street photography style',
  },
  {
    type: 'image',
    slug: 'send-phone-hero',
    width: 1408,
    height: 768,
    prompt:
      'A smartphone being carefully placed into a padded yellow envelope on a clean white wooden desk, a small cute dog and bone sticker on the envelope, warm soft light, minimalist flat lay photography, professional product photography style, warm cream and yellow tones',
  },
  {
    type: 'image',
    slug: 'about-hero',
    width: 1408,
    height: 768,
    prompt:
      'A Samsung Galaxy A12 smartphone lying on a clean wooden desk next to a small succulent plant, a yellow notebook, and a cup of tea, soft diffused natural light, premium product photography, minimalist composition, cream and yellow tones, no screen content visible',
  },
  {
    type: 'image',
    slug: 'blog-screen-time',
    width: 1216,
    height: 640,
    prompt:
      "A young child around 10 years old looking pensively at a bright glowing phone screen in a dimly lit bedroom, parent's silhouette visible in the doorway looking concerned, contrast between warm light from doorway and cold blue screen glow, editorial photography, documentary style, thoughtful mood",
  },
  {
    type: 'image',
    slug: 'blog-senior-phone',
    width: 1216,
    height: 640,
    prompt:
      'Close-up of elderly hands gently holding a simple smartphone with large readable text visible on the screen, warm morning light, wooden kitchen table surface, a pair of reading glasses nearby, soft focus background, warm and tender mood, lifestyle photography',
  },
  {
    type: 'image',
    slug: 'blog-digital-detox',
    width: 1216,
    height: 640,
    prompt:
      'A person standing on a hilltop at sunrise with arms open wide, vast green landscape stretching to the horizon, no phone in sight, morning mist in valleys below, freedom and liberation feeling, travel photography style, cinematic wide shot, golden hour light',
  },
  {
    type: 'image',
    slug: 'blog-teen-mental-health',
    width: 1216,
    height: 640,
    prompt:
      'A teenage girl around 15 sitting alone against a school corridor wall, looking at her phone with a vacant sad expression, other students blurred walking past, moody cool blue lighting, editorial documentary photography, thoughtful and concerned mood',
  },
  {
    type: 'image',
    slug: 'blog-balance',
    width: 1216,
    height: 640,
    prompt:
      'Split composition: left half shows a chaotic smartphone screen covered in social media notifications and red badge counts, right half shows a peaceful sunrise with a simple phone face-down on a windowsill and a cup of tea, conceptual editorial photography, sharp contrast between digital chaos and calm morning peace',
  },
  {
    type: 'video',
    slug: 'hero-reel',
    durationSeconds: 6,
    prompt:
      "Slow motion cinematic video: a simple yellow-cased smartphone is gently placed face-down on a wooden kitchen table next to a steaming cup of tea, a person's relaxed hands visible resting peacefully on the table, natural morning sunlight through windows, peaceful and intentional atmosphere, 4K film quality, warm tones",
  },
  {
    type: 'video',
    slug: 'family-reel',
    durationSeconds: 6,
    prompt:
      'Cinematic video: a parent hands a simple phone to a smiling child in a sunny garden, the child glances at the phone then immediately looks up and runs toward a dog playing on the grass, warm golden afternoon light, joyful and free feeling, smooth camera movement, family lifestyle commercial style',
  },
  {
    type: 'video',
    slug: 'senior-reel',
    durationSeconds: 6,
    prompt:
      'Close-up cinematic video: an elderly man in his 70s holding a simple phone to his ear, breaking into a warm genuine smile as he speaks, bright comfortable home environment visible softly in background, natural light, close-up emotional moment, documentary warmth, slow zoom out',
  },
]

// ---------------------------------------------------------------------------
// Bedrock client — uses default AWS credential chain
// ---------------------------------------------------------------------------

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

// ---------------------------------------------------------------------------
// Image generation via Nova Canvas
// ---------------------------------------------------------------------------

async function generateImage(asset: ImageAsset): Promise<void> {
  const outputPath = path.join(process.cwd(), 'public', 'images', 'ai', `${asset.slug}.png`)

  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭  Skipping ${asset.slug}.png (already exists)`)
    return
  }

  console.log(`  📸 Generating image: ${asset.slug} (${asset.width}×${asset.height})`)

  const body = JSON.stringify({
    taskType: 'TEXT_IMAGE',
    textToImageParams: {
      text: asset.prompt,
      negativeText:
        'low quality, blurry, distorted, pixelated, watermark, text overlay, logo, nsfw',
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      height: asset.height,
      width: asset.width,
      cfgScale: 8.0,
      seed: 42,
    },
  })

  const response = await client.send(
    new InvokeModelCommand({
      modelId: 'amazon.nova-canvas-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: Buffer.from(body),
    }),
  )

  const result = JSON.parse(new TextDecoder().decode(response.body))
  const imageBase64 = result.images[0]
  const imageBuffer = Buffer.from(imageBase64, 'base64')

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, imageBuffer)
  console.log(`  ✅ Saved: public/images/ai/${asset.slug}.png`)
}

// ---------------------------------------------------------------------------
// Video generation via Nova Reel (async)
// ---------------------------------------------------------------------------

async function generateVideo(asset: VideoAsset): Promise<void> {
  const outputPath = path.join(process.cwd(), 'public', 'videos', `${asset.slug}.mp4`)

  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭  Skipping ${asset.slug}.mp4 (already exists)`)
    return
  }

  console.log(`  🎬 Starting video generation: ${asset.slug} (${asset.durationSeconds}s)`)

  // Nova Reel requires an S3 bucket for output — URI must be a bucket/prefix (directory), not a file
  const s3OutputBucket = process.env.BEDROCK_OUTPUT_BUCKET || 'dog-and-bone-ai-assets'
  // Use prefix directory — Bedrock appends its own filename within this prefix
  const s3OutputPrefix = `videos/${asset.slug}/`

  const modelInput = {
    taskType: 'TEXT_VIDEO',
    textToVideoParams: {
      text: asset.prompt,
    },
    videoGenerationConfig: {
      durationSeconds: asset.durationSeconds,
      fps: 24,
      dimension: '1280x720',
      seed: 42,
    },
  }

  // Start async invocation
  const startResponse = await client.send(
    new StartAsyncInvokeCommand({
      modelId: 'amazon.nova-reel-v1:0',
      contentType: 'application/json',
      modelInput,
      outputDataConfig: {
        s3OutputDataConfig: {
          s3Uri: `s3://${s3OutputBucket}/${s3OutputPrefix}`,
        },
      },
    }),
  )

  const invocationArn = startResponse.invocationArn!
  console.log(`  ⏳ Video job started: ${invocationArn}`)

  // Poll until complete
  let status = 'InProgress'
  let attempts = 0
  const maxAttempts = 60 // 5 minutes at 5-second intervals

  while (status === 'InProgress' && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    attempts++

    const statusResponse = await client.send(new GetAsyncInvokeCommand({ invocationArn }))

    status = statusResponse.status || 'InProgress'
    console.log(`  ⏳ Status: ${status} (attempt ${attempts}/${maxAttempts})`)
  }

  if (status === 'Completed') {
    // Download from S3 — Bedrock puts output.mp4 inside the prefix
    const s3Key = `${s3OutputPrefix}output.mp4`
    console.log(`  ✅ Video complete. Downloading from s3://${s3OutputBucket}/${s3Key}`)
    console.log(`     Run: aws s3 cp s3://${s3OutputBucket}/${s3Key} ${outputPath}`)
  } else {
    console.error(`  ❌ Video generation failed or timed out: ${asset.slug}`)
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n🦴 Dog and Bone — AI Asset Generator\n')
  console.log('Using AWS region: us-east-1')
  console.log('AWS profile: default\n')

  const images = ASSETS.filter((a): a is ImageAsset => a.type === 'image')
  const videos = ASSETS.filter((a): a is VideoAsset => a.type === 'video')

  console.log(`📸 Generating ${images.length} images...`)
  for (const asset of images) {
    try {
      await generateImage(asset)
    } catch (err) {
      console.error(`  ❌ Failed: ${asset.slug}`, err)
    }
  }

  console.log(`\n🎬 Generating ${videos.length} videos...`)
  console.log('  Note: Videos are written to S3. You must create the bucket first:')
  console.log('  aws s3 mb s3://dog-and-bone-ai-assets --region us-east-1\n')

  for (const asset of videos) {
    try {
      await generateVideo(asset)
    } catch (err) {
      console.error(`  ❌ Failed: ${asset.slug}`, err)
    }
  }

  console.log('\n✅ Done!\n')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
