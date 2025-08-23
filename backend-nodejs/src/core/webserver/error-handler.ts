import {
  FastifyInstance,
  FastifyError,
  FastifyReply,
  FastifyRequest
} from 'fastify';
import { AppError } from './app-error';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

export const errorHandler = (app: FastifyInstance) => {
  app.setErrorHandler(
    (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          success: false,
          message: error.message,
          statusCode: error.statusCode
        });
      }

      if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.status(400).send({
          success: false,
          message: error.validation.map((e) => e.message).join(', '),
          statusCode: 400
        });
      }

      // eslint-disable-next-line no-console
      console.error('Unexpected error:', error);
      return reply.status(500).send({
        success: false,
        message: `Internal Server Error. ${error.message}`,
        statusCode: 500
      });
    }
  );
};
