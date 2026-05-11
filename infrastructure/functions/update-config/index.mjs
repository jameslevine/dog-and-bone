import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const CONFIG_BUCKET = process.env.CONFIG_BUCKET
const DEVICE_TABLE = process.env.DEVICE_TABLE
if (!CONFIG_BUCKET) throw new Error('CONFIG_BUCKET env var is required')
if (!DEVICE_TABLE) throw new Error('DEVICE_TABLE env var is required')

const s3 = new S3Client({})
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

export const handler = async (event) => {
  const serial = event.pathParameters?.serial
  const config = event.body

  if (!serial || !config) {
    return jsonResponse(400, { error: 'Serial and config required' })
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: CONFIG_BUCKET,
        Key: `devices/${serial}/app-config.json`,
        Body: config,
        ContentType: 'application/json',
      }),
    )
  } catch (error) {
    console.error('update-config: S3 PutObjectCommand failed', { serial, error })
    return jsonResponse(500, { error: 'Failed to save config' })
  }

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: DEVICE_TABLE,
        Key: { deviceSerial: serial },
        UpdateExpression: 'SET configVersion = configVersion + :inc, lastConfigUpdate = :now',
        ExpressionAttributeValues: {
          ':inc': 1,
          ':now': new Date().toISOString(),
        },
      }),
    )
  } catch (error) {
    console.error('update-config: DynamoDB UpdateCommand failed', { serial, error })
    return jsonResponse(500, { error: 'Config saved but device record update failed' })
  }

  return jsonResponse(200, { success: true, serial })
}
