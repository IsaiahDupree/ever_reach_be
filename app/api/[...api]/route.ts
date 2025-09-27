export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { default: app } = await import('../../../../backend/hono');
  return app.fetch(request);
}

export async function POST(request: Request) {
  const { default: app } = await import('../../../../backend/hono');
  return app.fetch(request);
}

export async function PUT(request: Request) {
  const { default: app } = await import('../../../../backend/hono');
  return app.fetch(request);
}

export async function DELETE(request: Request) {
  const { default: app } = await import('../../../../backend/hono');
  return app.fetch(request);
}

export async function PATCH(request: Request) {
  const { default: app } = await import('../../../../backend/hono');
  return app.fetch(request);
}

export async function OPTIONS(request: Request) {
  const { default: app } = await import('../../../../backend/hono');
  return app.fetch(request);
}
