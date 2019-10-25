import React, { useRef, useEffect } from 'react';
import protobuf from 'protobufjs';
import Button from '@material-ui/core/Button';
import { jsonTemplate } from './proto';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import { makeStyles } from '@material-ui/core/styles';
import './Playground.css';

const useStyles = makeStyles(theme => ({
  editor: {
    marginBottom: theme.spacing(2),
    '& .CodeMirror': {
      fontSize: '16px',
      fontFamily: 'Monaco, monospace',
    },
  },
}));

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
          text: `"${field.name}": `,
          displayText: field.name,
        })),
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end),
      };
    }
  }
);

const Playground: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  const cm = useRef<CodeMirror.EditorFromTextArea>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (
      method.resolvedRequestType === null ||
      method.resolvedResponseType === null
    ) {
      throw new Error('Method types must be resolved');
    }
    if (textareaRef.current == null) {
      throw new Error('No');
    }
    cm.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: {
        name: 'javascript',
        json: true,
      },
      theme: 'monokai',
      hintOptions: {
        type: method.resolvedRequestType,
        completeSingle: true,
      },
    });

    cm.current.setValue(
      JSON.stringify(jsonTemplate(method.resolvedRequestType), null, 2)
    );
    cm.current.on('keyup', (cm: CodeMirror.Editor, event) => {
      const code = event.keyCode;
      if (
        (code >= 65 && code <= 90) || // letters
        (!event.shiftKey && code >= 48 && code <= 57) || // numbers
        (event.shiftKey && code === 189) || // underscore
        (event.shiftKey && code === 222) // "
      ) {
        cm.execCommand('autocomplete');
      }
    });
    return () => {
      if (cm.current) {
        cm.current.toTextArea();
      }
    };
  }, [method]);
  const classes = useStyles();
  return (
    <>
      <div className={classes.editor}>
        <textarea ref={textareaRef} />
      </div>
      <Button variant="contained" color="primary">
        Run Method
      </Button>
    </>
  );
};

export default Playground;
