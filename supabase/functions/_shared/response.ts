import { corsHeaders } from './cors.ts'

export function successResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

export function errorResponse(error: string, status = 400, message?: string) {
  return new Response(
    JSON.stringify({
      success: false,
      error,
      message: message || error,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  )
}
