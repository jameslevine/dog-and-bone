import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const DEVICE_TABLE = process.env.DEVICE_TABLE
if (!DEVICE_TABLE) throw new Error('DEVICE_TABLE env var is required')

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

export const handler = async (event) => {
  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' })
  }

  const { deviceSerial, orderId, profileId, appList, launcherVersion } = body

  if (!deviceSerial) {
    return jsonResponse(400, { error: 'deviceSerial required' })
  }

  const timestamp = new Date().toISOString()

  try {
    await ddb.send(
      new PutCommand({
        TableName: DEVICE_TABLE,
        Item: {
          deviceSerial,
          orderId: orderId || 'unknown',
          profileId: profileId || 'unknown',
          appList: appList || [],
          launcherVersion: launcherVersion || '1.0.0',
          firstSeen: timestamp,
          lastSeen: timestamp,
          status: 'active',
          configVersion: 1,
        },
      }),
    )
  } catch (error) {
    console.error('register-device: DynamoDB PutCommand failed', { deviceSerial, error })
    return jsonResponse(500, { error: 'Failed to register device' })
  }

  return jsonResponse(200, { success: true, deviceSerial })
}
