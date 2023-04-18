import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {find_views as algo_find_views} from './algo';

import schema from './schema';

const find_views: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const limit = parseInt(event?.multiValueQueryStringParameters?.n?.[0] ?? '') || null;

  // i don't like using `as any` here, but the schema and the defined type match 
  // (and i don't know how to fix it, not a ts wizard)
  const views = algo_find_views(event.body as any, limit);  

  return {
    statusCode: 200,
    body: JSON.stringify(views),
  };
};

export const main = middyfy(find_views);
