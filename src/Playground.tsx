import React, { useState, useEffect } from 'react';
import protobuf from 'protobufjs';
import Button from '@material-ui/core/Button';
import { jsonTemplate } from './proto';

const Playground: React.FC<{ method: protobuf.Method }> = ({ method }) => {
  const [request, setRequest] = useState<protobuf.Message | null>(null);
  useEffect(() => {
    if (
      method.resolvedRequestType === null ||
      method.resolvedResponseType === null
    ) {
      throw new Error('Method types must be resolved');
    }
    const json = jsonTemplate(method.resolvedRequestType);
    setRequest(method.resolvedRequestType.create(json));
  }, [method]);
  const handleChange = () => {};
  return (
    <>
      <textarea
        value={JSON.stringify(request, null, 2)}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary">
        Run Method
      </Button>
    </>
  );
};

export default Playground;
