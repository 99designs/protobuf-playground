import React, { useRef, useEffect } from 'react';
import protobuf from 'protobufjs';
import Button from '@material-ui/core/Button';
import { jsonTemplate } from './proto';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
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
    const json = jsonTemplate(method.resolvedRequestType);
    cm.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: 'javascript',
      theme: 'monokai',
    });
    cm.current.setValue(JSON.stringify(json, null, 2));
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
