import protobuf from 'protobufjs';
import { jsonTemplate } from './proto';

const urlFor = (method: protobuf.Method, baseUrl: string = ''): string => {
  const service = method.parent as protobuf.Service;
  // TODO handle null cases here?
  const pkg = service.parent as protobuf.Namespace;
  let pkgName = pkg.fullName;
  if (pkgName.charAt(0) === '.') {
    pkgName = pkgName.slice(1);
  }
  return `${baseUrl}/twirp/${pkgName}.${service.name}/${method.name}`;
};

const twirp = (baseUrl: string): protobuf.RPCImpl => {
  return (method, request, callback) => {
    if (method instanceof protobuf.Method) {
      const url = urlFor(method, baseUrl);
      const req = new Request(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/protobuf',
          // TODO make basic auto configurable here
          Authorization: 'Basic ' + btoa('username:password'),
        },
        body: request,
      });
      fetch(req).then(res => {
        if (!res.ok) {
          throw new Error('HTTP error ' + res.status);
        }
      });

      const resType = method.resolvedResponseType as protobuf.Type;
      const tmpl = jsonTemplate(resType);
      const message = resType.create(tmpl);
      const enc = resType.encode(message);
      callback(null, enc.finish());
    }
  };
};

// headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));

export default twirp;
