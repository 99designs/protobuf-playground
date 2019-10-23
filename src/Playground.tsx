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

const useStyles = makeStyles(theme => ({
  editor: {
    marginBottom: theme.spacing(2),
    '& .CodeMirror': {
      fontSize: '16px',
      fontFamily: 'Monaco',
    },
  },
}));

CodeMirror.registerHelper(
  'hint',
  'javascript',
  (cm: CodeMirror.Editor, options: { type: protobuf.Type }) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    let match = token.string;
    let start = token.start;
    while (match.charAt(0) == '"') {
      match = match.substr(1);
      start++;
    }
    const list = options.type.fieldsArray
      .filter(field => field.name.startsWith(match))
      .map(field => field.name);
    console.log(match, list);
    if (list.length) {
      return {
        list,
        from: { line: cur.line, column: start },
        to: { line: cur.line, column: token.end },
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
      mode: 'javascript',
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
