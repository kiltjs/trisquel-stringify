/* global describe, it */

var stringifyNodes = require('../stringify'),
    assert = require('assert');

describe('stringify', function () {

  it('div', function () {

    assert.deepEqual( stringifyNodes([{ $:'div', attrs: { id: 'foobar' }, _:[{ text: 'foo' }] }]), `
<div id="foobar">foo</div>
    `.trim() );

  });

  it('text nodes', function () {

    assert.strictEqual( stringifyNodes([
      {
        text: 'foo ',
      },
      {
        text: ' bar',
      },
    ]), 'foo  bar' );

  });

  it('mixed nodes', function () {

    assert.strictEqual( stringifyNodes([
      'foo ',
      {
        text: ' bar',
      },
    ]), 'foo  bar' );

  });

  it('script', function () {

    assert.strictEqual( stringifyNodes([{ $:'script', attrs: { 'template:type': 'text/javascript' }, _:`
  var foo = 'bar';
` }]), `
<script template:type="text/javascript">
  var foo = 'bar';
</script>
    `.trim() );

  });

  it('html', function () {

    assert.strictEqual( stringifyNodes([
      {
        $: '!DOCTYPE',
        attrs: {
          html: ''
        },
        _: [
          {
            _: [
              {
                $: 'head'
              },
              {
                $: 'body'
              }
            ],
            $: 'html'
          }
        ],
        unclosed: true,
        warn: true
      }
    ]), '<!DOCTYPE html><html><head></head><body></body></html>' );

  });

  it('code', function () {

    var snippet = `
<pre><code class="language-html">
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
</code></pre>
    `;

    assert.strictEqual( stringifyNodes([
      {
        $: 'pre',
        _: [
          {
            $: 'code',
            attrs: {
              class: 'language-html'
            },
            _: '\n<!DOCTYPE html>\n<html>\n  <head></head>\n  <body></body>\n</html>\n',
          }
        ]
      }
    ]), snippet.trim() );

  });

  it('keep comments', function () {

    var snippet = 'foo <!-- commented text --> bar';

    assert.strictEqual( stringifyNodes([
      {
        text: 'foo ',
      },
      {
        comments: true,
        _: ' commented text ',
      },
      {
        text: ' bar',
      },
    ], { remove_comments: false }), snippet.trim() );

  });

  it('remove comments implicit', function () {

    assert.strictEqual( stringifyNodes([
      {
        text: 'foo ',
      },
      {
        comments: true,
        _: ' commented text ',
      },
      {
        text: ' bar',
      },
    ]), 'foo  bar' );

  });

  it('remove comments explicit', function () {

    assert.strictEqual( stringifyNodes([
      {
        text: 'foo ',
      },
      {
        comments: true,
        _: ' commented text ',
      },
      {
        text: ' bar',
      },
    ], { remove_comments: true }), 'foo  bar' );

  });

});
