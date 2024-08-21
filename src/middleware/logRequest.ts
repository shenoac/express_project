import { Request, Response, NextFunction } from 'express';

// Logging middleware
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  
  // Capture the start time
  const start = Date.now();
  
  // Once the response is finished, log additional details
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`Response status: ${res.statusCode}, Duration: ${duration}ms`);
  });

  next(); // Proceed to the next middleware or route handler
};

export default logRequest;
