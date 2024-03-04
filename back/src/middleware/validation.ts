import * as express from "express"
import { body, validationResult, ContextRunner } from 'express-validator';

const validate = (validations: ContextRunner[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({ errors: errors.array() });
    };
  };

export default validate