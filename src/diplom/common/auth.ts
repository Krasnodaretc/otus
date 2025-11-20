import { FastifyReply, FastifyRequest } from 'fastify';
import { createApiKeyPreHandler } from './authApiKey';
import { ApiKeyReaderMongo } from './adapters/ApiKeyReaderMongo';

export const apiKeyPreHandler = createApiKeyPreHandler(new ApiKeyReaderMongo());


