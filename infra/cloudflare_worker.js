/**
 * Cloudflare Worker for Coastal Flood Viewer API
 * 
 * This worker provides a secure proxy to Google Earth Engine and other services
 * without exposing credentials to the browser.
 * 
 * TODO: Implement actual GEE integration
 * - Add GEE authentication
 * - Implement elevation data endpoints
 * - Add rate limiting and caching
 * - Add error handling and logging
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Route handling
    if (url.pathname.startsWith('/api/elevation')) {
      return handleElevationRequest(request, env, corsHeaders);
    }
    
    if (url.pathname.startsWith('/api/sea-level')) {
      return handleSeaLevelRequest(request, env, corsHeaders);
    }

    // Default response
    return new Response(JSON.stringify({
      error: 'Not Found',
      message: 'API endpoint not found'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  },
};

/**
 * Handle elevation data requests
 */
async function handleElevationRequest(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    
    if (!lat || !lon) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Latitude and longitude parameters required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // TODO: Implement actual GEE elevation lookup
    // 1. Authenticate with GEE
    // 2. Load elevation asset
    // 3. Sample at lat/lon coordinates
    // 4. Return elevation value

    // Mock response for now
    const elevation = Math.random() * 10; // 0-10m elevation
    
    return new Response(JSON.stringify({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      elevation: elevation,
      unit: 'meters',
      source: 'mock_data'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

/**
 * Handle sea level data requests
 */
async function handleSeaLevelRequest(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const year = url.searchParams.get('year') || '2020';
    const month = url.searchParams.get('month') || '6';
    
    if (!lat || !lon) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Latitude and longitude parameters required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // TODO: Implement actual sea level data lookup
    // 1. Load sea level anomaly data
    // 2. Sample at lat/lon coordinates
    // 3. Return time series data

    // Mock response for now
    const seaLevel = (Math.random() - 0.5) * 100; // -50 to +50mm
    
    return new Response(JSON.stringify({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      year: parseInt(year),
      month: parseInt(month),
      seaLevel: seaLevel,
      unit: 'millimeters',
      source: 'mock_data'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
