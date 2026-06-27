import nextEnv from '@next/env'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const requiredEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
]

const optionalAdminEnv = [
  'SUPABASE_ADMIN_EMAIL',
  'SUPABASE_ADMIN_PASSWORD',
  'SUPABASE_ADMIN_FULL_NAME',
]

function readEnv(name) {
  const value = process.env[name]?.trim()
  return value ? value : null
}

function requireEnv(name) {
  const value = readEnv(name)
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const SUPABASE_URL = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
const SUPABASE_ANON_KEY = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

const ADMIN_EMAIL = readEnv('SUPABASE_ADMIN_EMAIL')
const ADMIN_PASSWORD = readEnv('SUPABASE_ADMIN_PASSWORD')
const ADMIN_FULL_NAME = readEnv('SUPABASE_ADMIN_FULL_NAME') ?? 'Riswandi Wedding Admin'

const restBaseUrl = `${SUPABASE_URL}/rest/v1`
const authBaseUrl = `${SUPABASE_URL}/auth/v1`
let lastResult = null

function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(days) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + days)
  return formatDate(date)
}

function makeHeaders(apiKey, extra = {}) {
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function parseResponseBody(response) {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  const body = await parseResponseBody(response)
  return { response, body }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function summarizeErrorBody(body) {
  if (!body) {
    return 'No response body'
  }

  if (typeof body === 'string') {
    return body
  }

  if (body.msg) {
    return body.msg
  }

  if (body.message) {
    return body.message
  }

  return JSON.stringify(body)
}

async function getFirstActiveService() {
  const url =
    `${restBaseUrl}/mc_services?select=id,title&is_active=eq.true` +
    `&order=sort_order.asc&limit=1`
  const { response, body } = await requestJson(url, {
    headers: makeHeaders(SUPABASE_ANON_KEY),
  })

  assert(response.ok, `Failed to read mc_services: ${summarizeErrorBody(body)}`)
  assert(Array.isArray(body) && body.length > 0, 'No active mc_services found')

  return body[0]
}

async function getFirstActiveTemplate() {
  const url =
    `${restBaseUrl}/invitation_templates?select=id,name,min_order_days&is_active=eq.true` +
    `&order=sort_order.asc&limit=1`
  const { response, body } = await requestJson(url, {
    headers: makeHeaders(SUPABASE_ANON_KEY),
  })

  assert(
    response.ok,
    `Failed to read invitation_templates: ${summarizeErrorBody(body)}`
  )
  assert(Array.isArray(body) && body.length > 0, 'No active invitation_templates found')

  return body[0]
}

async function verifyAnonCannotSelect(tableName) {
  const url = `${restBaseUrl}/${tableName}?select=id&limit=1`
  const { response, body } = await requestJson(url, {
    headers: makeHeaders(SUPABASE_ANON_KEY),
  })

  if (response.status === 401 || response.status === 403) {
    return {
      ok: true,
      detail: `${tableName} denied with HTTP ${response.status}`,
    }
  }

  if (response.ok && Array.isArray(body) && body.length === 0) {
    return {
      ok: false,
      detail:
        `${tableName} returned 200 with an empty array. ` +
        'That usually means anon still has select permission and RLS filtered rows instead of denying access.',
    }
  }

  if (response.ok) {
    return {
      ok: false,
      detail: `${tableName} unexpectedly readable by anon`,
    }
  }

  return {
    ok: false,
    detail: `${tableName} returned unexpected status ${response.status}: ${summarizeErrorBody(body)}`,
  }
}

async function deleteById(tableName, id) {
  const url = `${restBaseUrl}/${tableName}?id=eq.${encodeURIComponent(id)}`
  const { response, body } = await requestJson(url, {
    method: 'DELETE',
    headers: makeHeaders(SUPABASE_SERVICE_ROLE_KEY),
  })

  assert(response.ok, `Failed cleanup for ${tableName}/${id}: ${summarizeErrorBody(body)}`)
}

async function verifyPublicMcBookingRpc() {
  const service = await getFirstActiveService()
  const payload = {
    p_client_name: 'Phase 1 Verifier MC',
    p_event_date: addDays(14),
    p_service_name: service.title,
    p_phone: '628111111111',
    p_event_location: 'Verifier Hall',
    p_notes: 'Created by phase-1 baseline verifier',
  }

  const { response, body } = await requestJson(`${restBaseUrl}/rpc/submit_mc_booking`, {
    method: 'POST',
    headers: makeHeaders(SUPABASE_ANON_KEY),
    body: JSON.stringify(payload),
  })

  assert(response.ok, `submit_mc_booking failed: ${summarizeErrorBody(body)}`)
  assert(Array.isArray(body) && body.length === 1, 'submit_mc_booking returned unexpected shape')
  assert(body[0]?.id, 'submit_mc_booking did not return inserted id')

  await deleteById('mc_bookings', body[0].id)

  return {
    publicId: body[0].public_id,
    whatsappPreview: body[0].whatsapp_message,
  }
}

async function verifyPublicInvitationOrderRpc() {
  const template = await getFirstActiveTemplate()
  const minOrderDays = Number.isFinite(template.min_order_days)
    ? template.min_order_days
    : 7

  const payload = {
    p_couple_name: 'Phase 1 Verifier Couple',
    p_event_date: addDays(minOrderDays + 3),
    p_event_location: 'Verifier Ballroom',
    p_template_name: template.name,
    p_phone: '628222222222',
    p_target_completion_date: addDays(minOrderDays + 1),
    p_notes: 'Created by phase-1 baseline verifier',
  }

  const { response, body } = await requestJson(
    `${restBaseUrl}/rpc/submit_invitation_order`,
    {
      method: 'POST',
      headers: makeHeaders(SUPABASE_ANON_KEY),
      body: JSON.stringify(payload),
    }
  )

  assert(response.ok, `submit_invitation_order failed: ${summarizeErrorBody(body)}`)
  assert(
    Array.isArray(body) && body.length === 1,
    'submit_invitation_order returned unexpected shape'
  )
  assert(body[0]?.id, 'submit_invitation_order did not return inserted id')

  await deleteById('invitation_orders', body[0].id)

  return {
    publicId: body[0].public_id,
    whatsappPreview: body[0].whatsapp_message,
  }
}

async function createAdminUser() {
  const payload = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: ADMIN_FULL_NAME,
    },
  }

  const { response, body } = await requestJson(`${authBaseUrl}/admin/users`, {
    method: 'POST',
    headers: makeHeaders(SUPABASE_SERVICE_ROLE_KEY),
    body: JSON.stringify(payload),
  })

  if (response.ok) {
    return body.user ?? body
  }

  const message = summarizeErrorBody(body)
  const alreadyExists =
    message.toLowerCase().includes('already') ||
    message.toLowerCase().includes('exists') ||
    response.status === 422

  if (!alreadyExists) {
    throw new Error(`Failed to create admin auth user: ${message}`)
  }

  const signInUrl = `${authBaseUrl}/token?grant_type=password`
  const signInPayload = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  }

  const signIn = await requestJson(signInUrl, {
    method: 'POST',
    headers: makeHeaders(SUPABASE_ANON_KEY),
    body: JSON.stringify(signInPayload),
  })

  assert(
    signIn.response.ok && signIn.body?.user?.id,
    `Admin auth user already exists, but sign-in with supplied password failed: ${summarizeErrorBody(signIn.body)}`
  )

  return signIn.body.user
}

