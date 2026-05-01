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
      'A serene morning lifestyle scene: a woman in her 30s sitting at a rustic wooden kitchen table, hands wrapped around a ceramic mug of coffee, looking out of a sunlit window with a peaceful contented smile, a simple black smartphone face-down on the table beside her, warm golden morning light, lush green houseplants, bokeh background, professional editorial photography, Canon 5D, 85mm f/1.8, film grain, warm cream tones, no text, no screen visible',
  },
  {
    type: 'image',
    slug: 'senior-profile',
    width: 768,
    height: 768,
    prompt:
      'Portrait of an elegant elderly woman in her early 70s, silver hair, warm genuine smile, holding a simple black smartphone to her ear mid-conversation, bright airy living room interior, soft natural window light, blurred bookshelves and family photos in background, professional lifestyle photography, shallow depth of field, warm tones, no screen visible, no text',
  },
  {
    type: 'image',
    slug: 'family-profile',
    width: 960,
    height: 720,
    prompt:
      "Candid outdoor lifestyle photograph: a father kneeling beside his young daughter aged around 8 in a sunny park, both laughing together, the girl is looking up at her dad not at a phone, a simple smartphone tucked in the dad's shirt pocket barely visible, lush green grass, dappled afternoon sunlight through trees, shallow depth of field, warm golden tones, professional family photography, no screen visible",
  },
  {
    type: 'image',
    slug: 'balance-profile',
    width: 720,
    height: 960,
    prompt:
      'Portrait of a calm confident professional man in his early 30s, standing outdoors on a quiet city street at golden hour, eyes closed and face slightly tilted upward with a peaceful expression, a simple smartphone tucked away in his jacket pocket, soft bokeh city background, warm sunset light, clean minimal clothing, editorial street portrait photography, no screen visible, no text',
  },
  {
    type: 'image',
    slug: 'send-phone-hero',
    width: 1408,
    height: 768,
    prompt:
      'Flat lay product photography: a clean white wooden desk surface, a simple black smartphone placed neatly inside an open padded yellow mailer envelope, beside it a brown kraft label, a small bone-shaped sticker, and a yellow ribbon, soft diffused studio light from above, minimal and elegant composition, premium unboxing aesthetic, warm cream and yellow tones, professional product photography, no text visible',
  },
  {
    type: 'image',
    slug: 'about-hero',
    width: 1408,
    height: 768,
    prompt:
      'Minimal product lifestyle photograph: a single sleek black smartphone lying face-down on a smooth oak desk, beside it a small ceramic succulent pot, a yellow hardcover notebook closed, and a white ceramic mug of tea with steam rising, soft diffused natural window light, light and airy, premium product photography aesthetic, cream and warm tones, no screen visible, no text',
  },
  {
    type: 'image',
    slug: 'blog-screen-time',
    width: 1216,
    height: 640,
    prompt:
      "Editorial documentary photograph: a young child around 10 years old sitting alone on a bed in a dark bedroom, face illuminated by cold blue light from an unseen source below frame, expression distant and glazed, a concerned parent's silhouette visible in the warm light of the doorway behind, strong contrast between cold blue and warm amber light, moody cinematic atmosphere, professional editorial photography, no text, no screen content visible",
  },
  {
    type: 'image',
    slug: 'blog-senior-phone',
    width: 1216,
    height: 640,
    prompt:
      'Close-up lifestyle photograph: elderly hands with gentle wrinkles holding a simple black smartphone face-down on a wooden kitchen table, beside it a cup of tea and a pair of reading glasses, soft warm morning light from the side, shallow depth of field, tender and human mood, professional lifestyle photography, no screen visible, no text',
  },
  {
    type: 'image',
    slug: 'blog-digital-detox',
    width: 1216,
    height: 640,
    prompt:
      'Cinematic wide landscape photograph: a lone person standing on a green hilltop at sunrise, arms outstretched wide, back to camera, vast rolling countryside stretching to the horizon, morning mist in the valleys, golden light breaking through clouds, no phone visible anywhere, pure freedom and liberation, travel photography style, wide angle, 24mm, professional nature photography, no text',
  },
  {
    type: 'image',
    slug: 'blog-teen-mental-health',
    width: 1216,
    height: 640,
    prompt:
      'Editorial documentary photograph: a teenage girl around 15 sitting alone on the floor against a school corridor wall, knees pulled up, looking downward with a sad withdrawn expression, other students walking past blurred in motion behind her, cool blue fluorescent corridor lighting, moody and thoughtful atmosphere, professional editorial photography, no screen visible, no text',
  },
  {
    type: 'image',
    slug: 'blog-balance',
    width: 1216,
    height: 640,
    prompt:
      'Conceptual editorial photograph: a simple black smartphone placed face-down on a wooden windowsill, beside it a steaming cup of tea in a white mug, soft warm sunrise light flooding through the window onto a peaceful morning scene, potted plant blurred in background, calm and intentional atmosphere, professional lifestyle photography, no screen visible, no text, no notifications',
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
