
function _stringifyAttrs(attrs) {
  var result = '', _quote;

  if( !attrs ) return result;

  for( var key in attrs ) {
    if( key !== '$' && key !== '_' ) {
      _quote = /"/.test(attrs[key]) ? '\'' : '"';
      result += ' ' + key;
      result += attrs[key] ? ('=' + _quote + attrs[key] + _quote) : '';
    }
  }

  return result;
}

function _renderAttrs () {
  return _stringifyAttrs(this.attrs);
}

function _indentationSpaces (n) {
  var spaces = '';
  for( ; n > 0; n-- ) spaces += '  ';
  return spaces;
}

function _processNode (_node, processor, options, indent_level) {
  if( typeof _node === 'string' ) return _node;

  var node = Object.create(_node), result;

  if( processor instanceof Function ) {
    for( var key in _node ) {
      if( key !== '$' && key !== '_' ) node[key] = _node[key];
    }

    _node.__parent__ = _node;

    result = processor(node, function _renderChildren () {
      return this._ ? _stringifyNodes(this._, options, indent_level + 1) : '';
    }, _renderAttrs.bind(node) );

    if( typeof result === 'string' ) return result;
  }

  result = options.prettify_markup ? _indentationSpaces(indent_level) : '';

  if( node.$ ) {
    result += '<' + node.$ + _stringifyAttrs(node.attrs) + ( node.self_closed ? '/' : '' ) + '>';
    if( '_' in node ) result += _stringifyNodes(node._, options, indent_level + 1);
    if( !node.self_closed && !node.unclosed ) {
      if( options.prettify_markup && node._ instanceof Array ) result += '\n';
      result += '</' + node.$ + '>';
    }
  } else if( 'comments' in node ) {
    result += options.remove_comments === false ? ('<!--' + node.comments + '-->') : '';
  } else {
    result += node.text || '';
  }

  return result;
}

function _stringifyNodes (nodes, options, indent_level) {
  if( typeof nodes === 'string' ) return nodes;

  return nodes.reduce(function (html, node, i) {
    return html + ( (indent_level || i) && options.prettify_markup ? '\n' : '' ) + _processNode(node, options.processors[node.$], options, indent_level);
  }, '');
}

module.exports = function stringifyNodes (nodes, options) {
  options = options || {};
  options.processors = options.processors ||{};

  return _stringifyNodes(nodes, options, 0);
};
