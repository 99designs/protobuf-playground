import React from 'react';
import protobuf from 'protobufjs';
import ContentHeader from './ContentHeader';
import ReflectObjectList from './ReflectionObjectList';

export default function NamespaceContent({
  namespace,
}: {
  namespace: protobuf.Namespace;
}) {
  return (
    <div>
      <ContentHeader object={namespace} />
      <ReflectObjectList items={namespace.nestedArray} />
    </div>
  );
}
