import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const CONFIG_BUCKET = process.env.CONFIG_BUCKET
if (!CONFIG_BUCKET) throw new Error('CONFIG_BUCKET env var is required')

const s3 = new S3Client({})

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

export const handler = async (event) => {
  const serial = event.pathParameters?.serial

  if (!serial) {
    return jsonResponse(400, { error: 'Device serial required' })
  }

  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: CONFIG_BUCKET,
        Key: `devices/${serial}/app-config.json`,
      }),
    )
    const config = await response.Body.transformToString()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: config,
    }
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return jsonResponse(404, { error: 'No config found for this device' })
    }
    console.error('get-config: S3 GetObjectCommand failed', { serial, error })
    return jsonResponse(500, { error: 'Failed to fetch config' })
  }
}
