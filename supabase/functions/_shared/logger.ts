/**
 * Complete Request Logger for Edge Functions
 * Single-line JSON log with all information
 */

export interface RequestLog {
  functionName: string
  userId?: string
  email?: string
  method: string
  path: string
  requestBody?: unknown
  responseStatus?: number
  responseData?: unknown
  error?: string
  durationMs?: number
  timestamp: string
}

export class RequestLogger {
  private functionName: string
  private startTime: number
  private userId?: string
  private email?: string
  private method: string
  private path: string
  private requestBody?: unknown

  constructor(functionName: string, req: Request) {
    this.functionName = functionName
    this.startTime = Date.now()
    this.method = req.method
    const url = new URL(req.url)
    this.path = url.pathname
  }

  setUser(userId?: string, email?: string) {
    this.userId = userId
    this.email = email
  }

  setRequestBody(body: unknown) {
    this.requestBody = body
  }

  logSuccess(status: number, data: unknown) {
    const durationMs = Date.now() - this.startTime
    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      functionName: this.functionName,
      userId: this.userId || 'anonymous',
      email: this.email || 'N/A',
      method: this.method,
      path: this.path,
      requestBody: this.requestBody || null,
      responseStatus: status,
      responseData: data,
      error: undefined,
      durationMs,
    }
    console.log(JSON.stringify(log))
  }

  logError(status: number, error: string | Error) {
    const durationMs = Date.now() - this.startTime
    const errorMessage = typeof error === 'string' ? error : error.message
    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      functionName: this.functionName,
      userId: this.userId || 'anonymous',
      email: this.email || 'N/A',
      method: this.method,
      path: this.path,
      requestBody: this.requestBody || null,
      responseStatus: status,
      responseData: null,
      error: errorMessage,
      durationMs,
    }
    console.error(JSON.stringify(log))
  }
}
