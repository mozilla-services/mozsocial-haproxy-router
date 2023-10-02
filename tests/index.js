const assert = require('assert');
const fetch = require('node-fetch');

function url(pathname, query = '') {
  const url = new URL(process.env.MOZSOC_URL);
  assert(!!url);

  url.pathname = pathname;
  url.search = query;

  return url;
}

function request(pathname, query = '') {
  return fetch(url(pathname, query), {
    redirect: 'manual',
  });
}

describe('MozSoc URL mapping', () => {
  beforeEach(() => {
    if (!process.env.MOZSOC_URL) {
      throw new Error('Please set `MOZSOC_URL` env var');
    }
  });

  describe('Well-known', () => {
    it('well-known path', async () => {
      assert.equal((await request('.well-known')).status, 404);
    });

    it('well-known nodeinfo', async () => {
      const req = await request('.well-known/nodeinfo');
      assert.equal(req.status, 200);
      assert.equal(
        req.headers.get('content-type'),
        'application/json; charset=utf-8'
      );
      assert.equal(req.headers.get('x-server'), 'mastodon');
    });

    it('well-known host-meta', async () => {
      const req = await request('.well-known/host-meta');
      assert.equal(req.status, 200);
      assert.equal(
        req.headers.get('content-type'),
        'application/xrd+xml; charset=utf-8'
      );
      assert.equal(req.headers.get('x-server'), 'mastodon');
    });

    it('well-known webfinger', async () => {
      const req = await request('.well-known/webfinger');
      assert.equal(req.status, 400);
      assert.equal(req.headers.get('x-server'), 'mastodon');
    });
    it('well-known webfinger', async () => {
      const req = await request(
        '.well-known/webfinger',
        'resource=something@somethingelse'
      );
      assert.equal(req.status, 404);
      assert.equal(req.headers.get('x-server'), 'mastodon');
    });
  });

  describe('Activity-Pub', () => {
    it('generic', async () => {
      assert.equal(
        (
          await fetch(url('/'), {
            headers: {
              'content-type':
                'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
            },
          })
        ).status,
        200
      );
    });
  });

  // TODO: /actor/<**any>
  // TODO: /input
  // TODO: /users/<**any>

  it('mastodon API', async () => {
    assert.equal(
      (
        await fetch(url('api/v1/apps'), {
          method: 'POST',
        })
      ).status,
      422
    );
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

  describe('{o}auth', async () => {
    it('auth/signin', async () => {
      const req = await request('auth/sign_in');
      assert.equal(req.status, 200);
    });

    it('auth/authorize/native', async () => {
      const req = await request('oauth/authorize/native');
      assert.equal(req.status, 302);
      assert.equal(
        req.headers.get('location'),
        new URL('/auth/sign_in', process.env.MOZSOC_URL).toString()
      );
    });
  });

  describe('Elk', async () => {
    it('', async () => {
      const req = await request('');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('home', async () => {
      const req = await request('home');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('settings', async () => {
      const req = await request('settings');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('settings/foo', async () => {
      const req = await request('settings/foo');
      assert.equal(req.status, 302);
      assert.equal(
        req.headers.get('location'),
        new URL('/settings', process.env.MOZSOC_URL)
      );
    });

    it('@foo', async () => {
      const req = await request('@foo');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('@foo/bar', async () => {
      const req = await request('@foo/bar');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('explore', async () => {
      const req = await request('explore');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('notifications', async () => {
      const req = await request('notifications');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('publish', async () => {
      const req = await request('publish');
      assert.equal(req.status, 302);
      assert.equal(
        req.headers.get('location'),
        new URL('/compose', process.env.MOZSOC_URL)
      );
    });

    it('favourites', async () => {
      const req = await request('favourites');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('bookmarks', async () => {
      const req = await request('bookmarks');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('conversations', async () => {
      const req = await request('conversations');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('public/local', async () => {
      const req = await request('public/local');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('lists', async () => {
      const req = await request('lists');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('tags/a', async () => {
      const req = await request('tags/a');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('@foo/followers', async () => {
      const req = await request('@foo/followers');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('@foo/following', async () => {
      const req = await request('@foo/following');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('search', async () => {
      const req = await request('search');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });

    it('discover', async () => {
      const req = await request('discover');
      assert.equal(req.status, 200);
      assert.equal(req.headers.get('x-server'), 'elk');
    });
  });

  describe('Content-Feed', async () => {
    it('moso/v1/discover 200', async () => {
      const req = await request('content-feed/moso/v1/discover?locale=en-US');
      assert.equal(req.status, 200);
      assert.equal(
        req.headers.get('content-type'),
        'application/json; charset=utf-8'
      );
      assert.equal(req.headers.get('x-server'), 'content-feed');
    });

    it('moso/v1/discover 400 for missing query parameter', async () => {
      const req = await request('content-feed/moso/v1/discover');
      assert.equal(req.status, 400);
    });

    it('responds with 404 on a non-existing path', async () => {
      const req = await request('content-feed/does-not-exist');
      assert.equal(req.status, 404);
    });
  });

  describe('Mastodon deprecated', async () => {
    it('user/@foo/followers', async () => {
      const req = await request('user/@foo/followers');
      assert.equal(req.status, 404);
      assert.equal(req.headers.get('x-server'), 'mastodon');
    });

    it('user/@foo/following', async () => {
      const req = await request('user/@foo/following');
      assert.equal(req.status, 404);
      assert.equal(req.headers.get('x-server'), 'mastodon');
    });

    it('web', async () => {
      const req = await request('web');
      assert.equal(req.status, 302);
      assert.equal(
        req.headers.get('location'),
        new URL('/', process.env.MOZSOC_URL)
      );
    });

    it('about/more', async () => {
      const req = await request('about/more');
      assert.equal(req.status, 302);
      assert.equal(
        req.headers.get('location'),
        new URL('/about', process.env.MOZSOC_URL)
      );
    });
  });
});
