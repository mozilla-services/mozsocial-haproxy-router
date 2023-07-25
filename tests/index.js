const assert = require('assert');
const fetch = require("node-fetch");

function url(pathname, query = '') {
  const url = new URL(process.env.MOZSOC_URL);
  assert(!!url);

  url.pathname = pathname;
  url.search = query;

  return url;
}

function request(pathname, query = '') {
  return fetch(url(pathname, query), {
    redirect: 'manual'
  });
}

describe('MozSoc URL mapping', () => {
  beforeEach(() => {
    if (!process.env.MOZSOC_URL) {
      throw new Error("Please set `MOZSOC_URL` env var")
    }
  });

  describe('Well-known', () => {
    it('well-known path', async () => {
      assert.equal((await request('.well-known')).status, 404);
      assert.equal((await request('.well-known/nodeinfo')).status, 200);
    });

    it('well-known nodeinfo', async () => {
      assert.equal((await request('.well-known/nodeinfo')).status, 200);
      assert.equal((await request('.well-known/nodeinfo')).headers.get('content-type'), 'application/json; charset=utf-8');
    });

    it('well-known host-meta', async () => {
      assert.equal((await request('.well-known/host-meta')).status, 200);
      assert.equal((await request('.well-known/host-meta')).headers.get('content-type'), 'application/xrd+xml; charset=utf-8');
    });

    it('well-known webfinger', async () => {
      assert.equal((await request('.well-known/webfinger')).status, 400);
      assert.equal((await request('.well-known/webfinger', 'resource=something@somethingelse')).status, 404);
    });
  });

  describe('Activity-Pub', () => {
    it('generic', async () => {
      assert.equal((await fetch(url('/'), {
        headers: {
          'content-type': 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
        }
      })).status, 200);
    });
  });

  // TODO: /actor/<**any>
  // TODO: /input
  // TODO: /users/<**any>

  it('mastodon API', async () => {
    assert.equal((await fetch(url('api/v1/apps'), {
      method: 'POST'
    })).status, 422);
  });

  it('mastodon health', async () => {
    assert.equal((await request('health')).status, 200);
  });

  describe('nodeinfo', async () => {
    it('nodeinfo/2.0', async () => {
      assert.equal((await request('nodeinfo/2.0')).status, 200);
    });
  });

  it('manifest', async () => {
    assert.equal((await request('manifest')).status, 200);
  });

  // TODO: /admin

  it('{o}auth', async () => {
    assert.equal((await request('auth/sign_in')).status, 200);

    assert.equal((await request('oauth/authorize/native')).status, 302);
    assert.equal((await request('oauth/authorize/native')).headers.get('location'), new URL('/auth/sign_in', process.env.MOZSOC_URL));
  });

  it('Elk', async () => {
    assert.equal((await request('')).status, 302);
    assert.equal((await request('')).headers.get('location'), new URL('/elk/', process.env.MOZSOC_URL));

    assert.equal((await request('home')).status, 302);
    assert.equal((await request('home')).headers.get('location'), new URL('/elk/home', process.env.MOZSOC_URL));

    assert.equal((await request('settings')).status, 302);
    assert.equal((await request('settings')).headers.get('location'), new URL('/elk/settings', process.env.MOZSOC_URL));

    assert.equal((await request('settings/foo')).status, 302);
    assert.equal((await request('settings/foo')).headers.get('location'), new URL('/elk/settings', process.env.MOZSOC_URL));

    assert.equal((await request('@foo')).status, 302);
    assert.equal((await request('@foo')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/@foo', process.env.MOZSOC_URL));

    assert.equal((await request('@foo/bar')).status, 302);
    assert.equal((await request('@foo/bar')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/@foo/bar', process.env.MOZSOC_URL));

    assert.equal((await request('explore')).status, 302);
    assert.equal((await request('explore')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/explore', process.env.MOZSOC_URL));

    assert.equal((await request('notifications')).status, 302);
    assert.equal((await request('notifications')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/notifications', process.env.MOZSOC_URL));

    assert.equal((await request('publish')).status, 302);
    assert.equal((await request('publish')).headers.get('location'), new URL('/elk/compose', process.env.MOZSOC_URL));

    assert.equal((await request('favourites')).status, 302);
    assert.equal((await request('favourites')).headers.get('location'), new URL('/elk/favourites', process.env.MOZSOC_URL));

    assert.equal((await request('bookmarks')).status, 302);
    assert.equal((await request('bookmarks')).headers.get('location'), new URL('/elk/bookmarks', process.env.MOZSOC_URL));

    assert.equal((await request('conversations')).status, 302);
    assert.equal((await request('conversations')).headers.get('location'), new URL('/elk/conversations', process.env.MOZSOC_URL));

    assert.equal((await request('local')).status, 302);
    assert.equal((await request('local')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/local', process.env.MOZSOC_URL));

    assert.equal((await request('public/local')).status, 302);
    assert.equal((await request('public/local')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/public/local', process.env.MOZSOC_URL));

    assert.equal((await request('list')).status, 302);
    assert.equal((await request('list')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/list', process.env.MOZSOC_URL));

    assert.equal((await request('tags/a')).status, 302);
    assert.equal((await request('tags/a')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/tags/a', process.env.MOZSOC_URL));

    assert.equal((await request('@foo/followers')).status, 302);
    assert.equal((await request('@foo/followers')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/@foo/followers', process.env.MOZSOC_URL));

    assert.equal((await request('@foo/following')).status, 302);
    assert.equal((await request('@foo/following')).headers.get('location'), new URL('/elk/' + process.env.MOZSOC_HOST + '/@foo/following', process.env.MOZSOC_URL));

    // assert.equal((await request('search')).status, 302);
    // assert.equal((await request('search')).headers.get('location'), new URL('/elk/search', process.env.MOZSOC_URL));
  });

  it('Mastodon deprecated', async () => {
    assert.equal((await request('user/@foo/followers')).status, 404);
    assert.equal((await request('user/@foo/following')).status, 404);

    assert.equal((await request('web')).status, 302);
    assert.equal((await request('web')).headers.get('location'), new URL('/', process.env.MOZSOC_URL));

    assert.equal((await request('about/more')).status, 302);
    assert.equal((await request('about/more')).headers.get('location'), new URL('/about', process.env.MOZSOC_URL));
  });
});
