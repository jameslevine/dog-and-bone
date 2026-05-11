import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const DEVICE_TABLE = process.env.DEVICE_TABLE
if (!DEVICE_TABLE) throw new Error('DEVICE_TABLE env var is required')

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

export const handler = async () => {
  try {
    const response = await ddb.send(new ScanCommand({ TableName: DEVICE_TABLE }))
    return jsonResponse(200, { devices: response.Items || [] })
  } catch (error) {
    console.error('list-devices: DynamoDB ScanCommand failed', error)
    return jsonResponse(500, { error: 'Failed to list devices' })
  }
}
