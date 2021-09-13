import { join } from 'path';
import estraverse from 'estraverse';
import MagicString from 'magic-string';

let count = 0;
function reviseRoute({ code, magicString, start, end, defer = false, access }) {
  const componentPath = code.slice(start, end);
  if (defer) {
    magicString.appendLeft(
      0,
      `const Component${count} = React.lazy(() => import(${componentPath}));\n`
    );
  } else {
    magicString.appendLeft(
      0,
      `import Component${count} from ${componentPath};\n`
    );
  }

  const accessProp = access ? `access:${JSON.stringify(access)}` : '';
  magicString.overwrite(
    start,
    end,
    `React.createElement(Component${count}, {${accessProp}}, null)`
  );
  count++;
}

function reviseRedirect({ magicString, end, redirect, hasNavigate }) {
  if (!hasNavigate) {
    magicString.appendLeft(0, `import { Navigate } from 'react-router-dom';\n`);
  }
  magicString.appendLeft(
    end,
    `, element: React.createElement(Navigate, {to: '${redirect}'}, null)`
  );
}

export default function reactConfigRouter({
  routePaths = ['./config/routes.ts'],
} = {}) {
  return {
    name: 'react-config-router',
    transform(code, id) {
      if (
        routePaths
          .map((routePath) =>
            join(process.cwd(), routePath).replaceAll('\\', '/')
          )
          .includes(id)
      ) {
        const magicString = new MagicString(code);
        magicString.appendLeft(0, `import React from 'react';\n`);
        const parsed = this.parse(code);
        let viewedNodes = new Set();
        let hasNavigate = false;
        estraverse.traverse(parsed, {
          enter: (node, parent) => {
            if (node.type === 'Property' && node.key.name === 'element') {
              // get defer
              let defer = parent.properties.find(
                (element) =>
                  element.type === 'Property' && element.key.name === 'defer'
              );
              defer = defer ? defer.value.value : false;

              // get access
              let access = parent.properties.find(
                (element) =>
                  element.type === 'Property' && element.key.name === 'access'
              );
              access = access ? access.value.elements : null;

              // check access
              if (access !== null && !Array.isArray(access)) {
                throw Error('access must be a array if defined');
              }
              access = access ? access.map((element) => element.value) : null;
              reviseRoute({
                code,
                magicString,
                start: node.value.start,
                end: node.value.end,
                defer,
                access,
              });
              viewedNodes.add(parent);
            } else if (
              !viewedNodes.has(parent) &&
              node.type === 'Property' &&
              node.key.name === 'redirect'
            ) {
              let redirect = parent.properties.find(
                (element) =>
                  element.type === 'Property' && element.key.name === 'redirect'
              );
              redirect = redirect ? redirect.value.value : null;
              if (!redirect || typeof redirect !== 'string') {
                throw Error('redirect must be string value');
              }
              reviseRedirect({
                hasNavigate,
                magicString,
                end: node.value.end,
                redirect,
              });
              hasNavigate = true;
            }
          },
        });
        const codeNew = magicString.toString();
        const map = magicString.generateMap();
        return { code: codeNew, map };
      } else {
        return null;
      }
    },
  };
}