async function upsertAdminProfile(user) {
  const payload = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? ADMIN_FULL_NAME,
    role: 'super_admin',
    is_active: true,
  }

  const url = `${restBaseUrl}/profiles?on_conflict=id`
  const { response, body } = await requestJson(url, {
    method: 'POST',
    headers: makeHeaders(SUPABASE_SERVICE_ROLE_KEY, {
      Prefer: 'resolution=merge-duplicates,return=representation',
    }),
    body: JSON.stringify(payload),
  })

  assert(response.ok, `Failed to upsert admin profile: ${summarizeErrorBody(body)}`)
  assert(Array.isArray(body) && body[0]?.id, 'Admin profile upsert returned unexpected shape')

  return body[0]
}

async function bootstrapAdminIfConfigured() {
  if (!ADMIN_EMAIL && !ADMIN_PASSWORD) {
    return {
      skipped: true,
      detail:
        'SUPABASE_ADMIN_EMAIL and SUPABASE_ADMIN_PASSWORD are not set. ' +
        'Admin bootstrap skipped.',
    }
  }

  assert(
    ADMIN_EMAIL && ADMIN_PASSWORD,
    'Both SUPABASE_ADMIN_EMAIL and SUPABASE_ADMIN_PASSWORD must be set together.'
  )

  const user = await createAdminUser()
  const profile = await upsertAdminProfile(user)

  return {
    skipped: false,
    userId: user.id,
    email: user.email,
    role: profile.role,
  }
}

async function main() {
  const result = {
    checkedAt: new Date().toISOString(),
    requiredEnvPresent: requiredEnv.every((name) => Boolean(readEnv(name))),
    optionalAdminEnvPresent: optionalAdminEnv.filter((name) => Boolean(readEnv(name))),
    adminBootstrap: null,
    publicRpc: {},
    anonRls: {},
  }

  result.adminBootstrap = await bootstrapAdminIfConfigured()
  result.publicRpc.mcBooking = await verifyPublicMcBookingRpc()
  result.publicRpc.invitationOrder = await verifyPublicInvitationOrderRpc()
  result.anonRls.mcBookings = await verifyAnonCannotSelect('mc_bookings')
  result.anonRls.invitationOrders = await verifyAnonCannotSelect('invitation_orders')

  const anonChecksPassed =
    result.anonRls.mcBookings.ok && result.anonRls.invitationOrders.ok

  lastResult = result
  assert(anonChecksPassed, 'Anon RLS verification failed')

  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        result: lastResult,
      },
      null,
      2
    )
  )

  process.exitCode = 1
})
