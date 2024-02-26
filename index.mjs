import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const ddbClient = new DynamoDBClient({
  region: 'us-west-2'
})
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)

const myTableName = process.env.TABLE_NAME //my-dynamodb-table

export const handler = async (event) => {
  const operation = event.operation
  try {
    if (operation === 'echo') {
      return event.payload
    } else {
      event.payload.TableName = myTableName

      switch (operation) {
        case 'create':
          await ddbDocClient.send(new PutCommand(event.payload))
          return { massage: 'successfully created' }
        case 'read':
          let tableItem = await ddbDocClient.send(new GetCommand(event.payload))
          return { data: tableItem.Item }
        case 'search':
          let queryItem = await ddbDocClient.send(
            new QueryCommand(event.payload)
          )
          return { data: queryItem.Items }
        case 'update':
          await ddbDocClient.send(new UpdateCommand(event.payload))
          return { message: 'successfully updated' }
        case 'delete':
          await ddbDocClient.send(new DeleteCommand(event.payload))
          return { message: 'successfully deleted' }
        default:
          return `Unknown operation: ${operation}`
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    }
  }
}
