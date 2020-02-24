import React, { useRef, useEffect } from 'react';
import protobuf from 'protobufjs';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import { jsonTemplate } from './proto';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import { makeStyles } from '@material-ui/core/styles';
import './Playground.css';
import './codemirror';
import twirp from './twirp';

const twirpImpl = twirp('');

const useStyles = makeStyles(theme => ({
  frame: {
    display: 'flex',
    width: '100%',
    '& > div': {
      width: '50%',
    },
    '& .CodeMirror': {
      fontSize: '16px',
      fontFamily: 'Monaco, monospace',
    },
  },
  editor: {},
  response: {},
}));

export default function Playground({ method }: { method: protobuf.Method }) {
  const editorCm = useRef<CodeMirror.EditorFromTextArea>();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const responseCm = useRef<CodeMirror.EditorFromTextArea>();
  const responseRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (
      method.resolvedRequestType === null ||
      method.resolvedResponseType === null
    ) {
      throw new Error('Method types must be resolved');
    }

    editorCm.current = CodeMirror.fromTextArea(editorRef.current!, {
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

    editorCm.current.setValue(
      JSON.stringify(jsonTemplate(method.resolvedRequestType), null, 2)
    );

    editorCm.current.on('keyup', (cm: CodeMirror.Editor, event) => {
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

    responseCm.current = CodeMirror.fromTextArea(responseRef.current!, {
      mode: {
        name: 'javascript',
        json: true,
      },
      readOnly: true,
      theme: 'monokai',
    });

    return () => {
      if (editorCm.current) editorCm.current.toTextArea();
      if (responseCm.current) responseCm.current.toTextArea();
    };
  }, [method]);

  const handleExecute = () => {
    // TODO improve type safety everywhere here
    const srv = (method.parent as protobuf.Service).create(twirpImpl) as any;
    const methodName =
      method.name.charAt(0).toLowerCase() + method.name.slice(1);
    const json = JSON.parse(editorCm.current!.getValue());
    srv[methodName](json, (err: any, res: any) => {
      responseCm.current!.setValue(JSON.stringify(res, null, 2));
    });
  };

  const classes = useStyles();
  return (
    <>
      <Toolbar disableGutters={true}>
        <IconButton color="primary" onClick={handleExecute}>
          <PlayCircleFilled />
        </IconButton>
      </Toolbar>
      <div className={classes.frame}>
        <div className={classes.editor}>
          <textarea ref={editorRef} />
        </div>
        <div className={classes.response}>
          <textarea ref={responseRef} />
        </div>
      </div>
    </>
  );
}
