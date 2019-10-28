import protobuf from 'protobufjs';
import CodeMirror from 'codemirror';

const trimQuotes = /^"+|"+$/g;

// Given a list of tokens and a proto type, return the type that corresponds to the location of the last token by
// matching the JSON path to the type heirarchy.  Returns null if no match occurs.
const resolveTokensToType = (
  tokens: CodeMirror.Token[],
  type: protobuf.Type
): protobuf.Type | null => {
  // Build up property path from tokens
  const path: string[] = [];
  let currentProperty: CodeMirror.Token | null = null;
  tokens.forEach(token => {
    if (token.type === 'string property') {
      currentProperty = token;
      return;
    }
    if (token.string === '{' && currentProperty) {
      path.push(currentProperty.string.replace(trimQuotes, ''));
      return;
    }
    if (token.string === '}') {
      path.pop();
      return;
    }
  });

  // Resolve property path from array into final type
  let currentType = type;

  for (let i = 0; i < path.length; i++) {
    const field = currentType.fields[path[i]];
    if (!field || !(field.resolvedType instanceof protobuf.Type)) {
      return null;
    }
    currentType = field.resolvedType;
  }

  return currentType;
};

CodeMirror.registerHelper(
  'hint',
  'javascript',
  (cm: CodeMirror.Editor, options: { type: protobuf.Type }) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const match = token.string.replace(trimQuotes, '');

    // Fetch all tokens up to the cursor
    let tokens: CodeMirror.Token[] = [];
    for (let i = 0; i < cur.line; i++) {
      tokens = [...tokens, ...cm.getLineTokens(i)];
    }
    cm.getLineTokens(cur.line).forEach(token => {
      if (token.end <= cur.ch) {
        tokens.push(token);
      }
    });
    const type = resolveTokensToType(tokens, options.type);
    if (type === null) {
      return;
    }

    const results = type.fieldsArray.filter(field =>
      field.name.startsWith(match)
    );
    if (results.length) {
      return {
        list: results.map(field => ({
          // TODO would be nice here if we could also fill the default value, and maybe even select it for easy
          // replacement while typing.
          text: `"${field.name}": `,
          displayText: field.name,
        })),
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end),
      };
    }
  }
);
